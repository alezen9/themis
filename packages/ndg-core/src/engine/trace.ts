import { isComputedNode, type Node } from "../schema";
import type { EvalNote, NDGTraceEntry, NDGValue } from "../types";
import type { EvaluationState } from "./evaluate";

export const createTraceEntry = (
  node: Node,
  value: NDGValue,
  activeChildren: string[],
  state: EvaluationState,
  notes: EvalNote[],
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
    notes: notes.length > 0 ? notes : undefined,
    children: activeChildren,
  };
};

const createEvaluatorInputs = (
  activeChildren: string[],
  state: EvaluationState,
) => {
  const evaluatorInputs: Record<string, NDGValue> = {};

  for (const childId of activeChildren) {
    const child = state.nodeById.get(childId);
    if (!child) continue;
    const cached = state.cache[child.key];
    if (cached === undefined) continue;
    evaluatorInputs[child.key] = cached;
  }

  return evaluatorInputs;
};
