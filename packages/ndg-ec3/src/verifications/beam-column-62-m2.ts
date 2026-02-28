import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, derived, table, check } from "@ndg/ndg-core";
import { throwEc3VerificationError, throwInvalidInput, throwNotApplicableLoadCase } from "../errors";
import { getC1FromKc, getFReductionEq658, getKcFromEc3Table66 } from "../tables/ec3-table-6.6";

/**
 * §6.3.3 Eq.6.62 Method 2 (Annex B)
 */

const p = "beam-column-62-m2";

const nodes = [
  input(p, "N_Ed", "Axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "M_y_Ed", "Bending moment y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "M_z_Ed", "Bending moment z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "A", "Area", { unit: "mm²" }),
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
  stringInput(p, "section_shape", "Section shape family (I, RHS, CHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "alpha_y", "Imperfection factor y"),
  input(p, "alpha_z", "Imperfection factor z"),
  input(p, "alpha_LT", "LTB imperfection factor"),
  input(p, "psi_y", "Moment ratio for C_m,y"),
  input(p, "psi_z", "Moment ratio for C_m,z"),
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
  derived(p, "Lcr_y", "Buckling length y", ["L", "k_y"], { unit: "mm", expression: "k_y L" }),
  derived(p, "Lcr_z", "Buckling length z", ["L", "k_z"], { unit: "mm", expression: "k_z L" }),
  derived(p, "Lcr_LT", "LT buckling length", ["L", "k_LT"], { unit: "mm", expression: "k_{LT} L" }),
  derived(p, "Lcr_y_sq", "Squared buckling length y", ["Lcr_y"], { expression: "L_{cr,y}^2", unit: "mm²" }),
  derived(p, "Lcr_z_sq", "Squared buckling length z", ["Lcr_z"], { expression: "L_{cr,z}^2", unit: "mm²" }),
  derived(p, "Lcr_LT_sq", "Squared LT buckling length", ["Lcr_LT"], { expression: "L_{cr,LT}^2", unit: "mm²" }),
  derived(p, "psi_y_eff", "Effective psi for y-axis moment shape", ["moment_shape_y", "psi_y"], { expression: "\\psi_{y,eff}" }),
  derived(p, "psi_z_eff", "Effective psi for z-axis moment shape", ["moment_shape_z", "psi_z"], { expression: "\\psi_{z,eff}" }),
  derived(p, "psi_LT_eff", "Effective psi for LT moment shape", ["moment_shape_LT", "psi_LT"], { expression: "\\psi_{LT,eff}" }),
  table(p, "Cm_y", "Equivalent moment factor y", ["psi_y_eff"], { source: "EC3-B.3", meta: { sectionRef: "Annex B", tableRef: "B.3" } }),
  table(p, "Cm_z", "Equivalent moment factor z", ["psi_z_eff"], { source: "EC3-B.3", meta: { sectionRef: "Annex B", tableRef: "B.3" } }),
  table(p, "Cm_LT", "Equivalent moment factor LT", ["psi_LT_eff"], { source: "EC3-B.3", meta: { sectionRef: "Annex B", tableRef: "B.3" } }),
  derived(p, "euler_num", "Euler numerator in Mcr", ["piSq", "E", "Iz"], { expression: "\\pi^2EI_z" }),
  derived(p, "euler_term", "Euler term in Mcr", ["euler_num", "Lcr_LT_sq"], { expression: "\\pi^2EI_z/L_{cr,LT}^2" }),
  derived(p, "torsion_ratio", "Warping ratio in Mcr", ["Iw", "Iz"], { expression: "I_w/I_z" }),
  derived(p, "torsion_num", "Torsion additive numerator in Mcr", ["Lcr_LT_sq", "G", "It"], { expression: "L_{cr,LT}^2GI_t" }),
  derived(p, "torsion_den", "Torsion additive denominator in Mcr", ["piSq", "E", "Iz"], { expression: "\\pi^2EI_z" }),
  derived(p, "torsion_add", "Torsion additive term in Mcr", ["torsion_num", "torsion_den"], {
    expression: "\\frac{L_{cr,LT}^2GI_t}{\\pi^2EI_z}",
  }),
  derived(p, "torsion_sum", "Root term in Mcr", ["torsion_ratio", "torsion_add"], {
    expression: "\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2GI_t}{\\pi^2EI_z}",
  }),
  derived(p, "torsion_root", "Square-root term in Mcr", ["torsion_sum"], {
    expression: "\\sqrt{\\frac{I_w}{I_z}+\\frac{L_{cr,LT}^2GI_t}{\\pi^2EI_z}}",
  }),
  derived(p, "M_cr_prefactor", "Mcr prefactor", ["C1", "euler_term"], {
    expression: "C_1\\frac{\\pi^2EI_z}{L_{cr,LT}^2}",
  }),
  derived(p, "M_cr", "Elastic critical moment", ["section_shape", "section_class", "Lcr_LT", "Iz", "It", "Iw", "M_cr_prefactor", "torsion_root"], {
    unit: "N·mm",
    meta: { sectionRef: "6.3.2.2", paragraphRef: "(2)" },
  }),
  derived(p, "N_Rk", "Characteristic axial resistance", ["A", "fy"]),
  derived(p, "M_y_Rk", "Characteristic bending resistance y", ["Wpl_y", "fy"]),
  derived(p, "M_z_Rk", "Characteristic bending resistance z", ["Wpl_z", "fy"]),
  derived(p, "N_cr_y_num", "Ncr,y numerator", ["piSq", "E", "Iy"], { expression: "\\pi^2EI_y" }),
  derived(p, "N_cr_y", "Elastic critical force y", ["N_cr_y_num", "Lcr_y_sq"], { expression: "\\pi^2EI_y/L_{cr,y}^2" }),
  derived(p, "N_cr_z_num", "Ncr,z numerator", ["piSq", "E", "Iz"], { expression: "\\pi^2EI_z" }),
  derived(p, "N_cr_z", "Elastic critical force z", ["N_cr_z_num", "Lcr_z_sq"], { expression: "\\pi^2EI_z/L_{cr,z}^2" }),
  derived(p, "lambda_bar_z_sq", "Squared slenderness z", ["A", "fy", "N_cr_z"]),
  derived(p, "lambda_bar_z", "Slenderness z", ["lambda_bar_z_sq"]),
  derived(p, "phi_y_alpha", "Alpha term in phi_y", ["alpha_y", "A", "fy", "N_cr_y"]),
  derived(p, "phi_y_inner", "Inner sum in phi_y", ["phi_y_alpha", "A", "fy", "N_cr_y"]),
  derived(p, "phi_y", "Buckling parameter y", ["phi_y_inner"]),
  derived(p, "phi_y_sq", "Squared phi_y", ["phi_y"]),
  derived(p, "chi_y_radicand", "Radicand for chi_y", ["phi_y_sq", "A", "fy", "N_cr_y"]),
  derived(p, "chi_y_root", "Root for chi_y denominator", ["chi_y_radicand"]),
  derived(p, "chi_y_den", "Denominator for chi_y", ["phi_y", "chi_y_root"]),
  derived(p, "chi_y_base", "Base chi_y", ["chi_y_den"]),
  derived(p, "chi_y", "Reduction factor y", ["chi_y_base"]),
  derived(p, "phi_z_alpha", "Alpha term in phi_z", ["alpha_z", "lambda_bar_z"]),
  derived(p, "phi_z_inner", "Inner sum in phi_z", ["phi_z_alpha", "lambda_bar_z_sq"]),
  derived(p, "phi_z", "Buckling parameter z", ["phi_z_inner"]),
  derived(p, "phi_z_sq", "Squared phi_z", ["phi_z"]),
  derived(p, "chi_z_radicand", "Radicand for chi_z", ["phi_z_sq", "lambda_bar_z_sq"]),
  derived(p, "chi_z_root", "Root for chi_z denominator", ["chi_z_radicand"]),
  derived(p, "chi_z_den", "Denominator for chi_z", ["phi_z", "chi_z_root"]),
  derived(p, "chi_z_base", "Base chi_z", ["chi_z_den"]),
  derived(p, "chi_z", "Reduction factor z", ["chi_z_base"]),
  derived(p, "lambda_LT_sq", "Squared LT slenderness", ["Wpl_y", "fy", "M_cr"]),
  derived(p, "lambda_LT", "LT slenderness", ["lambda_LT_sq"]),
  derived(p, "phi_LT_alpha", "Alpha term in phi_LT", ["alpha_LT", "lambda_LT", "lambda_LT_0"]),
  derived(p, "phi_LT_beta", "Beta term in phi_LT", ["beta_LT", "lambda_LT_sq"]),
  derived(p, "phi_LT_inner", "Inner sum in phi_LT", ["phi_LT_alpha", "phi_LT_beta"]),
  derived(p, "phi_LT", "LTB buckling parameter", ["phi_LT_inner"]),
  derived(p, "phi_LT_sq", "Squared phi_LT", ["phi_LT"]),
  derived(p, "chi_LT_radicand", "Radicand for chi_LT", ["phi_LT_sq", "phi_LT_beta"]),
  derived(p, "chi_LT_root", "Root for chi_LT denominator", ["chi_LT_radicand"]),
  derived(p, "chi_LT_den", "Denominator for chi_LT", ["phi_LT", "chi_LT_root"]),
  derived(p, "chi_LT_base", "Base chi_LT", ["chi_LT_den"]),
  derived(p, "chi_LT_cap", "Cap term for chi_LT", ["lambda_LT_sq"]),
  derived(p, "chi_LT", "LTB reduction factor", ["chi_LT_base", "chi_LT_cap"]),
  derived(p, "f_LT", "LT correction factor", ["lambda_LT", "k_c"], {
    expression: "f = \\min\\left(1, 1 - 0.5(1-k_c)[1-2(\\bar{\\lambda}_{LT}-0.8)^2]\\right)",
    meta: { sectionRef: "6.3.2.3", paragraphRef: "(2)" },
  }),
  derived(p, "chi_LT_mod", "Modified LTB reduction factor", ["chi_LT", "f_LT"], {
    expression: "\\min\\left(1,\\frac{\\chi_{LT}}{f}\\right)",
    meta: { sectionRef: "6.3.2.3" },
  }),
  derived(p, "N_b_z_Rd", "Buckling resistance z", ["chi_z", "N_Rk", "gamma_M1"]),
  derived(p, "n_z", "Normalized axial load vs Nbz,Rd", ["N_Ed", "N_b_z_Rd"]),
  derived(p, "lambda_bar_z_cap", "Capped slenderness z", ["lambda_bar_z"]),
  derived(p, "k_zz_branch1_term", "Branch factor term for k_zz", ["lambda_bar_z_cap"]),
  derived(p, "k_zz_branch1", "Branch 1 for k_zz", ["Cm_z", "k_zz_branch1_term", "n_z"]),
  derived(p, "k_zz_branch2", "Branch 2 for k_zz", ["Cm_z", "n_z"]),
  table(p, "k_zz", "Interaction factor k_zz", ["k_zz_branch1", "k_zz_branch2"], {
    source: "EC3-B.1",
    meta: { sectionRef: "Annex B", tableRef: "B.1" },
  }),
  derived(p, "k_zy_cm_denom", "Cm_LT denominator term for k_zy", ["Cm_LT"]),
  derived(p, "k_zy_lambda_ratio", "Lambda/Cm term for k_zy", ["lambda_bar_z", "k_zy_cm_denom"]),
  derived(p, "k_zy_n_factor", "n factor for k_zy", ["n_z", "k_zy_lambda_ratio"]),
  derived(p, "k_zy_low_a", "Lower bound candidate A (lambda<0.4)", ["lambda_bar_z"]),
  derived(p, "k_zy_low_b", "Lower bound candidate B (lambda<0.4)", ["k_zy_n_factor"]),
  derived(p, "k_zy_high_lambda_cap", "Capped lambda for high branch", ["lambda_bar_z"]),
  derived(p, "k_zy_high_a", "High branch candidate A", ["k_zy_high_lambda_cap", "k_zy_cm_denom", "n_z"]),
  derived(p, "k_zy_high_b", "High branch candidate B", ["k_zy_cm_denom", "n_z"]),
  table(p, "k_zy", "Interaction factor k_zy", [
    "Cm_LT",
    { key: "k_zy_low_a", when: { lt: ["lambda_bar_z", 0.4] } },
    { key: "k_zy_low_b", when: { lt: ["lambda_bar_z", 0.4] } },
    { key: "k_zy_high_a", when: { gte: ["lambda_bar_z", 0.4] } },
    { key: "k_zy_high_b", when: { gte: ["lambda_bar_z", 0.4] } },
  ], {
    source: "EC3-B.2",
    meta: { sectionRef: "Annex B", tableRef: "B.2" },
  }),
  derived(p, "bc_62_term1", "Eq.6.62 term 1", ["N_Ed", "chi_z", "N_Rk", "gamma_M1"]),
  derived(p, "bc_62_term2", "Eq.6.62 term 2", ["k_zy", "M_y_Ed", "chi_LT_mod", "M_y_Rk", "gamma_M1"]),
  derived(p, "bc_62_term3", "Eq.6.62 term 3", ["k_zz", "M_z_Ed", "M_z_Rk", "gamma_M1"]),
  check(p, "bc_62_m2_check", "Beam-column Eq.6.62 Method 2", ["bc_62_term1", "bc_62_term2", "bc_62_term3"], {
    verificationExpression: "\\frac{N_{Ed}}{\\chi_z N_{Rk}/\\gamma_{M1}} + k_{zy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{zz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: { sectionRef: "6.3.3", verificationRef: "(6.62)" },
  }),
] as const;

export const ulsBeamColumn62M2: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    k_c: ({ moment_shape_LT, psi_LT, support_condition_LT, load_application_LT }) =>
      getKcFromEc3Table66({
        momentShape: moment_shape_LT as "uniform" | "linear" | "parabolic" | "triangular",
        psi: psi_LT,
        supportCondition: support_condition_LT as "pinned-pinned" | "fixed-pinned" | "fixed-fixed",
        loadApplication: load_application_LT as "top-flange" | "centroid" | "bottom-flange",
        contextLabel: "beam-column-62-m2:k_c",
      }),
    C1: ({ k_c }) => getC1FromKc(k_c),
    Lcr_y: ({ L, k_y }) => L * k_y,
    Lcr_z: ({ L, k_z }) => L * k_z,
    Lcr_LT: ({ L, k_LT }) => L * k_LT,
    Lcr_y_sq: ({ Lcr_y }) => {
      if (Lcr_y <= 0) throwInvalidInput("beam-column-62-m2: Lcr_y must be > 0");
      return Lcr_y ** 2;
    },
    Lcr_z_sq: ({ Lcr_z }) => {
      if (Lcr_z <= 0) throwInvalidInput("beam-column-62-m2: Lcr_z must be > 0");
      return Lcr_z ** 2;
    },
    Lcr_LT_sq: ({ Lcr_LT }) => {
      if (Lcr_LT <= 0) throwInvalidInput("beam-column-62-m2: Lcr_LT must be > 0");
      return Lcr_LT ** 2;
    },
    psi_y_eff: ({ moment_shape_y, psi_y }): number => {
      if (moment_shape_y === "uniform") return 1;
      if (moment_shape_y === "linear") {
        if (psi_y === undefined) {
          throwEc3VerificationError({
            type: "MISSING_INPUT",
            message: "beam-column-62-m2: psi_y is required when moment_shape_y is linear",
            details: { moment_shape_y, sectionRef: "Annex B Table B.3" },
          });
        }
        return psi_y!;
      }
      return throwNotApplicableLoadCase(
        "beam-column-62-m2: Annex B Cm_y is currently limited to uniform/linear y-axis moment shapes",
        { moment_shape_y, sectionRef: "Annex B Table B.3" },
      );
    },
    psi_z_eff: ({ moment_shape_z, psi_z }): number => {
      if (moment_shape_z === "uniform") return 1;
      if (moment_shape_z === "linear") {
        if (psi_z === undefined) {
          throwEc3VerificationError({
            type: "MISSING_INPUT",
            message: "beam-column-62-m2: psi_z is required when moment_shape_z is linear",
            details: { moment_shape_z, sectionRef: "Annex B Table B.3" },
          });
        }
        return psi_z!;
      }
      return throwNotApplicableLoadCase(
        "beam-column-62-m2: Annex B Cm_z is currently limited to uniform/linear z-axis moment shapes",
        { moment_shape_z, sectionRef: "Annex B Table B.3" },
      );
    },
    psi_LT_eff: ({ moment_shape_LT, psi_LT }) => {
      if (moment_shape_LT === "uniform") return 1;
      if (moment_shape_LT === "linear") return psi_LT;
      if (moment_shape_LT === "parabolic") return 0.94;
      return 0.86;
    },
    Cm_y: ({ psi_y_eff }) => Math.max(0.4, 0.6 + 0.4 * psi_y_eff),
    Cm_z: ({ psi_z_eff }) => Math.max(0.4, 0.6 + 0.4 * psi_z_eff),
    Cm_LT: ({ psi_LT_eff }) => Math.max(0.4, 0.6 + 0.4 * psi_LT_eff),
    euler_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    euler_term: ({ euler_num, Lcr_LT_sq }) => euler_num / Lcr_LT_sq,
    torsion_ratio: ({ Iw, Iz }) => {
      if (Iz <= 0) throwInvalidInput("beam-column-62-m2: Iz must be > 0");
      return Iw / Iz;
    },
    torsion_num: ({ Lcr_LT_sq, G, It }) => Lcr_LT_sq * G * It,
    torsion_den: ({ piSq, E, Iz }) => {
      if (Iz <= 0) throwInvalidInput("beam-column-62-m2: Iz must be > 0");
      return piSq * E * Iz;
    },
    torsion_add: ({ torsion_num, torsion_den }) => torsion_num / torsion_den,
    torsion_sum: ({ torsion_ratio, torsion_add }) => torsion_ratio + torsion_add,
    torsion_root: ({ torsion_sum }) => {
      if (torsion_sum <= 0) throwInvalidInput("beam-column-62-m2: invalid torsion term");
      return Math.sqrt(torsion_sum);
    },
    M_cr_prefactor: ({ C1, euler_term }) => C1 * euler_term,
    M_cr: ({ section_shape, section_class, Iz, It, Iw, M_cr_prefactor, torsion_root }) => {
      if (section_class === 4) {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_CLASS",
          message: "beam-column-62-m2: class 4 sections are out of scope",
          details: { section_class, sectionRef: "6.3.3" },
        });
      }
      if (section_shape !== "I") {
        throwEc3VerificationError({
          type: "NOT_APPLICABLE_SECTION_SHAPE",
          message: "beam-column-62-m2: SN003b M_cr is implemented only for I/H sections",
          details: { section_shape, sectionRef: "6.3.3" },
        });
      }
      if (Iz <= 0 || It <= 0 || Iw <= 0) throwInvalidInput("beam-column-62-m2: Iz, It and Iw must be > 0");
      return M_cr_prefactor * torsion_root;
    },
    N_Rk: ({ A, fy }) => A * fy,
    M_y_Rk: ({ Wpl_y, fy }) => Wpl_y * fy,
    M_z_Rk: ({ Wpl_z, fy }) => Wpl_z * fy,
    N_cr_y_num: ({ piSq, E, Iy }) => piSq * E * Iy,
    N_cr_y: ({ N_cr_y_num, Lcr_y_sq }) => N_cr_y_num / Lcr_y_sq,
    N_cr_z_num: ({ piSq, E, Iz }) => piSq * E * Iz,
    N_cr_z: ({ N_cr_z_num, Lcr_z_sq }) => N_cr_z_num / Lcr_z_sq,
    lambda_bar_z_sq: ({ A, fy, N_cr_z }) => (A * fy) / N_cr_z,
    lambda_bar_z: ({ lambda_bar_z_sq }) => Math.sqrt(lambda_bar_z_sq),
    phi_y_alpha: ({ alpha_y, A, fy, N_cr_y }) => alpha_y * (Math.sqrt((A * fy) / N_cr_y) - 0.2),
    phi_y_inner: ({ phi_y_alpha, A, fy, N_cr_y }) => 1 + phi_y_alpha + (A * fy) / N_cr_y,
    phi_y: ({ phi_y_inner }) => 0.5 * phi_y_inner,
    phi_y_sq: ({ phi_y }) => phi_y ** 2,
    chi_y_radicand: ({ phi_y_sq, A, fy, N_cr_y }) => phi_y_sq - (A * fy) / N_cr_y,
    chi_y_root: ({ chi_y_radicand }) => Math.sqrt(chi_y_radicand),
    chi_y_den: ({ phi_y, chi_y_root }) => phi_y + chi_y_root,
    chi_y_base: ({ chi_y_den }) => 1 / chi_y_den,
    chi_y: ({ chi_y_base }) => Math.min(1, chi_y_base),
    phi_z_alpha: ({ alpha_z, lambda_bar_z }) => alpha_z * (lambda_bar_z - 0.2),
    phi_z_inner: ({ phi_z_alpha, lambda_bar_z_sq }) => 1 + phi_z_alpha + lambda_bar_z_sq,
    phi_z: ({ phi_z_inner }) => 0.5 * phi_z_inner,
    phi_z_sq: ({ phi_z }) => phi_z ** 2,
    chi_z_radicand: ({ phi_z_sq, lambda_bar_z_sq }) => phi_z_sq - lambda_bar_z_sq,
    chi_z_root: ({ chi_z_radicand }) => Math.sqrt(chi_z_radicand),
    chi_z_den: ({ phi_z, chi_z_root }) => phi_z + chi_z_root,
    chi_z_base: ({ chi_z_den }) => 1 / chi_z_den,
    chi_z: ({ chi_z_base }) => Math.min(1, chi_z_base),
    lambda_LT_sq: ({ Wpl_y, fy, M_cr }) => {
      if (M_cr <= 0) throwInvalidInput("beam-column-62-m2: M_cr must be > 0");
      return (Wpl_y * fy) / M_cr;
    },
    lambda_LT: ({ lambda_LT_sq }) => Math.sqrt(lambda_LT_sq),
    phi_LT_alpha: ({ alpha_LT, lambda_LT, lambda_LT_0 }) => alpha_LT * (lambda_LT - lambda_LT_0),
    phi_LT_beta: ({ beta_LT, lambda_LT_sq }) => beta_LT * lambda_LT_sq,
    phi_LT_inner: ({ phi_LT_alpha, phi_LT_beta }) => 1 + phi_LT_alpha + phi_LT_beta,
    phi_LT: ({ phi_LT_inner }) => 0.5 * phi_LT_inner,
    phi_LT_sq: ({ phi_LT }) => phi_LT ** 2,
    chi_LT_radicand: ({ phi_LT_sq, phi_LT_beta }) => phi_LT_sq - phi_LT_beta,
    chi_LT_root: ({ chi_LT_radicand }) => Math.sqrt(chi_LT_radicand),
    chi_LT_den: ({ phi_LT, chi_LT_root }) => phi_LT + chi_LT_root,
    chi_LT_base: ({ chi_LT_den }) => 1 / chi_LT_den,
    chi_LT_cap: ({ lambda_LT_sq }) => 1 / lambda_LT_sq,
    chi_LT: ({ chi_LT_base, chi_LT_cap }) => Math.min(1, Math.min(chi_LT_base, chi_LT_cap)),
    f_LT: ({ lambda_LT, k_c }) => getFReductionEq658(lambda_LT, k_c),
    chi_LT_mod: ({ chi_LT, f_LT }) => {
      if (f_LT <= 0) throwInvalidInput("beam-column-62-m2: f_LT must be > 0");
      return Math.min(1, chi_LT / f_LT);
    },
    N_b_z_Rd: ({ chi_z, N_Rk, gamma_M1 }) => (chi_z * N_Rk) / gamma_M1,
    n_z: ({ N_Ed, N_b_z_Rd }) => {
      if (N_b_z_Rd <= 0) throwInvalidInput("beam-column-62-m2: NbzRd must be > 0");
      if (N_Ed > 0) {
        throwNotApplicableLoadCase("beam-column-62-m2: check is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.3",
        });
      }
      return -N_Ed / N_b_z_Rd;
    },
    lambda_bar_z_cap: ({ lambda_bar_z }) => Math.min(lambda_bar_z, 1),
    k_zz_branch1_term: ({ lambda_bar_z_cap }) => 2 * lambda_bar_z_cap - 0.6,
    k_zz_branch1: ({ Cm_z, k_zz_branch1_term, n_z }) => Cm_z * (1 + k_zz_branch1_term * n_z),
    k_zz_branch2: ({ Cm_z, n_z }) => Cm_z * (1 + 1.4 * n_z),
    k_zz: ({ k_zz_branch1, k_zz_branch2 }) => Math.min(k_zz_branch1, k_zz_branch2),
    k_zy_cm_denom: ({ Cm_LT }) => {
      const denom = Cm_LT - 0.25;
      if (denom === 0) throwInvalidInput("beam-column-62-m2: Cm_LT = 0.25 causes division by zero");
      return denom;
    },
    k_zy_lambda_ratio: ({ lambda_bar_z, k_zy_cm_denom }) => (0.1 * lambda_bar_z) / k_zy_cm_denom,
    k_zy_n_factor: ({ n_z, k_zy_lambda_ratio }) => k_zy_lambda_ratio * n_z,
    k_zy_low_a: ({ lambda_bar_z }) => 0.6 + lambda_bar_z,
    k_zy_low_b: ({ k_zy_n_factor }) => 1 - k_zy_n_factor,
    k_zy_high_lambda_cap: ({ lambda_bar_z }) => Math.min(lambda_bar_z, 1),
    k_zy_high_a: ({ k_zy_high_lambda_cap, k_zy_cm_denom, n_z }) => 1 - (0.1 * k_zy_high_lambda_cap / k_zy_cm_denom) * n_z,
    k_zy_high_b: ({ k_zy_cm_denom, n_z }) => 1 - (0.1 / k_zy_cm_denom) * n_z,
    k_zy: ({ lambda_bar_z, k_zy_low_a, k_zy_low_b, k_zy_high_a, k_zy_high_b }) => {
      if (lambda_bar_z < 0.4) {
        return Math.max(k_zy_low_a, k_zy_low_b);
      }
      return Math.max(k_zy_high_a, k_zy_high_b);
    },
    bc_62_term1: ({ N_Ed, chi_z, N_Rk, gamma_M1 }) => {
      if (N_Ed > 0) {
        throwNotApplicableLoadCase("beam-column-62-m2: check is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.3.3",
        });
      }
      return -N_Ed / ((chi_z * N_Rk) / gamma_M1);
    },
    bc_62_term2: ({ k_zy, M_y_Ed, chi_LT_mod, M_y_Rk, gamma_M1 }) => k_zy * Math.abs(M_y_Ed) / ((chi_LT_mod * M_y_Rk) / gamma_M1),
    bc_62_term3: ({ k_zz, M_z_Ed, M_z_Rk, gamma_M1 }) => k_zz * Math.abs(M_z_Ed) / (M_z_Rk / gamma_M1),
    bc_62_m2_check: ({ bc_62_term1, bc_62_term2, bc_62_term3 }) => bc_62_term1 + bc_62_term2 + bc_62_term3,
  },
};
