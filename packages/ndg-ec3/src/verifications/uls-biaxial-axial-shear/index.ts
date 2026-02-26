import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.2.10 — Bending, shear and axial force.
 * Per §6.2.10(3): when V_Ed > 0.5·V_pl,Rd the cross-section resistance to
 * M+N is computed using reduced yield strength (1-ρ)·f_y for the shear area,
 * then the biaxial interaction eq (6.41) is applied with exponents from §6.2.9.1(6).
 *
 * For I-sections:
 *   M_NV,y,Rd: shear area = A_v,z (web) → use eq (6.30) reduction, then §6.2.9.1(5) eq (6.36)
 *   M_NV,z,Rd: shear area = A_v,y (flanges) → §6.2.8(3) reduction, then §6.2.9.1(5) eq (6.38)
 */

const nodes = [
  {
    type: "user-input",
    key: "M_y_Ed",
    valueType: "number",
    id: "biaxs-M-y-Ed",
    name: "Design bending moment y-y",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "M_z_Ed",
    valueType: "number",
    id: "biaxs-M-z-Ed",
    name: "Design bending moment z-z",
    unit: "N·mm",
    children: [],
  },
  {
    type: "user-input",
    key: "N_Ed",
    valueType: "number",
    id: "biaxs-N-Ed",
    name: "Design axial force",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "V_z_Ed",
    valueType: "number",
    id: "biaxs-V-z-Ed",
    name: "Design shear force z",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "V_y_Ed",
    valueType: "number",
    id: "biaxs-V-y-Ed",
    name: "Design shear force y",
    unit: "N",
    children: [],
  },
  {
    type: "user-input",
    key: "A",
    valueType: "number",
    id: "biaxs-A",
    name: "Cross-sectional area",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_y",
    valueType: "number",
    id: "biaxs-Wpl-y",
    name: "Plastic section modulus y-y",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Wpl_z",
    valueType: "number",
    id: "biaxs-Wpl-z",
    name: "Plastic section modulus z-z",
    unit: "mm³",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_z",
    valueType: "number",
    id: "biaxs-Av-z",
    name: "Shear area in z (≈ A_w = h_w t_w)",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "Av_y",
    valueType: "number",
    id: "biaxs-Av-y",
    name: "Shear area in y (flanges)",
    unit: "mm²",
    children: [],
  },
  {
    type: "user-input",
    key: "tw",
    valueType: "number",
    id: "biaxs-tw",
    name: "Web thickness",
    symbol: "t_w",
    unit: "mm",
    children: [],
  },
  {
    type: "user-input",
    key: "section_shape",
    valueType: "string",
    id: "biaxs-section-shape",
    name: "Section shape family (I, CHS, RHS)",
    children: [],
  },
  {
    type: "user-input",
    key: "fy",
    valueType: "number",
    id: "biaxs-fy",
    name: "Yield strength",
    unit: "MPa",
    children: [],
  },
  {
    type: "coefficient",
    key: "gamma_M0",
    valueType: "number",
    id: "biaxs-gamma-M0",
    name: "Partial safety factor",
    symbol: "\\gamma_{M0}",
    meta: { sectionRef: "6.1" },
    children: [],
  },
  {
    type: "formula",
    key: "V_pl_z_Rd",
    valueType: "number",
    id: "biaxs-V-pl-z-Rd",
    name: "Plastic shear resistance z",
    symbol: "V_{pl,z,Rd}",
    expression: "A_{v,z} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [{ nodeId: "biaxs-Av-z" }, { nodeId: "biaxs-fy" }, { nodeId: "biaxs-gamma-M0" }],
  },
  {
    type: "formula",
    key: "V_pl_y_Rd",
    valueType: "number",
    id: "biaxs-V-pl-y-Rd",
    name: "Plastic shear resistance y",
    symbol: "V_{pl,y,Rd}",
    expression: "A_{v,y} f_y / (\\sqrt{3} \\gamma_{M0})",
    unit: "N",
    meta: { sectionRef: "6.2.6", formulaRef: "(6.18)" },
    children: [{ nodeId: "biaxs-Av-y" }, { nodeId: "biaxs-fy" }, { nodeId: "biaxs-gamma-M0" }],
  },
  {
    type: "derived",
    key: "rho_z",
    valueType: "number",
    id: "biaxs-rho-z",
    name: "Shear interaction z",
    children: [{ nodeId: "biaxs-V-z-Ed" }, { nodeId: "biaxs-V-pl-z-Rd" }],
  },
  {
    type: "derived",
    key: "rho_y",
    valueType: "number",
    id: "biaxs-rho-y",
    name: "Shear interaction y",
    children: [{ nodeId: "biaxs-V-y-Ed" }, { nodeId: "biaxs-V-pl-y-Rd" }],
  },
  {
    type: "formula",
    key: "N_pl_Rd",
    valueType: "number",
    id: "biaxs-N-pl-Rd",
    name: "Plastic resistance",
    symbol: "N_{pl,Rd}",
    expression: "A f_y / \\gamma_{M0}",
    unit: "N",
    meta: { sectionRef: "6.2.4", formulaRef: "(6.6)" },
    children: [{ nodeId: "biaxs-A" }, { nodeId: "biaxs-fy" }, { nodeId: "biaxs-gamma-M0" }],
  },
  {
    type: "derived",
    key: "n",
    valueType: "number",
    id: "biaxs-n",
    name: "Axial force ratio",
    children: [{ nodeId: "biaxs-N-Ed" }, { nodeId: "biaxs-N-pl-Rd" }],
  },
  {
    type: "derived",
    key: "a_w",
    valueType: "number",
    id: "biaxs-a-w",
    name: "Web area ratio",
    children: [{ nodeId: "biaxs-Av-z" }, { nodeId: "biaxs-A" }],
  },
  {
    type: "derived",
    key: "a_f",
    valueType: "number",
    id: "biaxs-a-f",
    name: "Flange area ratio",
    children: [{ nodeId: "biaxs-Av-z" }, { nodeId: "biaxs-A" }],
  },
  {
    type: "formula",
    key: "M_NV_y_Rd",
    valueType: "number",
    id: "biaxs-M-NV-y-Rd",
    name: "Reduced plastic moment y-y (axial + shear) per §6.2.10(3) + §6.2.9.1(5)",
    symbol: "M_{NV,y,Rd}",
    expression: "\\frac{\\left(W_{pl,y} - \\rho_z \\dfrac{A_{v,z}^2}{4t_w}\\right) f_y}{\\gamma_{M0}} \\cdot \\min\\!\\left(1,\\,\\frac{1-n}{1-0.5a_w}\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.30)+(6.36)" },
    children: [
      { nodeId: "biaxs-Wpl-y" }, { nodeId: "biaxs-rho-z" },
      { nodeId: "biaxs-Av-z" }, { nodeId: "biaxs-tw" },
      { nodeId: "biaxs-fy" }, { nodeId: "biaxs-gamma-M0" },
      { nodeId: "biaxs-n" }, { nodeId: "biaxs-a-w" },
    ],
  },
  {
    type: "formula",
    key: "M_NV_z_Rd",
    valueType: "number",
    id: "biaxs-M-NV-z-Rd",
    name: "Reduced plastic moment z-z (axial + shear) per §6.2.10(3) + §6.2.9.1(5)",
    symbol: "M_{NV,z,Rd}",
    expression: "\\frac{\\bigl[W_{pl,z} - \\rho_y(W_{pl,z} - A_{v,z}t_w/4)\\bigr] f_y}{\\gamma_{M0}} \\cdot \\left(1 - \\left(\\frac{n-a_f}{1-a_f}\\right)^2\\right)",
    unit: "N·mm",
    meta: { sectionRef: "6.2.10", formulaRef: "(6.2.8(3))+(6.38)" },
    children: [
      { nodeId: "biaxs-Wpl-z" }, { nodeId: "biaxs-rho-y" },
      { nodeId: "biaxs-Av-z" }, { nodeId: "biaxs-tw" },
      { nodeId: "biaxs-fy" }, { nodeId: "biaxs-gamma-M0" },
      { nodeId: "biaxs-n" }, { nodeId: "biaxs-a-f" },
    ],
  },
  {
    type: "derived",
    key: "alpha_biax",
    valueType: "number",
    id: "biaxs-alpha",
    name: "Biaxial exponent α per §6.2.9.1(6)",
    symbol: "\\alpha",
    children: [{ nodeId: "biaxs-section-shape" }, { nodeId: "biaxs-n" }],
  },
  {
    type: "derived",
    key: "beta_biax",
    valueType: "number",
    id: "biaxs-beta",
    name: "Biaxial exponent β per §6.2.9.1(6)",
    symbol: "\\beta",
    children: [{ nodeId: "biaxs-section-shape" }, { nodeId: "biaxs-n" }],
  },
  {
    type: "check",
    key: "biaxial_axial_shear_check",
    valueType: "number",
    id: "biaxs-check",
    name: "Biaxial bending + axial + shear check",
    verificationExpression:
      "\\left(\\frac{M_{y,Ed}}{M_{NV,y,Rd}}\\right)^\\alpha + \\left(\\frac{M_{z,Ed}}{M_{NV,z,Rd}}\\right)^\\beta \\leq 1.0",
    meta: { sectionRef: "6.2.10", verificationRef: "(6.41)" },
    children: [
      { nodeId: "biaxs-M-y-Ed" }, { nodeId: "biaxs-M-z-Ed" },
      { nodeId: "biaxs-M-NV-y-Rd" }, { nodeId: "biaxs-M-NV-z-Rd" },
      { nodeId: "biaxs-alpha" }, { nodeId: "biaxs-beta" },
    ],
  },
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
      return ((Wpl_red * fy) / gamma_M0) * Math.min(1, (1 - (n as number)) / (1 - 0.5 * (a_w as number)));
    },
    M_NV_z_Rd: ({ Wpl_z, rho_y, Av_z, tw, fy, gamma_M0, n, a_f }) => {
      // §6.2.10(3) + §6.2.8(3): apply (1-ρ)·fy to flanges, then §6.2.9.1(5) eq (6.38)
      const Wpl_z_web = (Av_z as number) * (tw as number) / 4;
      const Wpl_red = (Wpl_z as number) - (rho_y as number) * ((Wpl_z as number) - Wpl_z_web);
      const MplRd = (Wpl_red * (fy as number)) / (gamma_M0 as number);
      if ((n as number) <= (a_f as number)) return MplRd;
      return MplRd * (1 - (((n as number) - (a_f as number)) / (1 - (a_f as number))) ** 2);
    },
    // §6.2.9.1(6): exponents depend on section shape
    alpha_biax: ({ section_shape, n }) => {
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * (n as number) ** 2), 6);
      return 2; // I/H and CHS
    },
    beta_biax: ({ section_shape, n }) => {
      if (section_shape === "CHS") return 2;
      if (section_shape === "RHS") return Math.min(1.66 / (1 - 1.13 * (n as number) ** 2), 6);
      return Math.max(1, 5 * (n as number)); // I/H sections
    },
    biaxial_axial_shear_check: ({
      M_y_Ed, M_z_Ed, M_NV_y_Rd, M_NV_z_Rd, alpha_biax, beta_biax,
    }) =>
      (Math.abs(M_y_Ed) / M_NV_y_Rd) ** alpha_biax +
      (Math.abs(M_z_Ed) / M_NV_z_Rd) ** beta_biax,
  },
};
