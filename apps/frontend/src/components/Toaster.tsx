import { createContext, use } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

import { IconCheck, IconClose, IconWarning } from "@components/Icons";
import { useToastStore, type ToastInput } from "@components/toast";

const ToastContext = createContext<{ dismiss: () => void } | null>(null);

const useToast = () => {
  const ctx = use(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside Toaster");
  return ctx;
};

type PresetProps = { title: string; children?: ReactNode };

const ToastSuccess = (props: PresetProps) => {
  const { title, children } = props;
  const { dismiss } = useToast();
  return (
    <div className="flex items-start gap-3 rounded-sm border border-envy-300 bg-envy-50 p-3 text-envy-900 shadow-lg shadow-sand-950/5">
      <IconCheck className="mt-0.5 size-5 shrink-0 text-envy-600" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{title}</p>
        {children && <div className="text-sand-800">{children}</div>}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-sm p-0.5 text-current/60 hover:text-current"
      >
        <IconClose className="size-4" />
      </button>
    </div>
  );
};

const ToastError = (props: PresetProps) => {
  const { title, children } = props;
  const { dismiss } = useToast();
  return (
    <div className="flex items-start gap-3 rounded-sm border border-red-300 bg-red-50 p-3 text-red-900 shadow-lg shadow-sand-950/5">
      <IconWarning className="mt-0.5 size-5 shrink-0 text-red-600" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{title}</p>
        {children && <div className="text-sand-800">{children}</div>}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-sm p-0.5 text-current/60 hover:text-current"
      >
        <IconClose className="size-4" />
      </button>
    </div>
  );
};

const ToastContent = ({ input }: { input: ToastInput }) => {
  switch (input.type) {
    case "success":
      return <ToastSuccess title={input.title}>{input.message}</ToastSuccess>;
    case "error":
      return <ToastError title={input.title}>{input.message}</ToastError>;
    case "custom":
      return <>{input.component}</>;
  }
};

export const Toaster = () => {
  const items = useToastStore(s => s.items);
  const dismiss = useToastStore(s => s.dismiss);
  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {items.map(({ id, input }) => (
        <ToastContext key={id} value={{ dismiss: () => dismiss(id) }}>
          <div className="pointer-events-auto">
            <ToastContent input={input} />
          </div>
        </ToastContext>
      ))}
    </div>,
    document.body,
  );
};
