import { constantCatalog } from "@ndg/ndg-core";
import { Option } from "@components/inputs/shared";
import { coefficientKeys, tableKeys, userInputKeys } from "@ndg/ndg-ec3-1-1";

export const typeOptions = [
  { value: "user-input", label: "User input" },
  { value: "coefficient", label: "Coefficient" },
  { value: "constant", label: "Constant" },
  { value: "table", label: "Table" },
  { value: "formula", label: "Formula" },
] as const satisfies Option[];

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
