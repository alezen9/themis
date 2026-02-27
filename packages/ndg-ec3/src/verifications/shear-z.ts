import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, check } from "@ndg/ndg-core";

/** §6.2.6 -- Shear resistance (z-axis): V_z_Ed / V_pl_z_Rd ≤ 1.0 */

const p = "shear-z";

const nodes = [
  input(p, "V_z_Ed", "Design shear force in z", { symbol: "V_{z,Ed}", unit: "N" }),
  input(p, "Av_z", "Shear area in z", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance in z", ["Av_z", "fy", "gamma_M0"], {
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  check(p, "shear_z_check", "Shear resistance check (z-axis)", ["V_z_Ed", "V_pl_z_Rd"], {
    verificationExpression: "\\frac{V_{z,Ed}}{V_{pl,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
  }),
] as const;

export const ulsShearZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    shear_z_check: ({ V_z_Ed, V_pl_z_Rd }) =>
      Math.abs(V_z_Ed) / V_pl_z_Rd,
  },
};
