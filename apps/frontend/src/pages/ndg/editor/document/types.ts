import type { Condition, Node as NdgNode } from "@ndg/ndg-core";
import type {
  Edge as FlowEdge,
  Node as FlowNode,
  NodeProps,
} from "@xyflow/react";

export const EDITOR_DOCUMENT_VERSION = 2;
export const LEGACY_EDITOR_DOCUMENT_VERSION = 1;

type EditorNodeData<Type extends NdgNode["type"]> = Omit<
  Extract<NdgNode, { type: Type }>,
  "id" | "children" | "type"
>;

type EditorNodeOf<Type extends NdgNode["type"]> = FlowNode<
  EditorNodeData<Type>,
  Type
>;

type CheckEditorNode = EditorNodeOf<"check">;
type CoefficientEditorNode = EditorNodeOf<"coefficient">;
type ConstantEditorNode = EditorNodeOf<"constant">;
type FormulaEditorNode = EditorNodeOf<"formula">;
type TableEditorNode = EditorNodeOf<"table">;
type UserInputEditorNode = EditorNodeOf<"user-input">;

export type EditorNode =
  | CheckEditorNode
  | CoefficientEditorNode
  | ConstantEditorNode
  | FormulaEditorNode
  | TableEditorNode
  | UserInputEditorNode;

export type EditorNodeProps =
  | NodeProps<CheckEditorNode>
  | NodeProps<CoefficientEditorNode>
  | NodeProps<ConstantEditorNode>
  | NodeProps<FormulaEditorNode>
  | NodeProps<TableEditorNode>
  | NodeProps<UserInputEditorNode>;

type EditorEdgeData = { condition?: Condition };

export type EditorEdge = FlowEdge<EditorEdgeData>;

export type EditorDocument = {
  version: typeof EDITOR_DOCUMENT_VERSION;
  nodes: EditorNode[];
  edges: EditorEdge[];
};
