import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.8 — Bending and shear (y-axis).
 * When V_z_Ed > 0.5·V_pl_z_Rd, reduced bending resistance M_V_y_Rd applies.
 * Otherwise M_V_y_Rd = M_c_y_Rd (no reduction).
 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "bys-M-y-Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "V_z_Ed",
    valueType: "number",
    id: "bys-V-z-Ed",
    name: "Design shear force in z",
    symbol: "V_{z,Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "bys-Wpl-y",
    name: "Plastic section modulus about y-y",
    symbol: "W_{pl,y}",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "bys-Av-z",
    name: "Shear area in z",
    symbol: "A_{v,z}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "bys-fy",
    name: "Yield strength",
    symbol: "f_y",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "bys-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_z_Rd",
    valueType: "number",
    id: "bys-V-pl-z-Rd",
    name: "Plastic shear resistance in z",
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [
      { nodeId: "bys-Av-z" },
      { nodeId: "bys-fy" },
      { nodeId: "bys-gamma-M0" },
    ],
  },
  {
    type: "derived",
    key: "rho_z",
    valueType: "number",
    id: "bys-rho-z",
    name: "Shear interaction factor",
    symbol: "\\rho",
    expression: "(2V_{z,Ed}/V_{pl,z,Rd} - 1)^2",
    children: [
      { nodeId: "bys-V-z-Ed" },
      { nodeId: "bys-V-pl-z-Rd" },
    ],
  },
  {
    type: "formula",
    key: "M_V_y_Rd",
    valueType: "number",
    id: "bys-M-V-y-Rd",
    name: "Reduced bending resistance about y-y",
    symbol: "M_{V,y,Rd}",
    expression: "\\frac{(W_{pl,y} - \\rho A_{v,z}^2 / (4t_w)) f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.29)" },
    children: [
      { nodeId: "bys-Wpl-y" },
      { nodeId: "bys-rho-z" },
      { nodeId: "bys-Av-z" },
      { nodeId: "bys-fy" },
      { nodeId: "bys-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "bending_y_shear_check",
    valueType: "number",
    id: "bys-check",
    name: "Bending and shear check (y-axis)",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{V,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
    children: [
      { nodeId: "bys-M-y-Ed" },
      { nodeId: "bys-M-V-y-Rd" },
    ],
  },
] as const;

export const ulsBendingYShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    rho_z: ({ V_z_Ed, V_pl_z_Rd }) => {
      const ratio = Math.abs(V_z_Ed) / V_pl_z_Rd;
      if (ratio <= 0.5) return 0; // no reduction
      return (2 * ratio - 1) ** 2;
    },
    M_V_y_Rd: ({ Wpl_y, rho_z, fy, gamma_M0 }) => {
      // Simplified: reduced Wpl approach per §6.2.8(5)
      // For I-sections: M_V_Rd = (Wpl - ρ·Av²/(4·tw))·fy/γM0
      // We use simplified formula: Wpl_reduced = Wpl·(1 - ρ) as conservative approx
      // when no web thickness available
      const Wpl_reduced = Wpl_y * (1 - rho_z);
      return (Wpl_reduced * fy) / gamma_M0;
    },
    bending_y_shear_check: ({ M_y_Ed, M_V_y_Rd }) =>
      Math.abs(M_y_Ed) / M_V_y_Rd,
  },
};
