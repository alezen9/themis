import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/** §6.3.1 — Flexural buckling about z-z: N_Ed / N_b_z_Rd ≤ 1.0 */

const p = "bz";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "Iz", "Second moment of area z-z", { unit: "mm⁴" }),
  input(p, "Lcr_z", "Buckling length about z-z", { symbol: "L_{cr,z}", unit: "mm" }),
  input(p, "alpha_z", "Imperfection factor z-z", { symbol: "\\alpha_z" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  formula(p, "N_cr_z", "Elastic critical force z-z", ["E", "Iz", "Lcr_z"], {
    symbol: "N_{cr,z}",
    expression: "\\frac{\\pi^2 E I_z}{L_{cr,z}^2}",
    unit: "N",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
  }),
  derived(p, "lambda_bar_z", "Non-dimensional slenderness z-z", ["A", "fy", "N_cr_z"], {
    symbol: "\\bar{\\lambda}_z",
  }),
  derived(p, "phi_z", "Buckling parameter z-z", ["alpha_z", "lambda_bar_z"], {
    symbol: "\\Phi_z",
  }),
  formula(p, "chi_z", "Reduction factor z-z", ["phi_z", "lambda_bar_z"], {
    symbol: "\\chi_z",
    expression: "\\frac{1}{\\Phi_z + \\sqrt{\\Phi_z^2 - \\bar{\\lambda}_z^2}}",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
  }),
  formula(p, "N_b_z_Rd", "Buckling resistance z-z", ["chi_z", "A", "fy", "gamma_M1"], {
    symbol: "N_{b,z,Rd}",
    expression: "\\frac{\\chi_z A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.1", formulaRef: "(6.47)" },
  }),
  check(p, "buckling_z_check", "Flexural buckling check z-z", ["N_Ed", "N_b_z_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{b,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.1", verificationRef: "(6.46)" },
  }),
] as const;

export const ulsBucklingZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_cr_z: ({ E, Iz, Lcr_z }) =>
      (Math.PI ** 2 * E * Iz) / Lcr_z ** 2,
    lambda_bar_z: ({ A, fy, N_cr_z }) =>
      Math.sqrt((A * fy) / N_cr_z),
    phi_z: ({ alpha_z, lambda_bar_z }) =>
      0.5 * (1 + alpha_z * (lambda_bar_z - 0.2) + lambda_bar_z ** 2),
    chi_z: ({ phi_z, lambda_bar_z }) =>
      Math.min(1, 1 / (phi_z + Math.sqrt(phi_z ** 2 - lambda_bar_z ** 2))),
    N_b_z_Rd: ({ chi_z, A, fy, gamma_M1 }) =>
      (chi_z * A * fy) / gamma_M1,
    buckling_z_check: ({ N_Ed, N_b_z_Rd }) =>
      Math.abs(N_Ed) / N_b_z_Rd,
  },
};
