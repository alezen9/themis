import type { EditorEdge, EditorNode } from "../document/types";

export const findUnreachableNodeIds = (
  nodes: EditorNode[],
  edges: EditorEdge[],
) => {
  const checkNode = nodes.find(node => node.type === "check");
  if (!checkNode) return new Set<string>();

  const childrenBySource = new Map<string, string[]>();
  for (const edge of edges) {
    const children = childrenBySource.get(edge.source);
    if (children) children.push(edge.target);
    else childrenBySource.set(edge.source, [edge.target]);
  }

  const reachable = new Set<string>();
  const stack = [checkNode.id];
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const child of childrenBySource.get(id) ?? []) stack.push(child);
  }

  const unreachableNodeIds = new Set<string>();
  for (const node of nodes)
    if (!reachable.has(node.id)) unreachableNodeIds.add(node.id);
  return unreachableNodeIds;
};
