import { constantCatalog } from "@ndg/ndg-core";
import { coefficientCatalog, userInputCatalog } from "@ndg/ndg-ec3-1-1";

import type { EditorNodeInput } from "../../document/editorNodeSchema";
import type { EditableNodeType } from "./options";

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
    expressions: [{ expression: "" }],
  },
} as const satisfies Record<EditableNodeType, EditorNodeInput>;
