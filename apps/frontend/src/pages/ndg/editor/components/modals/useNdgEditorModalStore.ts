import { create } from "zustand";

export type ModalPayload =
  | { mode: "create-node"; sourceNodeId?: string }
  | { mode: "edit-node"; nodeId: string }
  | { mode: "edit-edge"; edgeId: string };

type NdgEditorModalStore = {
  modal: ModalPayload | undefined;
  openModal: (payload: ModalPayload) => void;
  closeModal: () => void;
};

export const useNdgEditorModalStore = create<NdgEditorModalStore>(set => ({
  modal: undefined,
  openModal: payload => set({ modal: payload }),
  closeModal: () => set({ modal: undefined }),
}));
