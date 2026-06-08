import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
  Connection,
  EdgeChange,
  NodeChange,
  OnSelectionChangeParams,
  XYPosition,
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
  toExportEdge,
  toExportNode,
  type AddNodeInput,
  type UpdateNodeInput,
} from "./actions";
import { canConnectNodes } from "../graph/rules";
import { findInvalidEdgeIds, findInvalidNodeIds } from "../graph/validate";
import { findUnreachableNodeIds } from "../graph/reachability";
import {
  emptyHistory,
  record as recordHistory,
  undo as undoHistory,
  redo as redoHistory,
  type History,
} from "./history";

const CHILD_OFFSET_Y = 170;

const childPosition = (parent: EditorNode | undefined): XYPosition => {
  if (!parent) return { x: 0, y: CHILD_OFFSET_Y };
  const { x, y } = parent.position;
  return { x, y: y + CHILD_OFFSET_Y };
};

const createKeyCounts = (nodes: EditorNode[]) => {
  const keyCounts = new Map<string, number>();
  for (const node of nodes)
    keyCounts.set(node.data.key, (keyCounts.get(node.data.key) ?? 0) + 1);
  return keyCounts;
};

const createAdjacencyList = (edges: EditorEdge[]) => {
  const map = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!map.has(edge.source)) map.set(edge.source, new Set());
    map.get(edge.source)!.add(edge.target);
  }
  return map;
};

const indexById = <T extends { id: string }>(items: T[]) =>
  new Map(items.map(item => [item.id, item]));

const derive = (nodes: EditorNode[], edges: EditorEdge[]) => ({
  _nodeById: indexById(nodes),
  _edgeById: indexById(edges),
  _adjacencyList: createAdjacencyList(edges),
  _keyCounts: createKeyCounts(nodes),
  _invalidNodeIds: findInvalidNodeIds(nodes),
  _unreachableNodeIds: findUnreachableNodeIds(nodes, edges),
  _invalidEdgeIds: findInvalidEdgeIds(nodes, edges),
});

const isStructuralNodeChange = (change: NodeChange<EditorNode>) =>
  change.type === "add" ||
  change.type === "remove" ||
  change.type === "replace";

const isStructuralEdgeChange = (change: EdgeChange<EditorEdge>) =>
  change.type !== "select";

type Snapshot = { nodes: EditorNode[]; edges: EditorEdge[] };

const reconcileSelection = (nodes: EditorNode[], edges: EditorEdge[]) => ({
  selectedNodes: nodes.filter(node => node.selected),
  selectedEdges: edges.filter(edge => edge.selected),
});

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

  history: History<Snapshot>;

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
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;
};

const withHistory = (state: NdgEditorStore, next: Partial<NdgEditorStore>) => ({
  ...next,
  history: recordHistory(state.history, {
    nodes: state.nodes,
    edges: state.edges,
  }),
});

const { nodes: initialNodes, edges: initialEdges } = initialDocument;

