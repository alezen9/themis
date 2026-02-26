import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.9.1 — Bending about y-y and axial force (Class 1 & 2 I-sections).
 * M_y_Ed / M_N_y_Rd ≤ 1.0
 * M_N_y_Rd = M_pl_y_Rd · min(1, (1 - n) / (1 - 0.5a))
 * where n = N_Ed / N_pl_Rd, a = min(A_w/A, 0.5)
 */

const p = "bya";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "Wpl_y", "Plastic section modulus about y-y", { symbol: "W_{pl,y}", unit: "mm³" }),
  input(p, "Av_z", "Web area (shear area z)", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_pl_Rd", "Plastic resistance to normal forces", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  formula(p, "M_pl_y_Rd", "Plastic bending resistance about y-y", ["Wpl_y", "fy", "gamma_M0"], {
    symbol: "M_{pl,y,Rd}",
    expression: "\\frac{W_{pl,y} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "n", "Axial force ratio", ["N_Ed", "N_pl_Rd"], {
    symbol: "n",
    expression: "N_{Ed} / N_{pl,Rd}",
  }),
  derived(p, "a_w", "Web area ratio", ["Av_z", "A"], {
    symbol: "a",
    expression: "\\min(A_w / A, 0.5)",
  }),
  formula(p, "M_N_y_Rd", "Reduced bending resistance about y-y (axial)", ["M_pl_y_Rd", "n", "a_w"], {
    symbol: "M_{N,y,Rd}",
    expression: "M_{pl,y,Rd} \\cdot \\min\\left(1, \\frac{1-n}{1-0.5a}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
  }),
  check(p, "bending_y_axial_check", "Bending about y-y and axial force check", ["M_y_Ed", "M_N_y_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{N,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.31)" },
  }),
] as const;

export const ulsBendingYAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    M_pl_y_Rd: ({ Wpl_y, fy, gamma_M0 }) => (Wpl_y * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    M_N_y_Rd: ({ M_pl_y_Rd, n, a_w }) =>
      M_pl_y_Rd * Math.min(1, (1 - n) / (1 - 0.5 * a_w)),
    bending_y_axial_check: ({ M_y_Ed, M_N_y_Rd }) =>
      Math.abs(M_y_Ed) / M_N_y_Rd,
  },
};
