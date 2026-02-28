import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, formula, derived, check } from "@ndg/ndg-core";
import { throwNotApplicableSectionClass } from "../errors";

/** §6.2.5 -- Bending resistance about z-z: M_z_Ed / M_c_z_Rd ≤ 1.0 */

const p = "bending-z";

const nodes = [
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "section_class", "Section class (1, 2, 3, 4)"),
  input(p, "Wel_z", "Elastic section modulus about z-z", { symbol: "W_{el,z}", unit: "mm³" }),
  input(p, "Wpl_z", "Plastic section modulus about z-z", { symbol: "W_{pl,z}", unit: "mm³" }),
  input(p, "fy", "Yield strength", { symbol: "f_y", unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  derived(p, "class_guard", "Section class applicability guard", ["section_class"], {
    expression: "\\text{section class guard}",
  }),
  derived(p, "W_z_res", "Class-dependent section modulus for z bending", ["section_class", "Wpl_z", "Wel_z"], {
    expression: "c=3?W_{el,z}:W_{pl,z}",
  }),
  formula(p, "M_c_z_Rd", "Design resistance for bending about z-z", ["class_guard", "W_z_res", "fy", "gamma_M0"], {
    symbol: "M_{c,z,Rd}",
    expression: "\\frac{W_{res,z} \\cdot f_y}{\\gamma_{M0}}",
    unit: "N·mm",
    meta: { sectionRef: "6.2.5", formulaRef: "(6.13)" },
  }),
  derived(p, "abs_M_z_Ed", "Absolute design bending moment about z-z", ["M_z_Ed"], {
    expression: "\\left|M_{z,Ed}\\right|",
    unit: "N·mm",
  }),
  check(p, "bending_z_check", "Bending resistance about z-z check", ["abs_M_z_Ed", "M_c_z_Rd"], {
    verificationExpression: "\\frac{M_{z,Ed}}{M_{c,z,Rd}} \\leq 1.0",
    meta: { sectionRef: "6.2.5", verificationRef: "(6.12)" },
  }),
] as const;

export const ulsBendingZ: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    class_guard: ({ section_class }) => {
      if (section_class === 4) {
        throwNotApplicableSectionClass("bending-z: class 4 sections are out of scope", {
          section_class,
          sectionRef: "6.2.5",
        });
      }
      return 1;
    },
    W_z_res: ({ section_class, Wpl_z, Wel_z }) => (section_class === 3 ? Wel_z : Wpl_z),
    M_c_z_Rd: ({ class_guard, W_z_res, fy, gamma_M0 }) => class_guard * ((W_z_res * fy) / gamma_M0),
    abs_M_z_Ed: ({ M_z_Ed }) => Math.abs(M_z_Ed),
    bending_z_check: ({ abs_M_z_Ed, M_c_z_Rd }) => abs_M_z_Ed / M_c_z_Rd,
  },
};
