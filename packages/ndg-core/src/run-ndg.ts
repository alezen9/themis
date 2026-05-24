import { evaluateCondition } from "./evaluate-condition";
import {
  isAutoSelectorNode,
  isComputedNode,
  type CheckNode,
  type Condition,
  type ConditionTuple,
  type Node,
  type NodeMeta,
} from "./schema";
import type { InferCache, NDGContext, NDGDefinition, NDGSuite } from "./engine";
import { validateNDG, type ValidatedNDG } from "./validate-ndg";

const INTERNAL_CONSTANTS: Readonly<Record<string, number>> = {
  pi: Math.PI,
  e: Math.E,
};

type RunValue = number | string;
type ValueContext = Record<string, RunValue>;

export type NDGTraceEntry = {
  nodeId: string;
  type: Node["type"];
  key: string;
  value: RunValue;
  unit?: string;
  symbol?: string;
  expression?: string;
  /** LaTeX expression for check nodes (the verification rule). */
  verificationExpression?: string;
  description?: string;
  meta?: NodeMeta;
  /** Cache values that were passed to the evaluator for this node. */
  evaluatorInputs?: ValueContext;
  children: string[];
};

export type NDGRunResult<TNodes extends readonly Node[] = readonly Node[]> = {
  check: {
    id: CheckNode["id"];
    key: CheckNode["key"];
    name: CheckNode["name"];
    verificationExpression: CheckNode["verificationExpression"];
    meta?: CheckNode["meta"];
  };
  passed: boolean;
  ratio: number;
  cache: InferCache<TNodes>;
  trace: NDGTraceEntry[];
};

export type NDGSuiteRunRow<TNodes extends readonly Node[] = readonly Node[]> = {
  id: number | string;
  name: string;
  payload:
    | { data: NDGRunResult<TNodes>; error?: undefined }
    | { data?: undefined; error: Error };
};

export type NDGSuiteRunResult = readonly NDGSuiteRunRow[];

type RuntimeContext = NDGContext & { constants: typeof INTERNAL_CONSTANTS };

type EvaluationState = {
  check: ValidatedNDG["check"];
  evaluators: ValidatedNDG["evaluators"];
  nodeById: ValidatedNDG["nodeById"];
  nodeByKey: ValidatedNDG["nodeByKey"];
  runtime: RuntimeContext;
  lookup: ValueContext;
  cache: ValueContext;
  trace: NDGTraceEntry[];
  visited: Set<string>;
  activeNode: Node | undefined;
};

export const runNDG = <
  TNodes extends readonly Node[],
  TValues extends NDGContext["values"] = NDGContext["values"],
>(
  definition: NDGDefinition<TNodes, TValues>,
  context: NDGContext,
): NDGRunResult<TNodes> => {
  const validated = validateNDG(definition);
  const state: EvaluationState = {
    ...validated,
    runtime: { ...context, constants: INTERNAL_CONSTANTS },
    lookup: { ...INTERNAL_CONSTANTS, ...context.values },
    cache: {},
    trace: [],
    visited: new Set(),
    activeNode: undefined,
  };
  const { check, cache, trace } = state;

  try {
    evaluateNode(check.id, state);

    const ratio = cache[check.key];
    if (typeof ratio !== "number") {
      throw new Error(
        `Check node "${check.key}" must evaluate to a number, got ${typeof ratio}`,
      );
    }
    if (!isFinite(ratio)) {
      throw new Error(
        `Check node "${check.key}" produced ${ratio} -- likely division by zero or invalid computation`,
      );
    }

    return {
      check: {
        id: check.id,
        key: check.key,
        name: check.name,
        verificationExpression: check.verificationExpression,
        meta: check.meta,
      },
      passed: ratio <= 1.0,
      ratio,
      cache: cache as InferCache<TNodes>,
      trace: trace,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "Ec3VerificationError") {
      throw error;
    }

    const nodeContext = state.activeNode
      ? ` at node "${state.activeNode.key}" (id: "${state.activeNode.id}")`
      : "";
    const cause = error instanceof Error ? error.message : String(error);

    throw new Error(
      `Unhandled NDG run failure [${check.key}]${nodeContext}: ${cause}`,
    );
  }
};

export const runNDGSuite = (
  suite: NDGSuite,
  context: NDGContext,
): NDGSuiteRunResult =>
  suite.map(({ id, ndg }) => {
    const check = getCheckNode(ndg.nodes);
    const definition = ndg as NDGDefinition<readonly Node[]>;

    try {
      return {
        id,
        name: check.name,
        payload: { data: runNDG(definition, context) },
      };
    } catch (error) {
      return {
        id,
        name: check.name,
        payload: {
          error: error instanceof Error ? error : new Error(String(error)),
        },
      };
    }
  });

const getCheckNode = (nodes: readonly Node[]) => {
  const check = nodes.find((node): node is CheckNode => node.type === "check");
  if (!check) throw new Error("NDG must contain a check node");
  return check;
};

