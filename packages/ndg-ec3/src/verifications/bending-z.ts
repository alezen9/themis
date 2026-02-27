import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, check } from "@ndg/ndg-core";

/** §6.2.5 -- Bending resistance about z-z: M_z_Ed / M_c_z_Rd ≤ 1.0 */

const p = "bending-z";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "Wpl_z", "Plastic section modulus about z-z", { symbol: "W_{pl,z}", unit: "mm³" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "M_c_z_Rd", "Design resistance for bending about z-z", ["Wpl_z", "fy", "gamma_M0"], {
    symbol: "M_{c,z,Rd}",
    expression: "\\frac{W_{pl,z} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  check(p, "bending_z_check", "Bending resistance about z-z check", ["M_z_Ed", "M_c_z_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{c,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
  }),
] as const;

export const ulsBendingZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    M_c_z_Rd: ({ Wpl_z, fy, gamma_M0 }) => (Wpl_z * fy) / gamma_M0,
    bending_z_check: ({ M_z_Ed, M_c_z_Rd }) => Math.abs(M_z_Ed) / M_c_z_Rd,
  },
};
