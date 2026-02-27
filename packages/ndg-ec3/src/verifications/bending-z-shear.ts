import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.8 -- Bending and shear (z-axis).
 * When V_y_Ed > 0.5·V_pl,y,Rd the reduced moment resistance applies.
 * Per §6.2.8(3): compute resistance using reduced yield strength (1-ρ)·f_y
 * for the shear area (A_v,y = flanges for I-sections).
 *
 * For I-sections bending about z-z, the flanges carry V_y.
 * Their contribution to W_pl,z is: W_pl,z,f = W_pl,z − t_w²·h_w/4
 *                                             = W_pl,z − A_v,z·t_w/4
 * Applying (1-ρ)·f_y to the flanges:
 *   M_z,V,Rd = [W_pl,z − ρ·W_pl,z,f]·f_y/γ_M0
 *            = [W_pl,z − ρ·(W_pl,z − A_v,z·t_w/4)]·f_y/γ_M0
 */

const p = "bending-z-shear";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "V_y_Ed", "Design shear force in y", { symbol: "V_{y,Ed}", unit: "N" }),
  input(p, "Wpl_z", "Plastic section modulus about z-z", { symbol: "W_{pl,z}", unit: "mm³" }),
  input(p, "Av_y", "Shear area in y (flanges)", { symbol: "A_{v,y}", unit: "mm²" }),
  input(p, "Av_z", "Shear area in z (≈ A_w = h_w t_w)", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance in y", ["Av_y", "fy", "gamma_M0"], {
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "rho_y", "Shear reduction factor", ["V_y_Ed", "V_pl_y_Rd"], {
    symbol: "\\rho",
    expression: "\\left(\\frac{2 V_{y,Ed}}{V_{pl,y,Rd}} - 1\\right)^2",
  }),
  derived(p, "Wpl_z_web", "Web contribution to plastic modulus about z-z", ["Av_z", "tw"], {
    symbol: "W_{pl,z,web}",
    expression: "\\frac{t_w^2 h_w}{4} = \\frac{A_{v,z} t_w}{4}",
    unit: "mm³",
  }),
  formula(p, "M_z_V_Rd", "Reduced plastic resistance moment about z-z allowing for shear", ["Wpl_z", "rho_y", "Wpl_z_web", "fy", "gamma_M0"], {
    symbol: "M_{z,V,Rd}",
    expression: "\\frac{\\bigl[W_{pl,z} - \\rho\\,(W_{pl,z} - W_{pl,z,web})\\bigr] f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.2.8(3))" },
  }),
  check(p, "bending_z_shear_check", "Bending and shear check (z-axis) §6.2.8", ["M_z_Ed", "M_z_V_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{z,V,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
  }),
] as const;

export const ulsBendingZShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    rho_y: ({ V_y_Ed, V_pl_y_Rd }) => {
      const ratio = Math.abs(V_y_Ed) / V_pl_y_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    // Web contribution to W_pl,z: t_w²·h_w/4 = A_v,z·t_w/4 (using A_v,z ≈ h_w·t_w)
    Wpl_z_web: ({ Av_z, tw }) => (Av_z * tw) / 4,
    // §6.2.8(3): apply (1-ρ)·f_y to shear area (flanges).
    // W_pl,z,flanges = W_pl,z − W_pl,z,web
    // M_z,V,Rd = [W_pl,z − ρ·W_pl,z,flanges]·f_y/γ_M0
    M_z_V_Rd: ({ Wpl_z, rho_y, Wpl_z_web, fy, gamma_M0 }) =>
      ((Wpl_z - rho_y * (Wpl_z - Wpl_z_web)) * fy) / gamma_M0,
    bending_z_shear_check: ({ M_z_Ed, M_z_V_Rd }) =>
      Math.abs(M_z_Ed) / M_z_V_Rd,
  },
};
