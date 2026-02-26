import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.9.1(6) — Biaxial bending and axial force, eq (6.41).
 * (M_y_Ed / M_N_y_Rd)^α + (M_z_Ed / M_N_z_Rd)^β ≤ 1.0
 *
 * Exponents per §6.2.9.1(6):
 *   I/H sections:  α = 2,  β = max(1, 5n)
 *   CHS:           α = 2,  β = 2
 *   RHS:           α = β = 1.66/(1 − 1.13n²)  but ≤ 6
 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "biax-M-y-Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: "number",
    id: "biax-M-z-Ed",
    name: "Design bending moment about z-z",
    symbol: "M_{z,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "biax-N-Ed",
    name: "Design axial force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "biax-A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "biax-Wpl-y",
    name: "Plastic section modulus y-y",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: "number",
    id: "biax-Wpl-z",
    name: "Plastic section modulus z-z",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "biax-Av-z",
    name: "Shear area z",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "biax-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "biax-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "biax-N-pl-Rd",
    name: "Plastic resistance",
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
    children: [{ nodeId: "biax-A" }, { nodeId: "biax-fy" }, { nodeId: "biax-gamma-M0" }],
  },
  {
    type: "derived",
    key: "n",
    valueType: "number",
    id: "biax-n",
    name: "Axial force ratio",
    symbol: "n",
    children: [{ nodeId: "biax-N-Ed" }, { nodeId: "biax-N-pl-Rd" }],
  },
  {
    type: "derived",
    key: "a_w",
    valueType: "number",
    id: "biax-a-w",
    name: "Web area ratio",
    children: [{ nodeId: "biax-Av-z" }, { nodeId: "biax-A" }],
  },
  {
    type: "derived",
    key: "a_f",
    valueType: "number",
    id: "biax-a-f",
    name: "Flange area ratio",
    children: [{ nodeId: "biax-Av-z" }, { nodeId: "biax-A" }],
  },
  {
    type: "formula",
    key: "M_N_y_Rd",
    valueType: "number",
    id: "biax-M-N-y-Rd",
    name: "Reduced bending resistance y-y",
    symbol: "M_{N,y,Rd}",
    expression: "M_{pl,y,Rd} \\min(1, (1-n)/(1-0.5a_w))",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
    children: [
      { nodeId: "biax-Wpl-y" },
      { nodeId: "biax-fy" },
      { nodeId: "biax-gamma-M0" },
      { nodeId: "biax-n" },
      { nodeId: "biax-a-w" },
    ],
  },
  {
    type: "formula",
    key: "M_N_z_Rd",
    valueType: "number",
    id: "biax-M-N-z-Rd",
    name: "Reduced bending resistance z-z",
    symbol: "M_{N,z,Rd}",
    expression: "M_{pl,z,Rd} (1 - ((n-a_f)/(1-a_f))^2)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
    children: [
      { nodeId: "biax-Wpl-z" },
      { nodeId: "biax-fy" },
      { nodeId: "biax-gamma-M0" },
      { nodeId: "biax-n" },
      { nodeId: "biax-a-f" },
    ],
  },
  {
    type: "user-input",
    key: "section_shape",
    valueType: "string",
    id: "biax-section-shape",
    name: "Section shape family (I, CHS, RHS)",
    children: [],
  },
  {
    type: "derived",
    key: "alpha_biax",
    valueType: "number",
    id: "biax-alpha",
    name: "Biaxial exponent α per §6.2.9.1(6)",
    symbol: "\\alpha",
    children: [{ nodeId: "biax-section-shape" }, { nodeId: "biax-n" }],
  },
  {
    type: "derived",
    key: "beta_biax",
    valueType: "number",
    id: "biax-beta",
    name: "Biaxial exponent β per §6.2.9.1(6)",
    symbol: "\\beta",
    children: [{ nodeId: "biax-section-shape" }, { nodeId: "biax-n" }],
  },
  {
    type: "check",
    key: "biaxial_axial_check",
    valueType: "number",
    id: "biax-check",
    name: "Biaxial bending and axial force check",
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{N,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{N,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.41)" },
    children: [
      { nodeId: "biax-M-y-Ed" },
      { nodeId: "biax-M-z-Ed" },
      { nodeId: "biax-M-N-y-Rd" },
      { nodeId: "biax-M-N-z-Rd" },
      { nodeId: "biax-alpha" },
      { nodeId: "biax-beta" },
    ],
  },
] as const;

export const ulsBiaxialAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    a_f: ({ Av_z, A }) => Math.min((A - Av_z) / A, 0.5),
    M_N_y_Rd: ({ Wpl_y, fy, gamma_M0, n, a_w }) => {
      const MplRd = (Wpl_y * fy) / gamma_M0;
      return MplRd * Math.min(1, (1 - n) / (1 - 0.5 * a_w));
    },
    M_N_z_Rd: ({ Wpl_z, fy, gamma_M0, n, a_f }) => {
      const MplRd = (Wpl_z * fy) / gamma_M0;
      if (n <= a_f) return MplRd;
      return MplRd * (1 - ((n - a_f) / (1 - a_f)) ** 2);
    },
    // §6.2.9.1(6): exponents depend on section shape
    alpha_biax: ({ section_shape, n }) => {
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * (n as number) ** 2), 6);
      return 2; // I/H and CHS
    },
    beta_biax: ({ section_shape, n }) => {
      if (section_shape === "CHS") return 2;
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * (n as number) ** 2), 6);
      return Math.max(1, 5 * (n as number)); // I/H sections
    },
    biaxial_axial_check: ({
      M_y_Ed,
      M_z_Ed,
      M_N_y_Rd,
      M_N_z_Rd,
      alpha_biax,
      beta_biax,
    }) =>
      (Math.abs(M_y_Ed) / M_N_y_Rd) ** alpha_biax +
      (Math.abs(M_z_Ed) / M_N_z_Rd) ** beta_biax,
  },
};
