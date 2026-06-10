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
import { NodeForm } from "./NodeForm";
import { NodeTypeSelector } from "./nodeFields";
import { EditableNodeType } from "./options";
import { defaultNodeFormValues } from "./defaultValues";

export const AddNodeModal = () => {
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const open = useNdgEditorModalStore(s => s.modal?.mode === "create-node");

  return (
    <Dialog
      open={open}
      onOpenChange={closeModal}
      header={
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Add node</DialogTitle>
          <Button type="submit" form="add-node-form">
            Save
          </Button>
        </DialogHeader>
      }
    >
      <AddNodeBody />
    </Dialog>
  );
};

const AddNodeBody = () => {
  const addNode = useNdgEditorStore(s => s.addNode);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const sourceNodeId = useNdgEditorModalStore(s =>
    s.modal?.mode === "create-node" ? s.modal.sourceNodeId : undefined,
  );
  const [type, setType] = useState<EditableNodeType>("user-input");

  const onSubmit = (values: EditorNodeInput) => {
    addNode({ ...values, sourceNodeId });
    closeModal();
  };

  return (
    <DialogContent className="gap-8">
      <NodeTypeSelector value={type} onChange={setType} />
      <NodeForm
        key={type}
        seed={defaultNodeFormValues[type]}
        formId="add-node-form"
        onSubmit={onSubmit}
      />
    </DialogContent>
  );
};
