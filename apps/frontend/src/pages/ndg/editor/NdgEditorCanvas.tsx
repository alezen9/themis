import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  type NodeMouseHandler,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";
import { useCallback } from "react";

import { useNdgEditorStore } from "./controller/useNdgEditorStore";
import type { EditorNode } from "./document/types";
import { nodeTypes } from "./flow/nodeTypes";
import { onBeforeDeleteElements } from "./graph/rules";
import { useNdgEditorModalStore } from "./modals/useNdgEditorModalStore";

export const NdgEditorCanvas = () => {
  const nodes = useNdgEditorStore(state => state.nodes);
  const edges = useNdgEditorStore(state => state.edges);
  const onNodesChange = useNdgEditorStore(state => state.onNodesChange);
  const onEdgesChange = useNdgEditorStore(state => state.onEdgesChange);
  const onConnectNodes = useNdgEditorStore(state => state.onConnectNodes);
  const openModal = useNdgEditorModalStore(state => state.openModal);

  const onNodeDoubleClick = useCallback<NodeMouseHandler<EditorNode>>(
    (_, node) => openModal({ mode: "edit-node", nodeId: node.id }),
    [openModal],
  );

  return (
    <ReactFlow
      fitView
      className="ndg-editor-flow"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      defaultEdgeOptions={{
        markerEnd: { type: MarkerType.Arrow },
        type: "smoothstep",
      }}
      nodeTypes={nodeTypes}
      maxZoom={8}
      minZoom={0.05}
      onConnect={onConnectNodes}
      onBeforeDelete={onBeforeDeleteElements}
      onNodeDoubleClick={onNodeDoubleClick}
      onlyRenderVisibleElements={nodes.length > 50}
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
