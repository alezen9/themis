import { get } from "lodash-es";
import { assertDefined, assertNDGValue } from "../assertions";
import { collectConditionKeys, evaluateCondition } from "../evaluate-condition";
import { isSelectorNode, type Condition, type Node } from "../schema";
import type {
  EvalCtx,
  EvalNote,
  NDGContext,
  NDGTraceEntry,
  NDGValue,
} from "../types";
import type { ValidatedNDG } from "../validate-ndg";
import { INTERNAL_CONSTANTS } from "./constants";
import { createTraceEntry } from "./trace";

type RuntimeContext = NDGContext & { constants: typeof INTERNAL_CONSTANTS };

export type EvaluationState = {
  check: ValidatedNDG["check"];
  evaluators: ValidatedNDG["evaluators"];
  nodeById: ValidatedNDG["nodeById"];
  nodeByKey: ValidatedNDG["nodeByKey"];
  runtime: RuntimeContext;
  lookup: Record<string, NDGValue>;
  cache: Record<string, NDGValue>;
  trace: NDGTraceEntry[];
  visited: Set<string>;
  activeNode: Node | undefined;
};

export const evaluateNode = (nodeId: string, state: EvaluationState): void => {
  if (state.visited.has(nodeId)) return;

  const node = state.nodeById.get(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  state.activeNode = node;

  const activeChildren = getActiveChildren(node, state);
  const notes: EvalNote[] = [];
  const value = resolveNodeValue(node, activeChildren, state, notes);

  state.cache[node.key] = value;
  state.lookup[node.key] = value;
  state.trace.push(createTraceEntry(node, value, activeChildren, state, notes));
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
    key => !Object.hasOwn(state.lookup, key),
  );

  const unknownKey = unresolvedKeys.find(key => !state.nodeByKey.has(key));
  if (unknownKey) {
    throw new Error(`Condition references unknown key: "${unknownKey}"`);
  }

  for (const key of unresolvedKeys) {
    const dependency = state.nodeByKey.get(key);
    if (!dependency)
      throw new Error(`Condition references unknown key: "${key}"`);
    evaluateNode(dependency.id, state);
  }

  return evaluateCondition(condition, state.lookup);
};

const resolveNodeValue = (
  node: Node,
  activeChildren: string[],
  state: EvaluationState,
  notes: EvalNote[],
): NDGValue => {
  switch (node.type) {
    case "constant": {
      const value = state.runtime.constants[node.key];
      assertDefined(value, `Unsupported constant: "${node.key}"`);
      return value;
    }
    case "user-input":
    case "coefficient":
    case "table": {
      const value = get(state.runtime.values, node.key);
      assertDefined(value, `Missing value: "${node.key}"`);
      assertNDGValue(value, node.key);
      return value;
    }
    case "formula":
    case "check": {
      const evaluator = state.evaluators[node.key];
      if (!evaluator) {
        return resolveAutoSelectorNode(node, activeChildren, state);
      }

      const ctx: EvalCtx = {
        addNote({ formula, latex, value, warn }) {
          notes.push({
            formula,
            latex,
            value,
            severity: warn ? "warning" : "ok",
          });
        },
        inputs: state.runtime.values,
      };
      const result = evaluator(state.lookup, ctx);
      assertFiniteNumberResult(node, result);
      return result;
    }
  }
};

const resolveAutoSelectorNode = (
  node: Node,
  activeChildren: string[],
  state: EvaluationState,
) => {
  if (!isSelectorNode(node)) {
    throw new Error(
      `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
    );
  }
  const [childId] = activeChildren;
  if (activeChildren.length !== 1 || !childId) {
    throw new Error(
      `Auto-selector node "${node.key}" (id: ${node.id}) must have exactly one active child, got ${activeChildren.length}`,
    );
  }

  const selectedChild = state.nodeById.get(childId);
  if (!selectedChild) {
    throw new Error(
      `Auto-selector node "${node.key}" (id: ${node.id}) references unknown child "${childId}"`,
    );
  }

  const selectedValue = state.cache[selectedChild.key];
  if (selectedValue === undefined) {
    throw new Error(
      `Auto-selector node "${node.key}" (id: ${node.id}) selected child "${selectedChild.key}" with undefined value`,
    );
  }

  assertFiniteNumberResult(node, selectedValue);
  return selectedValue;
};

const assertFiniteNumberResult = (node: Node, value: NDGValue) => {
  if (typeof value === "number" && !isFinite(value)) {
    throw new Error(
      `Node "${node.key}" (${node.type}) produced ${value} -- check inputs for division by zero or invalid values`,
    );
  }
};
