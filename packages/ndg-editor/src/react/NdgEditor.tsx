import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMemo } from "react";
import {
  DEFAULT_NDG_EDITOR_VIEWPORT,
  createEmptyNdgEditorDocument,
} from "../document";
import type {
  NdgEditorDocument,
  NdgEditorEdge,
  NdgEditorNode,
  NdgEditorProps,
} from "../types";

type FlowNode<TNodeData extends Record<string, unknown>> = Node<TNodeData>;
type FlowEdge<TEdgeData extends Record<string, unknown>> = Edge<TEdgeData>;

const rootStyle = {
  width: "100%",
  height: "100%",
  minHeight: 480,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  background: "#f8fafc",
} as const;

const emptyStateStyle = {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 1,
  maxWidth: 320,
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.92)",
  color: "#334155",
  fontSize: 14,
  lineHeight: 1.5,
} as const;

const toFlowNodes = <TNodeData extends Record<string, unknown>,>(
  nodes: readonly NdgEditorNode<TNodeData>[],
): FlowNode<TNodeData>[] =>
  nodes.map((node) => ({
    id: node.id,
    position: node.position,
    data: (node.data ?? {}) as TNodeData,
  }));

const toFlowEdges = <TEdgeData extends Record<string, unknown>,>(
  edges: readonly NdgEditorEdge<TEdgeData>[],
): FlowEdge<TEdgeData>[] =>
  edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    data: edge.data,
  }));

function NdgEditorCanvas<
  TNodeData extends Record<string, unknown> = Record<string, never>,
  TEdgeData extends Record<string, unknown> = Record<string, never>,
>({
  document,
  className,
}: NdgEditorProps<TNodeData, TEdgeData>) {
  const resolvedDocument: NdgEditorDocument<TNodeData, TEdgeData> =
    document ?? createEmptyNdgEditorDocument<TNodeData, TEdgeData>();

  const nodes = useMemo(
    () => toFlowNodes(resolvedDocument.nodes),
    [resolvedDocument.nodes],
  );
  const edges = useMemo(
    () => toFlowEdges(resolvedDocument.edges),
    [resolvedDocument.edges],
  );

  return (
    <div className={className} style={rootStyle}>
      {nodes.length === 0 ? (
        <div style={emptyStateStyle}>
          Editor scaffold is ready. Add node rendering, graph state, and domain
          config from the frontend layer.
        </div>
      ) : null}
      <ReactFlow<FlowNode<TNodeData>, FlowEdge<TEdgeData>>
        nodes={nodes}
        edges={edges}
        defaultViewport={
          (resolvedDocument.viewport ?? DEFAULT_NDG_EDITOR_VIEWPORT) as Viewport
        }
        fitView={nodes.length > 0}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export function NdgEditor<
  TNodeData extends Record<string, unknown> = Record<string, never>,
  TEdgeData extends Record<string, unknown> = Record<string, never>,
>(
  props: NdgEditorProps<TNodeData, TEdgeData>,
) {
  return (
    <ReactFlowProvider>
      <NdgEditorCanvas {...props} />
    </ReactFlowProvider>
  );
}
