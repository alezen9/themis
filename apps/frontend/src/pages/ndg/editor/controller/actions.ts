import type { Connection, ReactFlowInstance, XYPosition } from "@xyflow/react";

import { createEdgeId, createNodeId } from "../document/ids";
import {
  EDITOR_DOCUMENT_VERSION,
  type EditorDocument,
  type EditorEdge,
  type EditorNode,
} from "../document/types";
import { canConnectNodes } from "../graph/rules";

type ReactFlow = ReactFlowInstance<EditorNode, EditorEdge>;

export type AddNodeInput = {
  [Type in EditorNode["type"]]: {
    data: Extract<EditorNode, { type: Type }>["data"];
    position: XYPosition;
    sourceNodeId?: string;
    type: Type;
  };
}[EditorNode["type"]];

export type NdgEditorActions = {
  addNode: (input: AddNodeInput) => void;
  exportDocument: () => EditorDocument;
  onConnectNodes: (connection: Connection) => void;
};

export const addNodeFactory = (reactFlow: ReactFlow) => {
  return (input: AddNodeInput) => {
    const { sourceNodeId } = input;
    const nodes = reactFlow.getNodes();

    const node = toEditorNode(createNodeId(), input);

    reactFlow.addNodes(node);

    if (!sourceNodeId) return;

    const edges = reactFlow.getEdges();
    const connection: Connection = {
      source: sourceNodeId,
      sourceHandle: null,
      target: node.id,
      targetHandle: null,
    };
    const nextNodes = [...nodes, node];

    if (!canConnectNodes(nextNodes, edges, connection)) return;

    reactFlow.addEdges({
      id: createEdgeId(sourceNodeId, node.id),
      source: sourceNodeId,
      target: node.id,
    });
  };
};

const toEditorNode = (id: string, input: AddNodeInput): EditorNode => {
  switch (input.type) {
    case "check":
      return { id, data: input.data, position: input.position, type: "check" };
    case "coefficient":
      return {
        id,
        data: input.data,
        position: input.position,
        type: "coefficient",
      };
    case "constant":
      return {
        id,
        data: input.data,
        position: input.position,
        type: "constant",
      };
    case "formula":
      return {
        id,
        data: input.data,
        position: input.position,
        type: "formula",
      };
    case "table":
      return { id, data: input.data, position: input.position, type: "table" };
    case "user-input":
      return {
        id,
        data: input.data,
        position: input.position,
        type: "user-input",
      };
  }
};

export const exportDocumentFactory = (reactFlow: ReactFlow) => () => {
  const { edges, nodes } = reactFlow.toObject();

  return {
    version: EDITOR_DOCUMENT_VERSION,
    nodes,
    edges,
  } satisfies EditorDocument;
};

export const onConnectNodesFactory =
  (reactFlow: ReactFlow) => (connection: Connection) => {
    const { source, target } = connection;
    const nodes = reactFlow.getNodes();
    const edges = reactFlow.getEdges();

    if (!canConnectNodes(nodes, edges, connection)) return;

    if (!source || !target) return;

    const edgeId = createEdgeId(source, target);

    reactFlow.addEdges({ id: edgeId, source, target });
  };
