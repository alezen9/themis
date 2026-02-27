import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.8 -- Bending and shear (y-axis).
 * When V_z_Ed > 0.5·V_pl,z,Rd, reduced bending resistance M_y,V,Rd applies
 * per §6.2.8(5) eq (6.30) for I-sections with equal flanges.
 * Otherwise M_y,V,Rd = M_c,y,Rd (no reduction, §6.2.8(2)).
 */

const p = "bending-y-shear";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "V_z_Ed", "Design shear force in z", { symbol: "V_{z,Ed}", unit: "N" }),
  input(p, "Wpl_y", "Plastic section modulus about y-y", { symbol: "W_{pl,y}", unit: "mm³" }),
  input(p, "Av_z", "Shear area in z (≈ A_w = h_w t_w)", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance in z", ["Av_z", "fy", "gamma_M0"], {
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "rho_z", "Shear reduction factor", ["V_z_Ed", "V_pl_z_Rd"], {
    symbol: "\\rho",
    expression: "\\left(\\frac{2 V_{z,Ed}}{V_{pl,z,Rd}} - 1\\right)^2",
  }),
  formula(p, "M_y_V_Rd", "Reduced plastic resistance moment about y-y allowing for shear", ["Wpl_y", "rho_z", "Av_z", "tw", "fy", "gamma_M0"], {
    symbol: "M_{y,V,Rd}",
    expression: "\\frac{\\left(W_{pl,y} - \\rho \\dfrac{A_{v,z}^2}{4 t_w}\\right) f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.30)" },
  }),
  check(p, "bending_y_shear_check", "Bending and shear check (y-axis) §6.2.8", ["M_y_Ed", "M_y_V_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{y,V,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
  }),
] as const;

export const ulsBendingYShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    rho_z: ({ V_z_Ed, V_pl_z_Rd }) => {
      const ratio = Math.abs(V_z_Ed) / V_pl_z_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    // §6.2.8(5) eq (6.30): for I-sections with equal flanges, bending about major axis.
    // A_w = h_w·t_w ≈ A_v,z, so A_w²/(4t_w) = A_v,z²/(4t_w).
    M_y_V_Rd: ({ Wpl_y, rho_z, Av_z, tw, fy, gamma_M0 }) =>
      ((Wpl_y - rho_z * Av_z ** 2 / (4 * tw)) * fy) / gamma_M0,
    bending_y_shear_check: ({ M_y_Ed, M_y_V_Rd }) =>
      Math.abs(M_y_Ed) / M_y_V_Rd,
  },
};
