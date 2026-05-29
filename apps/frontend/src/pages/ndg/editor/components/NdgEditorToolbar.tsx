import { useRef, type ChangeEvent, type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

import { IconButton } from "@components/Button";
import {
  IconDelete,
  IconPencil,
  IconPlus,
  IconExport,
  IconExportPartial,
  IconImport,
  IconImportPartial,
} from "@components/Icons";
import { toast } from "@components/toast/store";
import { ToastError, ToastSuccess } from "@components/toast/presets";
import { downloadAs } from "@utils";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { parseDocumentFile } from "../document/import";
import { useNdgEditorModalStore } from "../modals/useNdgEditorModalStore";

export const NdgEditorToolbar = () => {
  return (
    <div className="flex items-center gap-2 border border-sand-600 p-1 rounded-sm">
      <AddButton />
      <EditButton />
      <EditDelete />
      <div className="mx-2 h-8 w-px bg-sand-600" />
      <EditExportPartial />
      <EditExportFull />
      <EditImportPartial />
      <EditImportFull />
    </div>
  );
};

const AddButton = () => {
  const openModal = useNdgEditorModalStore(s => s.openModal);
  return (
    <ToolbarIconButton
      title="Add node"
      onClick={() => openModal({ mode: "create-node" })}
    >
      <IconPlus />
    </ToolbarIconButton>
  );
};

const EditButton = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const selectedEdges = useNdgEditorStore(s => s.selectedEdges);
  const openModal = useNdgEditorModalStore(s => s.openModal);
  const disabled = selectedNodes.length !== 1 || selectedEdges.length > 0;

  const onClick = () => {
    openModal({ mode: "edit-node", nodeId: selectedNodes[0].id });
  };

  return (
    <ToolbarIconButton title="Edit node" disabled={disabled} onClick={onClick}>
      <IconPencil />
    </ToolbarIconButton>
  );
};

const EditDelete = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const selectedEdges = useNdgEditorStore(s => s.selectedEdges);
  const deleteSelected = useNdgEditorStore(s => s.deleteSelected);
  const disabled =
    (selectedNodes.length === 0 && selectedEdges.length === 0) ||
    selectedNodes.some(n => n.type === "check");

  return (
    <ToolbarIconButton
      title="Delete selected"
      disabled={disabled}
      onClick={deleteSelected}
    >
      <IconDelete />
    </ToolbarIconButton>
  );
};

const notifyInvalidFile = () =>
  toast(
    <ToastError title="Invalid file">
      Could not read a valid NDG document.
    </ToastError>,
  );

const EditImportFull = () => {
  const importFull = useNdgEditorStore(s => s.importFull);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSuccess = () => toast(<ToastSuccess title="Graph replaced" />);
  const onRejected = () =>
    toast(
      <ToastError title="Import rejected">
        A full import must contain exactly one check node.
      </ToastError>,
    );

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const document = await parseDocumentFile(file);
    if (!document) return notifyInvalidFile();
    if (importFull(document)) onSuccess();
    else onRejected();
  };

  return (
    <>
      <ToolbarIconButton
        title="Import (replace graph)"
        onClick={() => inputRef.current?.click()}
      >
        <IconImport />
      </ToolbarIconButton>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={onChange}
      />
    </>
  );
};

const EditImportPartial = () => {
  const importPartial = useNdgEditorStore(s => s.importPartial);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSuccess = () => toast(<ToastSuccess title="Nodes imported" />);
  const onRejected = () =>
    toast(
      <ToastError title="Import rejected">
        A partial import cannot contain a check node.
      </ToastError>,
    );

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const document = await parseDocumentFile(file);
    if (!document) return notifyInvalidFile();
    if (importPartial(document)) onSuccess();
    else onRejected();
  };

  return (
    <>
      <ToolbarIconButton
        title="Import into graph"
        onClick={() => inputRef.current?.click()}
      >
        <IconImportPartial />
      </ToolbarIconButton>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={onChange}
      />
    </>
  );
};

const EditExportPartial = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const exportSelected = useNdgEditorStore(s => s.exportSelected);
  const disabled = selectedNodes.length === 0;

  const onClick = () => {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(exportSelected(), null, 2)], {
      type: "application/json",
    });
    downloadAs(blob, `ndg-selection-${date}.json`);
  };

  return (
    <ToolbarIconButton
      title="Export selection"
      disabled={disabled}
      onClick={onClick}
    >
      <IconExportPartial />
    </ToolbarIconButton>
  );
};

const EditExportFull = () => {
  const exportDocument = useNdgEditorStore(s => s.exportDocument);

  const onClick = () => {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(exportDocument(), null, 2)], {
      type: "application/json",
    });
    downloadAs(blob, `ndg-${date}.json`);
  };

  return (
    <ToolbarIconButton title="Export full graph" onClick={onClick}>
      <IconExport />
    </ToolbarIconButton>
  );
};

const ToolbarIconButton = (props: ComponentProps<typeof IconButton>) => {
  const { className, ...rest } = props;
  return (
    <IconButton
      {...rest}
      className={twMerge(
        "rounded-sm p-2 grid place-items-center [&>svg]:size-5",
        className,
      )}
    />
  );
};
