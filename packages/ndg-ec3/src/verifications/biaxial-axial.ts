import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.9.1(6) -- Biaxial bending and axial force, eq (6.41).
 * (M_y_Ed / M_N_y_Rd)^α + (M_z_Ed / M_N_z_Rd)^β ≤ 1.0
 *
 * Exponents per §6.2.9.1(6):
 *   I/H sections:  α = 2,  β = max(1, 5n)
 *   CHS:           α = 2,  β = 2
 *   RHS:           α = β = 1.66/(1 − 1.13n²)  but ≤ 6
 */

const p = "biaxial";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment about y-y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "M_z_Ed", "Design bending moment about z-z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic section modulus z-z", { unit: "mm³" }),
  input(p, "Av_z", "Shear area z", { unit: "mm²" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "N_pl_Rd", "Plastic resistance", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "n", "Axial force ratio", ["N_Ed", "N_pl_Rd"], {
    symbol: "n",
  }),
  derived(p, "a_w", "Web area ratio a=(A-2bt_f)/A ≈ A_v,z/A", ["Av_z", "A"]),
  derived(p, "a_f", "Web area ratio a=(A-2bt_f)/A ≈ A_v,z/A (same as a_w for I-sections)", ["Av_z", "A"]),
  formula(p, "M_N_y_Rd", "Reduced bending resistance y-y", ["Wpl_y", "fy", "gamma_M0", "n", "a_w"], {
    symbol: "M_{N,y,Rd}",
    expression: "M_{pl,y,Rd} \\min(1, (1-n)/(1-0.5a_w))",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.36)" },
  }),
  formula(p, "M_N_z_Rd", "Reduced bending resistance z-z", ["Wpl_z", "fy", "gamma_M0", "n", "a_f"], {
    symbol: "M_{N,z,Rd}",
    expression: "M_{pl,z,Rd} (1 - ((n-a_f)/(1-a_f))^2)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.9.1", formulaRef: "(6.38)" },
  }),
  stringInput(p, "section_shape", "Section shape family (I, CHS, RHS)"),
  derived(p, "alpha_biax", "Biaxial exponent α per §6.2.9.1(6)", ["section_shape", "n"], {
    symbol: "\\alpha",
  }),
  derived(p, "beta_biax", "Biaxial exponent β per §6.2.9.1(6)", ["section_shape", "n"], {
    symbol: "\\beta",
  }),
  check(p, "biaxial_axial_check", "Biaxial bending and axial force check", ["M_y_Ed", "M_z_Ed", "M_N_y_Rd", "M_N_z_Rd", "alpha_biax", "beta_biax"], {
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{N,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{N,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: { sectionRef: "6.2.9.1", verificationRef: "(6.41)" },
  }),
] as const;

export const ulsBiaxialAxial: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    // EC3 §6.2.9.1(5): same 'a' (web fraction) for both y-y and z-z reductions
    a_f: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    M_N_y_Rd: ({ Wpl_y, fy, gamma_M0, n, a_w }) => {
      const MplRd = (Wpl_y * fy) / gamma_M0;
      return MplRd * Math.min(1, (1 - n) / (1 - 0.5 * a_w));
    },
    M_N_z_Rd: ({ Wpl_z, fy, gamma_M0, n, a_f }) => {
      const MplRd = (Wpl_z * fy) / gamma_M0;
      if (n <= a_f) return MplRd;
      return MplRd * (1 - ((n - a_f) / (1 - a_f)) ** 2);
    },
    // §6.2.9.1(6): exponents depend on section shape
    alpha_biax: ({ section_shape, n }) => {
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * n ** 2), 6);
      return 2; // I/H and CHS
    },
    beta_biax: ({ section_shape, n }) => {
      if (section_shape === "CHS") return 2;
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * n ** 2), 6);
      return Math.max(1, 5 * n); // I/H sections
    },
    biaxial_axial_check: ({
      M_y_Ed,
      M_z_Ed,
      M_N_y_Rd,
      M_N_z_Rd,
      alpha_biax,
      beta_biax,
    }) =>
      (Math.abs(M_y_Ed) / M_N_y_Rd) ** alpha_biax +
      (Math.abs(M_z_Ed) / M_N_z_Rd) ** beta_biax,
  },
};
