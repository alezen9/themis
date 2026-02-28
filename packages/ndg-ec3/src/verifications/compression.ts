import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableLoadCase, throwNotApplicableSectionClass } from "../errors";

/** §6.2.4 -- Compression resistance: N_Ed / N_c_Rd ≤ 1.0 */

const p = "compression";

const nodes = [
  input(p, "N_Ed", "Design compression force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "A", "Cross-sectional area", { symbol: "A", unit: "mm²" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_c_Rd", "Design resistance to normal forces", ["A", "fy", "gamma_M0"], {
    symbol: "N_{c,Rd}",
    expression: "\\frac{A \\cdot f_y}{\\gamma_{M0}}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.10)" },
  }),
  derived(p, "abs_N_Ed", "Absolute design compression force", ["N_Ed"], {
    expression: "\\left|N_{Ed}\\right|",
    unit: "N",
  }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  check(p, "compression_check", "Cross-section compression resistance", ["class_guard", "abs_N_Ed", "N_c_Rd"], {
    verificationExpression: "\\frac{N_{Ed}}{N_{c,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.4", verificationRef: "(6.9)" },
  }),
] as const;

export const ulsCompression: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_c_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    abs_N_Ed: ({ N_Ed }) => {
      if (N_Ed >= 0) {
        throwNotApplicableLoadCase("compression: verification is only applicable for compression (N_Ed < 0)", {
          N_Ed,
          sectionRef: "6.2.4",
        });
      }
      return -N_Ed;
    },
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("compression: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.4",
        });
      }
      return 1;
    },
    compression_check: ({ class_guard, abs_N_Ed, N_c_Rd }) => class_guard * (abs_N_Ed / N_c_Rd),
  },
};
