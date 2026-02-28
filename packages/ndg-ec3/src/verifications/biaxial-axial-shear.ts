import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.10 -- Bending, shear and axial force.
 */

const p = "biaxial-shear";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment y-y", { unit: "N·mm" }),
  input(p, "M_z_Ed", "Design bending moment z-z", { unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { unit: "N" }),
  input(p, "V_z_Ed", "Design shear force z", { unit: "N" }),
  input(p, "V_y_Ed", "Design shear force y", { unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic section modulus z-z", { unit: "mm³" }),
  input(p, "Av_z", "Shear area in z (approx web area)", { unit: "mm²" }),
  input(p, "Av_y", "Shear area in y (flanges)", { unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  stringInput(p, "section_shape", "Section shape family (I, CHS, RHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_z_num", "Numerator of V_pl,z,Rd", ["Av_z", "fy"]),
  derived(p, "V_pl_den", "Common denominator for V_pl,Rd", ["sqrt3", "gamma_M0"]),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance z", ["V_pl_z_num", "V_pl_den"], {
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "V_pl_y_num", "Numerator of V_pl,y,Rd", ["Av_y", "fy"]),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance y", ["V_pl_y_num", "V_pl_den"], {
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "abs_V_z_Ed", "Absolute design shear force z", ["V_z_Ed"]),
  derived(p, "abs_V_y_Ed", "Absolute design shear force y", ["V_y_Ed"]),
  derived(p, "rho_z_ratio", "Shear utilization ratio z", ["abs_V_z_Ed", "V_pl_z_Rd"]),
  derived(p, "rho_z_linear", "Linear term in rho_z", ["rho_z_ratio"]),
  derived(p, "rho_z_sq", "Squared term in rho_z", ["rho_z_linear"]),
  derived(p, "rho_z", "Shear interaction z", ["rho_z_ratio", "rho_z_sq"]),
  derived(p, "rho_y_ratio", "Shear utilization ratio y", ["abs_V_y_Ed", "V_pl_y_Rd"]),
  derived(p, "rho_y_linear", "Linear term in rho_y", ["rho_y_ratio"]),
  derived(p, "rho_y_sq", "Squared term in rho_y", ["rho_y_linear"]),
  derived(p, "rho_y", "Shear interaction y", ["rho_y_ratio", "rho_y_sq"]),
  derived(p, "N_pl_num", "Numerator of N_pl,Rd", ["A", "fy"]),
  formula(p, "N_pl_Rd", "Plastic resistance", ["N_pl_num", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"]),
  derived(p, "n", "Axial force ratio", ["abs_N_Ed", "N_pl_Rd"]),
  derived(p, "a_w_raw", "Raw web area ratio", ["Av_z", "A"]),
  derived(p, "a_w", "Web area ratio", ["a_w_raw"]),
  derived(p, "a_f_raw", "Raw flange area ratio", ["Av_z", "A"]),
  derived(p, "a_f", "Flange area ratio", ["a_f_raw"]),
  derived(p, "Av_z_sq", "Squared shear area z", ["Av_z"]),
  derived(p, "M_y_shear_mod", "Shear modulus reduction term y", ["Av_z_sq", "tw"]),
  derived(p, "M_y_rho_mod", "rho_z weighted reduction for y", ["rho_z", "M_y_shear_mod"]),
  derived(p, "Wpl_y_eff", "Effective plastic modulus y", ["Wpl_y", "M_y_rho_mod"]),
  derived(p, "M_y_V_num", "Numerator of M_y,V,Rd", ["Wpl_y_eff", "fy"]),
  formula(p, "M_y_V_Rd", "Reduced plastic moment y-y allowing for shear", ["M_y_V_num", "gamma_M0"], {
    symbol: "M_{y,V,Rd}",
    expression: "\\frac{\\left(W_{pl,y} - \\rho_z \\dfrac{A_{v,z}^2}{4t_w}\\right) f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.30)" },
  }),
  derived(p, "axial_y_num", "Numerator axial factor y", ["n"]),
  derived(p, "axial_y_den", "Denominator axial factor y", ["a_w"]),
  derived(p, "axial_y_ratio", "Raw axial factor y", ["axial_y_num", "axial_y_den"]),
  derived(p, "axial_y_factor", "Capped axial factor y", ["axial_y_ratio"]),
  formula(p, "M_NV_y_Rd", "Reduced plastic moment y-y (axial + shear)", ["M_y_V_Rd", "axial_y_factor"], {
    symbol: "M_{NV,y,Rd}",
    expression: "M_{y,V,Rd} \\cdot \\min\\!\\left(1,\\,\\frac{1-n}{1-0.5a_w}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
  }),
  derived(p, "Wpl_z_web", "Web contribution to plastic modulus about z-z", ["Av_z", "tw"], {
    expression: "A_{v,z} t_w / 4",
    unit: "mm^3",
  }),
  derived(p, "Wpl_z_flange", "Flange contribution to plastic modulus z", ["Wpl_z", "Wpl_z_web"]),
  derived(p, "M_z_rho_mod", "rho_y weighted reduction for z", ["rho_y", "Wpl_z_flange"]),
  derived(p, "Wpl_z_eff", "Effective plastic modulus z", ["Wpl_z", "M_z_rho_mod"]),
  derived(p, "M_z_V_num", "Numerator of M_z,V,Rd", ["Wpl_z_eff", "fy"]),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "M_z_V_Rd", "Reduced plastic moment z-z allowing for shear", ["class_guard", "M_z_V_num", "gamma_M0"], {
    symbol: "M_{z,V,Rd}",
    expression: "\\frac{\\left[W_{pl,z} - \\rho_y\\left(W_{pl,z} - W_{pl,z,web}\\right)\\right]f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", paragraphRef: "(3)" },
  }),
  derived(p, "n_minus_af", "Difference n-a_f", ["n", "a_f"]),
  derived(p, "one_minus_af", "Difference 1-a_f", ["a_f"]),
  derived(p, "axial_z_ratio", "Raw axial ratio z", ["n_minus_af", "one_minus_af"]),
  derived(p, "axial_z_ratio_sq", "Squared axial ratio z", ["axial_z_ratio"]),
  derived(p, "axial_z_factor", "Axial factor z", ["axial_z_ratio_sq"]),
  derived(p, "n_le_af", "Branch selector n <= a_f", ["n", "a_f"], {
    expression: "n\\le a_f ? 1 : 0",
  }),
  formula(p, "M_NV_z_Rd", "Reduced plastic moment z-z (axial + shear)", ["M_z_V_Rd", "n_le_af", "axial_z_factor"], {
    symbol: "M_{NV,z,Rd}",
    expression: "M_{z,V,Rd}\\left(1 - \\left(\\frac{n-a_f}{1-a_f}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
  }),
  derived(p, "alpha_biax", "Biaxial exponent alpha", ["section_shape", "n"]),
  derived(p, "beta_biax", "Biaxial exponent beta", ["section_shape", "n"]),
  derived(p, "abs_M_y_Ed", "Absolute design moment y", ["M_y_Ed"]),
  derived(p, "abs_M_z_Ed", "Absolute design moment z", ["M_z_Ed"]),
  derived(p, "ratio_y", "Normalized bending ratio y", ["abs_M_y_Ed", "M_NV_y_Rd"]),
  derived(p, "ratio_z", "Normalized bending ratio z", ["abs_M_z_Ed", "M_NV_z_Rd"]),
  derived(p, "term_y", "Powered y term", ["ratio_y", "alpha_biax"]),
  derived(p, "term_z", "Powered z term", ["ratio_z", "beta_biax"]),
  check(p, "biaxial_axial_shear_check", "Biaxial bending + axial + shear check", ["term_y", "term_z"], {
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{NV,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{NV,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: { sectionRef: "6.2.10", verificationRef: "(6.41)" },
  }),
] as const;

export const ulsBiaxialAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_num: ({ Av_z, fy }) => Av_z * fy,
    V_pl_den: ({ sqrt3, gamma_M0 }) => sqrt3 * gamma_M0,
    V_pl_z_Rd: ({ V_pl_z_num, V_pl_den }) => V_pl_z_num / V_pl_den,
    V_pl_y_num: ({ Av_y, fy }) => Av_y * fy,
    V_pl_y_Rd: ({ V_pl_y_num, V_pl_den }) => V_pl_y_num / V_pl_den,
    abs_V_z_Ed: ({ V_z_Ed }) => Math.abs(V_z_Ed),
    abs_V_y_Ed: ({ V_y_Ed }) => Math.abs(V_y_Ed),
    rho_z_ratio: ({ abs_V_z_Ed, V_pl_z_Rd }) => abs_V_z_Ed / V_pl_z_Rd,
    rho_z_linear: ({ rho_z_ratio }) => 2 * rho_z_ratio - 1,
    rho_z_sq: ({ rho_z_linear }) => rho_z_linear ** 2,
    rho_z: ({ rho_z_ratio, rho_z_sq }) => (rho_z_ratio <= 0.5 ? 0 : rho_z_sq),
    rho_y_ratio: ({ abs_V_y_Ed, V_pl_y_Rd }) => abs_V_y_Ed / V_pl_y_Rd,
    rho_y_linear: ({ rho_y_ratio }) => 2 * rho_y_ratio - 1,
    rho_y_sq: ({ rho_y_linear }) => rho_y_linear ** 2,
    rho_y: ({ rho_y_ratio, rho_y_sq }) => (rho_y_ratio <= 0.5 ? 0 : rho_y_sq),
    N_pl_num: ({ A, fy }) => A * fy,
    N_pl_Rd: ({ N_pl_num, gamma_M0 }) => N_pl_num / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.abs(N_Ed),
    n: ({ abs_N_Ed, N_pl_Rd }) => abs_N_Ed / N_pl_Rd,
    a_w_raw: ({ Av_z, A }) => Av_z / A,
    a_w: ({ a_w_raw }) => Math.min(a_w_raw, 0.5),
    a_f_raw: ({ Av_z, A }) => Av_z / A,
    a_f: ({ a_f_raw }) => Math.min(a_f_raw, 0.5),
    Av_z_sq: ({ Av_z }) => Av_z ** 2,
    M_y_shear_mod: ({ Av_z_sq, tw }) => Av_z_sq / (4 * tw),
    M_y_rho_mod: ({ rho_z, M_y_shear_mod }) => rho_z * M_y_shear_mod,
    Wpl_y_eff: ({ Wpl_y, M_y_rho_mod }) => Wpl_y - M_y_rho_mod,
    M_y_V_num: ({ Wpl_y_eff, fy }) => Wpl_y_eff * fy,
    M_y_V_Rd: ({ M_y_V_num, gamma_M0 }) => M_y_V_num / gamma_M0,
    axial_y_num: ({ n }) => 1 - n,
    axial_y_den: ({ a_w }) => 1 - 0.5 * a_w,
    axial_y_ratio: ({ axial_y_num, axial_y_den }) => axial_y_num / axial_y_den,
    axial_y_factor: ({ axial_y_ratio }) => Math.min(1, axial_y_ratio),
    M_NV_y_Rd: ({ M_y_V_Rd, axial_y_factor }) => M_y_V_Rd * axial_y_factor,
    Wpl_z_web: ({ Av_z, tw }) => (Av_z * tw) / 4,
    Wpl_z_flange: ({ Wpl_z, Wpl_z_web }) => Wpl_z - Wpl_z_web,
    M_z_rho_mod: ({ rho_y, Wpl_z_flange }) => rho_y * Wpl_z_flange,
    Wpl_z_eff: ({ Wpl_z, M_z_rho_mod }) => Wpl_z - M_z_rho_mod,
    M_z_V_num: ({ Wpl_z_eff, fy }) => Wpl_z_eff * fy,
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("biaxial-axial-shear: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.10",
        });
      }
      return 1;
    },
    M_z_V_Rd: ({ class_guard, M_z_V_num, gamma_M0 }) => class_guard * (M_z_V_num / gamma_M0),
    n_minus_af: ({ n, a_f }) => n - a_f,
    one_minus_af: ({ a_f }) => 1 - a_f,
    axial_z_ratio: ({ n_minus_af, one_minus_af }) => n_minus_af / one_minus_af,
    axial_z_ratio_sq: ({ axial_z_ratio }) => axial_z_ratio ** 2,
    axial_z_factor: ({ axial_z_ratio_sq }) => 1 - axial_z_ratio_sq,
    n_le_af: ({ n, a_f }) => (n <= a_f ? 1 : 0),
    M_NV_z_Rd: ({ M_z_V_Rd, n_le_af, axial_z_factor }) =>
      M_z_V_Rd * (n_le_af + (1 - n_le_af) * axial_z_factor),
    alpha_biax: ({ section_shape, n }) => {
      if (section_shape !== "RHS") return 2;
      return Math.min(1.66 / (1 - 1.13 * n ** 2), 6);
    },
    beta_biax: ({ section_shape, n }) => {
      if (section_shape === "CHS") return 2;
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * n ** 2), 6);
      return Math.max(1, 5 * n);
    },
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    ratio_y: ({ abs_M_y_Ed, M_NV_y_Rd }) => abs_M_y_Ed / M_NV_y_Rd,
    ratio_z: ({ abs_M_z_Ed, M_NV_z_Rd }) => abs_M_z_Ed / M_NV_z_Rd,
    term_y: ({ ratio_y, alpha_biax }) => ratio_y ** alpha_biax,
    term_z: ({ ratio_z, beta_biax }) => ratio_z ** beta_biax,
    biaxial_axial_shear_check: ({ term_y, term_z }) => term_y + term_z,
  },
};
