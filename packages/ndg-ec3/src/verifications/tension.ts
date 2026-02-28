import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/** §6.2.3 -- Tension resistance: N_Ed / N_pl_Rd ≤ 1.0 */

const p = "tension";

const nodes = [
  input(p, "N_Ed", "Design tensile force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_pl_Rd", "Design plastic resistance to normal forces", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.3", formulaRef: "(6.6)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design tensile force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  check(p, "tension_check", "Tension resistance check", ["class_guard", "abs_N_Ed", "N_pl_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.3", verificationRef: "(6.5)" },
  }),
] as const;

export const ulsTension: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => Math.max(N_Ed, 0),
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("tension: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.3",
        });
      }
      return 1;
    },
    tension_check: ({ class_guard, abs_N_Ed, N_pl_Rd }) => class_guard * (abs_N_Ed / N_pl_Rd),
  },
};
