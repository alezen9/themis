import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, check } from "@ndg/ndg-core";

/** §6.2.3 -- Tension resistance: N_Ed / N_pl_Rd ≤ 1.0 */

const p = "tension";

const nodes = [
  input(p, "N_Ed", "Design tensile force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_pl_Rd", "Design plastic resistance to normal forces", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.3", formulaRef: "(6.6)" },
  }),
  check(p, "tension_check", "Tension resistance check", ["N_Ed", "N_pl_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.3", verificationRef: "(6.5)" },
  }),
] as const;

export const ulsTension: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    tension_check: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
  },
};
