import {
  useRef,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { NavigationMenu } from "@base-ui/react/navigation-menu";

import { IconChevron } from "@components/Icons";
import { toast } from "@components/toast/store";
import { ToastError, ToastSuccess } from "@components/toast/presets";
import { downloadAs } from "@utils";

import { useNdgEditorStore } from "../controller/useNdgEditorStore";
import { parseDocumentFile } from "../document/import";
import type { EditorDocument } from "../document/types";

export const NdgEditorToolbar = () => (
  <NavigationMenu.Root delay={100}>
    <NavigationMenu.List className="flex items-center gap-1">
      <ImportMenu />
      <ExportMenu />
    </NavigationMenu.List>
    <NavigationMenu.Portal>
      <NavigationMenu.Positioner
        sideOffset={10}
        align="end"
        collisionPadding={16}
        className="z-50"
      >
        <NavigationMenu.Popup className="origin-(--transform-origin) rounded-sm border border-sand-200 bg-white shadow-lg shadow-sand-950/5">
          <NavigationMenu.Viewport className="relative h-(--popup-height) w-(--popup-width) overflow-hidden" />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
);

const ImportMenu = () => {
  const importFull = useNdgEditorStore(s => s.importFull);
  const importPartial = useNdgEditorStore(s => s.importPartial);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  const onReplace = async (event: ChangeEvent<HTMLInputElement>) => {
    const document = await readDocument(event);
    if (!document) return;
    if (importFull(document)) toast(<ToastSuccess title="Graph replaced" />);
    else
      toast(
        <ToastError title="Import rejected">
          A full import must contain exactly one check node.
        </ToastError>,
      );
  };

  const onMerge = async (event: ChangeEvent<HTMLInputElement>) => {
    const document = await readDocument(event);
    if (!document) return;
    if (importPartial(document)) toast(<ToastSuccess title="Nodes imported" />);
    else
      toast(
        <ToastError title="Import rejected">
          A partial import cannot contain a check node.
        </ToastError>,
      );
  };

  return (
    <NavigationMenu.Item>
      <ToolbarTrigger>Import</ToolbarTrigger>
      <MenuContent>
        <MenuOption
          title="Replace graph"
          description="Discard the current graph and load a document."
          onClick={() => replaceInputRef.current?.click()}
        />
        <MenuOption
          title="Merge into graph"
          description="Add nodes from a document, keeping the current check."
          onClick={() => mergeInputRef.current?.click()}
        />
      </MenuContent>
      <input ref={replaceInputRef} type="file" accept=".json" className="hidden" onChange={onReplace} />
      <input ref={mergeInputRef} type="file" accept=".json" className="hidden" onChange={onMerge} />
    </NavigationMenu.Item>
  );
};

const ExportMenu = () => {
  const selectedNodes = useNdgEditorStore(s => s.selectedNodes);
  const exportDocument = useNdgEditorStore(s => s.exportDocument);
  const exportSelected = useNdgEditorStore(s => s.exportSelected);

  return (
    <NavigationMenu.Item>
      <ToolbarTrigger>Export</ToolbarTrigger>
      <MenuContent>
        <MenuOption
          title="Full graph"
          description="Download the entire graph as JSON."
          onClick={() => downloadDocument(exportDocument(), "ndg")}
        />
        <MenuOption
          title="Selection"
          description="Download only the selected nodes and their edges."
          disabled={selectedNodes.length === 0}
          onClick={() => downloadDocument(exportSelected(), "ndg-selection")}
        />
      </MenuContent>
    </NavigationMenu.Item>
  );
};

const MenuContent = (props: { children: ReactNode }) => (
  <NavigationMenu.Content className="w-72 p-1">
    <ul>{props.children}</ul>
  </NavigationMenu.Content>
);

const MenuOption = (props: {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  const { title, description, onClick, disabled } = props;
  return (
    <li>
      <NavigationMenu.Link
        closeOnClick
        onClick={onClick}
        className="block w-full rounded-sm p-3 text-left transition-colors hover:bg-sand-100 disabled:pointer-events-none disabled:opacity-40"
        render={<button type="button" disabled={disabled} />}
      >
        <span className="block text-sm font-medium text-sand-900">{title}</span>
        <span className="mt-0.5 block text-xs text-sand-600">{description}</span>
      </NavigationMenu.Link>
    </li>
  );
};

const ToolbarTrigger = (props: { children: string }) => (
  <NavigationMenu.Trigger className="group flex items-center gap-1 rounded-sm px-3 py-2 text-sm text-sand-900 transition-colors hover:bg-sand-100 data-popup-open:bg-sand-100">
    {props.children}
    <NavigationMenu.Icon className="transition-transform duration-200 group-data-popup-open:rotate-180">
      <IconChevron className="size-4" />
    </NavigationMenu.Icon>
  </NavigationMenu.Trigger>
);

const readDocument = async (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return null;
  const document = await parseDocumentFile(file);
  if (!document)
    toast(
      <ToastError title="Invalid file">
        Could not read a valid NDG document.
      </ToastError>,
    );
  return document;
};

const downloadDocument = (document: EditorDocument, prefix: string) => {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(document, null, 2)], {
    type: "application/json",
  });
  downloadAs(blob, `${prefix}-${date}.json`);
};
