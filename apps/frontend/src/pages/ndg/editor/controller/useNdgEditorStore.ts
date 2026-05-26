import { create } from "zustand";

import {
  EDITOR_DOCUMENT_VERSION,
  type EditorDocument,
} from "../document/types";
import type { NdgEditorActions } from "./actions";

const noop = () => undefined;
const exportEmptyDocument = (): EditorDocument => ({
  version: EDITOR_DOCUMENT_VERSION,
  nodes: [],
  edges: [],
});

type NdgEditorModal =
  | { mode: "create-node"; sourceNodeId?: string }
  | { mode: "edit-node"; nodeId: string }
  | { mode: "edit-edge"; edgeId: string };

type NdgEditorStore = NdgEditorActions & {
  closeModal: () => void;
  modal: NdgEditorModal | undefined;
  openCreateNodeModal: (sourceNodeId?: string) => void;
  openEditEdgeModal: (edgeId: string) => void;
  openEditNodeModal: (nodeId: string) => void;
  setActions: (actions: Partial<NdgEditorActions>) => void;
};

export const useNdgEditorStore = create<NdgEditorStore>((set) => ({
  modal: undefined,
  addNode: noop,
  closeModal: () => set({ modal: undefined }),
  exportDocument: exportEmptyDocument,
  onConnectNodes: noop,
  openCreateNodeModal: (sourceNodeId) =>
    set({ modal: { mode: "create-node", sourceNodeId } }),
  openEditEdgeModal: (edgeId) => set({ modal: { mode: "edit-edge", edgeId } }),
  openEditNodeModal: (nodeId) => set({ modal: { mode: "edit-node", nodeId } }),
  setActions: (actions) => set(actions),
}));
