import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.3.2.3 — Lateral-torsional buckling (specific method).
 * M_y_Ed / M_b_Rd ≤ 1.0
 * Uses NDP parameters λ_LT,0 and β from national annex.
 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "ltb-M-y-Ed",
    name: "Design bending moment about y-y",
    symbol: "M_{y,Ed}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "ltb-Wpl-y",
    name: "Plastic section modulus y-y",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "ltb-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "user-input",
    key: "M_cr",
    valueType: "number",
    id: "ltb-M-cr",
    name: "Elastic critical moment for LTB",
    symbol: "M_{cr}",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "alpha_LT",
    valueType: "number",
    id: "ltb-alpha-LT",
    name: "LTB imperfection factor",
    symbol: "\\alpha_{LT}",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M1",
    valueType: "number",
    id: "ltb-gamma-M1",
    name: "Partial safety factor",
    symbol: "\\gamma_{M1}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "coefficient",
    key: "lambda_LT_0",
    valueType: "number",
    id: "ltb-lambda-LT-0",
    name: "Plateau length of LTB curves",
    symbol: "\\bar{\\lambda}_{LT,0}",
    meta: { sectionRef: "6.3.2.3" },
    children: [],
  },
  {
    type: "coefficient",
    key: "beta_LT",
    valueType: "number",
    id: "ltb-beta-LT",
    name: "LTB curve parameter",
    symbol: "\\beta",
    meta: { sectionRef: "6.3.2.3" },
    children: [],
  },
  {
    type: "derived",
    key: "lambda_bar_LT",
    valueType: "number",
    id: "ltb-lambda-bar",
    name: "Non-dimensional slenderness for LTB",
    symbol: "\\bar{\\lambda}_{LT}",
    expression: "\\sqrt{W_{pl,y} f_y / M_{cr}}",
    children: [{ nodeId: "ltb-Wpl-y" }, { nodeId: "ltb-fy" }, { nodeId: "ltb-M-cr" }],
  },
  {
    type: "derived",
    key: "phi_LT",
    valueType: "number",
    id: "ltb-phi",
    name: "LTB parameter",
    symbol: "\\Phi_{LT}",
    expression: "0.5(1 + \\alpha_{LT}(\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0}) + \\beta \\bar{\\lambda}_{LT}^2)",
    children: [
      { nodeId: "ltb-alpha-LT" }, { nodeId: "ltb-lambda-bar" },
      { nodeId: "ltb-lambda-LT-0" }, { nodeId: "ltb-beta-LT" },
    ],
  },
  {
    type: "formula",
    key: "chi_LT",
    valueType: "number",
    id: "ltb-chi",
    name: "LTB reduction factor",
    symbol: "\\chi_{LT}",
    expression: "\\frac{1}{\\Phi_{LT} + \\sqrt{\\Phi_{LT}^2 - \\beta \\bar{\\lambda}_{LT}^2}}",
    meta: { sectionRef: "6.3.2.3", formulaRef: "(6.57)" },
    children: [
      { nodeId: "ltb-phi" }, { nodeId: "ltb-lambda-bar" },
      { nodeId: "ltb-beta-LT" },
    ],
  },
  {
    type: "formula",
    key: "M_b_Rd",
    valueType: "number",
    id: "ltb-M-b-Rd",
    name: "LTB resistance",
    symbol: "M_{b,Rd}",
    expression: "\\frac{\\chi_{LT} W_{pl,y} f_y}{\\gamma_{M1}}",
    unit: "N·mm",
    meta: { sectionRef: "6.3.2.1", formulaRef: "(6.55)" },
    children: [
      { nodeId: "ltb-chi" }, { nodeId: "ltb-Wpl-y" },
      { nodeId: "ltb-fy" }, { nodeId: "ltb-gamma-M1" },
    ],
  },
  {
    type: "check",
    key: "ltb_check",
    valueType: "number",
    id: "ltb-check",
    name: "Lateral-torsional buckling check",
    verificationExpression: "\\frac{M_{y,Ed}}{M_{b,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.2.1", verificationRef: "(6.54)" },
    children: [{ nodeId: "ltb-M-y-Ed" }, { nodeId: "ltb-M-b-Rd" }],
  },
] as const;

export const ulsLtb: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    lambda_bar_LT: ({ Wpl_y, fy, M_cr }) =>
      Math.sqrt((Wpl_y * fy) / M_cr),
    phi_LT: ({ alpha_LT, lambda_bar_LT, lambda_LT_0, beta_LT }) =>
      0.5 * (1 + alpha_LT * (lambda_bar_LT - lambda_LT_0) + beta_LT * lambda_bar_LT ** 2),
    chi_LT: ({ phi_LT, lambda_bar_LT, beta_LT }) => {
      const val = 1 / (phi_LT + Math.sqrt(phi_LT ** 2 - beta_LT * lambda_bar_LT ** 2));
      // χ_LT ≤ 1.0 and χ_LT ≤ 1/λ̄²_LT
      return Math.min(1, Math.min(val, 1 / lambda_bar_LT ** 2));
    },
    M_b_Rd: ({ chi_LT, Wpl_y, fy, gamma_M1 }) =>
      (chi_LT * Wpl_y * fy) / gamma_M1,
    ltb_check: ({ M_y_Ed, M_b_Rd }) =>
      Math.abs(M_y_Ed) / M_b_Rd,
  },
};
