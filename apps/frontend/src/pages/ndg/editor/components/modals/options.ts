import { constantCatalog } from "@ndg/ndg-core";
import { Option } from "@components/inputs/shared";
import {
  coefficientCatalog,
  coefficientKeys,
  tableKeys,
  userInputCatalog,
  userInputKeys,
} from "@ndg/ndg-ec3-1-1";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

export const typeOptions = [
  { value: "user-input", label: "User input" },
  { value: "coefficient", label: "Coefficient" },
  { value: "constant", label: "Constant" },
  { value: "table", label: "Table" },
  { value: "formula", label: "Formula" },
] as const satisfies Option[];

export type EditableNodeType = (typeof typeOptions)[number]["value"];

export const valueTypeOptions = [
  { value: "number", label: "Number" },
  { value: "string", label: "String" },
] as const satisfies Option[];

const toOption = (value: string): Option => ({ value, label: value });

export const tableKeyOptions = tableKeys.map(toOption);
export const userInputKeyOptions = userInputKeys.map(toOption);
export const coefficientKeyOptions = coefficientKeys.map(toOption);
export const constantKeyOptions: Option[] = [
  { value: "custom", label: "Custom" },
  ...Object.keys(constantCatalog).map(toOption),
];

export const defaultNodeFormValues = {
  "user-input": {
    type: "user-input",
    key: "N_Ed_N",
    symbol: userInputCatalog.N_Ed_N.symbol,
    unit: userInputCatalog.N_Ed_N.unit,
    valueType: { type: userInputCatalog.N_Ed_N.valueType },
  },
  coefficient: {
    type: "coefficient",
    key: "gamma_M0",
    symbol: coefficientCatalog.gamma_M0.symbol,
    unit: coefficientCatalog.gamma_M0.unit,
    meta: coefficientCatalog.gamma_M0.meta,
    valueType: { type: "number" },
  },
  constant: {
    type: "constant",
    key: "E",
    symbol: constantCatalog.E.symbol,
    unit: constantCatalog.E.unit,
    valueType: { type: "number" },
  },
  table: {
    type: "table",
    key: "buckling_curve_y",
    source: "",
    valueType: { type: "number" },
  },
  formula: {
    type: "formula",
    key: "",
    valueType: { type: "number" },
  },
} as const satisfies Record<EditableNodeType, EditorNodeInput>;
