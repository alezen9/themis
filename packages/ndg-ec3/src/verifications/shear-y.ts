import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, constant, derived, formula, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/** §6.2.6 -- Shear resistance (y-axis): V_y_Ed / V_pl_y_Rd ≤ 1.0 */

const p = "shear-y";

const nodes = [
  input(p, "V_y_Ed", "Design shear force in y", { symbol: "V_{y,Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "Av_y", "Shear area in y", { symbol: "A_{v,y}", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  constant(p, "sqrt3", "Square root of three", { symbol: "\\sqrt{3}" }),
  derived(p, "V_pl_y_num", "Numerator of V_pl,y,Rd", ["Av_y", "fy"], {
    expression: "A_{v,y} f_y",
    unit: "N",
  }),
  derived(p, "V_pl_y_den", "Denominator of V_pl,y,Rd", ["sqrt3", "gamma_M0"], {
    expression: "\\sqrt{3}\\gamma_{M0}",
  }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance in y", ["V_pl_y_num", "V_pl_y_den"], {
    symbol: "V_{pl,y,Rd}",
    expression: "\\frac{A_{v,y} \\cdot f_y / \\sqrt{3}}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "abs_V_y_Ed", "Absolute design shear force in y", ["V_y_Ed"], {
    expression: "\\left|V_{y,Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  check(p, "shear_y_check", "Shear resistance check (y-axis)", ["class_guard", "abs_V_y_Ed", "V_pl_y_Rd"], {
    verificationExpression: "\\frac{V_{y,Ed}}{V_{pl,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.6", verificationRef: "(6.17)" },
  }),
] as const;

export const ulsShearY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_y_num: ({ Av_y, fy }) => Av_y * fy,
    V_pl_y_den: ({ sqrt3, gamma_M0 }) => sqrt3 * gamma_M0,
    V_pl_y_Rd: ({ V_pl_y_num, V_pl_y_den }) => V_pl_y_num / V_pl_y_den,
    abs_V_y_Ed: ({ V_y_Ed }) => Math.abs(V_y_Ed),
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("shear-y: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.6",
        });
      }
      return 1;
    },
    shear_y_check: ({ class_guard, abs_V_y_Ed, V_pl_y_Rd }) => class_guard * (abs_V_y_Ed / V_pl_y_Rd),
  },
};
