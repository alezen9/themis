import {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import type { Connection } from "@xyflow/react";

import type { EditorDocument } from "../document/types";

export type NdgEditorCommands = {
  connectNodes: (connection: Connection) => void;
};

type ContextValue = {
  commandsRef: RefObject<NdgEditorCommands | null>;
  documentRef: RefObject<EditorDocument>;
};

const NdgEditorControllerContext = createContext<ContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  initialDocument: EditorDocument;
};

export const NdgEditorControllerProvider = (props: ProviderProps) => {
  const { children, initialDocument } = props;
  const commandsRef = useRef<NdgEditorCommands | null>(null);
  const documentRef = useRef(initialDocument);

  const value = useMemo(
    () => ({ commandsRef, documentRef }),
    [commandsRef, documentRef],
  );

  return (
    <NdgEditorControllerContext.Provider value={value}>
      {children}
    </NdgEditorControllerContext.Provider>
  );
};

export const useNdgEditorControllerContext = () => {
  const context = useContext(NdgEditorControllerContext);

  if (!context) {
    throw new Error(
      "useNdgEditorControllerContext must be used within NdgEditorControllerProvider",
    );
  }

  return context;
};

export const useNdgEditorCommands = () => {
  const { commandsRef } = useNdgEditorControllerContext();

  return useMemo<NdgEditorCommands>(
    () => ({
      connectNodes: (connection) => {
        commandsRef.current?.connectNodes(connection);
      },
    }),
    [commandsRef],
  );
};
