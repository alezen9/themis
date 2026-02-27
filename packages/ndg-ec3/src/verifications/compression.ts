import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, check } from "@ndg/ndg-core";

/** §6.2.4 -- Compression resistance: N_Ed / N_c_Rd ≤ 1.0 */

const p = "compression";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_c_Rd", "Design resistance to normal forces", ["A", "fy", "gamma_M0"], {
    symbol: "N_{c,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.11)" },
  }),
  check(p, "compression_check", "Cross-section compression resistance", ["N_Ed", "N_c_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.4", verificationRef: "(6.10)" },
  }),
] as const;

export const ulsCompression: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_c_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    compression_check: ({ N_Ed, N_c_Rd }) => Math.abs(N_Ed) / N_c_Rd,
  },
};
