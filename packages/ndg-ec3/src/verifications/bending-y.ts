import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, check } from "@ndg/ndg-core";

/** §6.2.5 -- Bending resistance about y-y: M_y_Ed / M_c_y_Rd ≤ 1.0 */

const p = "bending-y";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "Wpl_y", "Plastic section modulus about y-y", { symbol: "W_{pl,y}", unit: "mm³" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "M_c_y_Rd", "Design resistance for bending about y-y", ["Wpl_y", "fy", "gamma_M0"], {
    symbol: "M_{c,y,Rd}",
    expression: "\\frac{W_{pl,y} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  check(p, "bending_y_check", "Bending resistance about y-y check", ["M_y_Ed", "M_c_y_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{c,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
  }),
] as const;

export const ulsBendingY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    M_c_y_Rd: ({ Wpl_y, fy, gamma_M0 }) => (Wpl_y * fy) / gamma_M0,
    bending_y_check: ({ M_y_Ed, M_c_y_Rd }) => Math.abs(M_y_Ed) / M_c_y_Rd,
  },
};
