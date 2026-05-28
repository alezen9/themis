import "@xyflow/react/dist/style.css";

import { CreateNodeModal } from "./modals/CreateNodeModal";
import { EditNodeModal } from "./modals/EditNodeModal";
import { NdgEditorCanvas } from "./NdgEditorCanvas";

export const NdgEditor = () => (
  <>
    <NdgEditorCanvas />
    <CreateNodeModal />
    <EditNodeModal />
  </>
);
