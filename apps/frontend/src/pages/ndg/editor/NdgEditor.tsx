import "@xyflow/react/dist/style.css";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";
import { AddNodeModal } from "./components/modals/AddNodeModal";
import { EditEdgeModal } from "./components/modals/EditEdgeModal";
import { EditNodeModal } from "./components/modals/EditNodeModal";
import { NdgEditorCanvas } from "./NdgEditorCanvas";

export const NdgEditor = () => (
  <div className="relative size-full">
    <KeyboardShortcuts>
      <NdgEditorCanvas />
    </KeyboardShortcuts>
    <AddNodeModal />
    <EditNodeModal />
    <EditEdgeModal />
  </div>
);
