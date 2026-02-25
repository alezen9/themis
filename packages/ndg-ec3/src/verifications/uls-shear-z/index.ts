import type { VerificationDefinition } from "@ndg/ndg-core";

/** §6.2.6 — Shear resistance (z-axis): V_z_Ed / V_pl_z_Rd ≤ 1.0 */

const nodes = [
  {
    type: "user-input",
    key: "V_z_Ed",
    valueType: "number",
    id: "shearz-V-z-Ed",
    name: "Design shear force in z",
    symbol: "V_{z,Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "shearz-Av-z",
    name: "Shear area in z",
    symbol: "A_{v,z}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "shearz-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "shearz-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_z_Rd",
    valueType: "number",
    id: "shearz-V-pl-z-Rd",
    name: "Plastic shear resistance in z",
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [
      { nodeId: "shearz-Av-z" },
      { nodeId: "shearz-fy" },
      { nodeId: "shearz-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "shear_z_check",
    valueType: "number",
    id: "shearz-check",
    name: "Shear resistance check (z-axis)",
    verificationExpression: "\\frac{V_{z,Ed}}{V_{pl,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
    children: [
      { nodeId: "shearz-V-z-Ed" },
      { nodeId: "shearz-V-pl-z-Rd" },
    ],
  },
] as const;

export const ulsShearZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    shear_z_check: ({ V_z_Ed, V_pl_z_Rd }) =>
      Math.abs(V_z_Ed) / V_pl_z_Rd,
  },
};
