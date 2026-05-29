import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
  Connection,
  EdgeChange,
  NodeChange,
  OnSelectionChangeParams,
} from "@xyflow/react";
import { create } from "zustand";

import { createEdgeId, createNodeId } from "../document/ids";
import { remapDocumentIds } from "../document/import";
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

const createKeyCounts = (nodes: EditorNode[]) => {
  const keyCounts = new Map<string, number>();
  for (const node of nodes)
    keyCounts.set(node.data.key, (keyCounts.get(node.data.key) ?? 0) + 1);
  return keyCounts;
};

const incrementKeyCount = (keyCounts: Map<string, number>, key: string) => {
  keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
};

const decrementKeyCount = (keyCounts: Map<string, number>, key: string) => {
  const next = (keyCounts.get(key) ?? 0) - 1;
  if (next <= 0) keyCounts.delete(key);
  else keyCounts.set(key, next);
};

const createAdjacencyList = (edges: EditorEdge[]) => {
  const map = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!map.has(edge.source)) map.set(edge.source, new Set());
    map.get(edge.source)!.add(edge.target);
  }
  return map;
};

const addToAdjacencyList = (
  adjacencyList: Map<string, Set<string>>,
  source: string,
  target: string,
) => {
  const existing = adjacencyList.get(source);
  if (existing) existing.add(target);
  else adjacencyList.set(source, new Set([target]));
};

const removeFromAdjacencyList = (
  adjacencyList: Map<string, Set<string>>,
  source: string,
  target: string,
) => {
  const existing = adjacencyList.get(source);
  if (!existing) return;
  existing.delete(target);
  if (existing.size === 0) adjacencyList.delete(source);
};

type NdgEditorStore = {
  nodes: EditorNode[];
  edges: EditorEdge[];
  _nodeById: Map<string, EditorNode>;
  _edgeById: Map<string, EditorEdge>;
  _adjacencyList: Map<string, Set<string>>;
  _keyCounts: Map<string, number>;

  selectedNodes: EditorNode[];
  selectedEdges: EditorEdge[];
  onSelectionChange: (
    changes: OnSelectionChangeParams<EditorNode, EditorEdge>,
  ) => void;

  getNodeById: (id: string) => EditorNode | undefined;
  getEdgeById: (id: string) => EditorEdge | undefined;
  isDuplicateKey: (key: string) => boolean;

  addNode: (input: AddNodeInput) => void;
  updateNode: (input: UpdateNodeInput) => void;
  deleteSelected: () => void;
  onNodesChange: (changes: NodeChange<EditorNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<EditorEdge>[]) => void;
  onConnectNodes: (connection: Connection) => void;
  exportDocument: () => EditorDocument;
  exportSelected: () => EditorDocument;
  importFull: (document: EditorDocument) => boolean;
  importPartial: (document: EditorDocument) => boolean;
};

const { nodes: initialNodes, edges: initialEdges } = initialDocument;

