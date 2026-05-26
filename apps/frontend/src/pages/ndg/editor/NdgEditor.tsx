import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { initialDocument } from "./document/initialDocument";
import { NdgEditorCanvas } from "./NdgEditorCanvas";
import { NdgEditorController } from "./controller/NdgEditorController";
import { NdgEditorControllerProvider } from "./controller/NdgEditorControllerContext";

export const NdgEditor = () => {
  return (
    <ReactFlowProvider>
      <NdgEditorControllerProvider initialDocument={initialDocument}>
        <NdgEditorController />
        <NdgEditorCanvas
          initialEdges={initialDocument.edges}
          initialNodes={initialDocument.nodes}
        />
      </NdgEditorControllerProvider>
    </ReactFlowProvider>
  );
};
