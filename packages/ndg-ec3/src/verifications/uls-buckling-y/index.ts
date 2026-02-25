import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.3.1 — Flexural buckling about y-y: N_Ed / N_b_y_Rd ≤ 1.0
 * χ_y from §6.3.1.2 using buckling curve imperfection factor.
 */

const nodes = [
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "by-N-Ed",
    name: "Design compression force",
    symbol: "N_{Ed}",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "by-A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "by-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "E",
    valueType: "number",
    id: "by-E",
    name: "Elastic modulus",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "Iy",
    valueType: "number",
    id: "by-Iy",
    name: "Second moment of area y-y",
    unit: "mm⁴",
    children: [],
  },
  {
    type: "user-input",
    key: "Lcr_y",
    valueType: "number",
    id: "by-Lcr-y",
    name: "Buckling length about y-y",
    symbol: "L_{cr,y}",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_y",
    valueType: "number",
    id: "by-alpha-y",
    name: "Imperfection factor y-y",
    symbol: "\\alpha_y",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M1",
    valueType: "number",
    id: "by-gamma-M1",
    name: "Partial safety factor",
    symbol: "\\gamma_{M1}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "N_cr_y",
    valueType: "number",
    id: "by-N-cr-y",
    name: "Elastic critical force y-y",
    symbol: "N_{cr,y}",
    expression: "\\frac{\\pi^2 E I_y}{L_{cr,y}^2}",
    unit: "N",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
    children: [{ nodeId: "by-E" }, { nodeId: "by-Iy" }, { nodeId: "by-Lcr-y" }],
  },
  {
    type: "derived",
    key: "lambda_bar_y",
    valueType: "number",
    id: "by-lambda-bar-y",
    name: "Non-dimensional slenderness y-y",
    symbol: "\\bar{\\lambda}_y",
    expression: "\\sqrt{A f_y / N_{cr,y}}",
    children: [{ nodeId: "by-A" }, { nodeId: "by-fy" }, { nodeId: "by-N-cr-y" }],
  },
  {
    type: "derived",
    key: "phi_y",
    valueType: "number",
    id: "by-phi-y",
    name: "Buckling parameter y-y",
    symbol: "\\Phi_y",
    expression: "0.5(1 + \\alpha(\\bar{\\lambda}-0.2) + \\bar{\\lambda}^2)",
    children: [{ nodeId: "by-alpha-y" }, { nodeId: "by-lambda-bar-y" }],
  },
  {
    type: "formula",
    key: "chi_y",
    valueType: "number",
    id: "by-chi-y",
    name: "Reduction factor y-y",
    symbol: "\\chi_y",
    expression: "\\frac{1}{\\Phi_y + \\sqrt{\\Phi_y^2 - \\bar{\\lambda}_y^2}}",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
    children: [{ nodeId: "by-phi-y" }, { nodeId: "by-lambda-bar-y" }],
  },
  {
    type: "formula",
    key: "N_b_y_Rd",
    valueType: "number",
    id: "by-N-b-y-Rd",
    name: "Buckling resistance y-y",
    symbol: "N_{b,y,Rd}",
    expression: "\\frac{\\chi_y A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.1", formulaRef: "(6.47)" },
    children: [
      { nodeId: "by-chi-y" }, { nodeId: "by-A" },
      { nodeId: "by-fy" }, { nodeId: "by-gamma-M1" },
    ],
  },
  {
    type: "check",
    key: "buckling_y_check",
    valueType: "number",
    id: "by-check",
    name: "Flexural buckling check y-y",
    verificationExpression: "\\frac{N_{Ed}}{N_{b,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.1", verificationRef: "(6.46)" },
    children: [{ nodeId: "by-N-Ed" }, { nodeId: "by-N-b-y-Rd" }],
  },
] as const;

export const ulsBucklingY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_cr_y: ({ E, Iy, Lcr_y }) =>
      (Math.PI ** 2 * E * Iy) / Lcr_y ** 2,
    lambda_bar_y: ({ A, fy, N_cr_y }) =>
      Math.sqrt((A * fy) / N_cr_y),
    phi_y: ({ alpha_y, lambda_bar_y }) =>
      0.5 * (1 + alpha_y * (lambda_bar_y - 0.2) + lambda_bar_y ** 2),
    chi_y: ({ phi_y, lambda_bar_y }) =>
      Math.min(1, 1 / (phi_y + Math.sqrt(phi_y ** 2 - lambda_bar_y ** 2))),
    N_b_y_Rd: ({ chi_y, A, fy, gamma_M1 }) =>
      (chi_y * A * fy) / gamma_M1,
    buckling_y_check: ({ N_Ed, N_b_y_Rd }) =>
      Math.abs(N_Ed) / N_b_y_Rd,
  },
};
