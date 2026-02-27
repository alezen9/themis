import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, check } from "@ndg/ndg-core";

/** §6.2.6 -- Shear resistance (y-axis): V_y_Ed / V_pl_y_Rd ≤ 1.0 */

const p = "shear-y";

const nodes = [
  input(p, "V_y_Ed", "Design shear force in y", { symbol: "V_{y,Ed}", unit: "N" }),
  input(p, "Av_y", "Shear area in y", { symbol: "A_{v,y}", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance in y", ["Av_y", "fy", "gamma_M0"], {
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  check(p, "shear_y_check", "Shear resistance check (y-axis)", ["V_y_Ed", "V_pl_y_Rd"], {
    verificationExpression: "\\frac{V_{y,Ed}}{V_{pl,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
  }),
] as const;

export const ulsShearY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    shear_y_check: ({ V_y_Ed, V_pl_y_Rd }) =>
      Math.abs(V_y_Ed) / V_pl_y_Rd,
  },
};