export const useNdgEditorStore = create<NdgEditorStore>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodes: [],
  selectedEdges: [],
  history: emptyHistory(),
  ...derive(initialNodes, initialEdges),

  onSelectionChange: ({ nodes, edges }) =>
    set({ selectedNodes: nodes, selectedEdges: edges }),

  getNodeById: id => get()._nodeById.get(id),
  getEdgeById: id => get()._edgeById.get(id),
  isDuplicateKey: key => (get()._keyCounts.get(key) ?? 0) > 1,
  isInvalidNode: id => get()._invalidNodeIds.has(id),
  isUnreachableNode: id => get()._unreachableNodeIds.has(id),
  isInvalidEdge: id => get()._invalidEdgeIds.has(id),

  addNode: input =>
    set(state => {
      const { sourceNodeId, ...nodeInput } = input;
      const parent = state._nodeById.get(sourceNodeId ?? "");
      const node = toEditorNode(
        createNodeId(),
        childPosition(parent),
        nodeInput,
      );
      const nodes = [...state.nodes, node];
      const derived = derive(nodes, state.edges);

      if (!sourceNodeId) return withHistory(state, { nodes, ...derived });

      const connection: Connection = {
        source: sourceNodeId,
        target: node.id,
        sourceHandle: null,
        targetHandle: null,
      };
      if (
        !canConnectNodes(derived._nodeById, derived._adjacencyList, connection)
      )
        return withHistory(state, { nodes, ...derived });

      const newEdge: EditorEdge = {
        id: createEdgeId(sourceNodeId, node.id),
        source: sourceNodeId,
        target: node.id,
      };
      const edges = [...state.edges, newEdge];
      return withHistory(state, { nodes, edges, ...derive(nodes, edges) });
    }),

  updateNode: input =>
    set(state => {
      const existing = state._nodeById.get(input.id);
      if (!existing) return state;
      const updated = applyNodeUpdate(existing, input);
      const nodes = state.nodes.map(n => (n.id === input.id ? updated : n));
      return withHistory(state, { nodes, ...derive(nodes, state.edges) });
    }),

  deleteSelected: () =>
    set(state => {
      const { selectedNodes, selectedEdges } = state;
      if (selectedNodes.some(n => n.type === "check")) return state;
      const selectedNodeIds = new Set(selectedNodes.map(n => n.id));
      const selectedEdgeIds = new Set(selectedEdges.map(e => e.id));
      const nodes = state.nodes.filter(n => !selectedNodeIds.has(n.id));
      const edges = state.edges.filter(
        e =>
          !selectedEdgeIds.has(e.id) &&
          !selectedNodeIds.has(e.source) &&
          !selectedNodeIds.has(e.target),
      );
      return withHistory(state, {
        nodes,
        edges,
        selectedNodes: [],
        selectedEdges: [],
        ...derive(nodes, edges),
      });
    }),

  onNodesChange: changes =>
    set(state => {
      const nodes = applyNodeChanges(changes, state.nodes);
      if (!changes.some(isStructuralNodeChange))
        return { nodes, _nodeById: indexById(nodes) };
      return { nodes, ...derive(nodes, state.edges) };
    }),

  onEdgesChange: changes =>
    set(state => {
      const edges = applyEdgeChanges(changes, state.edges);
      if (!changes.some(isStructuralEdgeChange))
        return { edges, _edgeById: indexById(edges) };
      return { edges, ...derive(state.nodes, edges) };
    }),

  onConnectNodes: connection =>
    set(state => {
      const { source, target } = connection;
      if (!canConnectNodes(state._nodeById, state._adjacencyList, connection))
        return state;
      const newEdge: EditorEdge = {
        id: createEdgeId(source, target),
        source,
        target,
      };
      const edges = [...state.edges, newEdge];
      return withHistory(state, { edges, ...derive(state.nodes, edges) });
    }),

  setEdgeCondition: (edgeId, condition) =>
    set(state => {
      const existing = state._edgeById.get(edgeId);
      if (!existing) return state;
      const updated = { ...existing, data: { ...existing.data, condition } };
      const edges = state.edges.map(e => (e.id === edgeId ? updated : e));
      return withHistory(state, { edges, ...derive(state.nodes, edges) });
    }),

  exportDocument: () => {
    const { nodes, edges } = get();
    return {
      version: EDITOR_DOCUMENT_VERSION,
      nodes: nodes.map(toExportNode),
      edges: edges.map(toExportEdge),
    };
  },

  exportSelected: () => {
    const { edges, selectedNodes } = get();
    const selectedIds = new Set(selectedNodes.map(n => n.id));
    const selectedEdges = edges.filter(
      e => selectedIds.has(e.source) && selectedIds.has(e.target),
    );
    return {
      version: EDITOR_DOCUMENT_VERSION,
      nodes: selectedNodes.map(toExportNode),
      edges: selectedEdges.map(toExportEdge),
    };
  },

  importFull: document => {
    if (document.nodes.filter(n => n.type === "check").length !== 1)
      return false;
    set(state =>
      withHistory(state, {
        nodes: document.nodes,
        edges: document.edges,
        selectedNodes: [],
        selectedEdges: [],
        ...derive(document.nodes, document.edges),
      }),
    );
    return true;
  },

  importPartial: document => {
    if (document.nodes.some(n => n.type === "check")) return false;
    const { nodes: addedNodes, edges: addedEdges } = remapDocumentIds(document);
    set(state => {
      const nodes = [...state.nodes, ...addedNodes];
      const edges = [...state.edges, ...addedEdges];
      return withHistory(state, { nodes, edges, ...derive(nodes, edges) });
    });
    return true;
  },

  commitHistory: () =>
    set(state => ({
      history: recordHistory(state.history, {
        nodes: state.nodes,
        edges: state.edges,
      }),
    })),

  undo: () =>
    set(state => {
      const result = undoHistory(state.history, {
        nodes: state.nodes,
        edges: state.edges,
      });
      if (!result) return state;
      const { nodes, edges } = result.value;
      return {
        nodes,
        edges,
        history: result.history,
        ...derive(nodes, edges),
        ...reconcileSelection(nodes, edges),
      };
    }),

  redo: () =>
    set(state => {
      const result = redoHistory(state.history, {
        nodes: state.nodes,
        edges: state.edges,
      });
      if (!result) return state;
      const { nodes, edges } = result.value;
      return {
        nodes,
        edges,
        history: result.history,
        ...derive(nodes, edges),
        ...reconcileSelection(nodes, edges),
      };
    }),
}));
