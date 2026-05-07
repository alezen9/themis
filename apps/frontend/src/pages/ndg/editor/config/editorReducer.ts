import type { Condition } from "@ndg/ndg-core";
import type { Connection, NodeChange, XYPosition } from "@xyflow/react";
import {
  applyConnection,
  applyNodePositionChanges,
  applyReconnect,
} from "./adapter";
import {
  addChildNode,
  applyAutoLayout,
  closeNodeEditor,
  deleteNodes,
  disconnectEdge,
  openNodeEditor,
  saveNode,
  setAutoLayoutError,
  setEdgeCondition,
  type EditorState,
} from "./graph";
import type { NodeDraft } from "./nodeFactory";

export type NdgEditorAction =
  | { type: "addChild"; parentId: string }
  | {
      type: "applyEdgeCondition";
      sourceId: string;
      targetId: string;
      when: Condition;
    }
  | {
      type: "applyAutoLayout";
      edgeLayoutById: Record<string, XYPosition[]>;
      layoutById: Record<string, XYPosition>;
    }
  | { type: "applyConnection"; connection: Connection }
  | { type: "applyNodeChanges"; changes: NodeChange[] }
  | { type: "autoLayoutError"; error: string }
  | { type: "clearEdgeCondition"; sourceId: string; targetId: string }
  | { type: "closeDialog" }
  | { type: "deleteNodes"; nodeIds: string[] }
  | { type: "disconnectEdge"; sourceId: string; targetId: string }
  | {
      type: "reconnectEdge";
      oldEdge: { source?: string | null; target?: string | null };
      connection: Connection;
    }
  | { type: "hydrate"; state: EditorState }
  | { type: "openDialog"; nodeId: string }
  | { type: "saveNode"; nodeId: string; draft: NodeDraft };

const getMovedNodeIds = (changes: readonly NodeChange[]) => {
  const movedNodeIds = new Set<string>();

  for (const change of changes) {
    if (change.type !== "position" || !change.position) continue;
    movedNodeIds.add(change.id);
  }

  return movedNodeIds;
};

const pruneEdgeLayoutByMovedNodeIds = (
  edgeLayoutById: Record<string, XYPosition[]>,
  movedNodeIds: ReadonlySet<string>,
) => {
  if (movedNodeIds.size === 0) return edgeLayoutById;

  let hasPrunedEdge = false;
  const nextEdgeLayoutById: Record<string, XYPosition[]> = {};

  for (const [edgeId, points] of Object.entries(edgeLayoutById)) {
    const separatorIndex = edgeId.indexOf(":");
    if (separatorIndex < 0) {
      nextEdgeLayoutById[edgeId] = points;
      continue;
    }

    const sourceNodeId = edgeId.slice(0, separatorIndex);
    const targetNodeId = edgeId.slice(separatorIndex + 1);
    if (movedNodeIds.has(sourceNodeId) || movedNodeIds.has(targetNodeId)) {
      hasPrunedEdge = true;
      continue;
    }

    nextEdgeLayoutById[edgeId] = points;
  }

  if (!hasPrunedEdge) return edgeLayoutById;
  return nextEdgeLayoutById;
};

export const editorReducer = (
  state: EditorState,
  action: NdgEditorAction,
) => {
  switch (action.type) {
    case "addChild":
      return { ...addChildNode(state, action.parentId), edgeLayoutById: {} };
    case "applyEdgeCondition":
      return setEdgeCondition(
        state,
        action.sourceId,
        action.targetId,
        action.when,
      );
    case "applyAutoLayout":
      return applyAutoLayout(state, action.layoutById, action.edgeLayoutById);
    case "applyConnection":
      return {
        ...applyConnection(state, action.connection),
        edgeLayoutById: {},
      };
    case "applyNodeChanges": {
      const nextState = applyNodePositionChanges(state, action.changes);
      if (nextState === state) return state;
      if (Object.keys(state.edgeLayoutById).length === 0) return nextState;

      const movedNodeIds = getMovedNodeIds(action.changes);
      const nextEdgeLayoutById = pruneEdgeLayoutByMovedNodeIds(
        state.edgeLayoutById,
        movedNodeIds,
      );
      if (nextEdgeLayoutById === state.edgeLayoutById) return nextState;
      return { ...nextState, edgeLayoutById: nextEdgeLayoutById };
    }
    case "autoLayoutError":
      return setAutoLayoutError(state, action.error);
    case "clearEdgeCondition":
      return setEdgeCondition(state, action.sourceId, action.targetId);
    case "closeDialog":
      return closeNodeEditor(state);
    case "deleteNodes":
      return deleteNodes(state, action.nodeIds);
    case "disconnectEdge":
      return {
        ...disconnectEdge(state, action.sourceId, action.targetId),
        edgeLayoutById: {},
      };
    case "reconnectEdge":
      return {
        ...applyReconnect(state, action.oldEdge, action.connection),
        edgeLayoutById: {},
      };
    case "hydrate":
      return action.state;
    case "openDialog":
      return openNodeEditor(state, action.nodeId);
    case "saveNode":
      return {
        ...saveNode(state, action.nodeId, action.draft),
        edgeLayoutById: {},
      };
  }
};
