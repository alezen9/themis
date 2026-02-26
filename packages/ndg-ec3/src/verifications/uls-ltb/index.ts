import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.3.2.3 — Lateral-torsional buckling (specific method).
 * M_y_Ed / M_b_Rd ≤ 1.0
 * Uses NDP parameters λ_LT,0 and β from national annex.
 */

const p = "ltb";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "M_cr", "Elastic critical moment for LTB", { symbol: "M_{cr}", unit: "N·mm" }),
  input(p, "alpha_LT", "LTB imperfection factor", { symbol: "\\alpha_{LT}" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  coeff(p, "lambda_LT_0", "Plateau length of LTB curves", { sectionRef: "6.3.2.3" }, { symbol: "\\bar{\\lambda}_{LT,0}" }),
  coeff(p, "beta_LT", "LTB curve parameter", { sectionRef: "6.3.2.3" }, { symbol: "\\beta" }),
  derived(p, "lambda_bar_LT", "Non-dimensional slenderness for LTB", ["Wpl_y", "fy", "M_cr"], {
    symbol: "\\bar{\\lambda}_{LT}",
    expression: "\\sqrt{W_{pl,y} f_y / M_{cr}}",
  }),
  derived(p, "phi_LT", "LTB parameter", ["alpha_LT", "lambda_bar_LT", "lambda_LT_0", "beta_LT"], {
    symbol: "\\Phi_{LT}",
    expression: "0.5(1 + \\alpha_{LT}(\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0}) + \\beta \\bar{\\lambda}_{LT}^2)",
  }),
  formula(p, "chi_LT", "LTB reduction factor", ["phi_LT", "lambda_bar_LT", "beta_LT"], {
    symbol: "\\chi_{LT}",
    expression: "\\frac{1}{\\Phi_{LT} + \\sqrt{\\Phi_{LT}^2 - \\beta \\bar{\\lambda}_{LT}^2}}",
    meta: { sectionRef: "6.3.2.3", formulaRef: "(6.57)" },
  }),
  formula(p, "M_b_Rd", "LTB resistance", ["chi_LT", "Wpl_y", "fy", "gamma_M1"], {
    symbol: "M_{b,Rd}",
    expression: "\\frac{\\chi_{LT} W_{pl,y} f_y}{\\gamma_{M1}}",
    unit: "N·mm",
    meta: { sectionRef: "6.3.2.1", formulaRef: "(6.55)" },
  }),
  check(p, "ltb_check", "Lateral-torsional buckling check", ["M_y_Ed", "M_b_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{b,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.2.1", verificationRef: "(6.54)" },
  }),
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
