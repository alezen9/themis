import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, stringInput, coeff, formula, derived, check } from "@ndg/ndg-core";

/**
 * §6.2.10 -- Bending, shear and axial force.
 * Per §6.2.10(3): when V_Ed > 0.5·V_pl,Rd the cross-section resistance to
 * M+N is computed using reduced yield strength (1-ρ)·f_y for the shear area,
 * then the biaxial interaction eq (6.41) is applied with exponents from §6.2.9.1(6).
 *
 * For I-sections:
 *   M_NV,y,Rd: shear area = A_v,z (web) → use eq (6.30) reduction, then §6.2.9.1(5) eq (6.36)
 *   M_NV,z,Rd: shear area = A_v,y (flanges) → §6.2.8(3) reduction, then §6.2.9.1(5) eq (6.38)
 */

const p = "biaxial-shear";

const nodes = [
  input(p, "M_y_Ed", "Design bending moment y-y", { unit: "N·mm" }),
  input(p, "M_z_Ed", "Design bending moment z-z", { unit: "N·mm" }),
  input(p, "N_Ed", "Design axial force", { unit: "N" }),
  input(p, "V_z_Ed", "Design shear force z", { unit: "N" }),
  input(p, "V_y_Ed", "Design shear force y", { unit: "N" }),
  input(p, "A", "Cross-sectional area", { unit: "mm²" }),
  input(p, "Wpl_y", "Plastic section modulus y-y", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic section modulus z-z", { unit: "mm³" }),
  input(p, "Av_z", "Shear area in z (≈ A_w = h_w t_w)", { unit: "mm²" }),
  input(p, "Av_y", "Shear area in y (flanges)", { unit: "mm²" }),
  input(p, "tw", "Web thickness", { symbol: "t_w", unit: "mm" }),
  stringInput(p, "section_shape", "Section shape family (I, CHS, RHS)"),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  coeff(p, "gamma_M0", "Partial safety factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M0}" }),
  formula(p, "V_pl_z_Rd", "Plastic shear resistance z", ["Av_z", "fy", "gamma_M0"], {
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  formula(p, "V_pl_y_Rd", "Plastic shear resistance y", ["Av_y", "fy", "gamma_M0"], {
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
  }),
  derived(p, "rho_z", "Shear interaction z", ["V_z_Ed", "V_pl_z_Rd"]),
  derived(p, "rho_y", "Shear interaction y", ["V_y_Ed", "V_pl_y_Rd"]),
  formula(p, "N_pl_Rd", "Plastic resistance", ["A", "fy", "gamma_M0"], {
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
  }),
  derived(p, "n", "Axial force ratio", ["N_Ed", "N_pl_Rd"]),
  derived(p, "a_w", "Web area ratio", ["Av_z", "A"]),
  derived(p, "a_f", "Flange area ratio", ["Av_z", "A"]),
  formula(p, "M_NV_y_Rd", "Reduced plastic moment y-y (axial + shear) per §6.2.10(3) + §6.2.9.1(5)", ["Wpl_y", "rho_z", "Av_z", "tw", "fy", "gamma_M0", "n", "a_w"], {
    symbol: "M_{NV,y,Rd}",
    expression: "\\frac{\\left(W_{pl,y} - \\rho_z \\dfrac{A_{v,z}^2}{4t_w}\\right) f_y}{\\gamma_{M0}} \\cdot \\min\\!\\left(1,\\,\\frac{1-n}{1-0.5a_w}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.30)+(6.36)" },
  }),
  formula(p, "M_NV_z_Rd", "Reduced plastic moment z-z (axial + shear) per §6.2.10(3) + §6.2.9.1(5)", ["Wpl_z", "rho_y", "Av_z", "tw", "fy", "gamma_M0", "n", "a_f"], {
    symbol: "M_{NV,z,Rd}",
    expression: "\\frac{\\bigl[W_{pl,z} - \\rho_y(W_{pl,z} - A_{v,z}t_w/4)\\bigr] f_y}{\\gamma_{M0}} \\cdot \\left(1 - \\left(\\frac{n-a_f}{1-a_f}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.2.8(3))+(6.38)" },
  }),
  derived(p, "alpha_biax", "Biaxial exponent α per §6.2.9.1(6)", ["section_shape", "n"], {
    symbol: "\\alpha",
  }),
  derived(p, "beta_biax", "Biaxial exponent β per §6.2.9.1(6)", ["section_shape", "n"], {
    symbol: "\\beta",
  }),
  check(p, "biaxial_axial_shear_check", "Biaxial bending + axial + shear check", ["M_y_Ed", "M_z_Ed", "M_NV_y_Rd", "M_NV_z_Rd", "alpha_biax", "beta_biax"], {
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{NV,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{NV,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: { sectionRef: "6.2.10", verificationRef: "(6.41)" },
  }),
] as const;

export const ulsBiaxialAxialShear: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) =>
      (Av_z * (fy / Math.sqrt(3))) / gamma_M0,
    V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) =>
      (Av_y * (fy / Math.sqrt(3))) / gamma_M0,
    rho_z: ({ V_z_Ed, V_pl_z_Rd }) => {
      const r = Math.abs(V_z_Ed) / V_pl_z_Rd;
      return r <= 0.5 ? 0 : (2 * r - 1) ** 2;
    },
    rho_y: ({ V_y_Ed, V_pl_y_Rd }) => {
      const r = Math.abs(V_y_Ed) / V_pl_y_Rd;
      return r <= 0.5 ? 0 : (2 * r - 1) ** 2;
    },
    N_pl_Rd: ({ A, fy, gamma_M0 }) => (A * fy) / gamma_M0,
    n: ({ N_Ed, N_pl_Rd }) => Math.abs(N_Ed) / N_pl_Rd,
    a_w: ({ Av_z, A }) => Math.min(Av_z / A, 0.5),
    a_f: ({ Av_z, A }) => Math.min((A - Av_z) / A, 0.5),
    M_NV_y_Rd: ({ Wpl_y, rho_z, Av_z, tw, fy, gamma_M0, n, a_w }) => {
      // §6.2.10(3) + §6.2.8(5) eq (6.30): shear-reduced Wpl,y, then §6.2.9.1(5) eq (6.36)
      const Wpl_red = Wpl_y - rho_z * Av_z ** 2 / (4 * tw);
      return ((Wpl_red * fy) / gamma_M0) * Math.min(1, (1 - n) / (1 - 0.5 * a_w));
    },
    M_NV_z_Rd: ({ Wpl_z, rho_y, Av_z, tw, fy, gamma_M0, n, a_f }) => {
      // §6.2.10(3) + §6.2.8(3): apply (1-ρ)·fy to flanges, then §6.2.9.1(5) eq (6.38)
      const Wpl_z_web = Av_z * tw / 4;
      const Wpl_red = Wpl_z - rho_y * (Wpl_z - Wpl_z_web);
      const MplRd = (Wpl_red * fy) / gamma_M0;
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
    biaxial_axial_shear_check: ({
      M_y_Ed, M_z_Ed, M_NV_y_Rd, M_NV_z_Rd, alpha_biax, beta_biax,
    }) =>
      (Math.abs(M_y_Ed) / M_NV_y_Rd) ** alpha_biax +
      (Math.abs(M_z_Ed) / M_NV_z_Rd) ** beta_biax,
  },
};
