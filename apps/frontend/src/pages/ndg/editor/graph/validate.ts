import type { EditorNode } from "../document/types";
import { nodeFormSchema } from "../modals/schema";

export const findInvalidNodeIds = (nodes: EditorNode[]) => {
  const invalidNodeIds = new Set<string>();
  for (const node of nodes)
    if (!nodeFormSchema.safeParse({ type: node.type, ...node.data }).success)
      invalidNodeIds.add(node.id);
  return invalidNodeIds;
};
