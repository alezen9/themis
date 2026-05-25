import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { EditorDocument } from "./document/types";
import { toFlowEdges, toFlowNodes } from "./flow/convert";
import { nodeTypes } from "./flow/nodeTypes";

type Props = { document: EditorDocument };

export const NdgEditor = (props: Props) => {
  const { document } = props;

  return (
    <ReactFlow
      fitView
      className="ndg-editor-flow"
      defaultNodes={toFlowNodes(document)}
      defaultEdges={toFlowEdges(document)}
      nodeTypes={nodeTypes}
      maxZoom={8}
      minZoom={0.05}
      panOnDrag={[1, 2]}
      panOnScroll
      panOnScrollSpeed={1.2}
      panActivationKeyCode="Space"
      proOptions={{ hideAttribution: true }}
      selectionMode={SelectionMode.Partial}
      selectionOnDrag
    >
      <Background
        color="rgba(110, 85, 62, 0.035)"
        gap={24}
        id="fine-grid"
        variant={BackgroundVariant.Lines}
      />
      <Background
        color="rgba(110, 85, 62, 0.035)"
        gap={120}
        id="coarse-grid"
        variant={BackgroundVariant.Lines}
      />
      <Controls showZoom={false} />
    </ReactFlow>
  );
};
