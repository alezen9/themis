import type { Condition } from "@ndg/ndg-core";
import type {
  Edge as FlowEdge,
  Node as FlowNode,
  NodeProps,
} from "@xyflow/react";

import type { EditorNodeInput } from "./editorNodeSchema";

export const EDITOR_DOCUMENT_VERSION = 2;

type NodeType = EditorNodeInput["type"];

type EditorNodeData<Type extends NodeType> = Omit<
  Extract<EditorNodeInput, { type: Type }>,
  "type"
>;

type EditorNodeOf<Type extends NodeType> = FlowNode<
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
