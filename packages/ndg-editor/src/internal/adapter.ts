import {
  MarkerType,
  type XYPosition,
  type Connection,
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  type NodeChange,
} from "@xyflow/react";
import type { Condition, NodeType } from "@ndg/ndg-core";
import { formatCondition } from "./condition";
import {
  connectEdge,
  reconnectEdge,
  updateNodePositions,
  type EditorState,
} from "./graph";
import { canNodeHaveChildren, type EditorNode } from "./node-factory";

type FlowNodeType = NodeType;

const nodeTypeLabels: Record<NodeType, string> = {
  check: "Check",
  coefficient: "Coefficient",
  constant: "Constant",
  derived: "Derived",
  formula: "Formula",
  table: "Table",
  "user-input": "User input",
};

const getNodeTypeLabel = (nodeType: FlowNodeType) => nodeTypeLabels[nodeType];

const getNodeLabel = (node: EditorNode) => {
  const key = node.key.trim();
  return key ? key : node.id;
};

const getNodeFormulaText = (node: EditorNode) => {
  switch (node.type) {
    case "check":
      return node.verificationExpression;
    case "formula":
    case "derived":
      return node.expression;
    default:
      return undefined;
  }
};

const getReferencePart = (label: string, value: string | undefined) => {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return null;
  return `${label} ${trimmedValue}`;
};

