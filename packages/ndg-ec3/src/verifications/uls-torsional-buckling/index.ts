import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.3.1.4 — Torsional and torsional-flexural buckling.
 * N_Ed / N_b_TF_Rd ≤ 1.0
 * Uses the minimum of N_cr_y, N_cr_z, N_cr_TF.
 * CHS: N_cr_TF is very large → check trivially passes (ratio ≈ 0).
 */

const p = "tb";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "G", "Shear modulus", { unit: "MPa" }),
  input(p, "Iy", "Second moment of area y-y", { unit: "mm⁴" }),
  input(p, "Iz", "Second moment of area z-z", { unit: "mm⁴" }),
  input(p, "It", "St. Venant torsion constant", { unit: "mm⁴" }),
  input(p, "Iw", "Warping constant", { unit: "mm⁶" }),
  input(p, "Lcr_y", "Buckling length y-y", { unit: "mm" }),
  input(p, "Lcr_z", "Buckling length z-z", { unit: "mm" }),
  input(p, "Lcr_T", "Torsional buckling length", { symbol: "L_{cr,T}", unit: "mm" }),
  input(p, "alpha_z", "Imperfection factor (weaker axis governs)", { symbol: "\\alpha" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  formula(p, "N_cr_TF", "Elastic torsional-flexural critical force", ["E", "G", "Iy", "Iz", "It", "Iw", "Lcr_T", "A"], {
    symbol: "N_{cr,TF}",
    expression: "\\frac{1}{i_p^2}(G I_t + \\frac{\\pi^2 E I_w}{L_{cr,T}^2})",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", formulaRef: "(6.3.1.4)" },
  }),
  derived(p, "lambda_bar_TF", "Non-dimensional slenderness (torsional-flexural)", ["A", "fy", "N_cr_TF"], {
    symbol: "\\bar{\\lambda}_{TF}",
  }),
  derived(p, "phi_TF", "Buckling parameter (torsional-flexural)", ["alpha_z", "lambda_bar_TF"], {
    symbol: "\\Phi_{TF}",
  }),
  formula(p, "chi_TF", "Reduction factor (torsional-flexural)", ["phi_TF", "lambda_bar_TF"], {
    symbol: "\\chi_{TF}",
    expression: "\\frac{1}{\\Phi_{TF} + \\sqrt{\\Phi_{TF}^2 - \\bar{\\lambda}_{TF}^2}}",
    meta: { sectionRef: "6.3.1.4", formulaRef: "(6.49)" },
  }),
  formula(p, "N_b_TF_Rd", "Torsional-flexural buckling resistance", ["chi_TF", "A", "fy", "gamma_M1"], {
    symbol: "N_{b,TF,Rd}",
    expression: "\\frac{\\chi_{TF} A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", formulaRef: "(6.47)" },
  }),
  check(p, "torsional_buckling_check", "Torsional-flexural buckling check", ["N_Ed", "N_b_TF_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{b,TF,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.4", verificationRef: "(6.46)" },
  }),
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