const evaluateNode = (nodeId: string, state: EvaluationState): void => {
  if (state.visited.has(nodeId)) return;

  const node = state.nodeById.get(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  state.activeNode = node;

  const activeChildren = getActiveChildren(node, state);
  const value = resolveNodeValue(node, activeChildren, state);

  state.cache[node.key] = value;
  state.lookup[node.key] = value;
  state.trace.push(createTraceEntry(node, value, activeChildren, state));
  state.visited.add(nodeId);
};

const getActiveChildren = (node: Node, state: EvaluationState) => {
  const activeChildren: string[] = [];

  for (const child of node.children) {
    if (child.when && !matchesCondition(child.when, state)) {
      continue;
    }

    evaluateNode(child.nodeId, state);
    activeChildren.push(child.nodeId);
  }

  return activeChildren;
};

const matchesCondition = (condition: Condition, state: EvaluationState) => {
  const unresolvedKeys = collectConditionKeys(condition).filter(
    (key) => !Object.hasOwn(state.lookup, key),
  );

  const unknownKey = unresolvedKeys.find((key) => !state.nodeByKey.has(key));
  if (unknownKey) {
    throw new Error(`Condition references unknown key: "${unknownKey}"`);
  }

  for (const key of unresolvedKeys) {
    evaluateNode(state.nodeByKey.get(key)!.id, state);
  }

  return evaluateCondition(condition, state.lookup);
};

const resolveNodeValue = (
  node: Node,
  activeChildren: string[],
  state: EvaluationState,
) => {
  switch (node.type) {
    case "constant": {
      const value = state.runtime.constants[node.key];
      if (value === undefined) {
        throw new Error(`Unsupported constant: "${node.key}"`);
      }
      return value;
    }
    case "user-input":
    case "coefficient":
    case "table": {
      const value = state.runtime.values[node.key];
      if (value === undefined) throw new Error(`Missing value: "${node.key}"`);
      return value;
    }
    case "formula":
    case "derived":
    case "check": {
      const evaluator = state.evaluators[node.key];
      if (!evaluator) {
        if (!isAutoSelectorNode(node)) {
          throw new Error(
            `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
          );
        }
        if (activeChildren.length !== 1) {
          throw new Error(
            `Auto-selector node "${node.key}" (id: ${node.id}) must have exactly one active child, got ${activeChildren.length}`,
          );
        }

        const selectedChild = state.nodeById.get(activeChildren[0]);
        if (!selectedChild) {
          throw new Error(
            `Auto-selector node "${node.key}" (id: ${node.id}) references unknown child "${activeChildren[0]}"`,
          );
        }

        const selectedValue = state.cache[selectedChild.key];
        if (selectedValue === undefined) {
          throw new Error(
            `Auto-selector node "${node.key}" (id: ${node.id}) selected child "${selectedChild.key}" with undefined value`,
          );
        }
        if (typeof selectedValue === "number" && !isFinite(selectedValue)) {
          throw new Error(
            `Node "${node.key}" (${node.type}) produced ${selectedValue} -- check inputs for division by zero or invalid values`,
          );
        }
        return selectedValue;
      }

      const result = evaluator(state.lookup);
      if (typeof result === "number" && !isFinite(result)) {
        throw new Error(
          `Node "${node.key}" (${node.type}) produced ${result} -- check inputs for division by zero or invalid values`,
        );
      }
      return result;
    }
  }
};

const createTraceEntry = (
  node: Node,
  value: RunValue,
  activeChildren: string[],
  state: EvaluationState,
): NDGTraceEntry => {
  const evaluatorInputs = isComputedNode(node)
    ? createEvaluatorInputs(activeChildren, state)
    : undefined;

  return {
    nodeId: node.id,
    type: node.type,
    key: node.key,
    value,
    unit: "unit" in node ? node.unit : undefined,
    symbol: node.symbol,
    expression: "expression" in node ? node.expression : undefined,
    verificationExpression:
      "verificationExpression" in node
        ? node.verificationExpression
        : undefined,
    description: node.description,
    meta: "meta" in node ? node.meta : undefined,
    evaluatorInputs,
    children: activeChildren,
  };
};

const createEvaluatorInputs = (
  activeChildren: string[],
  state: EvaluationState,
): ValueContext => {
  const evaluatorInputs: ValueContext = {};

  for (const childId of activeChildren) {
    const child = state.nodeById.get(childId);
    if (child) {
      evaluatorInputs[child.key] = state.cache[child.key];
    }
  }

  return evaluatorInputs;
};

const collectConditionKeys = (condition: Condition): string[] => {
  if ("eq" in condition) {
    return getConditionTupleKeys(condition.eq);
  }
  if ("lt" in condition) {
    return getConditionTupleKeys(condition.lt);
  }
  if ("lte" in condition) {
    return getConditionTupleKeys(condition.lte);
  }
  if ("gt" in condition) {
    return getConditionTupleKeys(condition.gt);
  }
  if ("gte" in condition) {
    return getConditionTupleKeys(condition.gte);
  }
  if ("and" in condition) {
    return condition.and.flatMap((item) => collectConditionKeys(item));
  }
  return condition.or.flatMap((item) => collectConditionKeys(item));
};

const getConditionTupleKeys = (condition: ConditionTuple): string[] => {
  const [left, right] = condition;
  return "key" in right ? [left, right.key] : [left];
};
