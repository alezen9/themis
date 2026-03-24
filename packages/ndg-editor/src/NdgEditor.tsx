import type { Node as NdgCoreNode } from "@ndg/ndg-core";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node as ReactFlowNode,
  type ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type NdgEditorNode = ReactFlowNode<
  { node: NdgCoreNode },
  NdgCoreNode["type"]
>;

type NdgEditorProps = ReactFlowProps<NdgEditorNode, Edge>;

export const NdgEditor = (props: NdgEditorProps) => {
  return (
    <ReactFlow {...props}>
      <Background color="rgba(0,0,0,0.2)" />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
