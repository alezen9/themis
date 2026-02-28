import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, constant, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.10 -- Bending about z-z, axial force, and shear.
 */

const p = "bending-z-axial-shear";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { unit: "N" }),
  input(p, "V_y_Ed", "Design shear force in y", { unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wel_z", "Elastic section modulus z-z", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic section modulus z-z", { unit: "mm³" }),
  input(p, "Av_y", "Shear area y", { unit: "mm²" }),
  input(p, "Av_z", "Shear area z (web area)", { unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_y_num", "Numerator of V_pl,y,Rd", ["Av_y", "fy"], {
    expression: "A_{v,y}f_y",
  }),
  derived(p, "V_pl_y_den", "Denominator of V_pl,y,Rd", ["sqrt3", "gamma_M0"], {
    expression: "\\sqrt{3}\\gamma_{M0}",
  }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance y", ["V_pl_y_num", "V_pl_y_den"], {
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "abs_V_y_Ed", "Absolute design shear force", ["V_y_Ed"], {
    expression: "\\left|V_{y,Ed}\\right|",
  }),
  derived(p, "rho_ratio", "Shear force utilization ratio", ["abs_V_y_Ed", "V_pl_y_Rd"], {
    expression: "\\left|V_{y,Ed}\\right|/V_{pl,y,Rd}",
  }),
  derived(p, "rho_linear", "Linear term in ρ", ["rho_ratio"], {
    expression: "2\\left|V_{y,Ed}\\right|/V_{pl,y,Rd}-1",
  }),
  derived(p, "rho_sq", "Squared term in ρ", ["rho_linear"], {
    expression: "\\left(2\\left|V_{y,Ed}\\right|/V_{pl,y,Rd}-1\\right)^2",
  }),
  derived(p, "rho_y", "Shear interaction factor", ["rho_ratio", "rho_sq"], {
    symbol: "\\rho",
    expression: "\\left(2V_{y,Ed}/V_{pl,y,Rd} - 1\\right)^2",
  }),
  derived(p, "N_pl_num", "Numerator of N_pl,Rd", ["A", "fy"], {
    expression: "Af_y",
  }),
  formula(p, "N_pl_Rd", "Plastic resistance", ["N_pl_num", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design axial force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
  }),
  derived(p, "n", "Axial force ratio", ["abs_N_Ed", "N_pl_Rd"]),
  derived(p, "a_f_raw", "Raw flange area ratio", ["Av_z", "A"], {
    expression: "A_{v,z}/A",
  }),
  derived(p, "a_f", "Flange area ratio", ["a_f_raw"]),
  derived(p, "Wpl_z_web", "Web contribution to plastic modulus about z-z", ["Av_z", "tw"], {
    symbol: "W_{pl,z,web}",
    expression: "A_{v,z} t_w / 4",
    unit: "mm^3",
  }),
  derived(p, "Wpl_z_flange", "Flange contribution to plastic modulus", ["Wpl_z", "Wpl_z_web"], {
    expression: "W_{pl,z}-W_{pl,z,web}",
    unit: "mm³",
  }),
  derived(p, "rho_flange_reduction", "ρ-weighted flange reduction", ["rho_y", "Wpl_z_flange"], {
    expression: "\\rho\\left(W_{pl,z}-W_{pl,z,web}\\right)",
    unit: "mm³",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_z_res", "Class-dependent section modulus for z bending", ["section_class", "Wpl_z", "Wel_z"], {
    expression: "c=3?W_{el,z}:W_{pl,z}",
  }),
  derived(p, "Wpl_z_eff", "Effective plastic modulus under shear", ["W_z_res", "rho_flange_reduction"], {
    expression: "W_{res,z}-\\rho\\left(W_{res,z}-W_{pl,z,web}\\right)",
    unit: "mm³",
  }),
  derived(p, "M_z_V_num", "Numerator of M_z,V,Rd", ["Wpl_z_eff", "fy"], {
    expression: "\\left[W_{pl,z}-\\rho\\left(W_{pl,z}-W_{pl,z,web}\\right)\\right]f_y",
    unit: "N·mm",
  }),
  derived(p, "M_z_V_Rd", "Reduced bending resistance z-z allowing for shear", ["class_guard", "M_z_V_num", "gamma_M0"], {
    symbol: "M_{z,V,Rd}",
    expression: "\\frac{\\left[W_{res,z} - \\rho_y\\left(W_{res,z} - W_{pl,z,web}\\right)\\right]f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", paragraphRef: "(3)" },
  }),
  derived(p, "n_minus_af", "Difference n-a_f", ["n", "a_f"], {
    expression: "n-a_f",
  }),
  derived(p, "one_minus_af", "Difference 1-a_f", ["a_f"], {
    expression: "1-a_f",
  }),
  derived(p, "axial_ratio", "Raw axial interaction ratio", ["n_minus_af", "one_minus_af"], {
    expression: "\\frac{n-a_f}{1-a_f}",
  }),
  derived(p, "axial_ratio_sq", "Squared axial interaction ratio", ["axial_ratio"], {
    expression: "\\left(\\frac{n-a_f}{1-a_f}\\right)^2",
  }),
  derived(p, "axial_factor", "Axial reduction factor", ["axial_ratio_sq"], {
    expression: "1-\\left(\\frac{n-a_f}{1-a_f}\\right)^2",
  }),
  derived(p, "n_le_af", "Branch selector n <= a_f", ["n", "a_f"], {
    expression: "n\\le a_f ? 1 : 0",
  }),
  formula(p, "M_NV_z_Rd", "Reduced bending resistance z-z (axial + shear)", ["M_z_V_Rd", "n_le_af", "axial_factor"], {
    symbol: "M_{NV,z,Rd}",
    expression: "M_{z,V,Rd} \\left(1-\\left(\\frac{n-a_f}{1-a_f}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
  }),
  derived(p, "abs_M_z_Ed", "Absolute design bending moment", ["M_z_Ed"], {
    expression: "\\left|M_{z,Ed}\\right|",
  }),
  check(p, "bending_z_axial_shear_check", "Bending z + axial + shear check", ["abs_M_z_Ed", "M_NV_z_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{NV,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.10" },
  }),
] as const;

