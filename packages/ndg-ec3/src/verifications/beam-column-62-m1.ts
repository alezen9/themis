import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, derived, table, check } from "@ndg/ndg-core";
import { throwEc3VerificationError, throwInvalidInput, throwNotApplicableLoadCase } from "../errors";
import { getC1FromKc, getFReductionEq658, getKcFromEc3Table66 } from "../tables/ec3-table-6.6";

/**
 * §6.3.3 Eq.6.62 Method 1 (Annex A)
 */

const p = "beam-column-62-m1";

const nodes = [
  input(p, "N_Ed", "Axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "M_y_Ed", "Bending moment y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "M_z_Ed", "Bending moment z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "A", "Area", { unit: "mm²" }),
  input(p, "Wel_y", "Elastic modulus y", { unit: "mm³" }),
  input(p, "Wel_z", "Elastic modulus z", { unit: "mm³" }),
  input(p, "Wpl_y", "Plastic modulus y", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic modulus z", { unit: "mm³" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "G", "Shear modulus", { unit: "MPa" }),
  input(p, "Iy", "Inertia y", { unit: "mm⁴" }),
  input(p, "Iz", "Inertia z", { unit: "mm⁴" }),
  input(p, "It", "St. Venant torsion constant", { unit: "mm⁴" }),
  input(p, "Iw", "Warping constant", { unit: "mm⁶" }),
  input(p, "L", "Member length", { unit: "mm" }),
  input(p, "k_y", "Buckling length factor y"),
  input(p, "k_z", "Buckling length factor z"),
  input(p, "k_LT", "LT buckling length factor"),
  input(p, "psi_LT", "Moment ratio for LT shape selection"),
  stringInput(p, "moment_shape_y", "Moment shape for y-axis"),
  stringInput(p, "support_condition_y", "Support condition for y-axis"),
  stringInput(p, "moment_shape_z", "Moment shape for z-axis"),
  stringInput(p, "support_condition_z", "Support condition for z-axis"),
  stringInput(p, "moment_shape_LT", "Moment shape for LT segment"),
  stringInput(p, "support_condition_LT", "Support condition for LT segment"),
  stringInput(p, "load_application_LT", "Load application for LT segment"),
  input(p, "psi_y", "Moment ratio for C_m,y"),
  input(p, "psi_z", "Moment ratio for C_m,z"),
  stringInput(p, "section_shape", "Section shape family (I, RHS, CHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "alpha_y", "Imperfection factor y"),
  input(p, "alpha_z", "Imperfection factor z"),
  input(p, "alpha_LT", "LTB imperfection factor"),
  coeff(p, "gamma_M1", "Partial factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  coeff(p, "lambda_LT_0", "LTB plateau", { sectionRef: "6.3.2.3" }),
  coeff(p, "beta_LT", "LTB beta", { sectionRef: "6.3.2.3" }),
  constant(p, "piSq", "Pi squared", { symbol: "\\pi^2" }),
  table(p, "k_c", "Moment distribution correction factor", ["moment_shape_LT", "psi_LT", "support_condition_LT", "load_application_LT"], {
    symbol: "k_c",
    source: "EC3-6.6",
    meta: { sectionRef: "6.3.2.3", tableRef: "6.6" },
  }),
  derived(p, "C1", "Moment gradient factor C1", ["k_c"], {
    expression: "\\frac{1}{k_c^2}",
  }),
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], { expression: "\\left|N_{Ed}\\right|" }),
  derived(p, "abs_M_y_Ed", "Absolute design bending moment y", ["M_y_Ed"], { expression: "\\left|M_{y,Ed}\\right|" }),
  derived(p, "abs_M_z_Ed", "Absolute design bending moment z", ["M_z_Ed"], { expression: "\\left|M_{z,Ed}\\right|" }),
  derived(p, "Lcr_y", "Buckling length y", ["L", "k_y"], { unit: "mm", expression: "k_y L" }),
  derived(p, "Lcr_z", "Buckling length z", ["L", "k_z"], { unit: "mm", expression: "k_z L" }),
  derived(p, "Lcr_LT", "LT buckling length", ["L", "k_LT"], { unit: "mm", expression: "k_{LT} L" }),
  derived(p, "Lcr_y_sq", "Squared buckling length y", ["Lcr_y"], { expression: "L_{cr,y}^2", unit: "mm²" }),
  derived(p, "Lcr_z_sq", "Squared buckling length z", ["Lcr_z"], { expression: "L_{cr,z}^2", unit: "mm²" }),
  derived(p, "Lcr_LT_sq", "Squared LT buckling length", ["Lcr_LT"], { expression: "L_{cr,LT}^2", unit: "mm²" }),
  derived(p, "N_cr_y_num", "Ncr,y numerator", ["piSq", "E", "Iy"], { expression: "\\pi^2EI_y" }),
  derived(p, "N_cr_y", "Elastic critical force y", ["N_cr_y_num", "Lcr_y_sq"], {
    unit: "N",
    expression: "\\pi^2 E I_y / L_{cr,y}^2",
    meta: { sectionRef: "6.3.1.2" },
  }),
  derived(p, "N_cr_z_num", "Ncr,z numerator", ["piSq", "E", "Iz"], { expression: "\\pi^2EI_z" }),
  derived(p, "N_cr_z", "Elastic critical force z", ["N_cr_z_num", "Lcr_z_sq"], {
    unit: "N",
    expression: "\\pi^2 E I_z / L_{cr,z}^2",
    meta: { sectionRef: "6.3.1.2" },
  }),
  derived(p, "ip2_num", "Polar radius numerator", ["Iy", "Iz"], { expression: "I_y+I_z" }),
  derived(p, "ip2", "Polar radius denominator term", ["ip2_num", "A"], { expression: "(I_y+I_z)/A" }),
  derived(p, "ncr_t_warp_num", "Warping term numerator", ["piSq", "E", "Iw"], { expression: "\\pi^2EI_w" }),
  derived(p, "ncr_t_warp", "Warping term in Ncr,T", ["ncr_t_warp_num", "Lcr_z_sq"], { expression: "\\pi^2EI_w/L_{cr,z}^2" }),
  derived(p, "ncr_t_num", "Numerator of Ncr,T", ["G", "It", "ncr_t_warp"], { expression: "GI_t+\\pi^2EI_w/L_{cr,z}^2" }),
  derived(p, "N_cr_T", "Elastic torsional critical force", ["ncr_t_num", "ip2"], {
    unit: "N",
    meta: { sectionRef: "6.3.1.4", paragraphRef: "(2)" },
  }),
  derived(p, "N_cr_TF", "Elastic torsional-flexural critical force", ["N_cr_T", "N_cr_z"], {
    unit: "N",
    expression: "\\min(N_{cr,T}, N_{cr,z})",
    meta: { sectionRef: "6.3.1.4", paragraphRef: "(2)" },
  }),
  derived(p, "euler_num", "Euler numerator in Mcr", ["piSq", "E", "Iz"], { expression: "\\pi^2EI_z" }),
  derived(p, "euler_term", "Euler term in Mcr", ["euler_num", "Lcr_LT_sq"], { expression: "\\pi^2EI_z/L_{cr,LT}^2" }),
  derived(p, "torsion_ratio", "Warping ratio in Mcr", ["Iw", "Iz"], { expression: "I_w/I_z" }),
  derived(p, "torsion_num", "Torsion additive numerator in Mcr", ["Lcr_LT_sq", "G", "It"], { expression: "L_{cr,LT}^2GI_t" }),
  derived(p, "torsion_den", "Torsion additive denominator in Mcr", ["piSq", "E", "Iz"], { expression: "\\pi^2EI_z" }),
  derived(p, "torsion_term", "Torsion additive term in Mcr", ["torsion_num", "torsion_den"], { expression: "\\frac{L_{cr,LT}^2GI_t}{\\pi^2EI_z}" }),
  derived(p, "torsion_sum", "Root term in Mcr", ["torsion_ratio", "torsion_term"], { expression: "\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2GI_t}{\\pi^2EI_z}" }),
  derived(p, "torsion_root", "Square-root term in Mcr", ["torsion_sum"], { expression: "\\sqrt{\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2GI_t}{\\pi^2EI_z}}" }),
  derived(p, "M_cr_prefactor", "Mcr prefactor", ["C1", "euler_term"], { expression: "C_1\\pi^2EI_z/L_{cr,LT}^2" }),
  derived(p, "M_cr", "Elastic critical moment", ["section_shape", "Lcr_LT", "Iz", "It", "Iw", "M_cr_prefactor", "torsion_root"], {
    unit: "N·mm",
    meta: { sectionRef: "6.3.2.2", paragraphRef: "(2)" },
  }),
  derived(p, "lambda_bar_0_num", "Reference LT slenderness numerator", ["Wpl_y", "fy", "C1"], { expression: "W_{pl,y}f_yC_1" }),
  derived(p, "lambda_bar_0", "Reference LT slenderness for uniform moment", ["lambda_bar_0_num", "M_cr"], {
    expression: "\\sqrt{W_{pl,y} f_y C_1 / M_{cr}}",
    meta: { sectionRef: "Annex A" },
  }),
  derived(p, "it_over_iy", "It/Iy ratio", ["It", "Iy"], { expression: "I_t/I_y" }),
  derived(p, "a_LT", "Annex A auxiliary term a_LT", ["it_over_iy"], {
    expression: "1 - I_t / I_y",
    meta: { sectionRef: "Annex A" },
  }),
  derived(p, "eta_y_m_over_n", "Moment-to-force ratio in eta_y", ["abs_M_y_Ed", "abs_N_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|/\\left|N_{Ed}\\right|",
  }),
  derived(p, "eta_y_area_ratio", "Area-to-modulus ratio in eta_y", ["A", "Wpl_y"], {
    expression: "A/W_{pl,y}",
  }),
  derived(p, "eta_y", "Annex A auxiliary term eta_y", ["eta_y_m_over_n", "eta_y_area_ratio"], {
    expression: "\\left|\\frac{M_{y,Ed}}{N_{Ed}}\\right|\\frac{A}{W_{pl,y}}",
    meta: { sectionRef: "Annex A" },
  }),
  derived(p, "psi_y_eff", "Effective psi for y-axis moment shape", ["moment_shape_y", "psi_y"], {
    expression: "\\psi_{y,eff}",
  }),
  derived(p, "psi_z_eff", "Effective psi for z-axis moment shape", ["moment_shape_z", "psi_z"], {
    expression: "\\psi_{z,eff}",
  }),
  derived(p, "ncr_y_ratio", "N_Ed/N_cr,y ratio", ["abs_N_Ed", "N_cr_y"], { expression: "\\left|N_{Ed}\\right|/N_{cr,y}" }),
  derived(p, "ncr_z_ratio", "N_Ed/N_cr,z ratio", ["abs_N_Ed", "N_cr_z"], { expression: "\\left|N_{Ed}\\right|/N_{cr,z}" }),
  table(p, "Cmy_0", "Equivalent moment factor C_m,y,0", ["psi_y_eff", "ncr_y_ratio"], {
    source: "EC3-A.2",
    meta: { sectionRef: "Annex A", tableRef: "A.2" },
  }),
  table(p, "Cmz_0", "Equivalent moment factor C_m,z,0", ["psi_z_eff", "ncr_z_ratio"], {
    source: "EC3-A.2",
    meta: { sectionRef: "Annex A", tableRef: "A.2" },
  }),
  derived(p, "ncr_t_ratio", "N_Ed/N_cr,T ratio", ["abs_N_Ed", "N_cr_T"], { expression: "\\left|N_{Ed}\\right|/N_{cr,T}" }),
  derived(p, "ncr_tf_ratio", "N_Ed/N_cr,TF ratio", ["abs_N_Ed", "N_cr_TF"], { expression: "\\left|N_{Ed}\\right|/N_{cr,TF}" }),
  derived(p, "cm_branch_limit", "Annex A branch limit", ["ncr_z_ratio", "ncr_tf_ratio"], {
    expression: "0.4(1-n_{cr,z})(1-n_{cr,TF})",
  }),
  derived(p, "cm_branch_active", "Annex A branch selector for Cm adjustments", ["lambda_bar_0", "C1", "cm_branch_limit"], {
    expression: "\\bar{\\lambda}_0>0.2\\land C_1<\\text{limit}",
  }),
  derived(p, "cm_amp_num", "Annex A amplification numerator", ["eta_y", "a_LT"], { expression: "\\eta_ya_{LT}" }),
  derived(p, "cm_amp_den", "Annex A amplification denominator", ["cm_amp_num"], { expression: "1+\\eta_ya_{LT}" }),
  derived(p, "cm_amp", "Annex A amplification factor", ["cm_amp_num", "cm_amp_den"], { expression: "\\eta_ya_{LT}/(1+\\eta_ya_{LT})" }),
  derived(p, "cm_denom", "Annex A denominator term", ["ncr_z_ratio", "ncr_t_ratio"], { expression: "(1-n_{cr,z})(1-n_{cr,T})" }),
  table(p, "Cm_y", "Equivalent moment factor y", ["Cmy_0", "cm_branch_active", "cm_amp", "cm_denom"], {
    source: "EC3-A.1",
    meta: { sectionRef: "Annex A", tableRef: "A.1" },
  }),
  table(p, "Cm_z", "Equivalent moment factor z", ["Cmz_0"], {
    source: "EC3-A.1",
    meta: { sectionRef: "Annex A", tableRef: "A.1" },
  }),
  derived(p, "Cm_y_aug", "Augmented Cm_y for LT branch", ["Cmy_0", "cm_amp"], { expression: "C_{m,y,0}+(1-C_{m,y,0})\\,\\text{amp}" }),
  derived(p, "cm_lt_num", "Numerator in Cm_LT branch", ["Cm_y_aug", "a_LT"], { expression: "C_{m,y}^2a_{LT}" }),
  derived(p, "cm_lt_raw", "Raw Cm_LT branch value", ["cm_lt_num", "cm_denom"], { expression: "C_{m,y}^2a_{LT}/\\text{denom}" }),
  table(p, "Cm_LT", "Equivalent moment factor LT", ["cm_branch_active", "cm_lt_raw"], {
    source: "EC3-A.1",
    meta: { sectionRef: "Annex A", tableRef: "A.1" },
  }),
  derived(p, "N_Rk", "Characteristic axial resistance", ["A", "fy"]),
  derived(p, "M_y_Rk", "Characteristic bending resistance y", ["Wpl_y", "fy"]),
  derived(p, "M_z_Rk", "Characteristic bending resistance z", ["Wpl_z", "fy"]),
  derived(p, "wy", "Annex A factor w_y", ["Wpl_y", "Wel_y"]),
  derived(p, "wz", "Annex A factor w_z", ["Wpl_z", "Wel_z"]),
  derived(p, "chi_y", "Reduction factor y", ["A", "fy", "E", "Iy", "Lcr_y", "alpha_y"]),
  derived(p, "chi_z", "Reduction factor z", ["A", "fy", "E", "Iz", "Lcr_z", "alpha_z"]),
  derived(p, "chi_LT", "LTB reduction factor", ["Wpl_y", "fy", "M_cr", "alpha_LT", "lambda_LT_0", "beta_LT"]),
  derived(p, "f_LT", "LT correction factor", ["chi_LT", "Wpl_y", "fy", "M_cr", "k_c"], {
    expression: "f = \\min\\left(1, 1 - 0.5(1-k_c)[1-2(\\bar{\\lambda}_{LT}-0.8)^2]\\right)",
    meta: { sectionRef: "6.3.2.3", paragraphRef: "(2)" },
  }),
  derived(p, "chi_LT_mod", "Modified LTB reduction factor", ["chi_LT", "f_LT"], {
    expression: "\\min\\left(1,\\frac{\\chi_{LT}}{f}\\right)",
    meta: { sectionRef: "6.3.2.3" },
  }),
  derived(p, "C_zy", "Method 1 interaction coefficient C_zy", ["abs_N_Ed"]),
  derived(p, "k_yy_denom", "Denominator of k_yy", ["ncr_y_ratio"], { expression: "1-n_{cr,y}" }),
  derived(p, "k_yy", "Interaction factor k_yy", ["Cm_y", "Cm_LT", "k_yy_denom"]),
  derived(p, "k_zz_denom", "Denominator of k_zz", ["ncr_z_ratio"], { expression: "1-n_{cr,z}" }),
  derived(p, "k_zz", "Interaction factor k_zz", ["Cm_z", "k_zz_denom"]),
  derived(p, "k_zy", "Interaction factor k_zy", ["abs_N_Ed", "Cm_y", "Cm_LT", "k_yy_denom", "C_zy", "wy", "wz", "k_yy"]),
  derived(p, "bc_62_term1_den", "Denominator of Eq.6.62 term 1", ["chi_z", "N_Rk", "gamma_M1"], {
    expression: "\\chi_zN_{Rk}/\\gamma_{M1}",
  }),
  derived(p, "bc_62_term1", "Eq.6.62 term 1", ["abs_N_Ed", "bc_62_term1_den"]),
  derived(p, "bc_62_term2_den", "Denominator of Eq.6.62 term 2", ["chi_LT_mod", "M_y_Rk", "gamma_M1"], {
    expression: "\\chi_{LT}M_{y,Rk}/\\gamma_{M1}",
  }),
  derived(p, "bc_62_term2", "Eq.6.62 term 2", ["k_zy", "abs_M_y_Ed", "bc_62_term2_den"]),
  derived(p, "bc_62_term3_den", "Denominator of Eq.6.62 term 3", ["M_z_Rk", "gamma_M1"], {
    expression: "M_{z,Rk}/\\gamma_{M1}",
  }),
  derived(p, "bc_62_term3", "Eq.6.62 term 3", ["k_zz", "abs_M_z_Ed", "bc_62_term3_den"]),
  check(p, "bc_62_m1_check", "Beam-column Eq.6.62 Method 1", ["bc_62_term1", "bc_62_term2", "bc_62_term3"], {
    verificationExpression: "\\frac{N_{Ed}}{\\chi_z N_{Rk}/\\gamma_{M1}} + k_{zy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{zz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: { sectionRef: "6.3.3", verificationRef: "(6.62)" },
  }),
] as const;

export const ulsBeamColumn62M1: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    k_c: ({ moment_shape_LT, psi_LT, support_condition_LT, load_application_LT }) =>
      getKcFromEc3Table66({
        momentShape: moment_shape_LT as "uniform" | "linear" | "parabolic" | "triangular",
        psi: psi_LT,
        supportCondition: support_condition_LT as "pinned-pinned" | "fixed-pinned" | "fixed-fixed",
        loadApplication: load_application_LT as "top-flange" | "centroid" | "bottom-flange",
        contextLabel: "beam-column-62-m1:k_c",
      }),
    C1: ({ k_c }) => getC1FromKc(k_c),
    abs_N_Ed: ({ N_Ed }) => {
      if (N_Ed > 0) {
        throwNotApplicableLoadCase("beam-column-62-m1: check is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.3",
        });
      }
      return -N_Ed;
    },
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    Lcr_y: ({ L, k_y }) => L * k_y,
    Lcr_z: ({ L, k_z }) => L * k_z,
    Lcr_LT: ({ L, k_LT }) => L * k_LT,
    Lcr_y_sq: ({ Lcr_y }) => {
      if (Lcr_y <= 0) throwInvalidInput("beam-column-62-m1: Lcr_y must be > 0");
      return Lcr_y ** 2;
    },
    Lcr_z_sq: ({ Lcr_z }) => {
      if (Lcr_z <= 0) throwInvalidInput("beam-column-62-m1: Lcr_z must be > 0");
      return Lcr_z ** 2;
    },
    Lcr_LT_sq: ({ Lcr_LT }) => {
      if (Lcr_LT <= 0) throwInvalidInput("beam-column-62-m1: Lcr_LT must be > 0");
      return Lcr_LT ** 2;
    },
    N_cr_y_num: ({ piSq, E, Iy }) => piSq * E * Iy,
    N_cr_y: ({ N_cr_y_num, Lcr_y_sq }) => N_cr_y_num / Lcr_y_sq,
    N_cr_z_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    N_cr_z: ({ N_cr_z_num, Lcr_z_sq }) => N_cr_z_num / Lcr_z_sq,
    ip2_num: ({ Iy, Iz }) => Iy + Iz,
    ip2: ({ ip2_num, A }) => {
      if (A <= 0) throwInvalidInput("beam-column-62-m1: A must be > 0");
      const value = ip2_num / A;
      if (value <= 0) throwInvalidInput("beam-column-62-m1: invalid polar radius term");
      return value;
    },
    ncr_t_warp_num: ({ piSq, E, Iw }) => piSq * E * Iw,
    ncr_t_warp: ({ ncr_t_warp_num, Lcr_z_sq }) => ncr_t_warp_num / Lcr_z_sq,
    ncr_t_num: ({ G, It, ncr_t_warp }) => G * It + ncr_t_warp,
    N_cr_T: ({ Iy, Iz, It, Iw, ncr_t_num, ip2 }) => {
      if (Iy <= 0 || Iz <= 0 || It <= 0 || Iw <= 0) {
        throwInvalidInput("beam-column-62-m1: Iy, Iz, It and Iw must be > 0");
      }
      return ncr_t_num / ip2;
    },
    N_cr_TF: ({ N_cr_T, N_cr_z }) => Math.min(N_cr_T, N_cr_z),
    euler_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    euler_term: ({ euler_num, Lcr_LT_sq }) => euler_num / Lcr_LT_sq,
    torsion_ratio: ({ Iw, Iz }) => {
      if (Iz <= 0) throwInvalidInput("beam-column-62-m1: Iz must be > 0");
      return Iw / Iz;
    },
    torsion_num: ({ Lcr_LT_sq, G, It }) => Lcr_LT_sq * G * It,
    torsion_den: ({ piSq, E, Iz }) => {
      if (Iz <= 0) throwInvalidInput("beam-column-62-m1: Iz must be > 0");
      return piSq * E * Iz;
    },
    torsion_term: ({ torsion_num, torsion_den }) => torsion_num / torsion_den,
    torsion_sum: ({ torsion_ratio, torsion_term }) => torsion_ratio + torsion_term,
    torsion_root: ({ torsion_sum }) => {
      if (torsion_sum <= 0) throwInvalidInput("beam-column-62-m1: invalid torsion term");
      return Math.sqrt(torsion_sum);
    },
    M_cr_prefactor: ({ C1, euler_term }) => C1 * euler_term,
    M_cr: ({ section_shape, section_class, Lcr_LT, Iz, It, Iw, M_cr_prefactor, torsion_root }) => {
      if (section_class === 4) {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_CLASS",
          message: "beam-column-62-m1: class 4 sections are out of scope",
          details: { section_class, sectionRef: "6.3.3" },
        });
      }
      if (section_shape !== "I") {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_SHAPE",
          message: "beam-column-62-m1: SN003b M_cr is implemented only for I/H sections",
          details: { section_shape, sectionRef: "6.3.3" },
        });
      }
      if (Lcr_LT <= 0) throwInvalidInput("beam-column-62-m1: Lcr_LT must be > 0");
      if (Iz <= 0 || It <= 0 || Iw <= 0) throwInvalidInput("beam-column-62-m1: Iz, It and Iw must be > 0");
      return M_cr_prefactor * torsion_root;
    },
    lambda_bar_0_num: ({ Wpl_y, fy, C1 }) => Wpl_y * fy * C1,
    lambda_bar_0: ({ lambda_bar_0_num, M_cr, C1 }) => {
      if (C1 <= 0) throwInvalidInput("beam-column-62-m1: C1 must be > 0");
      return Math.sqrt(lambda_bar_0_num / M_cr);
    },
    it_over_iy: ({ It, Iy }) => It / Iy,
    a_LT: ({ it_over_iy }) => Math.max(1 - it_over_iy, 0),
    eta_y_m_over_n: ({ abs_M_y_Ed, abs_N_Ed }) => {
      if (abs_N_Ed < 1e-9) return 0;
      return abs_M_y_Ed / abs_N_Ed;
    },
    eta_y_area_ratio: ({ A, Wpl_y }) => A / Wpl_y,
    eta_y: ({ eta_y_m_over_n, eta_y_area_ratio }) => eta_y_m_over_n * eta_y_area_ratio,
    psi_y_eff: ({ moment_shape_y, psi_y }): number => {
      if (moment_shape_y === "uniform") return 1;
      if (moment_shape_y === "linear") {
        if (psi_y === undefined) {
          throwEc3VerificationError({
            type: "MISSING_INPUT",
            message: "beam-column-62-m1: psi_y is required when moment_shape_y is linear",
            details: { moment_shape_y, sectionRef: "Annex A Table A.2" },
          });
        }
        return psi_y!;
      }
      return throwNotApplicableLoadCase(
        "beam-column-62-m1: Annex A Cmy,0 is currently limited to uniform/linear y-axis moment shapes",
        { moment_shape_y, sectionRef: "Annex A Table A.2" },
      );
    },
    psi_z_eff: ({ moment_shape_z, psi_z }): number => {
      if (moment_shape_z === "uniform") return 1;
      if (moment_shape_z === "linear") {
        if (psi_z === undefined) {
          throwEc3VerificationError({
            type: "MISSING_INPUT",
            message: "beam-column-62-m1: psi_z is required when moment_shape_z is linear",
            details: { moment_shape_z, sectionRef: "Annex A Table A.2" },
          });
        }
        return psi_z!;
      }
      return throwNotApplicableLoadCase(
        "beam-column-62-m1: Annex A Cmz,0 is currently limited to uniform/linear z-axis moment shapes",
        { moment_shape_z, sectionRef: "Annex A Table A.2" },
      );
    },
    ncr_y_ratio: ({ abs_N_Ed, N_cr_y }) => {
      if (N_cr_y <= 0) throwInvalidInput("beam-column-62-m1: N_cr_y must be > 0");
      return abs_N_Ed / N_cr_y;
    },
    ncr_z_ratio: ({ abs_N_Ed, N_cr_z }) => {
      if (N_cr_z <= 0) throwInvalidInput("beam-column-62-m1: N_cr_z must be > 0");
      return abs_N_Ed / N_cr_z;
    },
    Cmy_0: ({ psi_y_eff, ncr_y_ratio }) =>
      0.79 + 0.21 * psi_y_eff + 0.36 * (psi_y_eff - 0.33) * ncr_y_ratio,
    Cmz_0: ({ psi_z_eff, ncr_z_ratio }) =>
      0.79 + 0.21 * psi_z_eff + 0.36 * (psi_z_eff - 0.33) * ncr_z_ratio,
    ncr_t_ratio: ({ abs_N_Ed, N_cr_T }) => {
      if (N_cr_T <= 0) throwInvalidInput("beam-column-62-m1: N_cr_T must be > 0");
      return abs_N_Ed / N_cr_T;
    },
    ncr_tf_ratio: ({ abs_N_Ed, N_cr_TF }) => {
      if (N_cr_TF <= 0) throwInvalidInput("beam-column-62-m1: N_cr_TF must be > 0");
      return abs_N_Ed / N_cr_TF;
    },
    cm_branch_limit: ({ ncr_z_ratio, ncr_tf_ratio }) => 0.4 * (1 - ncr_z_ratio) * (1 - ncr_tf_ratio),
    cm_branch_active: ({ lambda_bar_0, C1, cm_branch_limit }) =>
      lambda_bar_0 > 0.2 && C1 < cm_branch_limit ? 1 : 0,
    cm_amp_num: ({ eta_y, a_LT }) => eta_y * a_LT,
    cm_amp_den: ({ cm_amp_num }) => 1 + cm_amp_num,
    cm_amp: ({ cm_amp_num, cm_amp_den }) => cm_amp_num / cm_amp_den,
    cm_denom: ({ ncr_z_ratio, ncr_t_ratio }) => (1 - ncr_z_ratio) * (1 - ncr_t_ratio),
    Cm_y: ({ Cmy_0, cm_branch_active, cm_amp, cm_denom }) => {
      if (cm_branch_active === 0) return Cmy_0;
      if (cm_denom <= 0) throwInvalidInput("beam-column-62-m1: invalid C_m denominator");
      return Cmy_0 + (1 - Cmy_0) * cm_amp;
    },
    Cm_z: ({ Cmz_0 }) => Cmz_0,
    Cm_y_aug: ({ Cmy_0, cm_amp }) => Cmy_0 + (1 - Cmy_0) * cm_amp,
    cm_lt_num: ({ Cm_y_aug, a_LT }) => Cm_y_aug ** 2 * a_LT,
    cm_lt_raw: ({ cm_lt_num, cm_denom }) => {
      if (cm_denom <= 0) throwInvalidInput("beam-column-62-m1: invalid denominator for C_m,LT");
      return cm_lt_num / cm_denom;
    },
    Cm_LT: ({ cm_branch_active, cm_lt_raw }) => (cm_branch_active === 0 ? 1 : Math.min(cm_lt_raw, 1)),
    N_Rk: ({ A, fy }) => A * fy,
    M_y_Rk: ({ Wpl_y, fy }) => Wpl_y * fy,
    M_z_Rk: ({ Wpl_z, fy }) => Wpl_z * fy,
    wy: ({ Wpl_y, Wel_y }) => Math.min(Wpl_y / Wel_y, 1.5),
    wz: ({ Wpl_z, Wel_z }) => Math.min(Wpl_z / Wel_z, 1.5),
    chi_y: ({ A, fy, E, Iy, Lcr_y, alpha_y }) => {
      if (Lcr_y === 0) throwInvalidInput("beam-column-62-m1: Lcr_y must be > 0");
      const Ncr = (Math.PI ** 2 * E * Iy) / Lcr_y ** 2;
      if (Ncr === 0) throwInvalidInput("beam-column-62-m1: invalid Ncr,y");
      const lb = Math.sqrt((A * fy) / Ncr);
      const phi = 0.5 * (1 + alpha_y * (lb - 0.2) + lb ** 2);
      return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
    },
    chi_z: ({ A, fy, E, Iz, Lcr_z, alpha_z }) => {
      if (Lcr_z === 0) throwInvalidInput("beam-column-62-m1: Lcr_z must be > 0");
      const Ncr = (Math.PI ** 2 * E * Iz) / Lcr_z ** 2;
      if (Ncr === 0) throwInvalidInput("beam-column-62-m1: invalid Ncr,z");
      const lb = Math.sqrt((A * fy) / Ncr);
      const phi = 0.5 * (1 + alpha_z * (lb - 0.2) + lb ** 2);
      return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
    },
    chi_LT: ({ Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT }) => {
      if (M_cr <= 0) throwInvalidInput("beam-column-62-m1: M_cr must be > 0");
      const lb = Math.sqrt((Wpl_y * fy) / M_cr);
      const phi = 0.5 * (1 + alpha_LT * (lb - lambda_LT_0) + beta_LT * lb ** 2);
      const val = 1 / (phi + Math.sqrt(phi ** 2 - beta_LT * lb ** 2));
      return Math.min(1, Math.min(val, 1 / lb ** 2));
    },
    f_LT: ({ Wpl_y, fy, M_cr, k_c }) => {
      if (M_cr <= 0) throwInvalidInput("beam-column-62-m1: M_cr must be > 0");
      const lambdaBarLT = Math.sqrt((Wpl_y * fy) / M_cr);
      return getFReductionEq658(lambdaBarLT, k_c);
    },
    chi_LT_mod: ({ chi_LT, f_LT }) => {
      if (f_LT <= 0) throwInvalidInput("beam-column-62-m1: f_LT must be > 0");
      return Math.min(1, chi_LT / f_LT);
    },
    C_zy: ({ abs_N_Ed }) => (abs_N_Ed <= 1e-12 ? 0.998 : 1),
    k_yy_denom: ({ ncr_y_ratio }) => {
      const denom = 1 - ncr_y_ratio;
      if (denom <= 0) throwInvalidInput("beam-column-62-m1: invalid k_yy denominator");
      return denom;
    },
    k_yy: ({ Cm_y, Cm_LT, k_yy_denom }) => (Cm_y * Cm_LT) / k_yy_denom,
    k_zz_denom: ({ ncr_z_ratio }) => {
      const denom = 1 - ncr_z_ratio;
      if (denom <= 0) throwInvalidInput("beam-column-62-m1: invalid k_zz denominator");
      return denom;
    },
    k_zz: ({ Cm_z, k_zz_denom }) => Cm_z / k_zz_denom,
    k_zy: ({ abs_N_Ed, Cm_y, Cm_LT, k_yy_denom, C_zy, wy, wz, k_yy }) => {
      if (abs_N_Ed <= 1e-12) {
        return (Cm_y * Cm_LT * (1 / C_zy) * 0.6 * Math.sqrt(wy / wz)) / k_yy_denom;
      }
      return 0.6 * k_yy;
    },
    bc_62_term1_den: ({ chi_z, N_Rk, gamma_M1 }) => (chi_z * N_Rk) / gamma_M1,
    bc_62_term1: ({ abs_N_Ed, bc_62_term1_den }) => abs_N_Ed / bc_62_term1_den,
    bc_62_term2_den: ({ chi_LT_mod, M_y_Rk, gamma_M1 }) => (chi_LT_mod * M_y_Rk) / gamma_M1,
    bc_62_term2: ({ k_zy, abs_M_y_Ed, bc_62_term2_den }) => k_zy * (abs_M_y_Ed / bc_62_term2_den),
    bc_62_term3_den: ({ M_z_Rk, gamma_M1 }) => M_z_Rk / gamma_M1,
    bc_62_term3: ({ k_zz, abs_M_z_Ed, bc_62_term3_den }) => k_zz * (abs_M_z_Ed / bc_62_term3_den),
    bc_62_m1_check: ({ bc_62_term1, bc_62_term2, bc_62_term3 }) => bc_62_term1 + bc_62_term2 + bc_62_term3,
  },
};
