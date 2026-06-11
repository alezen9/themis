import { useEffect, type ReactNode } from "react";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./modals/useNdgEditorModalStore";

type Props = { children: ReactNode };

export const KeyboardShortcuts = (props: Props) => {
  const { children } = props;
  const undo = useNdgEditorStore(state => state.undo);
  const redo = useNdgEditorStore(state => state.redo);
  const duplicateSelected = useNdgEditorStore(state => state.duplicateSelected);

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
        case "KeyD": {
          event.preventDefault();
          duplicateSelected();
          break;
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo, duplicateSelected]);

  return <div className="size-full">{children}</div>;
};
