import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react";

import { useNdgEditorStore } from "./controller/useNdgEditorStore";
import type { EditorEdge, EditorNode } from "./document/types";
import { nodeTypes } from "./flow/nodeTypes";
import { onBeforeDeleteElements } from "./graph/rules";

type Props = { initialEdges: EditorEdge[]; initialNodes: EditorNode[] };

export const NdgEditorCanvas = (props: Props) => {
  const { initialEdges, initialNodes } = props;
  const reactFlow = useReactFlow<EditorNode, EditorEdge>();
  const onConnectNodes = useNdgEditorStore((state) => state.onConnectNodes);
  const openEditNodeModal = useNdgEditorStore(
    (state) => state.openEditNodeModal,
  );

  return (
    <ReactFlow
      fitView
      className="ndg-editor-flow"
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      defaultEdgeOptions={{
        markerEnd: { type: MarkerType.ArrowClosed },
        type: "smoothstep",
      }}
      nodeTypes={nodeTypes}
      maxZoom={8}
      minZoom={0.05}
      onConnect={onConnectNodes}
      onBeforeDelete={onBeforeDeleteElements}
      onNodeDoubleClick={(_, node) => {
        const selectedNodes = reactFlow
          .getNodes()
          .filter((node) => node.selected);

        if (selectedNodes.length !== 1) return;
        if (selectedNodes[0]?.id !== node.id) return;

        openEditNodeModal(node.id);
      }}
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
