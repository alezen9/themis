import { createPortal } from "react-dom";

import { ToastContext } from "./context";
import { useToastStore } from "./store";

export const Toaster = () => {
  const toasts = useToastStore(state => state.toasts);
  const dismiss = useToastStore(state => state.dismiss);

  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
      {toasts.map(({ id, content }) => (
        <ToastContext.Provider key={id} value={{ dismiss: () => dismiss(id) }}>
          <div className="pointer-events-auto">{content}</div>
        </ToastContext.Provider>
      ))}
    </div>,
    document.body,
  );
};
