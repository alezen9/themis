import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.3.1 -- Flexural buckling about y-y: N_Ed / N_b_y_Rd ≤ 1.0
 * χ_y from §6.3.1.2 using buckling curve imperfection factor.
 */

const p = "buckling-y";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "Iy", "Second moment of area y-y", { unit: "mm⁴" }),
  input(p, "Lcr_y", "Buckling length about y-y", { symbol: "L_{cr,y}", unit: "mm" }),
  input(p, "alpha_y", "Imperfection factor y-y", { symbol: "\\alpha_y" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  derived(p, "N_cr_y", "Elastic critical force y-y", ["E", "Iy", "Lcr_y"], {
    symbol: "N_{cr,y}",
    expression: "\\frac{\\pi^2 E I_y}{L_{cr,y}^2}",
    unit: "N",
    meta: { sectionRef: "6.3.1.2" },
  }),
  derived(p, "lambda_bar_y", "Non-dimensional slenderness y-y", ["A", "fy", "N_cr_y"], {
    symbol: "\\bar{\\lambda}_y",
    expression: "\\sqrt{A f_y / N_{cr,y}}",
  }),
  derived(p, "phi_y", "Buckling parameter y-y", ["alpha_y", "lambda_bar_y"], {
    symbol: "\\Phi_y",
    expression: "0.5(1 + \\alpha(\\bar{\\lambda}-0.2) + \\bar{\\lambda}^2)",
  }),
  formula(p, "chi_y", "Reduction factor y-y", ["phi_y", "lambda_bar_y"], {
    symbol: "\\chi_y",
    expression: "\\frac{1}{\\Phi_y + \\sqrt{\\Phi_y^2 - \\bar{\\lambda}_y^2}}",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
  }),
  formula(p, "N_b_y_Rd", "Buckling resistance y-y", ["chi_y", "A", "fy", "gamma_M1"], {
    symbol: "N_{b,y,Rd}",
    expression: "\\frac{\\chi_y A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.1", formulaRef: "(6.47)" },
  }),
  check(p, "buckling_y_check", "Flexural buckling check y-y", ["N_Ed", "N_b_y_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{b,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.1", verificationRef: "(6.46)" },
  }),
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
