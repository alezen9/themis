import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { initialDocument } from "./document/initialDocument";
import { NdgEditorCanvas } from "./NdgEditorCanvas";
import { CreateEditNodeModal } from "./components/modals/CreateEditNodeModal";
import { NdgEditorController } from "./controller/NdgEditorController";

export const NdgEditor = () => {
  return (
    <ReactFlowProvider>
      <NdgEditorController />
      <NdgEditorCanvas
        initialEdges={initialDocument.edges}
        initialNodes={initialDocument.nodes}
      />
      <CreateEditNodeModal />
    </ReactFlowProvider>
  );
};
