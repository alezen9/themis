import {
  MarkerType,
  type Connection,
  type Edge as ReactFlowEdge,
  type Node as ReactFlowNode,
  type NodeChange,
} from "@xyflow/react";
import type { Condition, NodeType } from "@ndg/ndg-core";
import { formatCondition } from "./condition";
import {
  buildParentById,
  connectUnattachedNode,
  isRootCheckNode,
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
  canAcceptParent: boolean;
  canAddChild: boolean;
  canDelete: boolean;
  canEditIncomingCondition: boolean;
  incomingCondition?: Condition;
  incomingConditionLabel?: string;
  nodeId: string;
  nodeLabel: string;
  nodeName: string;
  nodeType: FlowNodeType;
  nodeTypeLabel: string;
  nodeReference: string;
  nodeFormula?: string;
  onAddChild: (nodeId: string) => void;
  onApplyIncomingCondition: (nodeId: string, condition: Condition) => void;
  onClearIncomingCondition: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
};

export const flowNodeType = "ndg-node";

export type EditorFlowNode = ReactFlowNode<FlowNodeData, typeof flowNodeType>;
export type EditorFlowEdge = ReactFlowEdge;

export const editorStateToFlowNodes = (
  state: EditorState,
  handlers: {
    onAddChild: (nodeId: string) => void;
    onApplyIncomingCondition: (nodeId: string, condition: Condition) => void;
    onClearIncomingCondition: (nodeId: string) => void;
    onDelete: (nodeId: string) => void;
    onEdit: (nodeId: string) => void;
  },
): EditorFlowNode[] => {
  const parentById = buildParentById(state.nodesById);

  return [...state.nodesById.values()].map((node) => {
    const nodeType = node.type;
    const measured = state.measuredById[node.id];
    const parentId = parentById.get(node.id);
    const parentNode = parentId ? state.nodesById.get(parentId) : null;
    const incomingCondition = parentNode?.children.find(
      (child) => child.nodeId === node.id,
    )?.when;

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
      ...(measured ? { measured } : {}),
      position: state.layoutById[node.id] ?? { x: 0, y: 0 },
      data: {
        canAcceptParent:
          !parentById.has(node.id) && !isRootCheckNode(node, parentById),
        canAddChild: canNodeHaveChildren(node),
        canDelete: !isRootCheckNode(node, parentById),
        canEditIncomingCondition: Boolean(parentId),
        ...(incomingCondition
          ? {
              incomingCondition,
              incomingConditionLabel: formatCondition(incomingCondition),
            }
          : {}),
        nodeId: node.id,
        nodeLabel: getNodeLabel(node),
        nodeName: node.name,
        nodeType,
        nodeTypeLabel: getNodeTypeLabel(nodeType),
        nodeReference: getNodeReferenceText(node),
        nodeFormula: getNodeFormulaText(node),
        onAddChild: handlers.onAddChild,
        onApplyIncomingCondition: handlers.onApplyIncomingCondition,
        onClearIncomingCondition: handlers.onClearIncomingCondition,
        onDelete: handlers.onDelete,
        onEdit: handlers.onEdit,
      },
    };
  });
};

export const editorStateToFlowEdges = (
  state: EditorState,
): EditorFlowEdge[] => {
  const edges: EditorFlowEdge[] = [];

  for (const node of state.nodesById.values()) {
    for (const child of node.children) {
      edges.push({
        id: `${node.id}:${child.nodeId}`,
        source: node.id,
        target: child.nodeId,
        type: "smoothstep",
        deletable: false,
        reconnectable: false,
        selectable: false,
        markerEnd: { type: MarkerType.ArrowClosed },
      });
    }
  }

  return edges;
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

  return connectUnattachedNode(state, connection.source, connection.target);
};
