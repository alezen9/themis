import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";

import type { EditorEdge, EditorNode } from "../document/types";
import {
  addNodeFactory,
  exportDocumentFactory,
  onConnectNodesFactory,
} from "./actions";
import { useNdgEditorStore } from "./useNdgEditorStore";

export const NdgEditorController = () => {
  const reactFlow = useReactFlow<EditorNode, EditorEdge>();
  const setActions = useNdgEditorStore((state) => state.setActions);

  useEffect(() => {
    setActions({
      addNode: addNodeFactory(reactFlow),
      exportDocument: exportDocumentFactory(reactFlow),
      onConnectNodes: onConnectNodesFactory(reactFlow),
    });
  }, [reactFlow, setActions]);

  return null;
};
