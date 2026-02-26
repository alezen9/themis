import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.10 — Bending about y-y, axial force, and shear.
 * Uses reduced yield strength for shear interaction + axial reduction.
 */

const p = "byas";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "V_z_Ed", "Design shear force in z", { symbol: "V_{z,Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "Av_z", "Shear area z", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance", ["Av_z", "fy", "gamma_M0"], {
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "rho_z", "Shear interaction factor", ["V_z_Ed", "V_pl_z_Rd"], {
    symbol: "\\rho",
  }),
  formula(p, "N_pl_Rd", "Plastic resistance", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "n", "Axial force ratio", ["N_Ed", "N_pl_Rd"]),
  derived(p, "a_w", "Web area ratio", ["Av_z", "A"]),
  formula(p, "M_NV_y_Rd", "Reduced bending resistance (axial + shear)", ["Wpl_y", "rho_z", "fy", "gamma_M0", "n", "a_w"], {
    symbol: "M_{NV,y,Rd}",
    expression: "W_{pl,y}(1-\\rho) f_y (1-n)/(1-0.5a) / \\gamma_{M0}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.2.10)" },
  }),
  check(p, "bending_y_axial_shear_check", "Bending y + axial + shear check", ["M_y_Ed", "M_NV_y_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{NV,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.10" },
  }),
] as const;

export const ulsBendingYAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    rho_z: ({ V_z_Ed, V_pl_z_Rd }) => {
      const ratio = Math.abs(V_z_Ed) / V_pl_z_Rd;
      if (ratio <= 0.5) return 0;
      return (2 * ratio - 1) ** 2;
    },
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    M_NV_y_Rd: ({ Wpl_y, rho_z, fy, gamma_M0, n, a_w }) => {
      const Wpl_red = Wpl_y * (1 - rho_z);
      const axial_red = Math.min(1, (1 - n) / (1 - 0.5 * a_w));
      return (Wpl_red * fy * axial_red) / gamma_M0;
    },
    bending_y_axial_shear_check: ({ M_y_Ed, M_NV_y_Rd }) =>
      Math.abs(M_y_Ed) / M_NV_y_Rd,
  },
};
