import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.9.1 -- Bending about z-z and axial force (Class 1 & 2 I-sections).
 * M_z_Ed / M_N_z_Rd ≤ 1.0
 * M_N_z_Rd depends on n and a_f = min((A-2btf)/A, 0.5)
 */

const p = "bending-z-axial";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "Wpl_z", "Plastic section modulus about z-z", { symbol: "W_{pl,z}", unit: "mm³" }),
  input(p, "Av_z", "Web area", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_pl_Rd", "Plastic resistance", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  formula(p, "M_pl_z_Rd", "Plastic bending resistance about z-z", ["Wpl_z", "fy", "gamma_M0"], {
    symbol: "M_{pl,z,Rd}",
    expression: "\\frac{W_{pl,z} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "n", "Axial force ratio", ["N_Ed", "N_pl_Rd"], {
    symbol: "n",
  }),
  derived(p, "a_f", "Web area ratio a=(A-2bt_f)/A ≈ A_v,z/A", ["Av_z", "A"], {
    symbol: "a",
  }),
  formula(p, "M_N_z_Rd", "Reduced bending resistance about z-z (axial)", ["M_pl_z_Rd", "n", "a_f"], {
    symbol: "M_{N,z,Rd}",
    expression: "M_{pl,z,Rd} \\cdot \\left(1 - \\left(\\frac{n-a}{1-a}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
  }),
  check(p, "bending_z_axial_check", "Bending about z-z and axial force check", ["M_z_Ed", "M_N_z_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{N,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.31)" },
  }),
] as const;

export const ulsBendingZAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    M_pl_z_Rd: ({ Wpl_z, fy, gamma_M0 }) => (Wpl_z * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_f: ({ Av_z, A }) => {
      // EC3 §6.2.9.1(5): a = (A - 2·b·tf) / A ≈ A_v,z / A (web fraction), capped at 0.5
      return Math.min(Av_z / A, 0.5);
    },
    M_N_z_Rd: ({ M_pl_z_Rd, n, a_f }) => {
      if (n <= a_f) return M_pl_z_Rd; // no reduction needed
      return M_pl_z_Rd * (1 - ((n - a_f) / (1 - a_f)) ** 2);
    },
    bending_z_axial_check: ({ M_z_Ed, M_N_z_Rd }) =>
      Math.abs(M_z_Ed) / M_N_z_Rd,
  },
};
