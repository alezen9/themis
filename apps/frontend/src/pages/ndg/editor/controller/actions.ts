import type { XYPosition } from "@xyflow/react";

import type { EditorNode } from "../document/types";

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

export type UpdateNodeInput = Omit<AddNodeInput, "position" | "sourceNodeId"> & {
  id: string;
};

export const toEditorNode = (id: string, input: AddNodeInput): EditorNode => {
  const { position, type } = input;
  switch (type) {
    case "check":
      return { id, position, data: toCheckData(input), type };
    case "coefficient":
      return { id, position, data: toCoefficientData(input), type };
    case "constant":
      return { id, position, data: toConstantData(input), type };
    case "formula":
      return { id, position, data: toFormulaData(input), type };
    case "table":
      return { id, position, data: toTableData(input), type };
    case "user-input":
      return { id, position, data: toUserInputData(input), type };
  }
};

export const applyNodeUpdate = (existing: EditorNode, input: UpdateNodeInput): EditorNode => {
  const { id, position } = existing;
  const { type } = input;
  switch (type) {
    case "check":
      return { id, position, data: toCheckData(input), type };
    case "coefficient":
      return { id, position, data: toCoefficientData(input), type };
    case "constant":
      return { id, position, data: toConstantData(input), type };
    case "formula":
      return { id, position, data: toFormulaData(input), type };
    case "table":
      return { id, position, data: toTableData(input), type };
    case "user-input":
      return { id, position, data: toUserInputData(input), type };
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
  const trimmed = value.trim();
  if (!trimmed) return;
  return trimmed;
};
