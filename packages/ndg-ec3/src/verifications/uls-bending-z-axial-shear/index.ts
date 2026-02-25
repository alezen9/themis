import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.10 — Bending about z-z, axial force, and shear.
 */

const nodes = [
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: "number",
    id: "bzas-M-z-Ed",
    name: "Design bending moment about z-z",
    symbol: "M_{z,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "bzas-N-Ed",
    name: "Design axial force",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "V_y_Ed",
    valueType: "number",
    id: "bzas-V-y-Ed",
    name: "Design shear force in y",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "bzas-A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: "number",
    id: "bzas-Wpl-z",
    name: "Plastic section modulus z-z",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_y",
    valueType: "number",
    id: "bzas-Av-y",
    name: "Shear area y",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "bzas-Av-z",
    name: "Shear area z (web area)",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bzas-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bzas-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_y_Rd",
    valueType: "number",
    id: "bzas-V-pl-y-Rd",
    name: "Plastic shear resistance y",
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [{ nodeId: "bzas-Av-y" }, { nodeId: "bzas-fy" }, { nodeId: "bzas-gamma-M0" }],
  },
  {
    type: "derived",
    key: "rho_y",
    valueType: "number",
    id: "bzas-rho-y",
    name: "Shear interaction factor",
    children: [{ nodeId: "bzas-V-y-Ed" }, { nodeId: "bzas-V-pl-y-Rd" }],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "bzas-N-pl-Rd",
    name: "Plastic resistance",
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
    children: [{ nodeId: "bzas-A" }, { nodeId: "bzas-fy" }, { nodeId: "bzas-gamma-M0" }],
  },
  {
    type: "derived",
    key: "n",
    valueType: "number",
    id: "bzas-n",
    name: "Axial force ratio",
    children: [{ nodeId: "bzas-N-Ed" }, { nodeId: "bzas-N-pl-Rd" }],
  },
  {
    type: "derived",
    key: "a_f",
    valueType: "number",
    id: "bzas-a-f",
    name: "Flange area ratio",
    children: [{ nodeId: "bzas-Av-z" }, { nodeId: "bzas-A" }],
  },
  {
    type: "formula",
    key: "M_NV_z_Rd",
    valueType: "number",
    id: "bzas-M-NV-z-Rd",
    name: "Reduced bending resistance z-z (axial + shear)",
    symbol: "M_{NV,z,Rd}",
    expression: "W_{pl,z}(1-\\rho_y) f_y (1-((n-a_f)/(1-a_f))^2) / \\gamma_{M0}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.2.10)" },
    children: [
      { nodeId: "bzas-Wpl-z" },
      { nodeId: "bzas-rho-y" },
      { nodeId: "bzas-fy" },
      { nodeId: "bzas-gamma-M0" },
      { nodeId: "bzas-n" },
      { nodeId: "bzas-a-f" },
    ],
  },
  {
    type: "check",
    key: "bending_z_axial_shear_check",
    valueType: "number",
    id: "bzas-check",
    name: "Bending z + axial + shear check",
    verificationExpression: "\\frac{M_{z,Ed}}{M_{NV,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.10" },
    children: [{ nodeId: "bzas-M-z-Ed" }, { nodeId: "bzas-M-NV-z-Rd" }],
  },
] as const;

export const ulsBendingZAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    rho_y: ({ V_y_Ed, V_pl_y_Rd }) => {
      const ratio = Math.abs(V_y_Ed) / V_pl_y_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_f: ({ Av_z, A }) => Math.min((A - Av_z) / A, 0.5),
    M_NV_z_Rd: ({ Wpl_z, rho_y, fy, gamma_M0, n, a_f }) => {
      const Wpl_red = Wpl_z * (1 - rho_y);
      const MplRd = (Wpl_red * fy) / gamma_M0;
      if (n <= a_f) return MplRd;
      return MplRd * (1 - ((n - a_f) / (1 - a_f)) ** 2);
    },
    bending_z_axial_shear_check: ({ M_z_Ed, M_NV_z_Rd }) =>
      Math.abs(M_z_Ed) / M_NV_z_Rd,
  },
};
