import type { Edge, Node } from "@xyflow/react";
import type {
  EditorDocument,
  EditorEdge,
  EditorNode,
  EditorNodeData,
} from "../document/types";

export type EditorFlowNode = Node<EditorNodeData, EditorNodeData["type"]>;

export const toFlowNode = (node: EditorNode): EditorFlowNode => ({
  id: node.id,
  type: node.data.type,
  position: node.position,
  data: node.data,
});

export const toFlowEdge = (edge: EditorEdge): Edge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  type: "smoothstep",
});

export const toFlowNodes = (document: EditorDocument): EditorFlowNode[] =>
  document.nodes.map(toFlowNode);

export const toFlowEdges = (document: EditorDocument): Edge[] =>
  document.edges.map(toFlowEdge);
