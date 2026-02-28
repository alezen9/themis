import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, constant, derived, formula, check } from "@ndg/ndg-core";
import { throwNotApplicableLoadCase, throwNotApplicableSectionClass } from "../errors";

/**
 * §6.3.1 -- Flexural buckling about y-y: N_Ed / N_b,y,Rd <= 1.0
 * χ_y from §6.3.1.2 using buckling curve imperfection factor.
 */

const p = "buckling-y";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "Iy", "Second moment of area y-y", { unit: "mm⁴" }),
  input(p, "L", "Member length", { unit: "mm" }),
  input(p, "k_y", "Buckling length factor y"),
  input(p, "alpha_y", "Imperfection factor y-y", { symbol: "\\alpha_y" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  constant(p, "piSq", "Pi squared", { symbol: "\\pi^2" }),
  derived(p, "Lcr_y", "Buckling length about y-y", ["L", "k_y"], {
    symbol: "L_{cr,y}",
    expression: "k_yL",
    unit: "mm",
  }),
  derived(p, "Lcr_y_sq", "Squared buckling length about y-y", ["Lcr_y"], {
    expression: "L_{cr,y}^2",
    unit: "mm^2",
  }),
  derived(p, "N_cr_y_num", "Numerator of N_cr,y", ["piSq", "E", "Iy"], {
    expression: "\\pi^2EI_y",
    unit: "N·mm^2",
  }),
  derived(p, "N_cr_y", "Elastic critical force y-y", ["N_cr_y_num", "Lcr_y_sq"], {
    symbol: "N_{cr,y}",
    expression: "\\frac{\\pi^2EI_y}{L_{cr,y}^2}",
    unit: "N",
    meta: { sectionRef: "6.3.1.2" },
  }),
  derived(p, "lambda_bar_y_num", "Numerator of slenderness square", ["A", "fy"], {
    expression: "Af_y",
    unit: "N",
  }),
  derived(p, "lambda_bar_y_sq", "Squared non-dimensional slenderness y-y", ["lambda_bar_y_num", "N_cr_y"], {
    expression: "\\frac{Af_y}{N_{cr,y}}",
  }),
  derived(p, "lambda_bar_y", "Non-dimensional slenderness y-y", ["lambda_bar_y_sq"], {
    symbol: "\\bar{\\lambda}_y",
    expression: "\\sqrt{Af_y/N_{cr,y}}",
  }),
  derived(p, "lambda_bar_y_minus_02", "Slenderness shifted by 0.2", ["lambda_bar_y"], {
    expression: "\\bar{\\lambda}_y-0.2",
  }),
  derived(p, "phi_y_alpha_term", "Imperfection contribution in Phi_y", ["alpha_y", "lambda_bar_y_minus_02"], {
    expression: "\\alpha_y(\\bar{\\lambda}_y-0.2)",
  }),
  derived(p, "phi_y_sum", "Parenthesized sum in Phi_y", ["phi_y_alpha_term", "lambda_bar_y_sq"], {
    expression: "1+\\alpha_y(\\bar{\\lambda}_y-0.2)+\\bar{\\lambda}_y^2",
  }),
  derived(p, "phi_y", "Buckling parameter y-y", ["phi_y_sum"], {
    symbol: "\\Phi_y",
    expression: "0.5\\left(1+\\alpha_y(\\bar{\\lambda}_y-0.2)+\\bar{\\lambda}_y^2\\right)",
  }),
  derived(p, "phi_y_sq", "Squared buckling parameter y-y", ["phi_y"], {
    expression: "\\Phi_y^2",
  }),
  derived(p, "chi_y_root_arg", "Square-root argument in χ_y denominator", ["phi_y_sq", "lambda_bar_y_sq"], {
    expression: "\\Phi_y^2-\\bar{\\lambda}_y^2",
  }),
  derived(p, "chi_y_root", "Square-root term in χ_y denominator", ["chi_y_root_arg"], {
    expression: "\\sqrt{\\Phi_y^2-\\bar{\\lambda}_y^2}",
  }),
  derived(p, "chi_y_den", "Denominator of χ_y", ["phi_y", "chi_y_root"], {
    expression: "\\Phi_y+\\sqrt{\\Phi_y^2-\\bar{\\lambda}_y^2}",
  }),
  derived(p, "chi_y_base", "Uncapped reduction factor χ_y", ["chi_y_den"], {
    expression: "\\left(\\Phi_y+\\sqrt{\\Phi_y^2-\\bar{\\lambda}_y^2}\\right)^{-1}",
  }),
  formula(p, "chi_y", "Reduction factor y-y", ["chi_y_base"], {
    symbol: "\\chi_y",
    expression: "\\frac{1}{\\Phi_y + \\sqrt{\\Phi_y^2 - \\bar{\\lambda}_y^2}}",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
  }),
  derived(p, "N_b_y_num", "Numerator of N_b,y,Rd", ["chi_y", "A", "fy"], {
    expression: "\\chi_yAf_y",
    unit: "N",
  }),
  formula(p, "N_b_y_Rd", "Buckling resistance y-y", ["N_b_y_num", "gamma_M1"], {
    symbol: "N_{b,y,Rd}",
    expression: "\\frac{\\chi_y A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.1", formulaRef: "(6.47)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class", "N_Ed"], {
    expression: "\\text{section class guard}",
  }),
  check(p, "buckling_y_check", "Flexural buckling check y-y", ["class_guard", "abs_N_Ed", "N_b_y_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{b,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.1", verificationRef: "(6.46)" },
  }),
] as const;

