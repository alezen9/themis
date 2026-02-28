import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, formula, derived, check } from "@ndg/ndg-core";
import { throwEc3VerificationError, throwInvalidInput, throwNotApplicableLoadCase } from "../errors";

/**
 * §6.3.1.4 -- Torsional / torsional-flexural buckling.
 */

const p = "torsional-buckling";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "G", "Shear modulus", { unit: "MPa" }),
  input(p, "Iy", "Second moment of area y-y", { unit: "mm⁴" }),
  input(p, "Iz", "Second moment of area z-z", { unit: "mm⁴" }),
  input(p, "It", "St. Venant torsion constant", { unit: "mm⁴" }),
  input(p, "Iw", "Warping constant", { unit: "mm⁶" }),
  input(p, "L", "Member length", { unit: "mm" }),
  input(p, "k_z", "Buckling length factor z"),
  stringInput(p, "section_shape", "Section shape family (I, RHS, CHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "alpha_z", "Imperfection factor (z-axis curve)", { symbol: "\\alpha" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  constant(p, "piSq", "Pi squared", { symbol: "\\pi^2" }),
  derived(p, "Lcr_T", "Torsional buckling length", ["L", "k_z"], {
    symbol: "L_{cr,T}",
    expression: "k_z L",
    unit: "mm",
  }),
  derived(p, "Lcr_T_sq", "Squared torsional buckling length", ["Lcr_T"], {
    expression: "L_{cr,T}^2",
    unit: "mm²",
  }),
  derived(p, "ip2_num", "Polar radius numerator", ["Iy", "Iz"], {
    expression: "I_y + I_z",
  }),
  derived(p, "ip2", "Polar radius term", ["ip2_num", "A"], {
    expression: "\\frac{I_y+I_z}{A}",
  }),
  derived(p, "ncr_t_left", "Left summand in N_cr,T numerator", ["G", "It"], {
    expression: "GI_t",
  }),
  derived(p, "ncr_t_right_num", "Right numerator in N_cr,T", ["piSq", "E", "Iw"], {
    expression: "\\pi^2 E I_w",
  }),
  derived(p, "ncr_t_right", "Right summand in N_cr,T numerator", ["ncr_t_right_num", "Lcr_T_sq"], {
    expression: "\\frac{\\pi^2 E I_w}{L_{cr,T}^2}",
  }),
  derived(p, "N_cr_T_num", "N_cr,T numerator", ["ncr_t_left", "ncr_t_right"], {
    expression: "GI_t + \\frac{\\pi^2 E I_w}{L_{cr,T}^2}",
  }),
  derived(p, "N_cr_T", "Elastic torsional critical force", ["section_shape", "A", "Lcr_T", "Iy", "Iz", "It", "Iw", "N_cr_T_num", "ip2"], {
    symbol: "N_{cr,T}",
    expression: "\\frac{1}{i_p^2}\\left(G I_t + \\frac{\\pi^2 E I_w}{L_{cr,T}^2}\\right)",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", paragraphRef: "(2)" },
  }),
  derived(p, "N_cr_z_num", "N_cr,z numerator", ["piSq", "E", "Iz"], {
    expression: "\\pi^2 E I_z",
  }),
  derived(p, "N_cr_z", "Elastic flexural critical force about z-z", ["N_cr_z_num", "Lcr_T_sq"], {
    symbol: "N_{cr,z}",
    expression: "\\frac{\\pi^2 E I_z}{L_{cr,T}^2}",
    unit: "N",
    meta: { sectionRef: "6.3.1.2" },
  }),
  derived(p, "N_cr_TF", "Elastic torsional-flexural critical force", ["N_cr_T", "N_cr_z"], {
    symbol: "N_{cr,TF}",
    expression: "\\min(N_{cr,T}, N_{cr,z})",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", paragraphRef: "(2)" },
  }),
  derived(p, "N_cr_governing", "Governing critical force for torsional-flexural slenderness", ["N_cr_T", "N_cr_TF"], {
    symbol: "N_{cr}",
    expression: "N_{cr,TF} \\;\\text{with}\\; N_{cr,TF} < N_{cr,T}",
    unit: "N",
    meta: { sectionRef: "6.3.1.4", paragraphRef: "(2)" },
  }),
  derived(p, "lambda_bar_TF_num", "Slenderness numerator", ["A", "fy"], {
    expression: "Af_y",
  }),
  derived(p, "lambda_bar_TF_sq", "Squared torsional-flexural slenderness", ["lambda_bar_TF_num", "N_cr_governing"], {
    expression: "\\frac{Af_y}{N_{cr}}",
  }),
  derived(p, "lambda_bar_TF", "Non-dimensional slenderness (torsional-flexural)", ["lambda_bar_TF_sq"], {
    symbol: "\\bar{\\lambda}_{T}",
    expression: "\\sqrt{\\frac{Af_y}{N_{cr}}}",
    meta: { sectionRef: "6.3.1.4", paragraphRef: "(2)" },
  }),
  derived(p, "lambda_delta", "Slenderness delta", ["lambda_bar_TF"], {
    expression: "\\bar{\\lambda}_{TF} - 0.2",
  }),
  derived(p, "phi_alpha_term", "Alpha term in Phi_TF", ["alpha_z", "lambda_delta"], {
    expression: "\\alpha(\\bar{\\lambda}_{TF}-0.2)",
  }),
  derived(p, "phi_inner", "Inner sum in Phi_TF", ["phi_alpha_term", "lambda_bar_TF_sq"], {
    expression: "1 + \\alpha(\\bar{\\lambda}_{TF}-0.2) + \\bar{\\lambda}_{TF}^2",
  }),
  derived(p, "phi_TF", "Buckling parameter (torsional-flexural)", ["phi_inner"], {
    symbol: "\\Phi_{TF}",
    expression: "0.5(1 + \\alpha(\\bar{\\lambda}_{TF}-0.2) + \\bar{\\lambda}_{TF}^2)",
  }),
  derived(p, "phi_TF_sq", "Squared Phi_TF", ["phi_TF"], {
    expression: "\\Phi_{TF}^2",
  }),
  derived(p, "chi_TF_radicand", "Radicand in χ_TF denominator", ["phi_TF_sq", "lambda_bar_TF_sq"], {
    expression: "\\Phi_{TF}^2 - \\bar{\\lambda}_{TF}^2",
  }),
  derived(p, "chi_TF_root", "Square-root radicand term", ["chi_TF_radicand"], {
    expression: "\\sqrt{\\Phi_{TF}^2 - \\bar{\\lambda}_{TF}^2}",
  }),
  derived(p, "chi_TF_den", "χ_TF denominator", ["phi_TF", "chi_TF_root"], {
    expression: "\\Phi_{TF} + \\sqrt{\\Phi_{TF}^2 - \\bar{\\lambda}_{TF}^2}",
  }),
  formula(p, "chi_TF_base", "Base torsional-flexural reduction factor", ["chi_TF_den"], {
    symbol: "\\chi_{TF,base}",
    expression: "\\frac{1}{\\Phi_{TF} + \\sqrt{\\Phi_{TF}^2 - \\bar{\\lambda}_{TF}^2}}",
    meta: { sectionRef: "6.3.1.2", formulaRef: "(6.49)" },
  }),
  derived(p, "chi_TF", "Capped torsional-flexural reduction factor", ["chi_TF_base"], {
    expression: "\\min(1,\\chi_{TF,base})",
  }),
  derived(p, "N_b_TF_num", "Numerator of N_b,TF,Rd", ["chi_TF", "A", "fy"], {
    expression: "\\chi_{TF}Af_y",
  }),
  formula(p, "N_b_TF_Rd", "Torsional-flexural buckling resistance", ["N_b_TF_num", "gamma_M1"], {
    symbol: "N_{b,TF,Rd}",
    expression: "\\frac{\\chi_{TF} A f_y}{\\gamma_{M1}}",
    unit: "N",
    meta: { sectionRef: "6.3.1.1", formulaRef: "(6.47)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
  }),
  check(p, "torsional_buckling_check", "Torsional-flexural buckling check", ["abs_N_Ed", "N_b_TF_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{b,TF,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.1.1", verificationRef: "(6.46)" },
  }),
] as const;

