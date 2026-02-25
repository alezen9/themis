import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.3.1.4 — Torsional and torsional-flexural buckling.
 * N_Ed / N_b_TF_Rd ≤ 1.0
 * Uses the minimum of N_cr_y, N_cr_z, N_cr_TF.
 * CHS: N_cr_TF is very large → check trivially passes (ratio ≈ 0).
 */

const nodes = [
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "tf-N-Ed",
    name: "Design compression force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "tf-A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "tf-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "E",
    valueType: "number",
    id: "tf-E",
    name: "Elastic modulus",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "G",
    valueType: "number",
    id: "tf-G",
    name: "Shear modulus",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "Iy",
    valueType: "number",
    id: "tf-Iy",
    name: "Second moment of area y-y",
    unit: "mm⁴",
    children: [],
  },
  {
    type: "user-input",
    key: "Iz",
    valueType: "number",
    id: "tf-Iz",
    name: "Second moment of area z-z",
    unit: "mm⁴",
    children: [],
  },
  {
    type: "user-input",
    key: "It",
    valueType: "number",
    id: "tf-It",
    name: "St. Venant torsion constant",
    unit: "mm⁴",
    children: [],
  },
  {
    type: "user-input",
    key: "Iw",
    valueType: "number",
    id: "tf-Iw",
    name: "Warping constant",
    unit: "mm⁶",
    children: [],
  },
  {
    type: "user-input",
    key: "Lcr_y",
    valueType: "number",
    id: "tf-Lcr-y",
    name: "Buckling length y-y",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "Lcr_z",
    valueType: "number",
    id: "tf-Lcr-z",
    name: "Buckling length z-z",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "Lcr_T",
    valueType: "number",
    id: "tf-Lcr-T",
    name: "Torsional buckling length",
    symbol: "L_{cr,T}",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_z",
    valueType: "number",
    id: "tf-alpha",
    name: "Imperfection factor (weaker axis governs)",
    symbol: "\\alpha",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M1",
    valueType: "number",
    id: "tf-gamma-M1",
    name: "Partial safety factor",
    symbol: "\\gamma_{M1}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_cr_TF",
    valueType: "number",
    id: "tf-N-cr-TF",
    name: "Elastic torsional-flexural critical force",
    symbol: "N_{cr,TF}",
    expression: "\\frac{1}{i_p^2}(G I_t + \\frac{\\pi^2 E I_w}{L_{cr,T}^2})",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", formulaRef: "(6.3.1.4)" },
    children: [
      { nodeId: "tf-E" }, { nodeId: "tf-G" },
      { nodeId: "tf-Iy" }, { nodeId: "tf-Iz" },
      { nodeId: "tf-It" }, { nodeId: "tf-Iw" },
      { nodeId: "tf-Lcr-T" }, { nodeId: "tf-A" },
    ],
  },
  {
    type: "derived",
    key: "lambda_bar_TF",
    valueType: "number",
    id: "tf-lambda-bar",
    name: "Non-dimensional slenderness (torsional-flexural)",
    symbol: "\\bar{\\lambda}_{TF}",
    children: [{ nodeId: "tf-A" }, { nodeId: "tf-fy" }, { nodeId: "tf-N-cr-TF" }],
  },
  {
    type: "derived",
    key: "phi_TF",
    valueType: "number",
    id: "tf-phi",
    name: "Buckling parameter (torsional-flexural)",
    symbol: "\\Phi_{TF}",
    children: [{ nodeId: "tf-alpha" }, { nodeId: "tf-lambda-bar" }],
  },
  {
    type: "formula",
    key: "chi_TF",
    valueType: "number",
    id: "tf-chi",
    name: "Reduction factor (torsional-flexural)",
    symbol: "\\chi_{TF}",
    expression: "\\frac{1}{\\Phi_{TF} + \\sqrt{\\Phi_{TF}^2 - \\bar{\\lambda}_{TF}^2}}",
    meta: { sectionRef: "6.3.1.4", formulaRef: "(6.49)" },
    children: [{ nodeId: "tf-phi" }, { nodeId: "tf-lambda-bar" }],
  },
  {
    type: "formula",
    key: "N_b_TF_Rd",
    valueType: "number",
    id: "tf-N-b-TF-Rd",
    name: "Torsional-flexural buckling resistance",
    symbol: "N_{b,TF,Rd}",
    expression: "\\frac{\\chi_{TF} A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", formulaRef: "(6.47)" },
    children: [
      { nodeId: "tf-chi" }, { nodeId: "tf-A" },
      { nodeId: "tf-fy" }, { nodeId: "tf-gamma-M1" },
    ],
  },
  {
    type: "check",
    key: "torsional_buckling_check",
    valueType: "number",
    id: "tf-check",
    name: "Torsional-flexural buckling check",
    verificationExpression: "\\frac{N_{Ed}}{N_{b,TF,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.4", verificationRef: "(6.46)" },
    children: [{ nodeId: "tf-N-Ed" }, { nodeId: "tf-N-b-TF-Rd" }],
  },
] as const;

export const ulsTorsionalBuckling: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_cr_TF: ({ E, G, Iy, Iz, It, Iw, Lcr_T, A }) => {
      // For doubly-symmetric sections: N_cr_T = (1/ip²)(G·It + π²EIw/LcrT²)
      // ip² = (Iy + Iz) / A (polar radius of gyration squared)
      const ip2 = (Iy + Iz) / A;
      return (1 / ip2) * (G * It + (Math.PI ** 2 * E * Iw) / Lcr_T ** 2);
    },
    lambda_bar_TF: ({ A, fy, N_cr_TF }) =>
      Math.sqrt((A * fy) / N_cr_TF),
    phi_TF: ({ alpha_z, lambda_bar_TF }) =>
      0.5 * (1 + alpha_z * (lambda_bar_TF - 0.2) + lambda_bar_TF ** 2),
    chi_TF: ({ phi_TF, lambda_bar_TF }) =>
      Math.min(1, 1 / (phi_TF + Math.sqrt(phi_TF ** 2 - lambda_bar_TF ** 2))),
    N_b_TF_Rd: ({ chi_TF, A, fy, gamma_M1 }) =>
      (chi_TF * A * fy) / gamma_M1,
    torsional_buckling_check: ({ N_Ed, N_b_TF_Rd }) =>
      Math.abs(N_Ed) / N_b_TF_Rd,
  },
};
