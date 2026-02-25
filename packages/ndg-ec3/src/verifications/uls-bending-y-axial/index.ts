import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.9.1 — Bending about y-y and axial force (Class 1 & 2 I-sections).
 * M_y_Ed / M_N_y_Rd ≤ 1.0
 * M_N_y_Rd = M_pl_y_Rd · min(1, (1 - n) / (1 - 0.5a))
 * where n = N_Ed / N_pl_Rd, a = min(A_w/A, 0.5)
 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "bya-M-y-Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "bya-N-Ed",
    name: "Design axial force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "bya-A",
    name: "Cross-sectional area",
    symbol: "A",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "bya-Wpl-y",
    name: "Plastic section modulus about y-y",
    symbol: "W_{pl,y}",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "bya-Av-z",
    name: "Web area (shear area z)",
    symbol: "A_{v,z}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bya-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bya-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "bya-N-pl-Rd",
    name: "Plastic resistance to normal forces",
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
    children: [
      { nodeId: "bya-A" },
      { nodeId: "bya-fy" },
      { nodeId: "bya-gamma-M0" },
    ],
  },
  {
    type: "formula",
    key: "M_pl_y_Rd",
    valueType: "number",
    id: "bya-M-pl-y-Rd",
    name: "Plastic bending resistance about y-y",
    symbol: "M_{pl,y,Rd}",
    expression: "\\frac{W_{pl,y} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
    children: [
      { nodeId: "bya-Wpl-y" },
      { nodeId: "bya-fy" },
      { nodeId: "bya-gamma-M0" },
    ],
  },
  {
    type: "derived",
    key: "n",
    valueType: "number",
    id: "bya-n",
    name: "Axial force ratio",
    symbol: "n",
    expression: "N_{Ed} / N_{pl,Rd}",
    children: [
      { nodeId: "bya-N-Ed" },
      { nodeId: "bya-N-pl-Rd" },
    ],
  },
  {
    type: "derived",
    key: "a_w",
    valueType: "number",
    id: "bya-a-w",
    name: "Web area ratio",
    symbol: "a",
    expression: "\\min(A_w / A, 0.5)",
    children: [
      { nodeId: "bya-Av-z" },
      { nodeId: "bya-A" },
    ],
  },
  {
    type: "formula",
    key: "M_N_y_Rd",
    valueType: "number",
    id: "bya-M-N-y-Rd",
    name: "Reduced bending resistance about y-y (axial)",
    symbol: "M_{N,y,Rd}",
    expression: "M_{pl,y,Rd} \\cdot \\min\\left(1, \\frac{1-n}{1-0.5a}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
    children: [
      { nodeId: "bya-M-pl-y-Rd" },
      { nodeId: "bya-n" },
      { nodeId: "bya-a-w" },
    ],
  },
  {
    type: "check",
    key: "bending_y_axial_check",
    valueType: "number",
    id: "bya-check",
    name: "Bending about y-y and axial force check",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{N,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.31)" },
    children: [
      { nodeId: "bya-M-y-Ed" },
      { nodeId: "bya-M-N-y-Rd" },
    ],
  },
] as const;

export const ulsBendingYAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    M_pl_y_Rd: ({ Wpl_y, fy, gamma_M0 }) => (Wpl_y * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    M_N_y_Rd: ({ M_pl_y_Rd, n, a_w }) =>
      M_pl_y_Rd * Math.min(1, (1 - n) / (1 - 0.5 * a_w)),
    bending_y_axial_check: ({ M_y_Ed, M_N_y_Rd }) =>
      Math.abs(M_y_Ed) / M_N_y_Rd,
  },
};
