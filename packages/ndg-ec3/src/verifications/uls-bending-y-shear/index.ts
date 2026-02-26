import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.8 — Bending and shear (y-axis).
 * When V_z_Ed > 0.5·V_pl,z,Rd, reduced bending resistance M_y,V,Rd applies
 * per §6.2.8(5) eq (6.30) for I-sections with equal flanges.
 * Otherwise M_y,V,Rd = M_c,y,Rd (no reduction, §6.2.8(2)).
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
    name: "Shear area in z (≈ A_w = h_w t_w)",
    symbol: "A_{v,z}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "tw",
    valueType: "number",
    id: "bys-tw",
    name: "Web thickness",
    symbol: "t_w",
    unit: "mm",
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
    expression: "\\frac{A_{v,z} f_y / \\sqrt{3}}{\\gamma_{M0}}",
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
    name: "Shear reduction factor",
    symbol: "\\rho",
    expression: "\\left(\\frac{2 V_{z,Ed}}{V_{pl,z,Rd}} - 1\\right)^2",
    children: [
      { nodeId: "bys-V-z-Ed" },
      { nodeId: "bys-V-pl-z-Rd" },
    ],
  },
  {
    type: "formula",
    key: "M_y_V_Rd",
    valueType: "number",
    id: "bys-M-y-V-Rd",
    name: "Reduced plastic resistance moment about y-y allowing for shear",
    symbol: "M_{y,V,Rd}",
    expression: "\\frac{\\left(W_{pl,y} - \\rho \\dfrac{A_{v,z}^2}{4 t_w}\\right) f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.30)" },
    children: [
      { nodeId: "bys-Wpl-y" },
      { nodeId: "bys-rho-z" },
      { nodeId: "bys-Av-z" },
      { nodeId: "bys-tw" },
      { nodeId: "bys-fy" },
      { nodeId: "bys-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "bending_y_shear_check",
    valueType: "number",
    id: "bys-check",
    name: "Bending and shear check (y-axis) §6.2.8",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{y,V,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
    children: [
      { nodeId: "bys-M-y-Ed" },
      { nodeId: "bys-M-y-V-Rd" },
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
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    // §6.2.8(5) eq (6.30): for I-sections with equal flanges, bending about major axis.
    // A_w = h_w·t_w ≈ A_v,z, so A_w²/(4t_w) = A_v,z²/(4t_w).
    M_y_V_Rd: ({ Wpl_y, rho_z, Av_z, tw, fy, gamma_M0 }) =>
      ((Wpl_y - rho_z * Av_z ** 2 / (4 * tw)) * fy) / gamma_M0,
    bending_y_shear_check: ({ M_y_Ed, M_y_V_Rd }) =>
      Math.abs(M_y_Ed) / M_y_V_Rd,
  },
};
