import { createContext, use } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";

import { IconCheck, IconClose, IconWarning } from "@components/Icons";

type ToastItem = { id: string; content: ReactNode };
type ToastOptions = { id?: string; duration?: number | null };

const DEFAULT_DURATION = 4000;

const useToastStore = create<{
  toasts: ToastItem[];
  add: (content: ReactNode, options?: ToastOptions) => string;
  dismiss: (id: string) => void;
}>((set, get) => ({
  toasts: [],
  add: (content, { id = crypto.randomUUID(), duration = DEFAULT_DURATION } = {}) => {
    set(state => ({
      toasts: [...state.toasts.filter(t => t.id !== id), { id, content }],
    }));
    if (duration !== null) setTimeout(() => get().dismiss(id), duration);
    return id;
  },
  dismiss: id => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));

const ToastContext = createContext<{ dismiss: () => void } | null>(null);

const useToast = () => {
  const ctx = use(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside Toaster");
  return ctx;
};

type ToastPresetProps = { title: string; children?: ReactNode };

const ToastSuccess = (props: ToastPresetProps) => {
  const { title, children } = props;
  const { dismiss } = useToast();
  return (
    <div className="flex items-start gap-3 rounded-sm border border-envy-300 bg-envy-50 p-3 text-envy-900 shadow-lg shadow-sand-950/5">
      <IconCheck className="mt-0.5 size-5 shrink-0 text-envy-600" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{title}</p>
        {children && <div className="text-sand-800">{children}</div>}
      </div>
      <button type="button" onClick={dismiss} className="shrink-0 rounded-sm p-0.5 text-current/60 hover:text-current">
        <IconClose className="size-4" />
      </button>
    </div>
  );
};

const ToastError = (props: ToastPresetProps) => {
  const { title, children } = props;
  const { dismiss } = useToast();
  return (
    <div className="flex items-start gap-3 rounded-sm border border-red-300 bg-red-50 p-3 text-red-900 shadow-lg shadow-sand-950/5">
      <IconWarning className="mt-0.5 size-5 shrink-0 text-red-600" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{title}</p>
        {children && <div className="text-sand-800">{children}</div>}
      </div>
      <button type="button" onClick={dismiss} className="shrink-0 rounded-sm p-0.5 text-current/60 hover:text-current">
        <IconClose className="size-4" />
      </button>
    </div>
  );
};

type ToastInput =
  | { type: "success"; title: string; message?: string }
  | { type: "error"; title: string; message?: string }
  | { type: "custom"; component: ReactNode };

export const toast = (input: ToastInput, options?: ToastOptions) => {
  const { add } = useToastStore.getState();
  switch (input.type) {
    case "success":
      return add(<ToastSuccess title={input.title}>{input.message}</ToastSuccess>, options);
    case "error":
      return add(<ToastError title={input.title}>{input.message}</ToastError>, options);
    case "custom":
      return add(input.component, options);
  }
};

export const Toaster = () => {
  const toasts = useToastStore(s => s.toasts);
  const dismiss = useToastStore(s => s.dismiss);
  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map(({ id, content }) => (
        <ToastContext key={id} value={{ dismiss: () => dismiss(id) }}>
          <div className="pointer-events-auto">{content}</div>
        </ToastContext>
      ))}
    </div>,
    document.body,
  );
};