export const ulsBendingZAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_num: ({ Av_y, fy }) => Av_y * fy,
    V_pl_y_den: ({ sqrt3, gamma_M0 }) => sqrt3 * gamma_M0,
    V_pl_y_Rd: ({ V_pl_y_num, V_pl_y_den }) => V_pl_y_num / V_pl_y_den,
    abs_V_y_Ed: ({ V_y_Ed }) => Math.abs(V_y_Ed),
    rho_ratio: ({ abs_V_y_Ed, V_pl_y_Rd }) => abs_V_y_Ed / V_pl_y_Rd,
    rho_linear: ({ rho_ratio }) => 2 * rho_ratio - 1,
    rho_sq: ({ rho_linear }) => rho_linear ** 2,
    rho_y: ({ rho_ratio, rho_sq }) => (rho_ratio <= 0.5 ? 0 : rho_sq),
    N_pl_num: ({ A, fy }) => A * fy,
    N_pl_Rd: ({ N_pl_num, gamma_M0 }) => N_pl_num / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.abs(N_Ed),
    n: ({ abs_N_Ed, N_pl_Rd }) => abs_N_Ed / N_pl_Rd,
    a_f_raw: ({ Av_z, A }) => Av_z / A,
    a_f: ({ a_f_raw }) => Math.min(a_f_raw, 0.5),
    Wpl_z_web: ({ Av_z, tw }) => (Av_z * tw) / 4,
    Wpl_z_flange: ({ Wpl_z, Wpl_z_web }) => Wpl_z - Wpl_z_web,
    rho_flange_reduction: ({ rho_y, Wpl_z_flange }) => rho_y * Wpl_z_flange,
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-z-axial-shear: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.10",
        });
      }
      return 1;
    },
    W_z_res: ({ section_class, Wpl_z, Wel_z }) => (section_class === 3 ? Wel_z : Wpl_z),
    Wpl_z_eff: ({ W_z_res, rho_flange_reduction }) => W_z_res - rho_flange_reduction,
    M_z_V_num: ({ Wpl_z_eff, fy }) => Wpl_z_eff * fy,
    M_z_V_Rd: ({ class_guard, M_z_V_num, gamma_M0 }) => class_guard * (M_z_V_num / gamma_M0),
    n_minus_af: ({ n, a_f }) => n - a_f,
    one_minus_af: ({ a_f }) => 1 - a_f,
    axial_ratio: ({ n_minus_af, one_minus_af }) => n_minus_af / one_minus_af,
    axial_ratio_sq: ({ axial_ratio }) => axial_ratio ** 2,
    axial_factor: ({ axial_ratio_sq }) => 1 - axial_ratio_sq,
    n_le_af: ({ n, a_f }) => (n <= a_f ? 1 : 0),
    M_NV_z_Rd: ({ M_z_V_Rd, n_le_af, axial_factor }) =>
      M_z_V_Rd * (n_le_af + (1 - n_le_af) * axial_factor),
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    bending_z_axial_shear_check: ({ abs_M_z_Ed, M_NV_z_Rd }) => abs_M_z_Ed / M_NV_z_Rd,
  },
};
