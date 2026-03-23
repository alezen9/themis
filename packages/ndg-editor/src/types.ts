export type NdgEditorPosition = {
  x: number;
  y: number;
};

export type NdgEditorViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type NdgEditorNode<TData extends Record<string, unknown> = Record<string, never>> = {
  id: string;
  position: NdgEditorPosition;
  data?: TData;
};

export type NdgEditorEdge<TData extends Record<string, unknown> = Record<string, never>> = {
  id: string;
  source: string;
  target: string;
  data?: TData;
};

export type NdgEditorDocument<
  TNodeData extends Record<string, unknown> = Record<string, never>,
  TEdgeData extends Record<string, unknown> = Record<string, never>,
> = {
  nodes: NdgEditorNode<TNodeData>[];
  edges: NdgEditorEdge<TEdgeData>[];
  viewport?: NdgEditorViewport;
};

export type NdgEditorProps<
  TNodeData extends Record<string, unknown> = Record<string, never>,
  TEdgeData extends Record<string, unknown> = Record<string, never>,
> = {
  document?: NdgEditorDocument<TNodeData, TEdgeData>;
  className?: string;
};
