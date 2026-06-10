import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog";
import { Button } from "@components/Button";

import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import {
  editorNodeSchema,
  type EditorNodeInput,
} from "../../document/editorNodeSchema";
import { FormDefinition } from "./FormDefinition";
import { FormIdentity } from "./FormIdentity";
import { FormMetadata } from "./FormMetadata";
import { FormType } from "./FormType";

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
      <EditNodeForm />
    </Dialog>
  );
};

const EditNodeForm = () => {
  const updateNode = useNdgEditorStore(s => s.updateNode);
  const getNodeById = useNdgEditorStore(s => s.getNodeById);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const nodeId = useNdgEditorModalStore(s =>
    s.modal?.mode === "edit-node" ? s.modal.nodeId : undefined,
  );
  const node = nodeId ? getNodeById(nodeId) : undefined;

  const form = useForm<EditorNodeInput>({
    resolver: zodResolver(editorNodeSchema),
    mode: "onChange",
    defaultValues: node
      ? ({ type: node.type, ...node.data } as EditorNodeInput)
      : undefined,
  });

  if (!node) return null;

  const onSubmit = form.handleSubmit(values => {
    updateNode({ ...values, id: node.id });
    closeModal();
  });

  return (
    <DialogContent className="gap-8">
      <form id="edit-node-form" onSubmit={onSubmit}>
        <FormProvider {...form}>
          {node.type !== "check" && <FormType />}
          <FormIdentity />
          <FormDefinition />
          <FormMetadata />
        </FormProvider>
      </form>
    </DialogContent>
  );
};
