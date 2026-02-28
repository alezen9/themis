import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, formula, derived, table, check } from "@ndg/ndg-core";
import { throwEc3VerificationError, throwInvalidInput } from "../errors";
import { getC1FromKc, getFReductionEq658, getKcFromEc3Table66 } from "../tables/ec3-table-6.6";

/**
 * §6.3.2.3 -- Lateral-torsional buckling (specific method).
 * M_y_Ed / M_b_Rd <= 1.0
 */

const p = "ltb";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "G", "Shear modulus", { unit: "MPa" }),
  input(p, "Iz", "Minor-axis second moment of area", { unit: "mm⁴" }),
  input(p, "It", "St. Venant torsion constant", { unit: "mm⁴" }),
  input(p, "Iw", "Warping constant", { unit: "mm⁶" }),
  input(p, "L", "Member length", { unit: "mm" }),
  input(p, "k_LT", "LT buckling length factor"),
  input(p, "psi_LT", "Moment ratio for LT shape selection"),
  stringInput(p, "moment_shape_LT", "Moment shape for LT segment"),
  stringInput(p, "support_condition_LT", "Support condition for LT segment"),
  stringInput(p, "load_application_LT", "Load application for LT segment"),
  stringInput(p, "section_shape", "Section shape family (I, RHS, CHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "alpha_LT", "LTB imperfection factor", { symbol: "\\alpha_{LT}" }),
  coeff(p, "gamma_M1", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  coeff(p, "lambda_LT_0", "Plateau length of LTB curves", { sectionRef: "6.3.2.3" }, { symbol: "\\bar{\\lambda}_{LT,0}" }),
  coeff(p, "beta_LT", "LTB curve parameter", { sectionRef: "6.3.2.3" }, { symbol: "\\beta" }),
  constant(p, "piSq", "Pi squared", { symbol: "\\pi^2" }),
  table(p, "k_c", "Moment distribution correction factor", ["moment_shape_LT", "psi_LT", "support_condition_LT", "load_application_LT"], {
    symbol: "k_c",
    source: "EC3-6.6",
    meta: { sectionRef: "6.3.2.3", tableRef: "6.6" },
  }),
  derived(p, "C1", "Moment gradient factor C1", ["k_c"], {
    expression: "\\frac{1}{k_c^2}",
  }),
  derived(p, "Lcr_LT", "LT buckling length", ["L", "k_LT"], {
    symbol: "L_{cr,LT}",
    expression: "k_{LT} L",
    unit: "mm",
  }),
  derived(p, "Lcr_LT_sq", "Squared LT buckling length", ["Lcr_LT"], {
    expression: "L_{cr,LT}^2",
    unit: "mm²",
  }),
  derived(p, "euler_num", "Euler numerator for M_cr", ["piSq", "E", "Iz"], {
    expression: "\\pi^2 E I_z",
  }),
  derived(p, "euler_term", "Euler term for M_cr", ["euler_num", "Lcr_LT_sq"], {
    expression: "\\frac{\\pi^2 E I_z}{L_{cr,LT}^2}",
  }),
  derived(p, "torsion_ratio", "Warping to inertia ratio", ["Iw", "Iz"], {
    expression: "\\frac{I_w}{I_z}",
  }),
  derived(p, "torsion_num", "Torsion additive numerator", ["Lcr_LT_sq", "G", "It"], {
    expression: "L_{cr,LT}^2 G I_t",
  }),
  derived(p, "torsion_den", "Torsion additive denominator", ["piSq", "E", "Iz"], {
    expression: "\\pi^2 E I_z",
  }),
  derived(p, "torsion_add", "Torsion additive term", ["torsion_num", "torsion_den"], {
    expression: "\\frac{L_{cr,LT}^2 G I_t}{\\pi^2 E I_z}",
  }),
  derived(p, "torsion_sum", "Torsion sum under square root", ["torsion_ratio", "torsion_add"], {
    expression: "\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2 G I_t}{\\pi^2 E I_z}",
  }),
  derived(p, "torsion_root", "Square-root torsion term", ["torsion_sum"], {
    expression: "\\sqrt{\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2 G I_t}{\\pi^2 E I_z}}",
  }),
  derived(p, "M_cr_prefactor", "Mcr prefactor", ["C1", "euler_term"], {
    expression: "C_1\\frac{\\pi^2 E I_z}{L_{cr,LT}^2}",
  }),
  derived(p, "M_cr", "Elastic critical moment for LTB (SN003b)", ["section_shape", "Lcr_LT", "Iz", "It", "Iw", "M_cr_prefactor", "torsion_root"], {
    symbol: "M_{cr}",
    expression: "C_1 \\frac{\\pi^2 E I_z}{L_{cr,LT}^2}\\sqrt{\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2 G I_t}{\\pi^2 E I_z}}",
    unit: "N·mm",
    meta: { sectionRef: "6.3.2.2", paragraphRef: "(2)" },
  }),
  derived(p, "lambda_LT_num", "LT slenderness numerator", ["Wpl_y", "fy"], {
    expression: "W_{pl,y}f_y",
  }),
  derived(p, "lambda_bar_LT_sq", "Squared LT slenderness", ["lambda_LT_num", "M_cr"], {
    expression: "\\frac{W_{pl,y} f_y}{M_{cr}}",
  }),
  derived(p, "lambda_bar_LT", "Non-dimensional slenderness for LTB", ["lambda_bar_LT_sq"], {
    symbol: "\\bar{\\lambda}_{LT}",
    expression: "\\sqrt{\\frac{W_{pl,y} f_y}{M_{cr}}}",
  }),
  derived(p, "lambda_LT_delta", "LT slenderness delta", ["lambda_bar_LT", "lambda_LT_0"], {
    expression: "\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0}",
  }),
  derived(p, "phi_alpha_term", "Alpha term in Phi_LT", ["alpha_LT", "lambda_LT_delta"], {
    expression: "\\alpha_{LT}(\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0})",
  }),
  derived(p, "phi_beta_term", "Beta term in Phi_LT", ["beta_LT", "lambda_bar_LT_sq"], {
    expression: "\\beta\\bar{\\lambda}_{LT}^2",
  }),
  derived(p, "phi_inner", "Inner sum in Phi_LT", ["phi_alpha_term", "phi_beta_term"], {
    expression: "1 + \\alpha_{LT}(\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0}) + \\beta\\bar{\\lambda}_{LT}^2",
  }),
  derived(p, "phi_LT", "LTB parameter", ["phi_inner"], {
    symbol: "\\Phi_{LT}",
    expression: "0.5(1 + \\alpha_{LT}(\\bar{\\lambda}_{LT} - \\bar{\\lambda}_{LT,0}) + \\beta \\bar{\\lambda}_{LT}^2)",
  }),
  derived(p, "phi_LT_sq", "Squared Phi_LT", ["phi_LT"], {
    expression: "\\Phi_{LT}^2",
  }),
  derived(p, "chi_LT_radicand", "Radicand in χ_LT denominator", ["phi_LT_sq", "phi_beta_term"], {
    expression: "\\Phi_{LT}^2 - \\beta\\bar{\\lambda}_{LT}^2",
  }),
  derived(p, "chi_LT_root", "Square-root radicand term", ["chi_LT_radicand"], {
    expression: "\\sqrt{\\Phi_{LT}^2 - \\beta\\bar{\\lambda}_{LT}^2}",
  }),
  derived(p, "chi_LT_den", "χ_LT denominator", ["phi_LT", "chi_LT_root"], {
    expression: "\\Phi_{LT} + \\sqrt{\\Phi_{LT}^2 - \\beta\\bar{\\lambda}_{LT}^2}",
  }),
  formula(p, "chi_LT_base", "Base LTB reduction factor from Eq.6.57", ["chi_LT_den"], {
    symbol: "\\chi_{LT,base}",
    expression: "\\frac{1}{\\Phi_{LT} + \\sqrt{\\Phi_{LT}^2 - \\beta \\bar{\\lambda}_{LT}^2}}",
    meta: { sectionRef: "6.3.2.3", formulaRef: "(6.57)" },
  }),
  derived(p, "chi_LT_cap", "Upper cap term for χ_LT", ["lambda_bar_LT_sq"], {
    expression: "\\frac{1}{\\bar{\\lambda}_{LT}^2}",
  }),
  derived(p, "chi_LT", "Capped LTB reduction factor", ["chi_LT_base", "chi_LT_cap"], {
    symbol: "\\chi_{LT}",
    expression: "\\min(1,\\min(\\chi_{LT,base}, 1/\\bar{\\lambda}_{LT}^2))",
  }),
  derived(p, "f_LT", "LT correction factor", ["lambda_bar_LT", "k_c"], {
    symbol: "f",
    expression: "f = \\min\\left(1, 1 - 0.5(1-k_c)[1-2(\\bar{\\lambda}_{LT}-0.8)^2]\\right)",
    meta: { sectionRef: "6.3.2.3", paragraphRef: "(2)" },
  }),
  formula(p, "chi_LT_mod", "Modified LT reduction factor", ["chi_LT", "f_LT"], {
    symbol: "\\chi_{LT,mod}",
    expression: "\\min\\left(1,\\frac{\\chi_{LT}}{f}\\right)",
    meta: { sectionRef: "6.3.2.3", formulaRef: "(6.58)" },
  }),
  derived(p, "M_b_num", "Numerator of M_b,Rd", ["chi_LT_mod", "Wpl_y", "fy"], {
    expression: "\\chi_{LT,mod}W_{pl,y}f_y",
  }),
  formula(p, "M_b_Rd", "LTB resistance", ["M_b_num", "gamma_M1"], {
    symbol: "M_{b,Rd}",
    expression: "\\frac{\\chi_{LT,mod} W_{pl,y} f_y}{\\gamma_{M1}}",
    unit: "N·mm",
    meta: { sectionRef: "6.3.2.1", formulaRef: "(6.55)" },
  }),
  derived(p, "abs_M_y_Ed", "Absolute design moment", ["M_y_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|",
  }),
  check(p, "ltb_check", "Lateral-torsional buckling check", ["abs_M_y_Ed", "M_b_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{b,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.3.2.1", verificationRef: "(6.54)" },
  }),
] as const;

