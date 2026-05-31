import type { ReactNode } from "react";
import { create } from "zustand";

type ToastOptions = { id?: string; duration?: number | null };

export type ToastInput =
  | { type: "success"; title: string; message?: string }
  | { type: "error"; title: string; message?: string }
  | { type: "custom"; component: ReactNode };

type ToastItem = { id: string; input: ToastInput };

const DEFAULT_DURATION = 4000;

export const useToastStore = create<{
  items: ToastItem[];
  add: (input: ToastInput, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}>((set, get) => ({
  items: [],
  add: (
    input,
    { id = crypto.randomUUID(), duration = DEFAULT_DURATION } = {},
  ) => {
    set(state => ({
      items: [...state.items.filter(t => t.id !== id), { id, input }],
    }));
    if (duration !== null) setTimeout(() => get().dismiss(id), duration);
    return id;
  },
  dismiss: id =>
    set(state => ({ items: state.items.filter(t => t.id !== id) })),
}));

export const toast = (input: ToastInput, options?: ToastOptions) =>
  useToastStore.getState().add(input, options);
