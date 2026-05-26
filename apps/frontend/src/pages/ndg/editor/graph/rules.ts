import type { Connection } from "@xyflow/react";

import { createEdgeId } from "../document/ids";
import type { EditorEdge, EditorNode } from "../document/types";

type DeleteElementsInput = {
  edges: EditorEdge[];
  nodes: EditorNode[];
};

export const canConnectNodes = (
  nodes: EditorNode[],
  edges: EditorEdge[],
  connection: Connection,
) => {
  const { source, target } = connection;

  if (!source || !target) return false;
  if (source === target) return false;

  const nodeIds = new Set(nodes.map((node) => node.id));

  if (!nodeIds.has(source) || !nodeIds.has(target)) return false;

  const edgeId = createEdgeId(source, target);
  const hasExistingEdge = edges.some((edge) => edge.id === edgeId);

  if (hasExistingEdge) return false;

  return !wouldCreateCycle(edges, source, target);
};

export const onBeforeDeleteElements = async ({ nodes }: DeleteElementsInput) => {
  const includesCheckNode = nodes.some((node) => node.type === "check");

  return !includesCheckNode;
};

const wouldCreateCycle = (
  edges: EditorEdge[],
  source: string,
  target: string,
) => {
  const pending = [target];
  const visited = new Set<string>();

  while (pending.length > 0) {
    const nodeId = pending.pop();

    if (!nodeId || visited.has(nodeId)) continue;
    if (nodeId === source) return true;

    visited.add(nodeId);

    for (const edge of edges) {
      if (edge.source === nodeId) {
        pending.push(edge.target);
      }
    }
  }

  return false;
};
