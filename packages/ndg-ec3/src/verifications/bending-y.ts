import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/** §6.2.5 -- Bending resistance about y-y: M_y_Ed / M_c_y_Rd ≤ 1.0 */

const p = "bending-y";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "Wel_y", "Elastic section modulus about y-y", { symbol: "W_{el,y}", unit: "mm³" }),
  input(p, "Wpl_y", "Plastic section modulus about y-y", { symbol: "W_{pl,y}", unit: "mm³" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_y_res", "Class-dependent section modulus for y bending", ["section_class", "Wpl_y", "Wel_y"], {
    expression: "c=3?W_{el,y}:W_{pl,y}",
  }),
  formula(p, "M_c_y_Rd", "Design resistance for bending about y-y", ["class_guard", "W_y_res", "fy", "gamma_M0"], {
    symbol: "M_{c,y,Rd}",
    expression: "\\frac{W_{res,y} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "abs_M_y_Ed", "Absolute design bending moment about y-y", ["M_y_Ed"], {
    expression: "\\left|M_{y,Ed}\\right|",
    unit: "N·mm",
  }),
  check(p, "bending_y_check", "Bending resistance about y-y check", ["abs_M_y_Ed", "M_c_y_Rd"], {
    verificationExpression: "\\frac{M_{y,Ed}}{M_{c,y,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
  }),
] as const;

export const ulsBendingY: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-y: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.5",
        });
      }
      return 1;
    },
    W_y_res: ({ section_class, Wpl_y, Wel_y }) => (section_class === 3 ? Wel_y : Wpl_y),
    M_c_y_Rd: ({ class_guard, W_y_res, fy, gamma_M0 }) => class_guard * ((W_y_res * fy) / gamma_M0),
    abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
    bending_y_check: ({ abs_M_y_Ed, M_c_y_Rd }) => abs_M_y_Ed / M_c_y_Rd,
  },
};
