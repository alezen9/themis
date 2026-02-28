import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, constant, derived, formula, check } from "@ndg/ndg-core";
import { throwNotApplicableLoadCase, throwNotApplicableSectionClass } from "../errors";

/** §6.3.1 -- Flexural buckling about z-z: N_Ed / N_b,z,Rd <= 1.0 */

const p = "buckling-z";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "Iz", "Second moment of area z-z", { unit: "mm⁴" }),
  input(p, "L", "Member length", { unit: "mm" }),
  input(p, "k_z", "Buckling length factor z"),
  input(p, "alpha_z", "Imperfection factor z-z", { symbol: "\\alpha_z" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  constant(p, "piSq", "Pi squared", { symbol: "\\pi^2" }),
  derived(p, "Lcr_z", "Buckling length about z-z", ["L", "k_z"], {
    symbol: "L_{cr,z}",
    expression: "k_zL",
    unit: "mm",
  }),
  derived(p, "Lcr_z_sq", "Squared buckling length about z-z", ["Lcr_z"], {
    expression: "L_{cr,z}^2",
    unit: "mm^2",
  }),
  derived(p, "N_cr_z_num", "Numerator of N_cr,z", ["piSq", "E", "Iz"], {
    expression: "\\pi^2EI_z",
    unit: "N·mm^2",
  }),
  derived(p, "N_cr_z", "Elastic critical force z-z", ["N_cr_z_num", "Lcr_z_sq"], {
    symbol: "N_{cr,z}",
    expression: "\\frac{\\pi^2EI_z}{L_{cr,z}^2}",
    unit: "N",
    meta: { sectionRef: "6.3.1.2" },
  }),
  derived(p, "lambda_bar_z_num", "Numerator of slenderness square", ["A", "fy"], {
    expression: "Af_y",
    unit: "N",
  }),
  derived(p, "lambda_bar_z_sq", "Squared non-dimensional slenderness z-z", ["lambda_bar_z_num", "N_cr_z"], {
    expression: "\\frac{Af_y}{N_{cr,z}}",
  }),
  derived(p, "lambda_bar_z", "Non-dimensional slenderness z-z", ["lambda_bar_z_sq"], {
    symbol: "\\bar{\\lambda}_z",
    expression: "\\sqrt{Af_y/N_{cr,z}}",
  }),
  derived(p, "lambda_bar_z_minus_02", "Slenderness shifted by 0.2", ["lambda_bar_z"], {
    expression: "\\bar{\\lambda}_z-0.2",
  }),
  derived(p, "phi_z_alpha_term", "Imperfection contribution in Phi_z", ["alpha_z", "lambda_bar_z_minus_02"], {
    expression: "\\alpha_z(\\bar{\\lambda}_z-0.2)",
  }),
  derived(p, "phi_z_sum", "Parenthesized sum in Phi_z", ["phi_z_alpha_term", "lambda_bar_z_sq"], {
    expression: "1+\\alpha_z(\\bar{\\lambda}_z-0.2)+\\bar{\\lambda}_z^2",
  }),
  derived(p, "phi_z", "Buckling parameter z-z", ["phi_z_sum"], {
    symbol: "\\Phi_z",
    expression: "0.5\\left(1+\\alpha_z(\\bar{\\lambda}_z-0.2)+\\bar{\\lambda}_z^2\\right)",
  }),
  derived(p, "phi_z_sq", "Squared buckling parameter z-z", ["phi_z"], {
    expression: "\\Phi_z^2",
  }),
  derived(p, "chi_z_root_arg", "Square-root argument in χ_z denominator", ["phi_z_sq", "lambda_bar_z_sq"], {
    expression: "\\Phi_z^2-\\bar{\\lambda}_z^2",
  }),
  derived(p, "chi_z_root", "Square-root term in χ_z denominator", ["chi_z_root_arg"], {
    expression: "\\sqrt{\\Phi_z^2-\\bar{\\lambda}_z^2}",
  }),
  derived(p, "chi_z_den", "Denominator of χ_z", ["phi_z", "chi_z_root"], {
    expression: "\\Phi_z+\\sqrt{\\Phi_z^2-\\bar{\\lambda}_z^2}",
  }),
  derived(p, "chi_z_base", "Uncapped reduction factor χ_z", ["chi_z_den"], {
    expression: "\\left(\\Phi_z+\\sqrt{\\Phi_z^2-\\bar{\\lambda}_z^2}\\right)^{-1}",
  }),
  formula(p, "chi_z", "Reduction factor z-z", ["chi_z_base"], {
    symbol: "\\chi_z",
    expression: "\\frac{1}{\\Phi_z + \\sqrt{\\Phi_z^2 - \\bar{\\lambda}_z^2}}",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
  }),
  derived(p, "N_b_z_num", "Numerator of N_b,z,Rd", ["chi_z", "A", "fy"], {
    expression: "\\chi_zAf_y",
    unit: "N",
  }),
  formula(p, "N_b_z_Rd", "Buckling resistance z-z", ["N_b_z_num", "gamma_M1"], {
    symbol: "N_{b,z,Rd}",
    expression: "\\frac{\\chi_z A f_y}{\\gamma_{M1}}",
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
  check(p, "buckling_z_check", "Flexural buckling check z-z", ["class_guard", "abs_N_Ed", "N_b_z_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{b,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.1", verificationRef: "(6.46)" },
  }),
] as const;

export const ulsBucklingZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    Lcr_z: ({ L, k_z }) => L * k_z,
    Lcr_z_sq: ({ Lcr_z }) => Lcr_z ** 2,
    N_cr_z_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    N_cr_z: ({ N_cr_z_num, Lcr_z_sq }) => N_cr_z_num / Lcr_z_sq,
    lambda_bar_z_num: ({ A, fy }) => A * fy,
    lambda_bar_z_sq: ({ lambda_bar_z_num, N_cr_z }) => lambda_bar_z_num / N_cr_z,
    lambda_bar_z: ({ lambda_bar_z_sq }) => Math.sqrt(lambda_bar_z_sq),
    lambda_bar_z_minus_02: ({ lambda_bar_z }) => lambda_bar_z - 0.2,
    phi_z_alpha_term: ({ alpha_z, lambda_bar_z_minus_02 }) => alpha_z * lambda_bar_z_minus_02,
    phi_z_sum: ({ phi_z_alpha_term, lambda_bar_z_sq }) => 1 + phi_z_alpha_term + lambda_bar_z_sq,
    phi_z: ({ phi_z_sum }) => 0.5 * phi_z_sum,
    phi_z_sq: ({ phi_z }) => phi_z ** 2,
    chi_z_root_arg: ({ phi_z_sq, lambda_bar_z_sq }) => phi_z_sq - lambda_bar_z_sq,
    chi_z_root: ({ chi_z_root_arg }) => Math.sqrt(chi_z_root_arg),
    chi_z_den: ({ phi_z, chi_z_root }) => phi_z + chi_z_root,
    chi_z_base: ({ chi_z_den }) => 1 / chi_z_den,
    chi_z: ({ chi_z_base }) => Math.min(1, chi_z_base),
    N_b_z_num: ({ chi_z, A, fy }) => chi_z * A * fy,
    N_b_z_Rd: ({ N_b_z_num, gamma_M1 }) => N_b_z_num / gamma_M1,
    abs_N_Ed: ({ N_Ed }) => {
      if (N_Ed >= 0) {
        throwNotApplicableLoadCase("buckling-z: verification is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.1.1",
        });
      }
      return -N_Ed;
    },
    class_guard: ({ section_class, N_Ed }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("buckling-z: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.3.1",
        });
      }
      if (N_Ed >= 0) {
        throwNotApplicableLoadCase("buckling-z: verification is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.1.1",
        });
      }
      return 1;
    },
    buckling_z_check: ({ class_guard, abs_N_Ed, N_b_z_Rd }) => class_guard * (abs_N_Ed / N_b_z_Rd),
  },
};
