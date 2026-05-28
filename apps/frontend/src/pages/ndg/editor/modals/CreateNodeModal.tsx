import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@components/Button";
import { useNdgEditorModalStore } from "./useNdgEditorModalStore";
import { FormDefinition } from "./FormDefinition";
import { FormIdentity } from "./FormIdentity";
import { FormMetadata } from "./FormMetadata";
import { FormType } from "./FormType";

export const CreateNodeModal = () => {
  const modal = useNdgEditorModalStore(s => s.modal);
  const closeModal = useNdgEditorModalStore(s => s.closeModal);
  const open = modal?.mode === "create-node";

  const form = useForm();

  useEffect(() => {
    if (!open) return;
    form.reset({});
  }, [open, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={closeModal}
      header={
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Add node</DialogTitle>
          <Button type="submit">Save</Button>
        </DialogHeader>
      }
    >
      <DialogContent className="gap-8">
        <FormProvider {...form}>
          <FormType />
          <FormIdentity />
          <FormDefinition />
          <FormMetadata />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
