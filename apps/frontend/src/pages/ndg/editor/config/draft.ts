import type { Node } from "@ndg/ndg-core";
import type { XYPosition } from "@xyflow/react";
import {
  buildInitialLayout,
  isRecord,
  isValidPosition,
  validateNodes,
  type EditorState,
} from "./graph";
import type { EditorNode } from "./nodeFactory";

export const ndgEditorDraftFormat = "ndg-editor-draft" as const;
export const ndgEditorDraftVersion = 1 as const;

export type NdgEditorDraftV1 = {
  format: typeof ndgEditorDraftFormat;
  version: typeof ndgEditorDraftVersion;
  nodesById: Record<string, Node>;
  layoutById: Record<string, XYPosition>;
};

export const editorStateToDraft = (state: EditorState): NdgEditorDraftV1 => {
  const nodesById: Record<string, Node> = {};

  for (const node of state.nodesById.values()) {
    nodesById[node.id] = node;
  }

  return {
    format: ndgEditorDraftFormat,
    version: ndgEditorDraftVersion,
    nodesById,
    layoutById: { ...state.layoutById },
  };
};

export const draftToEditorState = (draft: unknown) => {
  if (!isRecord(draft)) {
    return { error: "Draft must be a JSON object", state: null } as const;
  }

  if (draft.format !== ndgEditorDraftFormat) {
    return {
      error: `Draft format must be "${ndgEditorDraftFormat}"`,
      state: null,
    } as const;
  }

  if (draft.version !== ndgEditorDraftVersion) {
    return {
      error: `Draft version must be ${ndgEditorDraftVersion}`,
      state: null,
    } as const;
  }

  if (!isRecord(draft.nodesById)) {
    return { error: "Draft nodesById must be an object", state: null } as const;
  }

  if (!isRecord(draft.layoutById)) {
    return {
      error: "Draft layoutById must be an object",
      state: null,
    } as const;
  }

  const rawNodesById = draft.nodesById;
  const rawNodes: Node[] = [];

  for (const [nodeId, nodeValue] of Object.entries(rawNodesById)) {
    if (!isRecord(nodeValue)) {
      return {
        error: `Draft node "${nodeId}" must be an object`,
        state: null,
      } as const;
    }

    if (nodeValue.id !== nodeId) {
      return {
        error: `Draft node key "${nodeId}" must match node.id`,
        state: null,
      } as const;
    }

    rawNodes.push(nodeValue as Node);
  }

  const validatedNodes = validateNodes(rawNodes);
  if (validatedNodes.error || !validatedNodes.nodes) {
    return {
      error: validatedNodes.error ?? "Draft graph is invalid",
      state: null,
    } as const;
  }

  const nodesById = new Map<string, EditorNode>(
    validatedNodes.nodes.map((node) => [node.id, node]),
  );

  const initialLayout = buildInitialLayout(nodesById);
  const rawLayoutById = draft.layoutById;
  const layoutById: Record<string, XYPosition> = { ...initialLayout };

  for (const nodeId of nodesById.keys()) {
    const position = rawLayoutById[nodeId];
    if (!isValidPosition(position)) continue;

    layoutById[nodeId] = { x: position.x, y: position.y };
  }

  return {
    error: null,
    state: {
      nodesById,
      layoutById,
      edgeLayoutById: {},
      measuredById: {},
      editingNodeId: null,
      dialogError: null,
      autoLayoutError: null,
      autoLayoutVersion: 0,
    } satisfies EditorState,
  } as const;
};
