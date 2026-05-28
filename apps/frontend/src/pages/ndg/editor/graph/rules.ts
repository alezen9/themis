import type { Connection } from "@xyflow/react";

import type { EditorEdge, EditorNode } from "../document/types";

type DeleteElementsInput = { edges: EditorEdge[]; nodes: EditorNode[] };

export const isSelfConnection = (source: string, target: string) =>
  source === target;

export const doNodesExist = (
  nodeById: Map<string, EditorNode>,
  source: string,
  target: string,
) => nodeById.has(source) && nodeById.has(target);

export const areConnected = (
  adjacency: Map<string, Set<string>>,
  source: string,
  target: string,
) => adjacency.get(source)?.has(target) ?? false;

export const wouldCreateCycle = (
  adjacency: Map<string, Set<string>>,
  source: string,
  target: string,
) => {
  const visited = new Set<string>();
  const stack = [target];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node === source) return true;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const child of adjacency.get(node) ?? []) stack.push(child);
  }

  return false;
};

export const canConnectNodes = (
  nodeById: Map<string, EditorNode>,
  adjacency: Map<string, Set<string>>,
  connection: Connection,
) => {
  const { source, target } = connection;
  if (!source || !target) return false;
  if (isSelfConnection(source, target)) return false;
  if (!doNodesExist(nodeById, source, target)) return false;
  if (areConnected(adjacency, source, target)) return false;
  if (wouldCreateCycle(adjacency, source, target)) return false;
  return true;
};

export const onBeforeDeleteElements = async (elements: DeleteElementsInput) =>
  !elements.nodes.some(node => node.type === "check");
