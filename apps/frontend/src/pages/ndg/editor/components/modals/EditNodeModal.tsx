import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog";
import { Button } from "@components/Button";

import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import type { EditorNodeInput } from "../../document/editorNodeSchema";
import type { EditorNode } from "../../document/types";
import { NodeForm } from "./NodeForm";
import { NodeTypeSelector } from "./nodeFields";
import { EditableNodeType } from "./options";
import { defaultNodeFormValues } from "./defaultValues";

const seedFromNode = (node: EditorNode) =>
  ({ type: node.type, ...node.data }) as EditorNodeInput;

export const EditNodeModal = () => {
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const open = useNdgEditorModalStore(s => s.modal?.mode === "edit-node");

  return (
    <Dialog
      open={open}
      onOpenChange={closeModal}
      header={
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Edit node</DialogTitle>
          <Button type="submit" form="edit-node-form">
            Save
          </Button>
        </DialogHeader>
      }
    >
      <EditNodeBody />
    </Dialog>
  );
};

const EditNodeBody = () => {
  const updateNode = useNdgEditorStore(s => s.updateNode);
  const getNodeById = useNdgEditorStore(s => s.getNodeById);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const nodeId = useNdgEditorModalStore(s =>
    s.modal?.mode === "edit-node" ? s.modal.nodeId : undefined,
  );
  const node = nodeId ? getNodeById(nodeId) : undefined;
  const [type, setType] = useState<EditableNodeType>(
    node && node.type !== "check" ? node.type : "user-input",
  );

  if (!node) return null;

  const onSubmit = (values: EditorNodeInput) => {
    updateNode({ ...values, id: node.id });
    closeModal();
  };

  const seed: EditorNodeInput =
    node.type === "check" || type === node.type
      ? seedFromNode(node)
      : defaultNodeFormValues[type];

  return (
    <DialogContent className="gap-8">
      {node.type !== "check" && (
        <NodeTypeSelector value={type} onChange={setType} />
      )}
      <NodeForm
        key={type}
        seed={seed}
        formId="edit-node-form"
        onSubmit={onSubmit}
      />
    </DialogContent>
  );
};
