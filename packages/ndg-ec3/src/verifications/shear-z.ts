import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, constant, derived, formula, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/** §6.2.6 -- Shear resistance (z-axis): V_z_Ed / V_pl_z_Rd ≤ 1.0 */

const p = "shear-z";

const nodes = [
  input(p, "V_z_Ed", "Design shear force in z", { symbol: "V_{z,Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "Av_z", "Shear area in z", { symbol: "A_{v,z}", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_z_num", "Numerator of V_pl,z,Rd", ["Av_z", "fy"], {
    expression: "A_{v,z} f_y",
    unit: "N",
  }),
  derived(p, "V_pl_z_den", "Denominator of V_pl,z,Rd", ["sqrt3", "gamma_M0"], {
    expression: "\\sqrt{3}\\gamma_{M0}",
  }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance in z", ["V_pl_z_num", "V_pl_z_den"], {
    symbol: "V_{pl,z,Rd}",
    expression: "\\frac{A_{v,z} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "abs_V_z_Ed", "Absolute design shear force in z", ["V_z_Ed"], {
    expression: "\\left|V_{z,Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  check(p, "shear_z_check", "Shear resistance check (z-axis)", ["class_guard", "abs_V_z_Ed", "V_pl_z_Rd"], {
    verificationExpression: "\\frac{V_{z,Ed}}{V_{pl,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
  }),
] as const;

export const ulsShearZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_num: ({ Av_z, fy }) => Av_z * fy,
    V_pl_z_den: ({ sqrt3, gamma_M0 }) => sqrt3 * gamma_M0,
    V_pl_z_Rd: ({ V_pl_z_num, V_pl_z_den }) => V_pl_z_num / V_pl_z_den,
    abs_V_z_Ed: ({ V_z_Ed }) => Math.abs(V_z_Ed),
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("shear-z: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.6",
        });
      }
      return 1;
    },
    shear_z_check: ({ class_guard, abs_V_z_Ed, V_pl_z_Rd }) => class_guard * (abs_V_z_Ed / V_pl_z_Rd),
  },
};
