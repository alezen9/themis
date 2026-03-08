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
import type {
  EvaluationContext,
  InferCache,
  VerificationDefinition,
} from "./engine";
import {
  validateVerification,
  type ValidatedVerification,
} from "./validate-verification";

const INTERNAL_CONSTANTS: Readonly<Record<string, number>> = {
  pi: Math.PI,
  e: Math.E,
};

type EvaluationValue = number | string;
type ValueContext = Record<string, EvaluationValue>;

export type TraceEntry = {
  nodeId: string;
  type: Node["type"];
  key: string;
  value: EvaluationValue;
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

export type EvaluationResult<TNodes extends readonly Node[] = readonly Node[]> =
  {
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
    trace: TraceEntry[];
  };

type RuntimeContext = EvaluationContext & {
  constants: typeof INTERNAL_CONSTANTS;
};

type EvaluationState = {
  check: ValidatedVerification["check"];
  evaluators: ValidatedVerification["evaluators"];
  nodeById: ValidatedVerification["nodeById"];
  nodeByKey: ValidatedVerification["nodeByKey"];
  runtime: RuntimeContext;
  lookup: ValueContext;
  cache: ValueContext;
  trace: TraceEntry[];
  visited: Set<string>;
  activeNode: Node | undefined;
};

export const evaluate = <TNodes extends readonly Node[]>(
  definition: VerificationDefinition<TNodes>,
  context: EvaluationContext,
): EvaluationResult<TNodes> => {
  const validated = validateVerification(definition);
  const state: EvaluationState = {
    ...validated,
    runtime: { ...context, constants: INTERNAL_CONSTANTS },
    lookup: { ...INTERNAL_CONSTANTS, ...context.inputs },
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
      `Unhandled evaluation failure in verification [${check.key}]${nodeContext}: ${cause}`,
    );
  }
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
    case "user-input": {
      const value = state.runtime.inputs[node.key];
      if (value === undefined) {
        throw new Error(`Missing input: "${node.key}"`);
      }
      return value;
    }
    case "constant": {
      const value = state.runtime.constants[node.key];
      if (value === undefined) {
        throw new Error(`Unsupported constant: "${node.key}"`);
      }
      return value;
    }
    case "coefficient": {
      const value = state.runtime.annex.coefficients[node.key];
      if (value === undefined) {
        throw new Error(
          `Missing coefficient "${node.key}" in annex "${state.runtime.annex.id}"`,
        );
      }
      return value;
    }
    case "formula":
    case "derived":
    case "table":
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
  value: EvaluationValue,
  activeChildren: string[],
  state: EvaluationState,
): TraceEntry => {
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
