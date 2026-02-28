import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, constant, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.8 -- Bending and shear (y-axis).
 * When V_z_Ed > 0.5·V_pl,z,Rd, reduced bending resistance M_y,V,Rd applies
 * per §6.2.8(5) eq (6.30) for I-sections with equal flanges.
 */

const p = "bending-y-shear";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "V_z_Ed", "Design shear force in z", { symbol: "V_{z,Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "Wel_y", "Elastic section modulus about y-y", { symbol: "W_{el,y}", unit: "mm³" }),
  input(p, "Wpl_y", "Plastic section modulus about y-y", { symbol: "W_{pl,y}", unit: "mm³" }),
  input(p, "Av_z", "Shear area in z (≈ A_w = h_w t_w)", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_z_num", "Numerator of V_pl,z,Rd", ["Av_z", "fy"], {
    expression: "A_{v,z}f_y",
    unit: "N",
  }),
  derived(p, "V_pl_z_den", "Denominator of V_pl,z,Rd", ["sqrt3", "gamma_M0"], {
    expression: "\\sqrt{3}\\gamma_{M0}",
  }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance in z", ["V_pl_z_num", "V_pl_z_den"], {
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} f_y / \\sqrt{3}}{\\gamma_{M0}}",
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
  derived(p, "rho_z", "Shear reduction factor", ["rho_ratio", "rho_sq"], {
    symbol: "\\rho",
    expression: "\\left(\\frac{2 V_{z,Ed}}{V_{pl,z,Rd}} - 1\\right)^2",
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
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_y_res", "Class-dependent section modulus for y bending", ["section_class", "Wpl_y", "Wel_y"], {
    expression: "c=3?W_{el,y}:W_{pl,y}",
    unit: "mm³",
  }),
  derived(p, "Wpl_y_eff", "Effective plastic modulus under shear", ["W_y_res", "rho_mod_reduction"], {
    expression: "W_{res,y}-\\rho\\frac{A_{v,z}^2}{4t_w}",
    unit: "mm³",
  }),
  derived(p, "M_y_V_num", "Numerator of M_y,V,Rd", ["Wpl_y_eff", "fy"], {
    expression: "\\left(W_{pl,y}-\\rho\\frac{A_{v,z}^2}{4t_w}\\right)f_y",
    unit: "N·mm",
  }),
  formula(p, "M_y_V_Rd", "Reduced plastic resistance moment about y-y allowing for shear", ["class_guard", "M_y_V_num", "gamma_M0"], {
    symbol: "M_{y,V,Rd}",
    expression: "\\frac{\\left(W_{res,y} - \\rho \\dfrac{A_{v,z}^2}{4 t_w}\\right) f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", formulaRef: "(6.30)" },
  }),
  derived(p, "abs_M_y_Ed", "Absolute design bending moment", ["M_y_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|",
  }),
  check(p, "bending_y_shear_check", "Bending and shear check (y-axis) §6.2.8", ["abs_M_y_Ed", "M_y_V_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{y,V,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
  }),
] as const;

export const ulsBendingYShear: VerificationDefinition<typeof nodes> = {
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
    Av_z_sq: ({ Av_z }) => Av_z ** 2,
    shear_mod_reduction: ({ Av_z_sq, tw }) => Av_z_sq / (4 * tw),
    rho_mod_reduction: ({ rho_z, shear_mod_reduction }) => rho_z * shear_mod_reduction,
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-y-shear: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.8",
        });
      }
      return 1;
    },
    W_y_res: ({ section_class, Wpl_y, Wel_y }) => (section_class === 3 ? Wel_y : Wpl_y),
    Wpl_y_eff: ({ W_y_res, rho_mod_reduction }) => W_y_res - rho_mod_reduction,
    M_y_V_num: ({ Wpl_y_eff, fy }) => Wpl_y_eff * fy,
    M_y_V_Rd: ({ class_guard, M_y_V_num, gamma_M0 }) => class_guard * (M_y_V_num / gamma_M0),
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    bending_y_shear_check: ({ abs_M_y_Ed, M_y_V_Rd }) => abs_M_y_Ed / M_y_V_Rd,
  },
};
