import { ControlButton } from "@xyflow/react";

import {
  IconDelete,
  IconLayout,
  IconPencil,
  IconPlus,
  IconRedo,
  IconUndo,
} from "@components/Icons";
import { toast } from "@components/toast";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { computeLayout } from "../graph/layout";
import { useNdgEditorModalStore } from "../modals/useNdgEditorModalStore";
import { ComponentProps } from "react";

const ToolbarButton = (props: ComponentProps<typeof ControlButton>) => (
  <ControlButton
    className="[&>svg]:max-w-none! [&>svg]:max-h-none! [&>svg]:fill-none! disabled:text-zinc-200!"
    {...props}
  />
);

const UndoButton = () => {
  const undo = useNdgEditorStore(s => s.undo);
  const canUndo = useNdgEditorStore(s => s.history.past.length > 0);
  return (
    <ToolbarButton title="Undo" disabled={!canUndo} onClick={undo}>
      <IconUndo className="size-6" />
    </ToolbarButton>
  );
};

const RedoButton = () => {
  const redo = useNdgEditorStore(s => s.redo);
  const canRedo = useNdgEditorStore(s => s.history.future.length > 0);
  return (
    <ToolbarButton title="Redo" disabled={!canRedo} onClick={redo}>
      <IconRedo className="size-6" />
    </ToolbarButton>
  );
};

const AddButton = () => {
  const openModal = useNdgEditorModalStore(s => s.openModal);
  return (
    <ToolbarButton
      title="Add Node"
      onClick={() => openModal({ mode: "create-node" })}
    >
      <IconPlus className="size-4" />
    </ToolbarButton>
  );
};

const EditButton = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const selectedEdges = useNdgEditorStore(s => s.selectedEdges);
  const openModal = useNdgEditorModalStore(s => s.openModal);
  const disabled = selectedNodes.length !== 1 || selectedEdges.length > 0;
  return (
    <ToolbarButton
      title="Edit Node"
      disabled={disabled}
      onClick={() =>
        openModal({ mode: "edit-node", nodeId: selectedNodes[0].id })
      }
    >
      <IconPencil className="size-4" />
    </ToolbarButton>
  );
};

const DeleteButton = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const selectedEdges = useNdgEditorStore(s => s.selectedEdges);
  const deleteSelected = useNdgEditorStore(s => s.deleteSelected);
  const disabled =
    (selectedNodes.length === 0 && selectedEdges.length === 0) ||
    selectedNodes.some(n => n.type === "check");
  return (
    <ToolbarButton
      title="Delete Selected"
      disabled={disabled}
      onClick={deleteSelected}
    >
      <IconDelete className="size-4" />
    </ToolbarButton>
  );
};

const LayoutButton = () => {
  const nodes = useNdgEditorStore(s => s.nodes);
  const edges = useNdgEditorStore(s => s.edges);
  const applyLayout = useNdgEditorStore(s => s.applyLayout);
  const onClick = async () => {
    try {
      applyLayout(await computeLayout(nodes, edges));
    } catch {
      toast({
        type: "error",
        title: "Layout failed",
        message: "Could not compute auto layout.",
      });
    }
  };
  return (
    <ToolbarButton title="Auto Layout" onClick={onClick}>
      <IconLayout className="size-4" />
    </ToolbarButton>
  );
};

export const NdgEditorActionsPanel = () => (
  <>
    <UndoButton />
    <RedoButton />
    <AddButton />
    <EditButton />
    <DeleteButton />
    <LayoutButton />
  </>
);
