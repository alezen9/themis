import { useEffect, type ReactNode } from "react";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./modals/useNdgEditorModalStore";

type Props = { children: ReactNode };

export const KeyboardShortcuts = (props: Props) => {
  const { children } = props;
  const undo = useNdgEditorStore(state => state.undo);
  const redo = useNdgEditorStore(state => state.redo);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (useNdgEditorModalStore.getState().modal !== undefined) return;
      if (!event.ctrlKey && !event.metaKey) return;

      switch (event.code) {
        case "KeyZ": {
          event.preventDefault();
          if (event.shiftKey) redo();
          else undo();
          break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  return <div className="size-full">{children}</div>;
};
