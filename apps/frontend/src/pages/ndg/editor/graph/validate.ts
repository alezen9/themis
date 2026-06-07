import { ConditionSchema } from "@ndg/ndg-core";
import { coefficientKeys, tableKeys, userInputKeys } from "@ndg/ndg-ec3-1-1";
import { findUnknownConditionKeys } from "../conditions/validate";
import { editorNodeSchema } from "../document/editorNodeSchema";
import type { EditorEdge, EditorNode } from "../document/types";

export const findInvalidNodeIds = (nodes: EditorNode[]) => {
  const invalidNodeIds = new Set<string>();
  for (const node of nodes)
    if (!editorNodeSchema.safeParse({ type: node.type, ...node.data }).success)
      invalidNodeIds.add(node.id);
  return invalidNodeIds;
};

export const findInvalidEdgeIds = (
  nodes: EditorNode[],
  edges: EditorEdge[],
) => {
  const availableKeys = new Set([
    ...userInputKeys,
    ...tableKeys,
    ...coefficientKeys,
    ...nodes.map(node => node.data.key),
  ]);
  const invalidEdgeIds = new Set<string>();
  for (const edge of edges) {
    if (!edge.data?.condition) continue;
    const result = ConditionSchema.safeParse(edge.data?.condition);
    if (!result.success) {
      invalidEdgeIds.add(edge.id);
      continue;
    }
    const unknownKeys = findUnknownConditionKeys(result.data, availableKeys);
    if (!!unknownKeys.length) invalidEdgeIds.add(edge.id);
  }
  return invalidEdgeIds;
};
