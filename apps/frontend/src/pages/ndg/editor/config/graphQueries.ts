import type { EditorNode } from "./nodeFactory";

const isCheckNode = (node: EditorNode) => node.type === "check";

const getCheckNodeId = (nodesById: Map<string, EditorNode>) => {
  for (const node of nodesById.values()) {
    if (isCheckNode(node)) return node.id;
  }

  return null;
};

export const buildParentsByChildId = (nodesById: Map<string, EditorNode>) => {
  const parentsByChildId = new Map<string, Set<string>>();

  for (const node of nodesById.values()) {
    for (const child of node.children) {
      const parentIds = parentsByChildId.get(child.nodeId) ?? new Set<string>();
      parentIds.add(node.id);
      parentsByChildId.set(child.nodeId, parentIds);
    }
  }

  return parentsByChildId;
};

export const buildReachableNodeIds = (nodesById: Map<string, EditorNode>) => {
  const checkNodeId = getCheckNodeId(nodesById);
  if (!checkNodeId) return new Set<string>();

  const visited = new Set<string>();
  const stack = [checkNodeId];

  while (stack.length > 0) {
    const nodeId = stack.pop();
    if (!nodeId || visited.has(nodeId)) continue;

    visited.add(nodeId);
    const node = nodesById.get(nodeId);
    if (!node) continue;

    for (const child of node.children) {
      stack.push(child.nodeId);
    }
  }

  return visited;
};

export const getUnreachableNodeIds = (nodesById: Map<string, EditorNode>) => {
  const reachableNodeIds = buildReachableNodeIds(nodesById);
  const unreachableNodeIds = new Set<string>();

  for (const nodeId of nodesById.keys()) {
    if (reachableNodeIds.has(nodeId)) continue;
    unreachableNodeIds.add(nodeId);
  }

  return unreachableNodeIds;
};
