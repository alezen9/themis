import type { Condition, Node as NdgNode } from "@ndg/ndg-core";

type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

export type EditorNodeData = DistributiveOmit<NdgNode, "id" | "children">;

export type EditorPosition = {
  x: number;
  y: number;
};

export type EditorNode = {
  id: string;
  position: EditorPosition;
  data: EditorNodeData;
};

export type EditorEdge = {
  id: string;
  source: EditorNode["id"];
  target: EditorNode["id"];
  condition?: Condition;
};

export type EditorDocument = {
  version: 1;
  nodes: EditorNode[];
  edges: EditorEdge[];
};
