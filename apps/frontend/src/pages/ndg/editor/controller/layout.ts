import dagre from "@dagrejs/dagre";
import type { XYPosition } from "@xyflow/react";

import type { EditorEdge, EditorNode } from "../document/types";

const DEFAULT_WIDTH = 192;
const DEFAULT_HEIGHT = 80;
const ROW_PITCH = 170;

const nodeSize = (node: EditorNode) => ({
  width: node.measured?.width ?? DEFAULT_WIDTH,
  height: node.measured?.height ?? DEFAULT_HEIGHT,
});

export const computeLayout = (
  nodes: EditorNode[],
  edges: EditorEdge[],
): Map<string, XYPosition> => {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: "TB", nodesep: 40, ranksep: ROW_PITCH });
  graph.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) graph.setNode(node.id, nodeSize(node));
  for (const edge of edges) graph.setEdge(edge.source, edge.target);

  dagre.layout(graph);

  const rankCenters = [
    ...new Set(nodes.map(node => Math.round(graph.node(node.id).y))),
  ].sort((a, b) => a - b);

  const placed = nodes.map(node => {
    const { x, y, width } = graph.node(node.id);
    const row = rankCenters.indexOf(Math.round(y));
    return { id: node.id, x: x - width / 2, y: row * ROW_PITCH };
  });

  const originLeft = Math.min(...nodes.map(node => node.position.x));
  const originTop = Math.min(...nodes.map(node => node.position.y));
  const placedLeft = Math.min(...placed.map(pos => pos.x));
  const placedTop = Math.min(...placed.map(pos => pos.y));
  const shiftX = originLeft - placedLeft;
  const shiftY = originTop - placedTop;

  return new Map(
    placed.map(pos => [pos.id, { x: pos.x + shiftX, y: pos.y + shiftY }]),
  );
};