export const ulsLtb: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    k_c: ({ moment_shape_LT, psi_LT, support_condition_LT, load_application_LT }) =>
      getKcFromEc3Table66({
        momentShape: moment_shape_LT as "uniform" | "linear" | "parabolic" | "triangular",
        psi: psi_LT,
        supportCondition: support_condition_LT as "pinned-pinned" | "fixed-pinned" | "fixed-fixed",
        loadApplication: load_application_LT as "top-flange" | "centroid" | "bottom-flange",
        contextLabel: "ltb:k_c",
      }),
    C1: ({ k_c }) => getC1FromKc(k_c),
    Lcr_LT: ({ L, k_LT }) => L * k_LT,
    Lcr_LT_sq: ({ Lcr_LT }) => {
      if (Lcr_LT <= 0) throwInvalidInput("ltb: Lcr_LT must be > 0");
      return Lcr_LT ** 2;
    },
    euler_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    euler_term: ({ euler_num, Lcr_LT_sq }) => euler_num / Lcr_LT_sq,
    torsion_ratio: ({ Iw, Iz }) => {
      if (Iz <= 0) throwInvalidInput("ltb: Iz must be > 0");
      return Iw / Iz;
    },
    torsion_num: ({ Lcr_LT_sq, G, It }) => Lcr_LT_sq * G * It,
    torsion_den: ({ piSq, E, Iz }) => {
      if (Iz <= 0) throwInvalidInput("ltb: Iz must be > 0");
      return piSq * E * Iz;
    },
    torsion_add: ({ torsion_num, torsion_den }) => torsion_num / torsion_den,
    torsion_sum: ({ torsion_ratio, torsion_add }) => torsion_ratio + torsion_add,
    torsion_root: ({ torsion_sum }) => {
      if (torsion_sum <= 0) throwInvalidInput("ltb: invalid torsion term");
      return Math.sqrt(torsion_sum);
    },
    M_cr_prefactor: ({ C1, euler_term }) => C1 * euler_term,
    M_cr: ({ section_shape, section_class, Iz, It, Iw, M_cr_prefactor, torsion_root }) => {
      if (section_class === 4) {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_CLASS",
          message: "ltb: class 4 sections are out of scope",
          details: { section_class, sectionRef: "6.3.2.3" },
        });
      }
      if (section_shape !== "I") {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_SHAPE",
          message: "ltb: SN003b M_cr is implemented only for I/H sections",
          details: { section_shape, sectionRef: "6.3.2.3" },
        });
      }
      if (Iz <= 0 || It <= 0 || Iw <= 0) throwInvalidInput("ltb: Iz, It and Iw must be > 0");
      return M_cr_prefactor * torsion_root;
    },
    lambda_LT_num: ({ Wpl_y, fy }) => Wpl_y * fy,
    lambda_bar_LT_sq: ({ lambda_LT_num, M_cr }) => {
      if (M_cr <= 0) throwInvalidInput("ltb: M_cr must be > 0");
      return lambda_LT_num / M_cr;
    },
    lambda_bar_LT: ({ lambda_bar_LT_sq }) => Math.sqrt(lambda_bar_LT_sq),
    lambda_LT_delta: ({ lambda_bar_LT, lambda_LT_0 }) => lambda_bar_LT - lambda_LT_0,
    phi_alpha_term: ({ alpha_LT, lambda_LT_delta }) => alpha_LT * lambda_LT_delta,
    phi_beta_term: ({ beta_LT, lambda_bar_LT_sq }) => beta_LT * lambda_bar_LT_sq,
    phi_inner: ({ phi_alpha_term, phi_beta_term }) => 1 + phi_alpha_term + phi_beta_term,
    phi_LT: ({ phi_inner }) => 0.5 * phi_inner,
    phi_LT_sq: ({ phi_LT }) => phi_LT ** 2,
    chi_LT_radicand: ({ phi_LT_sq, phi_beta_term }) => phi_LT_sq - phi_beta_term,
    chi_LT_root: ({ chi_LT_radicand }) => Math.sqrt(chi_LT_radicand),
    chi_LT_den: ({ phi_LT, chi_LT_root }) => phi_LT + chi_LT_root,
    chi_LT_base: ({ chi_LT_den }) => 1 / chi_LT_den,
    chi_LT_cap: ({ lambda_bar_LT_sq }) => 1 / lambda_bar_LT_sq,
    chi_LT: ({ chi_LT_base, chi_LT_cap }) => Math.min(1, Math.min(chi_LT_base, chi_LT_cap)),
    f_LT: ({ lambda_bar_LT, k_c }) => getFReductionEq658(lambda_bar_LT, k_c),
    chi_LT_mod: ({ chi_LT, f_LT }) => {
      if (f_LT <= 0) throwInvalidInput("ltb: f_LT must be > 0");
      return Math.min(1, chi_LT / f_LT);
    },
    M_b_num: ({ chi_LT_mod, Wpl_y, fy }) => chi_LT_mod * Wpl_y * fy,
    M_b_Rd: ({ M_b_num, gamma_M1 }) => M_b_num / gamma_M1,
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    ltb_check: ({ abs_M_y_Ed, M_b_Rd }) => abs_M_y_Ed / M_b_Rd,
  },
};
