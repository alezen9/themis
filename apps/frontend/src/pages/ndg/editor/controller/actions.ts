import type { XYPosition } from "@xyflow/react";

import type { EditorNode } from "../document/types";
import type { NodeFormValues } from "../modals/schema";

export type AddNodeInput = NodeFormValues & { sourceNodeId?: string };
export type UpdateNodeInput = NodeFormValues & { id: string };

export const toEditorNode = (id: string, position: XYPosition, input: NodeFormValues): EditorNode => {
  const { type, ...data } = input;
  return { id, position, type, data } as EditorNode;
};

export const applyNodeUpdate = (existing: EditorNode, input: UpdateNodeInput): EditorNode => {
  const { id: _, ...formValues } = input;
  const { type, ...data } = formValues as NodeFormValues;
  return { id: existing.id, position: existing.position, type, data } as EditorNode;
};
