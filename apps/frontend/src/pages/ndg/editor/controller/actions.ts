import type { XYPosition } from "@xyflow/react";

import type { EditorNodeInput } from "../document/editorNodeSchema";
import type { EditorEdge, EditorNode } from "../document/types";

export type AddNodeInput = EditorNodeInput & { sourceNodeId?: string };
export type UpdateNodeInput = EditorNodeInput & { id: string };

export const toEditorNode = (
  id: string,
  position: XYPosition,
  input: EditorNodeInput,
): EditorNode => {
  const { type, ...data } = input;
  return { id, position, type, data } as EditorNode;
};

const exportNodeData = (node: EditorNode) => {
  if (node.type === "formula" && node.data.variant === "select")
    return {
      variant: "select",
      key: node.data.key,
      valueType: node.data.valueType,
    };
  if (node.type === "check" && node.data.variant === "select")
    return {
      variant: "select",
      key: node.data.key,
      name: node.data.name,
      valueType: node.data.valueType,
    };
  return node.data;
};

export const toExportNode = (node: EditorNode): EditorNode =>
  ({
    id: node.id,
    position: node.position,
    type: node.type,
    data: exportNodeData(node),
  }) as EditorNode;

export const toExportEdge = (edge: EditorEdge): EditorEdge => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  ...(edge.data && { data: edge.data }),
});

export const applyNodeUpdate = (
  existing: EditorNode,
  input: UpdateNodeInput,
): EditorNode => {
  const { id: _, ...formValues } = input;
  const { type, ...data } = formValues as EditorNodeInput;
  return {
    id: existing.id,
    position: existing.position,
    type,
    data,
  } as EditorNode;
};
