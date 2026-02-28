import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, constant, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/**
 * §6.2.8 -- Bending and shear (z-axis).
 */

const p = "bending-z-shear";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "V_y_Ed", "Design shear force in y", { symbol: "V_{y,Ed}", unit: "N" }),
  stringInput(p, "section_shape", "Section shape family (I, RHS, CHS)"),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "Wpl_z", "Plastic section modulus about z-z", { symbol: "W_{pl,z}", unit: "mm³" }),
  input(p, "Av_y", "Shear area in y (flanges)", { symbol: "A_{v,y}", unit: "mm²" }),
  input(p, "Av_z", "Shear area in z (≈ A_w = h_w t_w)", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_y_num", "Numerator of V_pl,y,Rd", ["Av_y", "fy"], {
    expression: "A_{v,y}f_y",
    unit: "N",
  }),
  derived(p, "V_pl_y_den", "Denominator of V_pl,y,Rd", ["sqrt3", "gamma_M0"], {
    expression: "\\sqrt{3}\\gamma_{M0}",
  }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance in y", ["V_pl_y_num", "V_pl_y_den"], {
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} f_y / \\sqrt{3}}{\\gamma_{M0}}",
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
  derived(p, "rho_y", "Shear reduction factor", ["rho_ratio", "rho_sq"], {
    symbol: "\\rho",
    expression: "\\left(\\frac{2 V_{y,Ed}}{V_{pl,y,Rd}} - 1\\right)^2",
  }),
  derived(p, "Wpl_z_web", "Web contribution to plastic modulus about z-z", ["Av_z", "tw"], {
    symbol: "W_{pl,z,web}",
    expression: "\\frac{A_{v,z} t_w}{4}",
    unit: "mm³",
  }),
  derived(p, "Wpl_z_flange", "Flange contribution to plastic modulus", ["Wpl_z", "Wpl_z_web"], {
    expression: "W_{pl,z}-W_{pl,z,web}",
    unit: "mm³",
  }),
  derived(p, "rho_flange_reduction", "ρ-weighted flange reduction", ["rho_y", "Wpl_z_flange"], {
    expression: "\\rho\\left(W_{pl,z}-W_{pl,z,web}\\right)",
    unit: "mm³",
  }),
  derived(p, "Wpl_z_eff", "Effective plastic modulus under shear", ["Wpl_z", "rho_flange_reduction"], {
    expression: "W_{pl,z}-\\rho\\left(W_{pl,z}-W_{pl,z,web}\\right)",
    unit: "mm³",
  }),
  derived(p, "M_z_V_num", "Numerator of M_z,V,Rd", ["Wpl_z_eff", "fy"], {
    expression: "\\left[W_{pl,z}-\\rho\\left(W_{pl,z}-W_{pl,z,web}\\right)\\right]f_y",
    unit: "N·mm",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "M_z_V_Rd", "Reduced plastic resistance moment about z-z allowing for shear", ["class_guard", "M_z_V_num", "gamma_M0"], {
    symbol: "M_{z,V,Rd}",
    expression: "\\frac{\\bigl[W_{pl,z} - \\rho\\,(W_{pl,z} - W_{pl,z,web})\\bigr] f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.8", paragraphRef: "(3)" },
  }),
  derived(p, "abs_M_z_Ed", "Absolute design bending moment", ["M_z_Ed"], {
    expression: "\\left|M_{z,Ed}\\right|",
  }),
  check(p, "bending_z_shear_check", "Bending and shear check (z-axis) §6.2.8", ["abs_M_z_Ed", "M_z_V_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{z,V,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.8" },
  }),
] as const;

export const ulsBendingZShear: VerificationDefinition<typeof nodes> = {
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
    Wpl_z_web: ({ Av_z, tw }) => (Av_z * tw) / 4,
    Wpl_z_flange: ({ Wpl_z, Wpl_z_web }) => Wpl_z - Wpl_z_web,
    rho_flange_reduction: ({ rho_y, Wpl_z_flange }) => rho_y * Wpl_z_flange,
    Wpl_z_eff: ({ Wpl_z, rho_flange_reduction }) => Wpl_z - rho_flange_reduction,
    M_z_V_num: ({ Wpl_z_eff, fy }) => Wpl_z_eff * fy,
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-z-shear: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.8",
        });
      }
      return 1;
    },
    M_z_V_Rd: ({ class_guard, M_z_V_num, gamma_M0 }) => class_guard * (M_z_V_num / gamma_M0),
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    bending_z_shear_check: ({ abs_M_z_Ed, M_z_V_Rd }) => abs_M_z_Ed / M_z_V_Rd,
  },
};
