import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { create } from "zustand";

import { createEdgeId, createNodeId } from "../document/ids";
import { initialDocument } from "../document/initialDocument";
import {
  EDITOR_DOCUMENT_VERSION,
  type EditorDocument,
  type EditorEdge,
  type EditorNode,
} from "../document/types";
import {
  applyNodeUpdate,
  toEditorNode,
  type AddNodeInput,
  type UpdateNodeInput,
} from "./actions";
import { canConnectNodes } from "../graph/rules";

const buildAdjacency = (edges: EditorEdge[]) => {
  const map = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!map.has(edge.source)) map.set(edge.source, new Set());
    map.get(edge.source)!.add(edge.target);
  }
  return map;
};

// mutate an already-copied adjacency map
const addToAdjacency = (
  adjacency: Map<string, Set<string>>,
  source: string,
  target: string,
) => {
  const existing = adjacency.get(source);
  adjacency.set(
    source,
    existing ? new Set([...existing, target]) : new Set([target]),
  );
};

const removeFromAdjacency = (
  adjacency: Map<string, Set<string>>,
  source: string,
  target: string,
) => {
  const existing = adjacency.get(source);
  if (!existing) return;
  const updated = new Set(existing);
  updated.delete(target);
  if (updated.size === 0) adjacency.delete(source);
  else adjacency.set(source, updated);
};

type NdgEditorStore = {
  nodes: EditorNode[];
  edges: EditorEdge[];
  _nodeById: Map<string, EditorNode>;
  _edgeById: Map<string, EditorEdge>;
  _adjacency: Map<string, Set<string>>;

  addNode: (input: AddNodeInput) => void;
  updateNode: (input: UpdateNodeInput) => void;
  onNodesChange: (changes: NodeChange<EditorNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<EditorEdge>[]) => void;
  onConnectNodes: (connection: Connection) => void;
  exportDocument: () => EditorDocument;
};

const { nodes: initialNodes, edges: initialEdges } = initialDocument;

export const useNdgEditorStore = create<NdgEditorStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  _nodeById: new Map(initialNodes.map(n => [n.id, n])),
  _edgeById: new Map(initialEdges.map(e => [e.id, e])),
  _adjacency: buildAdjacency(initialEdges),

  addNode: input =>
    set(state => {
      const node = toEditorNode(createNodeId(), input);
      const nodes = [...state.nodes, node];
      const _nodeById = new Map(state._nodeById);
      _nodeById.set(node.id, node);

      if (!input.sourceNodeId) return { nodes, _nodeById };

      const connection: Connection = {
        source: input.sourceNodeId,
        target: node.id,
        sourceHandle: null,
        targetHandle: null,
      };

      if (!canConnectNodes(_nodeById, state._adjacency, connection))
        return { nodes, _nodeById };

      const edgeId = createEdgeId(input.sourceNodeId, node.id);
      const newEdge: EditorEdge = {
        id: edgeId,
        source: input.sourceNodeId,
        target: node.id,
      };
      const edges = [...state.edges, newEdge];
      const _edgeById = new Map(state._edgeById);
      _edgeById.set(edgeId, newEdge);
      addToAdjacency(state._adjacency, input.sourceNodeId, node.id);

      return { nodes, _nodeById, edges, _edgeById };
    }),

  updateNode: input =>
    set(state => {
      const existing = state._nodeById.get(input.id);
      if (!existing) return state;
      const updated = applyNodeUpdate(existing, input);
      const nodes = state.nodes.map(n => (n.id === input.id ? updated : n));
      state._nodeById.set(input.id, updated);
      return { nodes };
    }),

  onNodesChange: changes =>
    set(state => {
      const nodes = applyNodeChanges(changes, state.nodes);
      const structural = changes.filter(
        c => c.type === "add" || c.type === "remove",
      );
      if (structural.length === 0) return { nodes };
      for (const change of structural) {
        if (change.type === "remove") state._nodeById.delete(change.id);
        else if (change.type === "add")
          state._nodeById.set(change.item.id, change.item);
      }
      return { nodes };
    }),

  onEdgesChange: changes =>
    set(state => {
      const edges = applyEdgeChanges(changes, state.edges);
      const structural = changes.filter(
        c => c.type === "add" || c.type === "remove",
      );
      if (structural.length === 0) return { edges };
      for (const change of structural) {
        if (change.type === "remove") {
          const edge = state._edgeById.get(change.id);
          if (edge) {
            state._edgeById.delete(change.id);
            removeFromAdjacency(state._adjacency, edge.source, edge.target);
          }
        } else if (change.type === "add") {
          state._edgeById.set(change.item.id, change.item);
          addToAdjacency(state._adjacency, change.item.source, change.item.target);
        }
      }
      return { edges };
    }),

  onConnectNodes: connection =>
    set(state => {
      const { source, target } = connection;
      if (!canConnectNodes(state._nodeById, state._adjacency, connection))
        return state;
      const edgeId = createEdgeId(source, target);
      const newEdge: EditorEdge = { id: edgeId, source, target };
      const edges = [...state.edges, newEdge];
      state._edgeById.set(edgeId, newEdge);
      addToAdjacency(state._adjacency, source, target);
      return { edges };
    }),

  exportDocument: () => {
    const { nodes, edges } = get();
    return { version: EDITOR_DOCUMENT_VERSION, nodes, edges };
  },

}));
