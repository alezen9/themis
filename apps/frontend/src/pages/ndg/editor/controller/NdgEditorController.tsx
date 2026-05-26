import { useCallback, useEffect } from "react";
import { type Connection, useReactFlow } from "@xyflow/react";

import { createEdgeId } from "../document/ids";
import type { EditorEdge, EditorNode } from "../document/types";
import { useNdgEditorControllerContext } from "./NdgEditorControllerContext";

export const NdgEditorController = () => {
  const reactFlow = useReactFlow<EditorNode, EditorEdge>();
  const { commandsRef, documentRef } = useNdgEditorControllerContext();

  const connectNodes = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;

      if (!source || !target) {
        return;
      }

      const edgeId = createEdgeId(source, target);

      if (reactFlow.getEdge(edgeId)) {
        return;
      }

      const edge: EditorEdge = {
        id: edgeId,
        source,
        target,
      };

      reactFlow.addEdges(edge);

      if (documentRef.current.edges.some((item) => item.id === edgeId)) {
        return;
      }

      documentRef.current = {
        ...documentRef.current,
        edges: [...documentRef.current.edges, edge],
      };
    },
    [documentRef, reactFlow],
  );

  useEffect(() => {
    commandsRef.current = { connectNodes };

    return () => {
      commandsRef.current = null;
    };
  }, [commandsRef, connectNodes]);

  return null;
};
