import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.9.1 -- Bending about y-y and axial force (Class 1 & 2 I-sections).
 * M_y_Ed / M_N_y_Rd ≤ 1.0
 * M_N_y_Rd = M_pl_y_Rd · min(1, (1 - n) / (1 - 0.5a))
 * where n = N_Ed / N_pl_Rd, a = min(A_w/A, 0.5)
 */

const p = "bending-y-axial";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "Wel_y", "Elastic section modulus about y-y", { symbol: "W_{el,y}", unit: "mm³" }),
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
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_y_res", "Class-dependent section modulus for y bending", ["section_class", "Wpl_y", "Wel_y"], {
    expression: "c=3?W_{el,y}:W_{pl,y}",
  }),
  derived(p, "M_pl_y_num", "Numerator of M_pl,y,Rd", ["W_y_res", "fy"], {
    expression: "W_{res,y}f_y",
    unit: "N·mm",
  }),
  formula(p, "M_pl_y_Rd", "Plastic bending resistance about y-y", ["class_guard", "M_pl_y_num", "gamma_M0"], {
    symbol: "M_{pl,y,Rd}",
    expression: "\\frac{W_{res,y} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "n", "Axial force ratio", ["abs_N_Ed", "N_pl_Rd"], {
    symbol: "n",
    expression: "N_{Ed} / N_{pl,Rd}",
  }),
  derived(p, "a_w_raw", "Raw web area ratio", ["Av_z", "A"], {
    expression: "A_w/A",
  }),
  derived(p, "a_w", "Web area ratio", ["a_w_raw"], {
    symbol: "a",
    expression: "\\min(A_w / A, 0.5)",
  }),
  derived(p, "axial_num", "Numerator of axial reduction ratio", ["n"], {
    expression: "1-n",
  }),
  derived(p, "axial_den", "Denominator of axial reduction ratio", ["a_w"], {
    expression: "1-0.5a",
  }),
  derived(p, "axial_ratio", "Axial reduction ratio", ["axial_num", "axial_den"], {
    expression: "\\frac{1-n}{1-0.5a}",
  }),
  derived(p, "axial_factor", "Axial reduction factor", ["axial_ratio"], {
    expression: "\\min\\left(1,\\frac{1-n}{1-0.5a}\\right)",
  }),
  formula(p, "M_N_y_Rd", "Reduced bending resistance about y-y (axial)", ["M_pl_y_Rd", "axial_factor"], {
    symbol: "M_{N,y,Rd}",
    expression: "M_{pl,y,Rd} \\cdot \\min\\left(1, \\frac{1-n}{1-0.5a}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
  }),
  derived(p, "abs_M_y_Ed", "Absolute design bending moment", ["M_y_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|",
    unit: "N·mm",
  }),
  check(p, "bending_y_axial_check", "Bending about y-y and axial force check", ["abs_M_y_Ed", "M_N_y_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{N,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.31)" },
  }),
] as const;

export const ulsBendingYAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.abs(N_Ed),
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-y-axial: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.9.1",
        });
      }
      return 1;
    },
    W_y_res: ({ section_class, Wpl_y, Wel_y }) => (section_class === 3 ? Wel_y : Wpl_y),
    M_pl_y_num: ({ W_y_res, fy }) => W_y_res * fy,
    M_pl_y_Rd: ({ class_guard, M_pl_y_num, gamma_M0 }) => class_guard * (M_pl_y_num / gamma_M0),
    n: ({ abs_N_Ed, N_pl_Rd }) => abs_N_Ed / N_pl_Rd,
    a_w_raw: ({ Av_z, A }) => Av_z / A,
    a_w: ({ a_w_raw }) => Math.min(a_w_raw, 0.5),
    axial_num: ({ n }) => 1 - n,
    axial_den: ({ a_w }) => 1 - 0.5 * a_w,
    axial_ratio: ({ axial_num, axial_den }) => axial_num / axial_den,
    axial_factor: ({ axial_ratio }) => Math.min(1, axial_ratio),
    M_N_y_Rd: ({ M_pl_y_Rd, axial_factor }) => M_pl_y_Rd * axial_factor,
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    bending_y_axial_check: ({ abs_M_y_Ed, M_N_y_Rd }) => abs_M_y_Ed / M_N_y_Rd,
  },
};