export const ulsBucklingY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    Lcr_y: ({ L, k_y }) => L * k_y,
    Lcr_y_sq: ({ Lcr_y }) => Lcr_y ** 2,
    N_cr_y_num: ({ piSq, E, Iy }) => piSq * E * Iy,
    N_cr_y: ({ N_cr_y_num, Lcr_y_sq }) => N_cr_y_num / Lcr_y_sq,
    lambda_bar_y_num: ({ A, fy }) => A * fy,
    lambda_bar_y_sq: ({ lambda_bar_y_num, N_cr_y }) => lambda_bar_y_num / N_cr_y,
    lambda_bar_y: ({ lambda_bar_y_sq }) => Math.sqrt(lambda_bar_y_sq),
    lambda_bar_y_minus_02: ({ lambda_bar_y }) => lambda_bar_y - 0.2,
    phi_y_alpha_term: ({ alpha_y, lambda_bar_y_minus_02 }) => alpha_y * lambda_bar_y_minus_02,
    phi_y_sum: ({ phi_y_alpha_term, lambda_bar_y_sq }) => 1 + phi_y_alpha_term + lambda_bar_y_sq,
    phi_y: ({ phi_y_sum }) => 0.5 * phi_y_sum,
    phi_y_sq: ({ phi_y }) => phi_y ** 2,
    chi_y_root_arg: ({ phi_y_sq, lambda_bar_y_sq }) => phi_y_sq - lambda_bar_y_sq,
    chi_y_root: ({ chi_y_root_arg }) => Math.sqrt(chi_y_root_arg),
    chi_y_den: ({ phi_y, chi_y_root }) => phi_y + chi_y_root,
    chi_y_base: ({ chi_y_den }) => 1 / chi_y_den,
    chi_y: ({ chi_y_base }) => Math.min(1, chi_y_base),
    N_b_y_num: ({ chi_y, A, fy }) => chi_y * A * fy,
    N_b_y_Rd: ({ N_b_y_num, gamma_M1 }) => N_b_y_num / gamma_M1,
    abs_N_Ed: ({ N_Ed }) => {
      if (N_Ed >= 0) {
        throwNotApplicableLoadCase("buckling-y: verification is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.1.1",
        });
      }
      return -N_Ed;
    },
    class_guard: ({ section_class, N_Ed }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("buckling-y: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.3.1",
        });
      }
      if (N_Ed >= 0) {
        throwNotApplicableLoadCase("buckling-y: verification is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.1.1",
        });
      }
      return 1;
    },
    buckling_y_check: ({ class_guard, abs_N_Ed, N_b_y_Rd }) => class_guard * (abs_N_Ed / N_b_y_Rd),
  },
};
