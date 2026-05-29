import {
  useRef,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

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
import { downloadAs } from "@utils";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import {
  EDITOR_DOCUMENT_VERSION,
  type EditorDocument,
} from "../document/types";
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

  const handleClick = () => {
    openModal({ mode: "edit-node", nodeId: selectedNodes[0].id });
  };

  return (
    <ToolbarIconButton
      title="Edit node"
      disabled={disabled}
      onClick={handleClick}
    >
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

const importSchema = z.object({
  version: z.literal(EDITOR_DOCUMENT_VERSION),
  nodes: z.array(
    z.object({
      id: z.string(),
      position: z.object({ x: z.number(), y: z.number() }),
      type: z.string(),
      data: z.record(z.string(), z.unknown()),
    }),
  ),
  edges: z.array(
    z.object({ id: z.string(), source: z.string(), target: z.string() }),
  ),
});

const parseDocument = async (file: File): Promise<EditorDocument | null> => {
  try {
    const result = importSchema.safeParse(JSON.parse(await file.text()));
    if (result.success) return result.data as EditorDocument;
    console.error("Invalid NDG document", result.error);
  } catch {
    console.error("Failed to parse file");
  }
  return null;
};

const FileImportButton = (props: {
  title: string;
  icon: ReactNode;
  onDocument: (doc: EditorDocument) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const doc = await parseDocument(file);
    if (doc) props.onDocument(doc);
  };

  return (
    <>
      <ToolbarIconButton
        title={props.title}
        onClick={() => fileInputRef.current?.click()}
      >
        {props.icon}
      </ToolbarIconButton>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
};

const EditImportFull = () => {
  const importFull = useNdgEditorStore(s => s.importFull);
  return (
    <FileImportButton
      title="Import (replace graph)"
      icon={<IconImport />}
      onDocument={importFull}
    />
  );
};

const EditImportPartial = () => {
  const importPartial = useNdgEditorStore(s => s.importPartial);
  return (
    <FileImportButton
      title="Import into graph"
      icon={<IconImportPartial />}
      onDocument={importPartial}
    />
  );
};

const EditExportPartial = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const exportSelected = useNdgEditorStore(s => s.exportSelected);
  const disabled = selectedNodes.length === 0;

  const handleClick = () => {
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
      onClick={handleClick}
    >
      <IconExportPartial />
    </ToolbarIconButton>
  );
};

const EditExportFull = () => {
  const exportDocument = useNdgEditorStore(s => s.exportDocument);

  const handleClick = () => {
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(exportDocument(), null, 2)], {
      type: "application/json",
    });
    downloadAs(blob, `ndg-${date}.json`);
  };

  return (
    <ToolbarIconButton title="Export full graph" onClick={handleClick}>
      <IconExport />
    </ToolbarIconButton>
  );
};

const ToolbarIconButton = (props: ComponentProps<typeof IconButton>) => (
  <IconButton
    {...props}
    className={twMerge(
      "rounded-sm p-2 grid place-items-center [&>svg]:size-5",
      props.className,
    )}
  />
);
