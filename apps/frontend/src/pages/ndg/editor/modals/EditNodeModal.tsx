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

export const EditNodeModal = () => {
  const modal = useNdgEditorModalStore(s => s.modal);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const updateNode = useNdgEditorStore(s => s.updateNode);
  const getNodeById = useNdgEditorStore(s => s.getNodeById);
  const open = modal?.mode === "edit-node";

  const form = useForm<NodeFormValues>({
    resolver: zodResolver(nodeFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (!open || modal?.mode !== "edit-node") return;
    const node = getNodeById(modal.nodeId);
    if (!node) return;
    form.reset({ type: node.type, ...node.data } as NodeFormValues);
  }, [open, modal, form, getNodeById]);

  const onSubmit = form.handleSubmit(values => {
    if (modal?.mode !== "edit-node") return;
    updateNode({ ...values, id: modal.nodeId });
    closeModal();
  });

  const isCheckNode =
    modal?.mode === "edit-node" && getNodeById(modal.nodeId)?.type === "check";

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
      <DialogContent className="gap-8">
        <form id="edit-node-form" onSubmit={onSubmit}>
          <FormProvider {...form}>
            {!isCheckNode && <FormType />}
            <FormIdentity />
            <FormDefinition />
            <FormMetadata />
          </FormProvider>
        </form>
      </DialogContent>
    </Dialog>
  );
};
