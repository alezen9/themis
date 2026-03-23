import type { NdgEditorDocument, NdgEditorViewport } from "./types";

export const DEFAULT_NDG_EDITOR_VIEWPORT = {
  x: 0,
  y: 0,
  zoom: 1,
} satisfies NdgEditorViewport;

export const createEmptyNdgEditorDocument = <
  TNodeData extends Record<string, unknown> = Record<string, never>,
  TEdgeData extends Record<string, unknown> = Record<string, never>,
>(): NdgEditorDocument<TNodeData, TEdgeData> => ({
  nodes: [],
  edges: [],
  viewport: { ...DEFAULT_NDG_EDITOR_VIEWPORT },
});
