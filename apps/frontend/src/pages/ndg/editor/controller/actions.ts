import type { XYPosition } from "@xyflow/react";

import type { EditorNodeInput } from "../document/editorNodeSchema";
import type { EditorNode } from "../document/types";

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
