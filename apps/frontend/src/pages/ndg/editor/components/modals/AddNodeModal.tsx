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
      <AddNodeForm />
    </Dialog>
  );
};

const AddNodeForm = () => {
  const addNode = useNdgEditorStore(s => s.addNode);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const sourceNodeId = useNdgEditorModalStore(s =>
    s.modal?.mode === "create-node" ? s.modal.sourceNodeId : undefined,
  );

  const form = useForm<EditorNodeInput>({
    resolver: zodResolver(editorNodeSchema),
    mode: "onChange",
    defaultValues: defaultNodeFormValues["user-input"],
  });

  const onSubmit = form.handleSubmit(values => {
    addNode({ ...values, sourceNodeId });
    closeModal();
  });

  return (
    <DialogContent className="gap-8">
      <form id="add-node-form" onSubmit={onSubmit}>
        <FormProvider {...form}>
          <FormType />
          <FormIdentity />
          <FormDefinition />
          <FormMetadata />
        </FormProvider>
      </form>
    </DialogContent>
  );
};
