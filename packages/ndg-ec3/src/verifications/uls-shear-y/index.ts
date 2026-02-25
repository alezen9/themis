import type { VerificationDefinition } from "@ndg/ndg-core";

/** §6.2.6 — Shear resistance (y-axis): V_y_Ed / V_pl_y_Rd ≤ 1.0 */

const nodes = [
  {
    type: "user-input",
    key: "V_y_Ed",
    valueType: "number",
    id: "sheary-V-y-Ed",
    name: "Design shear force in y",
    symbol: "V_{y,Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_y",
    valueType: "number",
    id: "sheary-Av-y",
    name: "Shear area in y",
    symbol: "A_{v,y}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "sheary-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "sheary-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_y_Rd",
    valueType: "number",
    id: "sheary-V-pl-y-Rd",
    name: "Plastic shear resistance in y",
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [
      { nodeId: "sheary-Av-y" },
      { nodeId: "sheary-fy" },
      { nodeId: "sheary-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "shear_y_check",
    valueType: "number",
    id: "sheary-check",
    name: "Shear resistance check (y-axis)",
    verificationExpression: "\\frac{V_{y,Ed}}{V_{pl,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
    children: [
      { nodeId: "sheary-V-y-Ed" },
      { nodeId: "sheary-V-pl-y-Rd" },
    ],
  },
] as const;

export const ulsShearY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    shear_y_check: ({ V_y_Ed, V_pl_y_Rd }) =>
      Math.abs(V_y_Ed) / V_pl_y_Rd,
  },
};
