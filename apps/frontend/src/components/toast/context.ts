import { createContext, use } from "react";

type ToastControls = { dismiss: () => void };

export const ToastContext = createContext<ToastControls | null>(null);

export const useToast = () => {
  const controls = use(ToastContext);
  if (!controls) throw new Error("useToast must be used inside a Toaster");
  return controls;
};
