import type { ReactNode } from "react";

import { IconCheck, IconClose, IconWarning } from "@components/Icons";

import { useToast } from "./context";

type ToastProps = { title?: ReactNode; children?: ReactNode };

export const ToastSuccess = (props: ToastProps) => {
  const { title, children } = props;
  const { dismiss } = useToast();

  return (
    <div className="flex items-start gap-3 rounded-sm border border-envy-300 bg-envy-50 p-3 text-envy-900 shadow-lg shadow-sand-950/5">
      <IconCheck className="mt-0.5 size-5 shrink-0 text-envy-600" />
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className="font-medium">{title}</p>}
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

export const ToastError = (props: ToastProps) => {
  const { title, children } = props;
  const { dismiss } = useToast();

  return (
    <div className="flex items-start gap-3 rounded-sm border border-red-300 bg-red-50 p-3 text-red-900 shadow-lg shadow-sand-950/5">
      <IconWarning className="mt-0.5 size-5 shrink-0 text-red-600" />
      <div className="min-w-0 flex-1 text-sm">
        {title && <p className="font-medium">{title}</p>}
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
