import { defineNodes } from "@ndg/ndg-core";

export const nodes = defineNodes([
  {
    id: "shear_y_check",
    type: "check",
    key: "shear_y_check",
    valueType: { type: "number" },
    name: "Shear resistance check about y-y",
    verificationExpression:
      "\\frac{\\left|V_{y,Ed}\\right|}{V_{pl,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
    children: [{ nodeId: "V_y_Ed" }, { nodeId: "V_pl_y_Rd" }],
  },
  {
    id: "V_y_Ed",
    type: "user-input",
    key: "V_y_Ed",
    valueType: { type: "number" },
    name: "Design shear force about y-y",
    symbol: "V_{y,Ed}",
    unit: "\\mathrm{N}",
    children: [],
  },
  {
    id: "V_pl_y_Rd",
    type: "formula",
    key: "V_pl_y_Rd",
    valueType: { type: "number" },
    name: "Plastic shear resistance about y-y",
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} \\cdot f_y}{\\sqrt{3}\\,\\gamma_{M0}}",
    unit: "\\mathrm{N}",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [
      { nodeId: "Av_y" },
      { nodeId: "fy" },
      { nodeId: "gamma_M0" },
    ],
  },
  {
    id: "Av_y",
    type: "user-input",
    key: "Av_y",
    valueType: { type: "number" },
    name: "Shear area about y-y",
    symbol: "A_{v,y}",
    unit: "\\mathrm{mm^{2}}",
    children: [],
  },
  {
    id: "fy",
    type: "user-input",
    key: "fy",
    valueType: { type: "number" },
    name: "Yield strength",
    symbol: "f_y",
    unit: "\\mathrm{MPa}",
    children: [],
  },
  {
    id: "gamma_M0",
    type: "coefficient",
    key: "gamma_M0",
    valueType: { type: "number" },
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
]);

export type Nodes = typeof nodes;
