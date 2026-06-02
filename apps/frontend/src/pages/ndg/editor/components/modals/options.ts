import { Option } from "@components/inputs/shared";
import { tableKeys, userInputKeys } from "../../document/keyCatalog";

export const typeOptions = [
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

const toOption = (value: string): Option => ({ value, label: value });

export const tableKeyOptions = tableKeys.map(toOption);
export const userInputKeyOptions = userInputKeys.map(toOption);
