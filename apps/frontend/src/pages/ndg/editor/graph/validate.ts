import { findUnknownConditionKeys } from "../conditions/validate";
import { tableKeys, userInputKeys } from "../document/keyCatalog";
import { nodeFormSchema } from "../document/nodeSchema";
import type { EditorEdge, EditorNode } from "../document/types";

export const findInvalidNodeIds = (nodes: EditorNode[]) => {
  const invalidNodeIds = new Set<string>();
  for (const node of nodes)
    if (!nodeFormSchema.safeParse({ type: node.type, ...node.data }).success)
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
    ...nodes.map(node => node.data.key),
  ]);
  const invalidEdgeIds = new Set<string>();
  for (const edge of edges)
    if (findUnknownConditionKeys(edge.data?.condition, availableKeys).length)
      invalidEdgeIds.add(edge.id);
  return invalidEdgeIds;
};
