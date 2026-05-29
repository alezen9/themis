import "@xyflow/react/dist/style.css";
import { AddNodeModal } from "./modals/AddNodeModal";
import { EditEdgeModal } from "./modals/EditEdgeModal";
import { EditNodeModal } from "./modals/EditNodeModal";
import { NdgEditorCanvas } from "./NdgEditorCanvas";

export const NdgEditor = () => (
  <div className="relative size-full">
    <NdgEditorCanvas />
    <AddNodeModal />
    <EditNodeModal />
    <EditEdgeModal />
  </div>
);
