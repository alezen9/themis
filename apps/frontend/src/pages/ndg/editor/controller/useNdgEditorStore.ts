import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { create } from "zustand";

import { createEdgeId, createNodeId } from "../document/ids";
import {
  isValidFullImport,
  isValidPartialImport,
  remapDocumentIds,
} from "../document/import";
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

  selectedNodes: EditorNode[];
  selectedEdges: EditorEdge[];
  setSelection: (nodes: EditorNode[], edges: EditorEdge[]) => void;

  addNode: (input: AddNodeInput) => void;
  updateNode: (input: UpdateNodeInput) => void;
  deleteSelected: () => void;
  onNodesChange: (changes: NodeChange<EditorNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<EditorEdge>[]) => void;
  onConnectNodes: (connection: Connection) => void;
  exportDocument: () => EditorDocument;
  exportSelected: () => EditorDocument;
  // replace the whole graph; rejected (returns false) unless it has one check
  importFull: (doc: EditorDocument) => boolean;
  // merge with fresh ids; rejected (returns false) if it carries a check
  importPartial: (doc: EditorDocument) => boolean;
};

const { nodes: initialNodes, edges: initialEdges } = initialDocument;

export const useNdgEditorStore = create<NdgEditorStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodes: [],
  selectedEdges: [],
  setSelection: (nodes, edges) => set({ selectedNodes: nodes, selectedEdges: edges }),
  _nodeById: new Map(initialNodes.map(n => [n.id, n])),
  _edgeById: new Map(initialEdges.map(e => [e.id, e])),
  _adjacency: buildAdjacency(initialEdges),

  addNode: input =>
    set(state => {
      const { sourceNodeId = "" } = input;
      const node = toEditorNode(createNodeId(), { x: 0, y: 200 }, input);
      const nodes = [...state.nodes, node];
      const _nodeById = new Map(state._nodeById);
      _nodeById.set(node.id, node);

      if (!sourceNodeId) return { nodes, _nodeById };

      const connection: Connection = {
        source: sourceNodeId,
        target: node.id,
        sourceHandle: null,
        targetHandle: null,
      };

      if (!canConnectNodes(_nodeById, state._adjacency, connection))
        return { nodes, _nodeById };

      const edgeId = createEdgeId(sourceNodeId, node.id);
      const newEdge: EditorEdge = {
        id: edgeId,
        source: sourceNodeId,
        target: node.id,
      };
      const edges = [...state.edges, newEdge];
      const _edgeById = new Map(state._edgeById);
      _edgeById.set(edgeId, newEdge);
      addToAdjacency(state._adjacency, sourceNodeId, node.id);

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

  deleteSelected: () =>
    set(state => {
      const selectedNodes = state.nodes.filter(n => n.selected);
      if (selectedNodes.some(n => n.type === "check")) return state;
      const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
      const edgesToRemove = state.edges.filter(
        e => e.selected || selectedNodeIds.has(e.source) || selectedNodeIds.has(e.target),
      );
      const edgeIdsToRemove = new Set(edgesToRemove.map(e => e.id));
      const nodes = state.nodes.filter(n => !selectedNodeIds.has(n.id));
      const edges = state.edges.filter(e => !edgeIdsToRemove.has(e.id));
      for (const n of selectedNodes) state._nodeById.delete(n.id);
      for (const e of edgesToRemove) {
        state._edgeById.delete(e.id);
        removeFromAdjacency(state._adjacency, e.source, e.target);
      }
      return { nodes, edges };
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
          addToAdjacency(
            state._adjacency,
            change.item.source,
            change.item.target,
          );
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

  exportSelected: () => {
    const { nodes, edges } = get();
    const selectedNodes = nodes.filter(n => n.selected);
    const selectedIds = new Set(selectedNodes.map(n => n.id));
    const selectedEdges = edges.filter(
      e => selectedIds.has(e.source) && selectedIds.has(e.target),
    );
    return { version: EDITOR_DOCUMENT_VERSION, nodes: selectedNodes, edges: selectedEdges };
  },

  importFull: doc => {
    if (!isValidFullImport(doc)) return false;
    set({
      nodes: doc.nodes,
      edges: doc.edges,
      _nodeById: new Map(doc.nodes.map(n => [n.id, n])),
      _edgeById: new Map(doc.edges.map(e => [e.id, e])),
      _adjacency: buildAdjacency(doc.edges),
    });
    return true;
  },

  importPartial: doc => {
    if (!isValidPartialImport(doc)) return false;
    const { nodes: addedNodes, edges: addedEdges } = remapDocumentIds(doc);
    set(state => {
      for (const n of addedNodes) state._nodeById.set(n.id, n);
      for (const e of addedEdges) {
        state._edgeById.set(e.id, e);
        addToAdjacency(state._adjacency, e.source, e.target);
      }
      return {
        nodes: [...state.nodes, ...addedNodes],
        edges: [...state.edges, ...addedEdges],
      };
    });
    return true;
  },
}));
