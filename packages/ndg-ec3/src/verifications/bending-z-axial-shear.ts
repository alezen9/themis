import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.10 -- Bending about z-z, axial force, and shear.
 */

const p = "bending-z-axial-shear";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { unit: "N" }),
  input(p, "V_y_Ed", "Design shear force in y", { unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wpl_z", "Plastic section modulus z-z", { unit: "mm³" }),
  input(p, "Av_y", "Shear area y", { unit: "mm²" }),
  input(p, "Av_z", "Shear area z (web area)", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance y", ["Av_y", "fy", "gamma_M0"], {
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "rho_y", "Shear interaction factor", ["V_y_Ed", "V_pl_y_Rd"]),
  formula(p, "N_pl_Rd", "Plastic resistance", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "n", "Axial force ratio", ["N_Ed", "N_pl_Rd"]),
  derived(p, "a_f", "Flange area ratio", ["Av_z", "A"]),
  formula(p, "M_NV_z_Rd", "Reduced bending resistance z-z (axial + shear)", ["Wpl_z", "rho_y", "fy", "gamma_M0", "n", "a_f"], {
    symbol: "M_{NV,z,Rd}",
    expression: "W_{pl,z}(1-\\rho_y) f_y (1-((n-a_f)/(1-a_f))^2) / \\gamma_{M0}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.2.10)" },
  }),
  check(p, "bending_z_axial_shear_check", "Bending z + axial + shear check", ["M_z_Ed", "M_NV_z_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{NV,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.10" },
  }),
] as const;

export const ulsBendingZAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    rho_y: ({ V_y_Ed, V_pl_y_Rd }) => {
      const ratio = Math.abs(V_y_Ed) / V_pl_y_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_f: ({ Av_z, A }) => Math.min((A - Av_z) / A, 0.5),
    M_NV_z_Rd: ({ Wpl_z, rho_y, fy, gamma_M0, n, a_f }) => {
      const Wpl_red = Wpl_z * (1 - rho_y);
      const MplRd = (Wpl_red * fy) / gamma_M0;
      if (n <= a_f) return MplRd;
      return MplRd * (1 - ((n - a_f) / (1 - a_f)) ** 2);
    },
    bending_z_axial_shear_check: ({ M_z_Ed, M_NV_z_Rd }) =>
      Math.abs(M_z_Ed) / M_NV_z_Rd,
  },
};
