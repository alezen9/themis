import {
  type Connection,
  type ReactFlowInstance,
  type XYPosition,
} from "@xyflow/react";

import { createEdgeId, createNodeId } from "../document/ids";
import {
  EDITOR_DOCUMENT_VERSION,
  type EditorDocument,
  type EditorEdge,
  type EditorNode,
} from "../document/types";
import { canConnectNodes } from "../graph/rules";

type ReactFlow = ReactFlowInstance<EditorNode, EditorEdge>;

export type AddNodeInput = {
  expression: string;
  formulaRef: string;
  key: string;
  paragraphRef: string;
  position: XYPosition;
  sectionRef: string;
  source: string;
  sourceNodeId?: string;
  subParagraphRef: string;
  symbol: string;
  tableRef: string;
  type: EditorNode["type"];
  unit: string;
  valueType: "number" | "string";
  verificationExpression: string;
  verificationRef: string;
};

export type UpdateNodeInput = Omit<
  AddNodeInput,
  "position" | "sourceNodeId"
> & { id: string };

export type NdgEditorActions = {
  addNode: (input: AddNodeInput) => void;
  exportDocument: () => EditorDocument;
  onConnectNodes: (connection: Connection) => void;
  updateNode: (input: UpdateNodeInput) => void;
};

export const addNodeFactory = (reactFlow: ReactFlow) => {
  return (input: AddNodeInput) => {
    const { sourceNodeId } = input;
    const nodes = reactFlow.getNodes();
    const node = toEditorNode(createNodeId(), input);
    reactFlow.addNodes(node);

    if (!sourceNodeId) return;

    const edges = reactFlow.getEdges();
    const connection: Connection = {
      source: sourceNodeId,
      sourceHandle: null,
      target: node.id,
      targetHandle: null,
    };
    const nextNodes = [...nodes, node];

    if (!canConnectNodes(nextNodes, edges, connection)) return;

    const edgeId = createEdgeId(sourceNodeId, node.id);
    reactFlow.addEdges({ id: edgeId, source: sourceNodeId, target: node.id });
  };
};

const toEditorNode = (id: string, input: AddNodeInput): EditorNode => {
  const { position, type } = input;
  switch (type) {
    case "check":
      return { id, data: toCheckData(input), position, type };
    case "coefficient":
      return { id, data: toCoefficientData(input), position, type };
    case "constant":
      return { id, data: toConstantData(input), position, type };
    case "formula":
      return { id, data: toFormulaData(input), position, type };
    case "table":
      return { id, data: toTableData(input), position, type };
    case "user-input":
      return { id, data: toUserInputData(input), position, type };
  }
};

export const exportDocumentFactory = (reactFlow: ReactFlow) => () => {
  const { edges, nodes } = reactFlow.toObject();

  return {
    version: EDITOR_DOCUMENT_VERSION,
    nodes,
    edges,
  } satisfies EditorDocument;
};

export const onConnectNodesFactory =
  (reactFlow: Pick<ReactFlow, "getNodes" | "setEdges">) => (connection: Connection) => {
    const { source, target } = connection;
    if (!source || !target) return;

    const nodes = reactFlow.getNodes();

    reactFlow.setEdges(currentEdges => {
      // React Flow auto-adds an edge with its own id before onConnect fires in uncontrolled
      // mode. Filter it out so we can replace it with our own id convention.
      const withoutAutoEdge = currentEdges.filter(
        e => !(e.source === source && e.target === target && !e.id.includes("__to__")),
      );

      if (!canConnectNodes(nodes, withoutAutoEdge, connection)) return withoutAutoEdge;

      const edgeId = createEdgeId(source, target);
      return [...withoutAutoEdge, { ...connection, id: edgeId }];
    });
  };

export const updateNodeFactory =
  (reactFlow: ReactFlow) => (input: UpdateNodeInput) => {
    const { id, type } = input;

    switch (type) {
      case "check":
        reactFlow.updateNode(id, { data: toCheckData(input), type });
        return;
      case "coefficient":
        reactFlow.updateNode(id, { data: toCoefficientData(input), type });
        return;
      case "constant":
        reactFlow.updateNode(id, { data: toConstantData(input), type });
        return;
      case "formula":
        reactFlow.updateNode(id, { data: toFormulaData(input), type });
        return;
      case "table":
        reactFlow.updateNode(id, { data: toTableData(input), type });
        return;
      case "user-input":
        reactFlow.updateNode(id, { data: toUserInputData(input), type });
        return;
    }
  };

const toCheckData = (input: AddNodeInput | UpdateNodeInput) => ({
  key: input.key,
  meta: toMeta(input),
  symbol: optional(input.symbol),
  valueType: { type: "number" } as const,
  verificationExpression: input.verificationExpression,
});

const toCoefficientData = (input: AddNodeInput | UpdateNodeInput) => ({
  key: input.key,
  meta: toMeta(input) ?? {},
  symbol: optional(input.symbol),
  unit: optional(input.unit),
  valueType: { type: "number" } as const,
});

const toConstantData = (input: AddNodeInput | UpdateNodeInput) => ({
  key: input.key,
  symbol: input.symbol,
  valueType: { type: "number" } as const,
});

const toFormulaData = (input: AddNodeInput | UpdateNodeInput) => ({
  expression: optional(input.expression),
  key: input.key,
  meta: toMeta(input),
  symbol: optional(input.symbol),
  unit: optional(input.unit),
  valueType: toValueType(input.valueType),
});

const toTableData = (input: AddNodeInput | UpdateNodeInput) => ({
  key: input.key,
  meta: toMeta(input),
  source: input.source,
  symbol: optional(input.symbol),
  unit: optional(input.unit),
  valueType: toValueType(input.valueType),
});

const toUserInputData = (input: AddNodeInput | UpdateNodeInput) => ({
  key: input.key,
  symbol: optional(input.symbol),
  unit: optional(input.unit),
  valueType: toValueType(input.valueType),
});

const toValueType = (valueType: AddNodeInput["valueType"]) => {
  if (valueType === "number") return { type: "number" } as const;
  return { type: "string" } as const;
};

const toMeta = (input: AddNodeInput | UpdateNodeInput) => {
  const meta = {
    ...(input.formulaRef && { formulaRef: input.formulaRef }),
    ...(input.paragraphRef && { paragraphRef: input.paragraphRef }),
    ...(input.sectionRef && { sectionRef: input.sectionRef }),
    ...(input.subParagraphRef && { subParagraphRef: input.subParagraphRef }),
    ...(input.tableRef && { tableRef: input.tableRef }),
    ...(input.verificationRef && { verificationRef: input.verificationRef }),
  };

  if (Object.keys(meta).length === 0) return;
  return meta;
};

const optional = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return;
  return trimmedValue;
};
