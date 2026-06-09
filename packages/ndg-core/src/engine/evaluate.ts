import { get } from "lodash-es";
import { assertDefined, assertNDGValue, assertUndefined } from "../assertions";
import { collectConditionKeys, evaluateCondition } from "../evaluate-condition";
import { type Condition, type Node } from "../schema";
import type {
  EvalCtx,
  EvalNote,
  NDGContext,
  NDGInputValue,
  NDGTraceEntry,
  NDGValue,
} from "../types";
import type { ValidatedNDG } from "../validate-ndg";
import { constantValues } from "./constants";
import { createEvaluatorInputs, createTraceEntry } from "./trace";

type RuntimeContext = NDGContext & { constants: typeof constantValues };

export type EvaluationState = {
  check: ValidatedNDG["check"];
  evaluators: ValidatedNDG["evaluators"];
  nodeById: ValidatedNDG["nodeById"];
  nodeByKey: ValidatedNDG["nodeByKey"];
  runtime: RuntimeContext;
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
  const entry = createTraceEntry(node, value, activeChildren, state, notes);
  // a select node absorbs its winning child: drop the child's standalone entry
  if (entry.resolvedFrom) {
    const absorbed = state.trace.findIndex(e => e.key === entry.resolvedFrom);
    if (absorbed !== -1) state.trace.splice(absorbed, 1);
  }
  state.trace.push(entry);
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

const conditionContext = (
  state: EvaluationState,
): Record<string, NDGInputValue> => ({
  ...state.runtime.constants,
  ...state.runtime.values,
  ...state.cache,
});

const matchesCondition = (condition: Condition, state: EvaluationState) => {
  const context = conditionContext(state);
  const unresolvedKeys = collectConditionKeys(condition).filter(
    key => get(context, key) === undefined,
  );

  const unknownKey = unresolvedKeys.find(key => !state.nodeByKey.has(key));
  assertUndefined(
    unknownKey,
    `Condition references unknown key: "${unknownKey}"`,
  );

  for (const key of unresolvedKeys) {
    const dependency = state.nodeByKey.get(key);
    assertDefined(dependency, `Condition references unknown key: "${key}"`);
    evaluateNode(dependency.id, state);
  }

  return evaluateCondition(condition, conditionContext(state));
};

const resolveNodeValue = (
  node: Node,
  activeChildren: string[],
  state: EvaluationState,
  notes: EvalNote[],
): NDGValue => {
  switch (node.type) {
    case "constant": {
      const value = node.value ?? get(state.runtime.constants, node.key);
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
      if (node.variant === "select") {
        return resolveSelectNode(node, activeChildren, state);
      }

      const evaluator = state.evaluators[node.key];
      assertDefined(
        evaluator,
        `Missing evaluator for ${node.type} node: "${node.key}" (id: ${node.id})`,
      );

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
      const deps = createEvaluatorInputs(activeChildren, state);
      const result = evaluator(deps, ctx);
      assertFiniteNumberResult(node, result);
      return result;
    }
  }
};

const resolveSelectNode = (
  node: Node,
  activeChildren: string[],
  state: EvaluationState,
) => {
  const [childId] = activeChildren;
  if (activeChildren.length !== 1 || !childId)
    throw new Error(
      `Select node "${node.key}" (id: ${node.id}) must have exactly one active child, got ${activeChildren.length}`,
    );

  const selectedChild = state.nodeById.get(childId);
  assertDefined(selectedChild, `Select node "${node.key}" references unknown child "${childId}"`);

  const selectedValue = state.cache[selectedChild.key];
  assertDefined(selectedValue, `Select node "${node.key}" selected "${selectedChild.key}" with no value`);

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