export const useNdgEditorStore = create<NdgEditorStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodes: [],
  selectedEdges: [],
  _nodeById: new Map(initialNodes.map(n => [n.id, n])),
  _edgeById: new Map(initialEdges.map(e => [e.id, e])),
  _adjacencyList: createAdjacencyList(initialEdges),
  _keyCounts: createKeyCounts(initialNodes),

  onSelectionChange: ({ nodes, edges }) =>
    set({ selectedNodes: nodes, selectedEdges: edges }),

  getNodeById: id => get()._nodeById.get(id),
  getEdgeById: id => get()._edgeById.get(id),
  isDuplicateKey: key => (get()._keyCounts.get(key) ?? 0) > 1,

  addNode: input =>
    set(state => {
      const { sourceNodeId } = input;
      const node = toEditorNode(createNodeId(), { x: 0, y: 200 }, input);
      state._nodeById.set(node.id, node);
      incrementKeyCount(state._keyCounts, node.data.key);
      const nodes = [...state.nodes, node];

      if (!sourceNodeId) return { nodes };

      const connection: Connection = {
        source: sourceNodeId,
        target: node.id,
        sourceHandle: null,
        targetHandle: null,
      };

      if (!canConnectNodes(state._nodeById, state._adjacencyList, connection))
        return { nodes };

      const edgeId = createEdgeId(sourceNodeId, node.id);
      const newEdge: EditorEdge = {
        id: edgeId,
        source: sourceNodeId,
        target: node.id,
      };
      state._edgeById.set(edgeId, newEdge);
      addToAdjacencyList(state._adjacencyList, sourceNodeId, node.id);

      return { nodes, edges: [...state.edges, newEdge] };
    }),

  updateNode: input =>
    set(state => {
      const existing = state._nodeById.get(input.id);
      if (!existing) return state;
      const updated = applyNodeUpdate(existing, input);
      const nodes = state.nodes.map(n => (n.id === input.id ? updated : n));
      state._nodeById.set(input.id, updated);
      if (existing.data.key !== updated.data.key) {
        decrementKeyCount(state._keyCounts, existing.data.key);
        incrementKeyCount(state._keyCounts, updated.data.key);
      }
      return { nodes };
    }),

  deleteSelected: () =>
    set(state => {
      const selectedNodes = state.nodes.filter(n => n.selected);
      if (selectedNodes.some(n => n.type === "check")) return state;
      const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
      const edgesToRemove = state.edges.filter(
        e =>
          e.selected ||
          selectedNodeIds.has(e.source) ||
          selectedNodeIds.has(e.target),
      );
      const edgeIdsToRemove = new Set(edgesToRemove.map(e => e.id));
      const nodes = state.nodes.filter(n => !selectedNodeIds.has(n.id));
      const edges = state.edges.filter(e => !edgeIdsToRemove.has(e.id));
      for (const n of selectedNodes) {
        state._nodeById.delete(n.id);
        decrementKeyCount(state._keyCounts, n.data.key);
      }
      for (const e of edgesToRemove) {
        state._edgeById.delete(e.id);
        removeFromAdjacencyList(state._adjacencyList, e.source, e.target);
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
        if (change.type === "remove") {
          const node = state._nodeById.get(change.id);
          if (node) {
            state._nodeById.delete(change.id);
            decrementKeyCount(state._keyCounts, node.data.key);
          }
        } else if (change.type === "add") {
          state._nodeById.set(change.item.id, change.item);
          incrementKeyCount(state._keyCounts, change.item.data.key);
        }
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
            removeFromAdjacencyList(state._adjacencyList, edge.source, edge.target);
          }
        } else if (change.type === "add") {
          state._edgeById.set(change.item.id, change.item);
          addToAdjacencyList(
            state._adjacencyList,
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
      if (!canConnectNodes(state._nodeById, state._adjacencyList, connection))
        return state;
      const edgeId = createEdgeId(source, target);
      const newEdge: EditorEdge = { id: edgeId, source, target };
      const edges = [...state.edges, newEdge];
      state._edgeById.set(edgeId, newEdge);
      addToAdjacencyList(state._adjacencyList, source, target);
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
    return {
      version: EDITOR_DOCUMENT_VERSION,
      nodes: selectedNodes,
      edges: selectedEdges,
    };
  },

  importFull: document => {
    if (document.nodes.filter(n => n.type === "check").length !== 1) return false;
    set({
      nodes: document.nodes,
      edges: document.edges,
      _nodeById: new Map(document.nodes.map(n => [n.id, n])),
      _edgeById: new Map(document.edges.map(e => [e.id, e])),
      _adjacencyList: createAdjacencyList(document.edges),
      _keyCounts: createKeyCounts(document.nodes),
    });
    return true;
  },

  importPartial: document => {
    if (document.nodes.some(n => n.type === "check")) return false;
    const { nodes: addedNodes, edges: addedEdges } = remapDocumentIds(document);
    set(state => {
      for (const n of addedNodes) {
        state._nodeById.set(n.id, n);
        incrementKeyCount(state._keyCounts, n.data.key);
      }
      for (const e of addedEdges) {
        state._edgeById.set(e.id, e);
        addToAdjacencyList(state._adjacencyList, e.source, e.target);
      }
      return {
        nodes: [...state.nodes, ...addedNodes],
        edges: [...state.edges, ...addedEdges],
      };
    });
    return true;
  },
}));
