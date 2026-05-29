import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
  Connection,
  EdgeChange,
  NodeChange,
  OnSelectionChangeParams,
} from "@xyflow/react";
import type { Condition } from "@ndg/ndg-core";
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
import { findInvalidEdgeIds, findInvalidNodeIds } from "../graph/validate";
import { findUnreachableNodeIds } from "../graph/reachability";

const validateAll = (nodes: EditorNode[], edges: EditorEdge[]) => ({
  _invalidNodeIds: findInvalidNodeIds(nodes),
  _unreachableNodeIds: findUnreachableNodeIds(nodes, edges),
  _invalidEdgeIds: findInvalidEdgeIds(nodes, edges),
});

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
  _invalidNodeIds: Set<string>;
  _unreachableNodeIds: Set<string>;
  _invalidEdgeIds: Set<string>;

  selectedNodes: EditorNode[];
  selectedEdges: EditorEdge[];
  onSelectionChange: (
    changes: OnSelectionChangeParams<EditorNode, EditorEdge>,
  ) => void;

  getNodeById: (id: string) => EditorNode | undefined;
  getEdgeById: (id: string) => EditorEdge | undefined;
  isDuplicateKey: (key: string) => boolean;
  isInvalidNode: (id: string) => boolean;
  isUnreachableNode: (id: string) => boolean;
  isInvalidEdge: (id: string) => boolean;
  validateGraph: () => number;

  addNode: (input: AddNodeInput) => void;
  updateNode: (input: UpdateNodeInput) => void;
  deleteSelected: () => void;
  onNodesChange: (changes: NodeChange<EditorNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<EditorEdge>[]) => void;
  onConnectNodes: (connection: Connection) => void;
  setEdgeCondition: (edgeId: string, condition: Condition | undefined) => void;
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
  ...validateAll(initialNodes, initialEdges),

  onSelectionChange: ({ nodes, edges }) =>
    set({ selectedNodes: nodes, selectedEdges: edges }),

  getNodeById: id => get()._nodeById.get(id),
  getEdgeById: id => get()._edgeById.get(id),
  isDuplicateKey: key => (get()._keyCounts.get(key) ?? 0) > 1,
  isInvalidNode: id => get()._invalidNodeIds.has(id),
  isUnreachableNode: id => get()._unreachableNodeIds.has(id),
  isInvalidEdge: id => get()._invalidEdgeIds.has(id),
  validateGraph: () => {
    const { nodes, edges } = get();
    const validation = validateAll(nodes, edges);
    set(validation);
    const flaggedNodeIds = new Set([
      ...validation._invalidNodeIds,
      ...validation._unreachableNodeIds,
    ]);
    return flaggedNodeIds.size + validation._invalidEdgeIds.size;
  },

  addNode: input =>
    set(state => {
      const { sourceNodeId } = input;
      const node = toEditorNode(createNodeId(), { x: 0, y: 200 }, input);
      state._nodeById.set(node.id, node);
      incrementKeyCount(state._keyCounts, node.data.key);
      const nodes = [...state.nodes, node];

      if (!sourceNodeId) return { nodes, ...validateAll(nodes, state.edges) };

      const connection: Connection = {
        source: sourceNodeId,
        target: node.id,
        sourceHandle: null,
        targetHandle: null,
      };

      if (!canConnectNodes(state._nodeById, state._adjacencyList, connection))
        return { nodes, ...validateAll(nodes, state.edges) };

      const edgeId = createEdgeId(sourceNodeId, node.id);
      const newEdge: EditorEdge = {
        id: edgeId,
        source: sourceNodeId,
        target: node.id,
      };
      state._edgeById.set(edgeId, newEdge);
      addToAdjacencyList(state._adjacencyList, sourceNodeId, node.id);

      const edges = [...state.edges, newEdge];
      return { nodes, edges, ...validateAll(nodes, edges) };
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
      return { nodes, ...validateAll(nodes, state.edges) };
    }),

  deleteSelected: () =>
    set(state => {
      const { selectedNodes, selectedEdges } = state;
      if (selectedNodes.some(n => n.type === "check")) return state;
      const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
      const selectedEdgeIds = new Set(selectedEdges.map(e => e.id));
      const edgesToRemove = state.edges.filter(
        e =>
          selectedEdgeIds.has(e.id) ||
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
      return {
        nodes,
        edges,
        selectedNodes: [],
        selectedEdges: [],
        ...validateAll(nodes, edges),
      };
    }),

  onNodesChange: changes =>
    set(state => {
      const nodes = applyNodeChanges(changes, state.nodes);
      const removals = changes.filter(change => change.type === "remove");
      if (removals.length === 0) return { nodes };
      for (const change of removals) {
        const node = state._nodeById.get(change.id);
        if (node) {
          state._nodeById.delete(change.id);
          decrementKeyCount(state._keyCounts, node.data.key);
        }
      }
      return { nodes, ...validateAll(nodes, state.edges) };
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
            removeFromAdjacencyList(
              state._adjacencyList,
              edge.source,
              edge.target,
            );
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
      return { edges, ...validateAll(state.nodes, edges) };
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
      return { edges, ...validateAll(state.nodes, edges) };
    }),

  setEdgeCondition: (edgeId, condition) =>
    set(state => {
      const existing = state._edgeById.get(edgeId);
      if (!existing) return state;
      const updated = { ...existing, data: { ...existing.data, condition } };
      state._edgeById.set(edgeId, updated);
      const edges = state.edges.map(e => (e.id === edgeId ? updated : e));
      return { edges, ...validateAll(state.nodes, edges) };
    }),

  exportDocument: () => {
    const { nodes, edges } = get();
    return { version: EDITOR_DOCUMENT_VERSION, nodes, edges };
  },

  exportSelected: () => {
    const { edges, selectedNodes } = get();
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
    if (document.nodes.filter(n => n.type === "check").length !== 1)
      return false;
    set({
      nodes: document.nodes,
      edges: document.edges,
      selectedNodes: [],
      selectedEdges: [],
      _nodeById: new Map(document.nodes.map(n => [n.id, n])),
      _edgeById: new Map(document.edges.map(e => [e.id, e])),
      _adjacencyList: createAdjacencyList(document.edges),
      _keyCounts: createKeyCounts(document.nodes),
      ...validateAll(document.nodes, document.edges),
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
      const nodes = [...state.nodes, ...addedNodes];
      const edges = [...state.edges, ...addedEdges];
      return { nodes, edges, ...validateAll(nodes, edges) };
    });
    return true;
  },
}));