const getNodeReferenceText = (node: EditorNode) => {
  if (!("meta" in node) || !node.meta) return "";
  const { meta } = node;

  const sectionRef = meta.sectionRef?.trim();
  const paragraphRef = meta.paragraphRef?.trim();
  const subParagraphRef = meta.subParagraphRef?.trim();
  const clauseRef = [
    sectionRef ? `\u00a7${sectionRef}` : null,
    paragraphRef ? `\u00b6${paragraphRef}` : null,
    subParagraphRef,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" ");

  return [
    clauseRef,
    getReferencePart("Eq.", meta.formulaRef),
    getReferencePart("Tbl.", meta.tableRef),
    getReferencePart("Check", meta.verificationRef),
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
};

type FlowNodeData = {
  canAddChild: boolean;
  canDelete: boolean;
  isUnreachable: boolean;
  nodeId: string;
  nodeLabel: string;
  nodeName: string;
  nodeType: FlowNodeType;
  nodeTypeLabel: string;
  nodeReference: string;
  nodeFormula?: string;
  onAddChild: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
};

export type FlowEdgeData = {
  condition?: Condition;
  conditionLabel?: string;
  isHovered: boolean;
  isUnreachable: boolean;
  routedPoints?: XYPosition[];
  sourceId: string;
  targetId: string;
  onApplyCondition: (
    sourceId: string,
    targetId: string,
    condition: Condition,
  ) => void;
  onClearCondition: (sourceId: string, targetId: string) => void;
  onDisconnect: (sourceId: string, targetId: string) => void;
};

export const flowNodeType = "ndg-node";
export const flowEdgeType = "ndg-edge";

export type EditorFlowNode = ReactFlowNode<FlowNodeData, typeof flowNodeType>;
export type EditorFlowEdge = ReactFlowEdge<FlowEdgeData, typeof flowEdgeType>;

export const edgeIdFromNodes = (sourceNodeId: string, targetNodeId: string) =>
  `${sourceNodeId}:${targetNodeId}`;

export const editorStateToFlowNodes = (
  state: EditorState,
  handlers: {
    onAddChild: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    onEdit: (nodeId: string) => void;
  },
  options: { unreachableNodeIds: ReadonlySet<string> },
): EditorFlowNode[] => {
  return [...state.nodesById.values()].map((node) => {
    const nodeType = node.type;
    const measured = state.measuredById[node.id];

    return {
      id: node.id,
      type: flowNodeType,
      style: {
        background: "transparent",
        border: "none",
        boxShadow: "none",
        overflow: "visible",
        padding: 0,
      },
      deletable: node.type !== "check",
      ...(measured ? { measured } : {}),
      position: state.layoutById[node.id] ?? { x: 0, y: 0 },
      data: {
        canAddChild: canNodeHaveChildren(node),
        canDelete: node.type !== "check",
        isUnreachable: options.unreachableNodeIds.has(node.id),
        nodeId: node.id,
        nodeLabel: getNodeLabel(node),
        nodeName: node.name,
        nodeType,
        nodeTypeLabel: getNodeTypeLabel(nodeType),
        nodeReference: getNodeReferenceText(node),
        nodeFormula: getNodeFormulaText(node),
        onAddChild: handlers.onAddChild,
        onDelete: handlers.onDelete,
        onEdit: handlers.onEdit,
      },
    };
  });
};

export const editorStateToFlowEdges = (
  nodesById: Map<string, EditorNode>,
  handlers: {
    onApplyCondition: (
      sourceId: string,
      targetId: string,
      condition: Condition,
    ) => void;
    onClearCondition: (sourceId: string, targetId: string) => void;
    onDisconnect: (sourceId: string, targetId: string) => void;
  },
  options: {
    hoveredEdgeId: string | null;
    routedEdgePointsById: Record<string, XYPosition[]>;
    unreachableNodeIds: ReadonlySet<string>;
  },
): EditorFlowEdge[] => {
  const edges: EditorFlowEdge[] = [];
  const hasHoveredEdge = options.hoveredEdgeId !== null;

  for (const node of nodesById.values()) {
    for (const child of node.children) {
      const edgeId = edgeIdFromNodes(node.id, child.nodeId);
      const isHovered = options.hoveredEdgeId === edgeId;
      const isUnreachable =
        options.unreachableNodeIds.has(node.id) ||
        options.unreachableNodeIds.has(child.nodeId);
      const strokeColor = isHovered
        ? "#0f766e"
        : isUnreachable
          ? "#d97706"
          : "#64748b";

      edges.push({
        id: edgeId,
        source: node.id,
        target: child.nodeId,
        type: flowEdgeType,
        selectable: true,
        reconnectable: true,
        focusable: true,
        deletable: false,
        interactionWidth: 56,
        markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
        style: {
          stroke: strokeColor,
          strokeWidth: isHovered ? 2.4 : 1.7,
          opacity: hasHoveredEdge && !isHovered ? 0.28 : 1,
        },
        data: {
          ...(child.when
            ? {
                condition: child.when,
                conditionLabel: formatCondition(child.when),
              }
            : {}),
          isHovered,
          isUnreachable,
          routedPoints: options.routedEdgePointsById[edgeId],
          sourceId: node.id,
          targetId: child.nodeId,
          onApplyCondition: handlers.onApplyCondition,
          onClearCondition: handlers.onClearCondition,
          onDisconnect: handlers.onDisconnect,
        },
      });
    }
  }

  if (!hasHoveredEdge) return edges;

  return edges.sort((left, right) => {
    const leftHovered = left.data?.isHovered ? 1 : 0;
    const rightHovered = right.data?.isHovered ? 1 : 0;
    return leftHovered - rightHovered;
  });
};

export const applyNodePositionChanges = (
  state: EditorState,
  changes: NodeChange[],
) => {
  const layoutUpdates: Record<string, { x: number; y: number }> = {};
  const measuredUpdates: Record<string, { width: number; height: number }> = {};
  let hasLayoutUpdates = false;
  let hasMeasuredUpdates = false;

  for (const change of changes) {
    if (change.type === "position" && change.position) {
      layoutUpdates[change.id] = change.position;
      hasLayoutUpdates = true;
      continue;
    }
    if (change.type === "dimensions" && change.dimensions) {
      measuredUpdates[change.id] = {
        width: change.dimensions.width,
        height: change.dimensions.height,
      };
      hasMeasuredUpdates = true;
    }
  }

  if (!hasLayoutUpdates && !hasMeasuredUpdates) return state;

  return updateNodePositions(state, layoutUpdates, measuredUpdates);
};

export const applyConnection = (state: EditorState, connection: Connection) => {
  if (!connection.source || !connection.target) return state;

  return connectEdge(state, connection.source, connection.target);
};

export const applyReconnect = (
  state: EditorState,
  oldEdge: { source?: string | null; target?: string | null },
  connection: Connection,
) => {
  if (!oldEdge.source || !oldEdge.target) return state;
  if (!connection.source || !connection.target) return state;

  return reconnectEdge(
    state,
    oldEdge.source,
    oldEdge.target,
    connection.source,
    connection.target,
  );
};
