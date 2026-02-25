import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.9.1 — Bending about z-z and axial force (Class 1 & 2 I-sections).
 * M_z_Ed / M_N_z_Rd ≤ 1.0
 * M_N_z_Rd depends on n and a_f = min((A-2btf)/A, 0.5)
 */

const nodes = [
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: "number",
    id: "bza-M-z-Ed",
    name: "Design bending moment about z-z",
    symbol: "M_{z,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "bza-N-Ed",
    name: "Design axial force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "bza-A",
    name: "Cross-sectional area",
    symbol: "A",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: "number",
    id: "bza-Wpl-z",
    name: "Plastic section modulus about z-z",
    symbol: "W_{pl,z}",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "bza-Av-z",
    name: "Web area",
    symbol: "A_{v,z}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bza-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bza-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "bza-N-pl-Rd",
    name: "Plastic resistance",
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
    children: [{ nodeId: "bza-A" }, { nodeId: "bza-fy" }, { nodeId: "bza-gamma-M0" }],
  },
  {
    type: "formula",
    key: "M_pl_z_Rd",
    valueType: "number",
    id: "bza-M-pl-z-Rd",
    name: "Plastic bending resistance about z-z",
    symbol: "M_{pl,z,Rd}",
    expression: "\\frac{W_{pl,z} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
    children: [{ nodeId: "bza-Wpl-z" }, { nodeId: "bza-fy" }, { nodeId: "bza-gamma-M0" }],
  },
  {
    type: "derived",
    key: "n",
    valueType: "number",
    id: "bza-n",
    name: "Axial force ratio",
    symbol: "n",
    children: [{ nodeId: "bza-N-Ed" }, { nodeId: "bza-N-pl-Rd" }],
  },
  {
    type: "derived",
    key: "a_f",
    valueType: "number",
    id: "bza-a-f",
    name: "Flange area ratio",
    symbol: "a_f",
    children: [{ nodeId: "bza-Av-z" }, { nodeId: "bza-A" }],
  },
  {
    type: "formula",
    key: "M_N_z_Rd",
    valueType: "number",
    id: "bza-M-N-z-Rd",
    name: "Reduced bending resistance about z-z (axial)",
    symbol: "M_{N,z,Rd}",
    expression: "M_{pl,z,Rd} \\cdot \\left(1 - \\left(\\frac{n-a_f}{1-a_f}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
    children: [
      { nodeId: "bza-M-pl-z-Rd" },
      { nodeId: "bza-n" },
      { nodeId: "bza-a-f" },
    ],
  },
  {
    type: "check",
    key: "bending_z_axial_check",
    valueType: "number",
    id: "bza-check",
    name: "Bending about z-z and axial force check",
    verificationExpression: "\\frac{M_{z,Ed}}{M_{N,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.31)" },
    children: [{ nodeId: "bza-M-z-Ed" }, { nodeId: "bza-M-N-z-Rd" }],
  },
] as const;

export const ulsBendingZAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    M_pl_z_Rd: ({ Wpl_z, fy, gamma_M0 }) => (Wpl_z * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_f: ({ Av_z, A }) => {
      // a = (A - 2btf) / A ≈ (A - Aw) / A where Aw ≈ Av_z
      // Capped at 0.5
      return Math.min((A - Av_z) / A, 0.5);
    },
    M_N_z_Rd: ({ M_pl_z_Rd, n, a_f }) => {
      if (n <= a_f) return M_pl_z_Rd; // no reduction needed
      return M_pl_z_Rd * (1 - ((n - a_f) / (1 - a_f)) ** 2);
    },
    bending_z_axial_check: ({ M_z_Ed, M_N_z_Rd }) =>
      Math.abs(M_z_Ed) / M_N_z_Rd,
  },
};
