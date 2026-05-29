import type { ReactNode } from "react";
import { create } from "zustand";

type Toast = { id: string; content: ReactNode };

type ToastOptions = { id?: string; duration?: number | null };

type ToastStore = {
  toasts: Toast[];
  add: (content: ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
};

const DEFAULT_DURATION = 4000;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  add: (content, { id = crypto.randomUUID(), duration = DEFAULT_DURATION } = {}) => {
    set(state => ({
      toasts: [...state.toasts.filter(existing => existing.id !== id), { id, content }],
    }));
    if (duration !== null) setTimeout(() => get().dismiss(id), duration);
    return id;
  },
  dismiss: id =>
    set(state => ({ toasts: state.toasts.filter(existing => existing.id !== id) })),
}));

export const toast = (content: ReactNode, options?: ToastOptions) =>
  useToastStore.getState().add(content, options);
