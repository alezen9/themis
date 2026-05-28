import "@xyflow/react/dist/style.css";

import { CreateNodeModal } from "./components/modals/CreateEditNodeModal/CreateNodeModal";
import { EditNodeModal } from "./components/modals/CreateEditNodeModal/EditNodeModal";
import { NdgEditorCanvas } from "./NdgEditorCanvas";

export const NdgEditor = () => (
  <>
    <NdgEditorCanvas />
    <CreateNodeModal />
    <EditNodeModal />
  </>
);
