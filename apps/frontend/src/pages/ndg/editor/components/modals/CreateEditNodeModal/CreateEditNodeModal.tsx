import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/Dialog";
import { InternalNode, useReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNdgEditorStore } from "../../../controller/useNdgEditorStore";
import type { EditorEdge, EditorNode } from "../../../document/types";
import { FormType } from "./FormType";
import { FormIdentity } from "./FormIdentity";
import { FormDefinition } from "./FormDefinition";
import { FormMetadata } from "./FormMetadata";
import { Button } from "@components/Button";

const toDefaultValues = (node?: InternalNode<EditorNode>) => {
  if (!node) return {};
  return { type: node.type, ...node.data };
};

export const CreateEditNodeModal = () => {
  const reactFlow = useReactFlow<EditorNode, EditorEdge>();
  const closeModal = useNdgEditorStore(s => s.closeModal);
  const modal = useNdgEditorStore(s => s.modal);
  const isEditNodeMode = modal?.mode === "edit-node";

  const form = useForm();

  useEffect(() => {
    const nodeId = modal?.mode === "edit-node" ? modal.nodeId : "";
    const node = reactFlow.getInternalNode(nodeId);
    const defaultValues = toDefaultValues(node);
    form.reset(defaultValues);
  }, [modal, form, reactFlow]);

  return (
    <Dialog
      open={!!modal}
      onOpenChange={closeModal}
      header={
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>{isEditNodeMode ? "Edit node" : "Add node"}</DialogTitle>
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