export const ulsTorsionalBuckling: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    Lcr_T: ({ L, k_z }) => L * k_z,
    Lcr_T_sq: ({ Lcr_T }) => {
      if (Lcr_T <= 0) throwInvalidInput("torsional-buckling: Lcr_T must be > 0");
      return Lcr_T ** 2;
    },
    ip2_num: ({ Iy, Iz }) => Iy + Iz,
    ip2: ({ ip2_num, A }) => {
      if (A <= 0) throwInvalidInput("torsional-buckling: A must be > 0");
      return ip2_num / A;
    },
    ncr_t_left: ({ G, It }) => G * It,
    ncr_t_right_num: ({ piSq, E, Iw }) => piSq * E * Iw,
    ncr_t_right: ({ ncr_t_right_num, Lcr_T_sq }) => ncr_t_right_num / Lcr_T_sq,
    N_cr_T_num: ({ ncr_t_left, ncr_t_right }) => ncr_t_left + ncr_t_right,
    N_cr_T: ({ section_shape, section_class, Iy, Iz, It, Iw, Lcr_T, ip2, N_cr_T_num }) => {
      if (section_class === 4) {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_CLASS",
          message: "torsional-buckling: class 4 sections are out of scope",
          details: { section_class, sectionRef: "6.3.1.4" },
        });
      }
      if (section_shape !== "I") {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_SHAPE",
          message: "torsional-buckling: implemented only for open I/H sections",
          details: { section_shape, sectionRef: "6.3.1.4" },
        });
      }
      if (Lcr_T <= 0) throwInvalidInput("torsional-buckling: Lcr_T must be > 0");
      if (Iy <= 0 || Iz <= 0 || It <= 0 || Iw <= 0) {
        throwInvalidInput("torsional-buckling: Iy, Iz, It and Iw must be > 0");
      }
      if (ip2 <= 0) throwInvalidInput("torsional-buckling: invalid polar radius of gyration term");
      return N_cr_T_num / ip2;
    },
    N_cr_z_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    N_cr_z: ({ N_cr_z_num, Lcr_T_sq }) => N_cr_z_num / Lcr_T_sq,
    N_cr_TF: ({ N_cr_T, N_cr_z }) => Math.min(N_cr_T, N_cr_z),
    N_cr_governing: ({ N_cr_T, N_cr_TF }) => {
      if (N_cr_TF <= 0) throwInvalidInput("torsional-buckling: invalid governing critical force");
      return Math.min(N_cr_TF, N_cr_T);
    },
    lambda_bar_TF_num: ({ A, fy }) => A * fy,
    lambda_bar_TF_sq: ({ lambda_bar_TF_num, N_cr_governing }) => lambda_bar_TF_num / N_cr_governing,
    lambda_bar_TF: ({ lambda_bar_TF_sq }) => Math.sqrt(lambda_bar_TF_sq),
    lambda_delta: ({ lambda_bar_TF }) => lambda_bar_TF - 0.2,
    phi_alpha_term: ({ alpha_z, lambda_delta }) => alpha_z * lambda_delta,
    phi_inner: ({ phi_alpha_term, lambda_bar_TF_sq }) => 1 + phi_alpha_term + lambda_bar_TF_sq,
    phi_TF: ({ phi_inner }) => 0.5 * phi_inner,
    phi_TF_sq: ({ phi_TF }) => phi_TF ** 2,
    chi_TF_radicand: ({ phi_TF_sq, lambda_bar_TF_sq }) => phi_TF_sq - lambda_bar_TF_sq,
    chi_TF_root: ({ chi_TF_radicand }) => Math.sqrt(chi_TF_radicand),
    chi_TF_den: ({ phi_TF, chi_TF_root }) => phi_TF + chi_TF_root,
    chi_TF_base: ({ chi_TF_den }) => 1 / chi_TF_den,
    chi_TF: ({ chi_TF_base }) => Math.min(1, chi_TF_base),
    N_b_TF_num: ({ chi_TF, A, fy }) => chi_TF * A * fy,
    N_b_TF_Rd: ({ N_b_TF_num, gamma_M1 }) => N_b_TF_num / gamma_M1,
    abs_N_Ed: ({ N_Ed }) => {
      if (N_Ed >= 0) {
        throwNotApplicableLoadCase("torsional-buckling: verification is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.1.4",
        });
      }
      return -N_Ed;
    },
    torsional_buckling_check: ({ abs_N_Ed, N_b_TF_Rd }) => abs_N_Ed / N_b_TF_Rd,
  },
};
