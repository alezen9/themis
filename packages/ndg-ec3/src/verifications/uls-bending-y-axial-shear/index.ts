import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.10 — Bending about y-y, axial force, and shear.
 * Uses reduced yield strength for shear interaction + axial reduction.
 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "byas-M-y-Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "byas-N-Ed",
    name: "Design axial force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "V_z_Ed",
    valueType: "number",
    id: "byas-V-z-Ed",
    name: "Design shear force in z",
    symbol: "V_{z,Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "byas-A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "byas-Wpl-y",
    name: "Plastic section modulus y-y",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "byas-Av-z",
    name: "Shear area z",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "byas-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "byas-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_z_Rd",
    valueType: "number",
    id: "byas-V-pl-z-Rd",
    name: "Plastic shear resistance",
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [{ nodeId: "byas-Av-z" }, { nodeId: "byas-fy" }, { nodeId: "byas-gamma-M0" }],
  },
  {
    type: "derived",
    key: "rho_z",
    valueType: "number",
    id: "byas-rho-z",
    name: "Shear interaction factor",
    symbol: "\\rho",
    children: [{ nodeId: "byas-V-z-Ed" }, { nodeId: "byas-V-pl-z-Rd" }],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "byas-N-pl-Rd",
    name: "Plastic resistance",
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
    children: [{ nodeId: "byas-A" }, { nodeId: "byas-fy" }, { nodeId: "byas-gamma-M0" }],
  },
  {
    type: "derived",
    key: "n",
    valueType: "number",
    id: "byas-n",
    name: "Axial force ratio",
    children: [{ nodeId: "byas-N-Ed" }, { nodeId: "byas-N-pl-Rd" }],
  },
  {
    type: "derived",
    key: "a_w",
    valueType: "number",
    id: "byas-a-w",
    name: "Web area ratio",
    children: [{ nodeId: "byas-Av-z" }, { nodeId: "byas-A" }],
  },
  {
    type: "formula",
    key: "M_NV_y_Rd",
    valueType: "number",
    id: "byas-M-NV-y-Rd",
    name: "Reduced bending resistance (axial + shear)",
    symbol: "M_{NV,y,Rd}",
    expression: "W_{pl,y}(1-\\rho) f_y (1-n)/(1-0.5a) / \\gamma_{M0}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.2.10)" },
    children: [
      { nodeId: "byas-Wpl-y" },
      { nodeId: "byas-rho-z" },
      { nodeId: "byas-fy" },
      { nodeId: "byas-gamma-M0" },
      { nodeId: "byas-n" },
      { nodeId: "byas-a-w" },
    ],
  },
  {
    type: "check",
    key: "bending_y_axial_shear_check",
    valueType: "number",
    id: "byas-check",
    name: "Bending y + axial + shear check",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{NV,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.10" },
    children: [{ nodeId: "byas-M-y-Ed" }, { nodeId: "byas-M-NV-y-Rd" }],
  },
] as const;

export const ulsBendingYAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    rho_z: ({ V_z_Ed, V_pl_z_Rd }) => {
      const ratio = Math.abs(V_z_Ed) / V_pl_z_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    M_NV_y_Rd: ({ Wpl_y, rho_z, fy, gamma_M0, n, a_w }) => {
      const Wpl_red = Wpl_y * (1 - rho_z);
      const axial_red = Math.min(1, (1 - n) / (1 - 0.5 * a_w));
      return (Wpl_red * fy * axial_red) / gamma_M0;
    },
    bending_y_axial_shear_check: ({ M_y_Ed, M_NV_y_Rd }) =>
      Math.abs(M_y_Ed) / M_NV_y_Rd,
  },
};
