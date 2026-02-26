import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.8 — Bending and shear (z-axis).
 * When V_y_Ed > 0.5·V_pl,y,Rd the reduced moment resistance applies.
 * Per §6.2.8(3): compute resistance using reduced yield strength (1-ρ)·f_y
 * for the shear area (A_v,y = flanges for I-sections).
 *
 * For I-sections bending about z-z, the flanges carry V_y.
 * Their contribution to W_pl,z is: W_pl,z,f = W_pl,z − t_w²·h_w/4
 *                                             = W_pl,z − A_v,z·t_w/4
 * Applying (1-ρ)·f_y to the flanges:
 *   M_z,V,Rd = [W_pl,z − ρ·W_pl,z,f]·f_y/γ_M0
 *            = [W_pl,z − ρ·(W_pl,z − A_v,z·t_w/4)]·f_y/γ_M0
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
    name: "Shear area in y (flanges)",
    symbol: "A_{v,y}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "bzs-Av-z",
    name: "Shear area in z (≈ A_w = h_w t_w)",
    symbol: "A_{v,z}",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "tw",
    valueType: "number",
    id: "bzs-tw",
    name: "Web thickness",
    symbol: "t_w",
    unit: "mm",
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
    expression: "\\frac{A_{v,y} f_y / \\sqrt{3}}{\\gamma_{M0}}",
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
    name: "Shear reduction factor",
    symbol: "\\rho",
    expression: "\\left(\\frac{2 V_{y,Ed}}{V_{pl,y,Rd}} - 1\\right)^2",
    children: [
      { nodeId: "bzs-V-y-Ed" },
      { nodeId: "bzs-V-pl-y-Rd" },
    ],
  },
  {
    type: "derived",
    key: "Wpl_z_web",
    valueType: "number",
    id: "bzs-Wpl-z-web",
    name: "Web contribution to plastic modulus about z-z",
    symbol: "W_{pl,z,web}",
    expression: "\\frac{t_w^2 h_w}{4} = \\frac{A_{v,z} t_w}{4}",
    unit: "mm³",
    children: [
      { nodeId: "bzs-Av-z" },
      { nodeId: "bzs-tw" },
    ],
  },
  {
    type: "formula",
    key: "M_z_V_Rd",
    valueType: "number",
    id: "bzs-M-z-V-Rd",
    name: "Reduced plastic resistance moment about z-z allowing for shear",
    symbol: "M_{z,V,Rd}",
    expression: "\\frac{\\bigl[W_{pl,z} - \\rho\\,(W_{pl,z} - W_{pl,z,web})\\bigr] f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.2.8(3))" },
    children: [
      { nodeId: "bzs-Wpl-z" },
      { nodeId: "bzs-rho-y" },
      { nodeId: "bzs-Wpl-z-web" },
      { nodeId: "bzs-fy" },
      { nodeId: "bzs-gamma-M0" },
    ],
  },
  {
    type: "check",
    key: "bending_z_shear_check",
    valueType: "number",
    id: "bzs-check",
    name: "Bending and shear check (z-axis) §6.2.8",
    verificationExpression: "\\frac{M_{z,Ed}}{M_{z,V,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
    children: [
      { nodeId: "bzs-M-z-Ed" },
      { nodeId: "bzs-M-z-V-Rd" },
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
    // Web contribution to W_pl,z: t_w²·h_w/4 = A_v,z·t_w/4 (using A_v,z ≈ h_w·t_w)
    Wpl_z_web: ({ Av_z, tw }) => (Av_z * tw) / 4,
    // §6.2.8(3): apply (1-ρ)·f_y to shear area (flanges).
    // W_pl,z,flanges = W_pl,z − W_pl,z,web
    // M_z,V,Rd = [W_pl,z − ρ·W_pl,z,flanges]·f_y/γ_M0
    M_z_V_Rd: ({ Wpl_z, rho_y, Wpl_z_web, fy, gamma_M0 }) =>
      ((Wpl_z - rho_y * (Wpl_z - Wpl_z_web)) * fy) / gamma_M0,
    bending_z_shear_check: ({ M_z_Ed, M_z_V_Rd }) =>
      Math.abs(M_z_Ed) / M_z_V_Rd,
  },
};
