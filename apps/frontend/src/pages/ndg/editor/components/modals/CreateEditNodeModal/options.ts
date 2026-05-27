import { Option } from "@components/inputs/shared";

export const typeOptions = [
  { value: "check", label: "Check" },
  { value: "user-input", label: "User input" },
  { value: "formula", label: "Formula" },
  { value: "coefficient", label: "Coefficient" },
  { value: "constant", label: "Constant" },
  { value: "table", label: "Table" },
] as const satisfies Option[];

export const valueTypeOptions = [
  { value: "number", label: "Number" },
  { value: "string", label: "String" },
] as const satisfies Option[];
