import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.9.1 -- Bending about z-z and axial force (Class 1 & 2 I-sections).
 * M_z_Ed / M_N_z_Rd ≤ 1.0
 * M_N_z_Rd depends on n and a_f = min((A-2btf)/A, 0.5)
 */

const p = "bending-z-axial";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "Wel_z", "Elastic section modulus about z-z", { symbol: "W_{el,z}", unit: "mm³" }),
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
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_z_res", "Class-dependent section modulus for z bending", ["section_class", "Wpl_z", "Wel_z"], {
    expression: "c=3?W_{el,z}:W_{pl,z}",
  }),
  derived(p, "M_pl_z_num", "Numerator of M_pl,z,Rd", ["W_z_res", "fy"], {
    expression: "W_{res,z}f_y",
    unit: "N·mm",
  }),
  formula(p, "M_pl_z_Rd", "Plastic bending resistance about z-z", ["class_guard", "M_pl_z_num", "gamma_M0"], {
    symbol: "M_{pl,z,Rd}",
    expression: "\\frac{W_{res,z} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "n", "Axial force ratio", ["abs_N_Ed", "N_pl_Rd"], {
    symbol: "n",
  }),
  derived(p, "a_f_raw", "Raw web area ratio", ["Av_z", "A"], {
    expression: "A_{v,z}/A",
  }),
  derived(p, "a_f", "Web area ratio a=(A-2bt_f)/A ≈ A_v,z/A", ["a_f_raw"], {
    symbol: "a",
    expression: "\\min\\left(A_{v,z}/A,0.5\\right)",
  }),
  derived(p, "n_minus_af", "Difference n-a", ["n", "a_f"], {
    expression: "n-a",
  }),
  derived(p, "one_minus_af", "Difference 1-a", ["a_f"], {
    expression: "1-a",
  }),
  derived(p, "axial_ratio", "Axial ratio for z-bending reduction", ["n_minus_af", "one_minus_af"], {
    expression: "\\frac{n-a}{1-a}",
  }),
  derived(p, "axial_ratio_sq", "Squared axial ratio", ["axial_ratio"], {
    expression: "\\left(\\frac{n-a}{1-a}\\right)^2",
  }),
  derived(p, "axial_factor", "Axial reduction factor for z-bending", ["n", "a_f", "axial_ratio_sq"], {
    expression: "n\\le a ? 1 : \\left(1-\\left(\\frac{n-a}{1-a}\\right)^2\\right)",
  }),
  formula(p, "M_N_z_Rd", "Reduced bending resistance about z-z (axial)", ["M_pl_z_Rd", "axial_factor"], {
    symbol: "M_{N,z,Rd}",
    expression: "M_{pl,z,Rd} \\cdot \\left(1 - \\left(\\frac{n-a}{1-a}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
  }),
  derived(p, "abs_M_z_Ed", "Absolute design bending moment", ["M_z_Ed"], {
    expression: "\\left|M_{z,Ed}\\right|",
    unit: "N·mm",
  }),
  check(p, "bending_z_axial_check", "Bending about z-z and axial force check", ["abs_M_z_Ed", "M_N_z_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{N,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.31)" },
  }),
] as const;

export const ulsBendingZAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.abs(N_Ed),
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-z-axial: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.9.1",
        });
      }
      return 1;
    },
    W_z_res: ({ section_class, Wpl_z, Wel_z }) => (section_class === 3 ? Wel_z : Wpl_z),
    M_pl_z_num: ({ W_z_res, fy }) => W_z_res * fy,
    M_pl_z_Rd: ({ class_guard, M_pl_z_num, gamma_M0 }) => class_guard * (M_pl_z_num / gamma_M0),
    n: ({ abs_N_Ed, N_pl_Rd }) => abs_N_Ed / N_pl_Rd,
    a_f_raw: ({ Av_z, A }) => Av_z / A,
    a_f: ({ a_f_raw }) => Math.min(a_f_raw, 0.5),
    n_minus_af: ({ n, a_f }) => n - a_f,
    one_minus_af: ({ a_f }) => 1 - a_f,
    axial_ratio: ({ n_minus_af, one_minus_af }) => n_minus_af / one_minus_af,
    axial_ratio_sq: ({ axial_ratio }) => axial_ratio ** 2,
    axial_factor: ({ n, a_f, axial_ratio_sq }) => (n <= a_f ? 1 : 1 - axial_ratio_sq),
    M_N_z_Rd: ({ M_pl_z_Rd, axial_factor }) => M_pl_z_Rd * axial_factor,
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    bending_z_axial_check: ({ abs_M_z_Ed, M_N_z_Rd }) => abs_M_z_Ed / M_N_z_Rd,
  },
};
