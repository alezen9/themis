import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.8 — Bending and shear (z-axis).
 * Analogous to y-axis but with V_y_Ed and M_z_Ed.
 */

const nodes = [
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: "number",
    id: "bzs-M-z-Ed",
    name: "Design bending moment about z-z",
    symbol: "M_{z,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "V_y_Ed",
    valueType: "number",
    id: "bzs-V-y-Ed",
    name: "Design shear force in y",
    symbol: "V_{y,Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: "number",
    id: "bzs-Wpl-z",
    name: "Plastic section modulus about z-z",
    symbol: "W_{pl,z}",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_y",
    valueType: "number",
    id: "bzs-Av-y",
    name: "Shear area in y",
    symbol: "A_{v,y}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bzs-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bzs-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_y_Rd",
    valueType: "number",
    id: "bzs-V-pl-y-Rd",
    name: "Plastic shear resistance in y",
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [
      { nodeId: "bzs-Av-y" },
      { nodeId: "bzs-fy" },
      { nodeId: "bzs-gamma-M0" },
    ],
  },
  {
    type: "derived",
    key: "rho_y",
    valueType: "number",
    id: "bzs-rho-y",
    name: "Shear interaction factor",
    symbol: "\\rho",
    children: [
      { nodeId: "bzs-V-y-Ed" },
      { nodeId: "bzs-V-pl-y-Rd" },
    ],
  },
  {
    type: "formula",
    key: "M_V_z_Rd",
    valueType: "number",
    id: "bzs-M-V-z-Rd",
    name: "Reduced bending resistance about z-z",
    symbol: "M_{V,z,Rd}",
    expression: "W_{pl,z}(1-\\rho) f_y / \\gamma_{M0}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.29)" },
    children: [
      { nodeId: "bzs-Wpl-z" },
      { nodeId: "bzs-rho-y" },
      { nodeId: "bzs-fy" },
      { nodeId: "bzs-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "bending_z_shear_check",
    valueType: "number",
    id: "bzs-check",
    name: "Bending and shear check (z-axis)",
    verificationExpression: "\\frac{M_{z,Ed}}{M_{V,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
    children: [
      { nodeId: "bzs-M-z-Ed" },
      { nodeId: "bzs-M-V-z-Rd" },
    ],
  },
] as const;

export const ulsBendingZShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    rho_y: ({ V_y_Ed, V_pl_y_Rd }) => {
      const ratio = Math.abs(V_y_Ed) / V_pl_y_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    M_V_z_Rd: ({ Wpl_z, rho_y, fy, gamma_M0 }) => {
      const Wpl_reduced = Wpl_z * (1 - rho_y);
      return (Wpl_reduced * fy) / gamma_M0;
    },
    bending_z_shear_check: ({ M_z_Ed, M_V_z_Rd }) =>
      Math.abs(M_z_Ed) / M_V_z_Rd,
  },
};
