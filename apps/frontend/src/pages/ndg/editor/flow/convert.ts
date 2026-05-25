import type { Edge, Node } from "@xyflow/react";
import type { EditorDocument, EditorEdge, EditorNode } from "../document/types";

export const toFlowNode = (node: EditorNode): Node => ({
  id: node.id,
  position: node.position,
  data: { label: `${node.data.name} (${node.data.type})` },
});

export const toFlowEdge = (edge: EditorEdge): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
});

export const toFlowNodes = (document: EditorDocument): Node[] =>
  document.nodes.map(toFlowNode);

export const toFlowEdges = (document: EditorDocument): Edge[] =>
  document.edges.map(toFlowEdge);
