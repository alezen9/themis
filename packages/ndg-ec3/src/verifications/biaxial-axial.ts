import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.9.1(6) -- Biaxial bending and axial force, eq (6.41).
 * (M_y_Ed / M_N_y_Rd)^alpha + (M_z_Ed / M_N_z_Rd)^beta <= 1.0
 *
 * Exponents per §6.2.9.1(6):
 *   I/H sections:  alpha = 2,  beta = max(1, 5n)
 *   CHS:           alpha = 2,  beta = 2
 *   RHS:           alpha = beta = 1.66/(1 - 1.13n^2)  but <= 6
 */

const p = "biaxial";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wel_y", "Elastic section modulus y-y", { unit: "mm³" }),
  input(p, "Wel_z", "Elastic section modulus z-z", { unit: "mm³" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic section modulus z-z", { unit: "mm³" }),
  input(p, "Av_z", "Shear area z", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  stringInput(p, "section_shape", "Section shape family (I, CHS, RHS)"),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_pl_Rd", "Plastic resistance", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
    unit: "N",
  }),
  derived(p, "n", "Axial force ratio", ["abs_N_Ed", "N_pl_Rd"], {
    symbol: "n",
    expression: "\\left|N_{Ed}\\right|/N_{pl,Rd}",
  }),
  derived(p, "a_w_raw", "Raw web ratio for y-axis reduction", ["Av_z", "A"], {
    expression: "A_{v,z}/A",
  }),
  derived(p, "a_w", "Web ratio for y-axis reduction", ["a_w_raw"], {
    expression: "\\min\\left(A_{v,z}/A,0.5\\right)",
  }),
  derived(p, "a_f_raw", "Raw web ratio for z-axis reduction", ["Av_z", "A"], {
    expression: "A_{v,z}/A",
  }),
  derived(p, "a_f", "Web ratio for z-axis reduction", ["a_f_raw"], {
    expression: "\\min\\left(A_{v,z}/A,0.5\\right)",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_y_res", "Class-dependent section modulus y-y", ["section_class", "Wpl_y", "Wel_y"], {
    expression: "c=3?W_{el,y}:W_{pl,y}",
  }),
  derived(p, "W_z_res", "Class-dependent section modulus z-z", ["section_class", "Wpl_z", "Wel_z"], {
    expression: "c=3?W_{el,z}:W_{pl,z}",
  }),
  derived(p, "M_pl_y_num", "Numerator of M_pl,y,Rd", ["W_y_res", "fy"], {
    expression: "W_{res,y}f_y",
    unit: "N·mm",
  }),
  formula(p, "M_pl_y_Rd", "Plastic bending resistance about y-y", ["class_guard", "M_pl_y_num", "gamma_M0"], {
    symbol: "M_{pl,y,Rd}",
    expression: "\\frac{W_{res,y} f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "M_pl_z_num", "Numerator of M_pl,z,Rd", ["W_z_res", "fy"], {
    expression: "W_{res,z}f_y",
    unit: "N·mm",
  }),
  formula(p, "M_pl_z_Rd", "Plastic bending resistance about z-z", ["class_guard", "M_pl_z_num", "gamma_M0"], {
    symbol: "M_{pl,z,Rd}",
    expression: "\\frac{W_{res,z} f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "axial_y_num", "Numerator of y-axis axial reduction ratio", ["n"], {
    expression: "1-n",
  }),
  derived(p, "axial_y_den", "Denominator of y-axis axial reduction ratio", ["a_w"], {
    expression: "1-0.5a_w",
  }),
  derived(p, "axial_y_ratio", "y-axis axial reduction ratio", ["axial_y_num", "axial_y_den"], {
    expression: "(1-n)/(1-0.5a_w)",
  }),
  derived(p, "axial_y_factor", "y-axis axial reduction factor", ["axial_y_ratio"], {
    expression: "\\min\\left(1,\\frac{1-n}{1-0.5a_w}\\right)",
  }),
  formula(p, "M_N_y_Rd", "Reduced bending resistance y-y", ["M_pl_y_Rd", "axial_y_factor"], {
    symbol: "M_{N,y,Rd}",
    expression: "M_{pl,y,Rd} \\min(1, (1-n)/(1-0.5a_w))",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
  }),
  derived(p, "axial_z_num", "Numerator of z-axis axial reduction ratio", ["n", "a_f"], {
    expression: "n-a_f",
  }),
  derived(p, "axial_z_den", "Denominator of z-axis axial reduction ratio", ["a_f"], {
    expression: "1-a_f",
  }),
  derived(p, "axial_z_ratio", "z-axis axial reduction ratio", ["axial_z_num", "axial_z_den"], {
    expression: "(n-a_f)/(1-a_f)",
  }),
  derived(p, "axial_z_ratio_sq", "Squared z-axis axial reduction ratio", ["axial_z_ratio"], {
    expression: "((n-a_f)/(1-a_f))^2",
  }),
  derived(p, "axial_z_factor", "z-axis axial reduction factor", ["n", "a_f", "axial_z_ratio_sq"], {
    expression: "n\\le a_f ? 1 : (1 - ((n-a_f)/(1-a_f))^2)",
  }),
  formula(p, "M_N_z_Rd", "Reduced bending resistance z-z", ["M_pl_z_Rd", "axial_z_factor"], {
    symbol: "M_{N,z,Rd}",
    expression: "M_{pl,z,Rd} (1 - ((n-a_f)/(1-a_f))^2)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
  }),
  derived(p, "n_sq", "Squared axial ratio", ["n"], {
    expression: "n^2",
  }),
  derived(p, "rhs_exp_den", "RHS exponent denominator", ["n_sq"], {
    expression: "1-1.13n^2",
  }),
  derived(p, "rhs_exp_raw", "Raw RHS exponent", ["rhs_exp_den"], {
    expression: "1.66/(1-1.13n^2)",
  }),
  derived(p, "rhs_exp", "RHS exponent capped at 6", ["rhs_exp_raw"], {
    expression: "\\min\\left(1.66/(1-1.13n^2),6\\right)",
  }),
  derived(p, "alpha_biax", "Biaxial exponent alpha per §6.2.9.1(6)", ["section_shape", "rhs_exp"], {
    symbol: "\\alpha",
  }),
  derived(p, "beta_biax", "Biaxial exponent beta per §6.2.9.1(6)", ["section_shape", "n", "rhs_exp"], {
    symbol: "\\beta",
  }),
  derived(p, "abs_M_y_Ed", "Absolute design bending moment about y-y", ["M_y_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|",
    unit: "N·mm",
  }),
  derived(p, "abs_M_z_Ed", "Absolute design bending moment about z-z", ["M_z_Ed"], {
    expression: "\\left|M_{z,Ed}\\right|",
    unit: "N·mm",
  }),
  derived(p, "ratio_y", "Moment ratio about y-y", ["abs_M_y_Ed", "M_N_y_Rd"], {
    expression: "\\left|M_{y,Ed}\\right|/M_{N,y,Rd}",
  }),
  derived(p, "ratio_z", "Moment ratio about z-z", ["abs_M_z_Ed", "M_N_z_Rd"], {
    expression: "\\left|M_{z,Ed}\\right|/M_{N,z,Rd}",
  }),
  derived(p, "term_y", "Powered y-axis interaction term", ["ratio_y", "alpha_biax"], {
    expression: "(M_{y,Ed}/M_{N,y,Rd})^\\alpha",
  }),
  derived(p, "term_z", "Powered z-axis interaction term", ["ratio_z", "beta_biax"], {
    expression: "(M_{z,Ed}/M_{N,z,Rd})^\\beta",
  }),
  check(p, "biaxial_axial_check", "Biaxial bending and axial force check", ["term_y", "term_z"], {
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{N,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{N,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.41)" },
  }),
] as const;

export const ulsBiaxialAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.abs(N_Ed),
    n: ({ abs_N_Ed, N_pl_Rd }) => abs_N_Ed / N_pl_Rd,
    a_w_raw: ({ Av_z, A }) => Av_z / A,
    a_w: ({ a_w_raw }) => Math.min(a_w_raw, 0.5),
    a_f_raw: ({ Av_z, A }) => Av_z / A,
    a_f: ({ a_f_raw }) => Math.min(a_f_raw, 0.5),
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("biaxial-axial: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.9.1",
        });
      }
      return 1;
    },
    W_y_res: ({ section_class, Wpl_y, Wel_y }) => (section_class === 3 ? Wel_y : Wpl_y),
    W_z_res: ({ section_class, Wpl_z, Wel_z }) => (section_class === 3 ? Wel_z : Wpl_z),
    M_pl_y_num: ({ W_y_res, fy }) => W_y_res * fy,
    M_pl_y_Rd: ({ class_guard, M_pl_y_num, gamma_M0 }) => class_guard * (M_pl_y_num / gamma_M0),
    M_pl_z_num: ({ W_z_res, fy }) => W_z_res * fy,
    M_pl_z_Rd: ({ class_guard, M_pl_z_num, gamma_M0 }) => class_guard * (M_pl_z_num / gamma_M0),
    axial_y_num: ({ n }) => 1 - n,
    axial_y_den: ({ a_w }) => 1 - 0.5 * a_w,
    axial_y_ratio: ({ axial_y_num, axial_y_den }) => axial_y_num / axial_y_den,
    axial_y_factor: ({ axial_y_ratio }) => Math.min(1, axial_y_ratio),
    M_N_y_Rd: ({ M_pl_y_Rd, axial_y_factor }) => M_pl_y_Rd * axial_y_factor,
    axial_z_num: ({ n, a_f }) => n - a_f,
    axial_z_den: ({ a_f }) => 1 - a_f,
    axial_z_ratio: ({ axial_z_num, axial_z_den }) => axial_z_num / axial_z_den,
    axial_z_ratio_sq: ({ axial_z_ratio }) => axial_z_ratio ** 2,
    axial_z_factor: ({ n, a_f, axial_z_ratio_sq }) => (n <= a_f ? 1 : 1 - axial_z_ratio_sq),
    M_N_z_Rd: ({ M_pl_z_Rd, axial_z_factor }) => M_pl_z_Rd * axial_z_factor,
    n_sq: ({ n }) => n ** 2,
    rhs_exp_den: ({ n_sq }) => 1 - 1.13 * n_sq,
    rhs_exp_raw: ({ rhs_exp_den }) => 1.66 / rhs_exp_den,
    rhs_exp: ({ rhs_exp_raw }) => Math.min(rhs_exp_raw, 6),
    alpha_biax: ({ section_shape, rhs_exp }) => (section_shape === "RHS" ? rhs_exp : 2),
    beta_biax: ({ section_shape, n, rhs_exp }) => {
      if (section_shape === "CHS") return 2;
      if (section_shape === "RHS") return rhs_exp;
      return Math.max(1, 5 * n);
    },
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    ratio_y: ({ abs_M_y_Ed, M_N_y_Rd }) => abs_M_y_Ed / M_N_y_Rd,
    ratio_z: ({ abs_M_z_Ed, M_N_z_Rd }) => abs_M_z_Ed / M_N_z_Rd,
    term_y: ({ ratio_y, alpha_biax }) => ratio_y ** alpha_biax,
    term_z: ({ ratio_z, beta_biax }) => ratio_z ** beta_biax,
    biaxial_axial_check: ({ term_y, term_z }) => term_y + term_z,
  },
};
