import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog";
import { Button } from "@components/Button";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import { nodeFormSchema, type NodeFormValues } from "./schema";
import { FormDefinition } from "./FormDefinition";
import { FormIdentity } from "./FormIdentity";
import { FormMetadata } from "./FormMetadata";
import { FormType } from "./FormType";

export const AddNodeModal = () => {
  const modal = useNdgEditorModalStore(s => s.modal);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const addNode = useNdgEditorStore(s => s.addNode);
  const open = modal?.mode === "create-node";

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeFormSchema),
    mode: "onChange",
    defaultValues: { type: "user-input", valueType: { type: "number" } },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({ type: "user-input", valueType: { type: "number" } });
  }, [open, form]);

  const handleSubmit = form.handleSubmit(values => {
    addNode({
      ...values,
      sourceNodeId: modal?.mode === "create-node" ? modal.sourceNodeId : undefined,
    });
    closeModal();
  });

  return (
    <Dialog
      open={open}
      onOpenChange={closeModal}
      header={
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Add node</DialogTitle>
          <Button type="submit" form="add-node-form">Save</Button>
        </DialogHeader>
      }
    >
      <DialogContent className="gap-8">
        <form id="add-node-form" onSubmit={handleSubmit}>
          <FormProvider {...form}>
            <FormType />
            <FormIdentity />
            <FormDefinition />
            <FormMetadata />
          </FormProvider>
        </form>
      </DialogContent>
    </Dialog>
  );
};
