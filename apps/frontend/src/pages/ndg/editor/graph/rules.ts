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
  adjacencyList: Map<string, Set<string>>,
  source: string,
  target: string,
) => adjacencyList.get(source)?.has(target) ?? false;

export const wouldCreateCycle = (
  adjacencyList: Map<string, Set<string>>,
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
    for (const child of adjacencyList.get(node) ?? []) stack.push(child);
  }

  return false;
};

export const canConnectNodes = (
  nodeById: Map<string, EditorNode>,
  adjacencyList: Map<string, Set<string>>,
  connection: Connection,
) => {
  const { source, target } = connection;
  if (!source || !target) return false;
  if (isSelfConnection(source, target)) return false;
  if (!doNodesExist(nodeById, source, target)) return false;
  if (areConnected(adjacencyList, source, target)) return false;
  if (wouldCreateCycle(adjacencyList, source, target)) return false;
  return true;
};

export const onBeforeDeleteElements = (elements: DeleteElementsInput) =>
  !elements.nodes.some(node => node.type === "check");
