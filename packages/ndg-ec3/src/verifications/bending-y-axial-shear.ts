import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.10 -- Bending about y-y, axial force, and shear.
 */

const p = "bending-y-axial-shear";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "V_z_Ed", "Design shear force in z", { symbol: "V_{z,Ed}", unit: "N" }),
  stringInput(p, "section_shape", "Section shape family (I, RHS, CHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "Av_z", "Shear area z", { unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_z_num", "Numerator of V_pl,z,Rd", ["Av_z", "fy"], {
    expression: "A_{v,z}f_y",
  }),
  derived(p, "V_pl_z_den", "Denominator of V_pl,z,Rd", ["sqrt3", "gamma_M0"], {
    expression: "\\sqrt{3}\\gamma_{M0}",
  }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance", ["V_pl_z_num", "V_pl_z_den"], {
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "abs_V_z_Ed", "Absolute design shear force", ["V_z_Ed"], {
    expression: "\\left|V_{z,Ed}\\right|",
  }),
  derived(p, "rho_ratio", "Shear force utilization ratio", ["abs_V_z_Ed", "V_pl_z_Rd"], {
    expression: "\\left|V_{z,Ed}\\right|/V_{pl,z,Rd}",
  }),
  derived(p, "rho_linear", "Linear term in ρ", ["rho_ratio"], {
    expression: "2\\left|V_{z,Ed}\\right|/V_{pl,z,Rd}-1",
  }),
  derived(p, "rho_sq", "Squared term in ρ", ["rho_linear"], {
    expression: "\\left(2\\left|V_{z,Ed}\\right|/V_{pl,z,Rd}-1\\right)^2",
  }),
  derived(p, "rho_z", "Shear interaction factor", ["rho_ratio", "rho_sq"], {
    symbol: "\\rho",
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
  derived(p, "a_w_raw", "Raw web area ratio", ["Av_z", "A"], {
    expression: "A_{v,z}/A",
  }),
  derived(p, "a_w", "Web area ratio", ["a_w_raw"], {
    expression: "\\min(A_{v,z}/A, 0.5)",
  }),
  derived(p, "Av_z_sq", "Squared shear area", ["Av_z"], {
    expression: "A_{v,z}^2",
  }),
  derived(p, "shear_mod_reduction", "Section modulus reduction term", ["Av_z_sq", "tw"], {
    expression: "\\frac{A_{v,z}^2}{4t_w}",
    unit: "mm³",
  }),
  derived(p, "rho_mod_reduction", "ρ-weighted modulus reduction", ["rho_z", "shear_mod_reduction"], {
    expression: "\\rho\\frac{A_{v,z}^2}{4t_w}",
    unit: "mm³",
  }),
  derived(p, "Wpl_y_eff", "Effective plastic modulus under shear", ["Wpl_y", "rho_mod_reduction"], {
    expression: "W_{pl,y}-\\rho\\frac{A_{v,z}^2}{4t_w}",
    unit: "mm³",
  }),
  derived(p, "M_y_V_num", "Numerator of M_y,V,Rd", ["Wpl_y_eff", "fy"], {
    expression: "\\left(W_{pl,y}-\\rho\\frac{A_{v,z}^2}{4t_w}\\right)f_y",
    unit: "N·mm",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  formula(p, "M_y_V_Rd", "Reduced bending resistance y-y allowing for shear", ["class_guard", "M_y_V_num", "gamma_M0"], {
    symbol: "M_{y,V,Rd}",
    expression: "\\frac{\\left(W_{pl,y} - \\rho_z \\dfrac{A_{v,z}^2}{4t_w}\\right) f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.30)" },
  }),
  derived(p, "axial_num", "Numerator of axial reduction term", ["n"], {
    expression: "1-n",
  }),
  derived(p, "axial_den", "Denominator of axial reduction term", ["a_w"], {
    expression: "1-0.5a_w",
  }),
  derived(p, "axial_ratio", "Raw axial reduction term", ["axial_num", "axial_den"], {
    expression: "\\frac{1-n}{1-0.5a_w}",
  }),
  derived(p, "axial_factor", "Capped axial reduction term", ["axial_ratio"], {
    expression: "\\min(1,\\frac{1-n}{1-0.5a_w})",
  }),
  formula(p, "M_NV_y_Rd", "Reduced bending resistance (axial + shear)", ["M_y_V_Rd", "axial_factor"], {
    symbol: "M_{NV,y,Rd}",
    expression: "M_{y,V,Rd} \\cdot \\min\\!\\left(1,\\,\\frac{1-n}{1-0.5a_w}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
  }),
  derived(p, "abs_M_y_Ed", "Absolute design bending moment", ["M_y_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|",
  }),
  check(p, "bending_y_axial_shear_check", "Bending y + axial + shear check", ["abs_M_y_Ed", "M_NV_y_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{NV,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.10" },
  }),
] as const;

export const ulsBendingYAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_num: ({ Av_z, fy }) => Av_z * fy,
    V_pl_z_den: ({ sqrt3, gamma_M0 }) => sqrt3 * gamma_M0,
    V_pl_z_Rd: ({ V_pl_z_num, V_pl_z_den }) => V_pl_z_num / V_pl_z_den,
    abs_V_z_Ed: ({ V_z_Ed }) => Math.abs(V_z_Ed),
    rho_ratio: ({ abs_V_z_Ed, V_pl_z_Rd }) => abs_V_z_Ed / V_pl_z_Rd,
    rho_linear: ({ rho_ratio }) => 2 * rho_ratio - 1,
    rho_sq: ({ rho_linear }) => rho_linear ** 2,
    rho_z: ({ rho_ratio, rho_sq }) => (rho_ratio <= 0.5 ? 0 : rho_sq),
    N_pl_num: ({ A, fy }) => A * fy,
    N_pl_Rd: ({ N_pl_num, gamma_M0 }) => N_pl_num / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.abs(N_Ed),
    n: ({ abs_N_Ed, N_pl_Rd }) => abs_N_Ed / N_pl_Rd,
    a_w_raw: ({ Av_z, A }) => Av_z / A,
    a_w: ({ a_w_raw }) => Math.min(a_w_raw, 0.5),
    Av_z_sq: ({ Av_z }) => Av_z ** 2,
    shear_mod_reduction: ({ Av_z_sq, tw }) => Av_z_sq / (4 * tw),
    rho_mod_reduction: ({ rho_z, shear_mod_reduction }) => rho_z * shear_mod_reduction,
    Wpl_y_eff: ({ Wpl_y, rho_mod_reduction }) => Wpl_y - rho_mod_reduction,
    M_y_V_num: ({ Wpl_y_eff, fy }) => Wpl_y_eff * fy,
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-y-axial-shear: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.10",
        });
      }
      return 1;
    },
    M_y_V_Rd: ({ class_guard, M_y_V_num, gamma_M0 }) => class_guard * (M_y_V_num / gamma_M0),
    axial_num: ({ n }) => 1 - n,
    axial_den: ({ a_w }) => 1 - 0.5 * a_w,
    axial_ratio: ({ axial_num, axial_den }) => axial_num / axial_den,
    axial_factor: ({ axial_ratio }) => Math.min(1, axial_ratio),
    M_NV_y_Rd: ({ M_y_V_Rd, axial_factor }) => M_y_V_Rd * axial_factor,
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    bending_y_axial_shear_check: ({ abs_M_y_Ed, M_NV_y_Rd }) => abs_M_y_Ed / M_NV_y_Rd,
  },
};
