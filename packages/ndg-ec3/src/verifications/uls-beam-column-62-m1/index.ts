import type { VerificationDefinition } from "@ndg/ndg-core";

/**
 * §6.3.3 Eq.6.62 Method 1 (Annex A)
 * N_Ed/(χ_z·N_Rk/γ_M1) + k_zy·M_y_Ed/(χ_LT·M_y_Rk/γ_M1) + k_zz·M_z_Ed/(M_z_Rk/γ_M1) ≤ 1.0
 */

const nodes = [
  { type: "user-input", key: "N_Ed", valueType: "number", id: "bc62m1-N-Ed", name: "Axial force", unit: "N", children: [] },
  { type: "user-input", key: "M_y_Ed", valueType: "number", id: "bc62m1-M-y-Ed", name: "Bending moment y", unit: "N·mm", children: [] },
  { type: "user-input", key: "M_z_Ed", valueType: "number", id: "bc62m1-M-z-Ed", name: "Bending moment z", unit: "N·mm", children: [] },
  { type: "user-input", key: "A", valueType: "number", id: "bc62m1-A", name: "Area", unit: "mm²", children: [] },
  { type: "user-input", key: "Wpl_y", valueType: "number", id: "bc62m1-Wpl-y", name: "Plastic modulus y", unit: "mm³", children: [] },
  { type: "user-input", key: "Wpl_z", valueType: "number", id: "bc62m1-Wpl-z", name: "Plastic modulus z", unit: "mm³", children: [] },
  { type: "user-input", key: "fy", valueType: "number", id: "bc62m1-fy", name: "Yield strength", unit: "MPa", children: [] },
  { type: "user-input", key: "E", valueType: "number", id: "bc62m1-E", name: "Elastic modulus", unit: "MPa", children: [] },
  { type: "user-input", key: "Iy", valueType: "number", id: "bc62m1-Iy", name: "Inertia y", unit: "mm⁴", children: [] },
  { type: "user-input", key: "Iz", valueType: "number", id: "bc62m1-Iz", name: "Inertia z", unit: "mm⁴", children: [] },
  { type: "user-input", key: "Lcr_y", valueType: "number", id: "bc62m1-Lcr-y", name: "Buckling length y", unit: "mm", children: [] },
  { type: "user-input", key: "Lcr_z", valueType: "number", id: "bc62m1-Lcr-z", name: "Buckling length z", unit: "mm", children: [] },
  { type: "user-input", key: "alpha_y", valueType: "number", id: "bc62m1-alpha-y", name: "Imperfection factor y", children: [] },
  { type: "user-input", key: "alpha_z", valueType: "number", id: "bc62m1-alpha-z", name: "Imperfection factor z", children: [] },
  { type: "user-input", key: "alpha_LT", valueType: "number", id: "bc62m1-alpha-LT", name: "LTB imperfection factor", children: [] },
  { type: "user-input", key: "M_cr", valueType: "number", id: "bc62m1-M-cr", name: "Elastic critical moment", unit: "N·mm", children: [] },
  { type: "user-input", key: "Cm_y", valueType: "number", id: "bc62m1-Cm-y", name: "Cm,y", children: [] },
  { type: "user-input", key: "Cm_z", valueType: "number", id: "bc62m1-Cm-z", name: "Cm,z", children: [] },
  { type: "user-input", key: "Cm_LT", valueType: "number", id: "bc62m1-Cm-LT", name: "Cm,LT", children: [] },
  { type: "coefficient", key: "gamma_M1", valueType: "number", id: "bc62m1-gamma-M1", name: "Partial factor", symbol: "\\gamma_{M1}", meta: { sectionRef: "6.1" }, children: [] },
  { type: "coefficient", key: "lambda_LT_0", valueType: "number", id: "bc62m1-lLT0", name: "LTB plateau", meta: { sectionRef: "6.3.2.3" }, children: [] },
  { type: "coefficient", key: "beta_LT", valueType: "number", id: "bc62m1-betaLT", name: "LTB beta", meta: { sectionRef: "6.3.2.3" }, children: [] },
  { type: "derived", key: "N_Rk", valueType: "number", id: "bc62m1-N-Rk", name: "N_Rk", children: [{ nodeId: "bc62m1-A" }, { nodeId: "bc62m1-fy" }] },
  { type: "derived", key: "M_y_Rk", valueType: "number", id: "bc62m1-M-y-Rk", name: "M_y_Rk", children: [{ nodeId: "bc62m1-Wpl-y" }, { nodeId: "bc62m1-fy" }] },
  { type: "derived", key: "M_z_Rk", valueType: "number", id: "bc62m1-M-z-Rk", name: "M_z_Rk", children: [{ nodeId: "bc62m1-Wpl-z" }, { nodeId: "bc62m1-fy" }] },
  { type: "derived", key: "chi_y", valueType: "number", id: "bc62m1-chi-y", name: "χ_y", children: [{ nodeId: "bc62m1-A" }, { nodeId: "bc62m1-fy" }, { nodeId: "bc62m1-E" }, { nodeId: "bc62m1-Iy" }, { nodeId: "bc62m1-Lcr-y" }, { nodeId: "bc62m1-alpha-y" }] },
  { type: "derived", key: "chi_z", valueType: "number", id: "bc62m1-chi-z", name: "χ_z", children: [{ nodeId: "bc62m1-A" }, { nodeId: "bc62m1-fy" }, { nodeId: "bc62m1-E" }, { nodeId: "bc62m1-Iz" }, { nodeId: "bc62m1-Lcr-z" }, { nodeId: "bc62m1-alpha-z" }] },
  { type: "derived", key: "chi_LT", valueType: "number", id: "bc62m1-chi-LT", name: "χ_LT", children: [{ nodeId: "bc62m1-Wpl-y" }, { nodeId: "bc62m1-fy" }, { nodeId: "bc62m1-M-cr" }, { nodeId: "bc62m1-alpha-LT" }, { nodeId: "bc62m1-lLT0" }, { nodeId: "bc62m1-betaLT" }] },
  { type: "derived", key: "lambda_bar_y", valueType: "number", id: "bc62m1-lb-y", name: "λ̄_y", children: [{ nodeId: "bc62m1-A" }, { nodeId: "bc62m1-fy" }, { nodeId: "bc62m1-E" }, { nodeId: "bc62m1-Iy" }, { nodeId: "bc62m1-Lcr-y" }] },
  { type: "derived", key: "lambda_bar_z", valueType: "number", id: "bc62m1-lb-z", name: "λ̄_z", children: [{ nodeId: "bc62m1-A" }, { nodeId: "bc62m1-fy" }, { nodeId: "bc62m1-E" }, { nodeId: "bc62m1-Iz" }, { nodeId: "bc62m1-Lcr-z" }] },
  { type: "derived", key: "k_zy", valueType: "number", id: "bc62m1-kzy", name: "k_zy", children: [{ nodeId: "bc62m1-Cm-LT" }, { nodeId: "bc62m1-lb-z" }, { nodeId: "bc62m1-N-Ed" }, { nodeId: "bc62m1-chi-z" }, { nodeId: "bc62m1-N-Rk" }, { nodeId: "bc62m1-gamma-M1" }] },
  { type: "derived", key: "k_zz", valueType: "number", id: "bc62m1-kzz", name: "k_zz", children: [{ nodeId: "bc62m1-Cm-z" }, { nodeId: "bc62m1-lb-z" }, { nodeId: "bc62m1-N-Ed" }, { nodeId: "bc62m1-chi-z" }, { nodeId: "bc62m1-N-Rk" }, { nodeId: "bc62m1-gamma-M1" }] },
  {
    type: "check",
    key: "bc_62_m1_check",
    valueType: "number",
    id: "bc62m1-check",
    name: "Beam-column Eq.6.62 Method 1",
    verificationExpression: "\\frac{N_{Ed}}{\\chi_z N_{Rk}/\\gamma_{M1}} + k_{zy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{zz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: { sectionRef: "6.3.3", verificationRef: "(6.62)" },
    children: [
      { nodeId: "bc62m1-N-Ed" }, { nodeId: "bc62m1-M-y-Ed" }, { nodeId: "bc62m1-M-z-Ed" },
      { nodeId: "bc62m1-chi-z" }, { nodeId: "bc62m1-chi-LT" },
      { nodeId: "bc62m1-N-Rk" }, { nodeId: "bc62m1-M-y-Rk" }, { nodeId: "bc62m1-M-z-Rk" },
      { nodeId: "bc62m1-gamma-M1" }, { nodeId: "bc62m1-kzy" }, { nodeId: "bc62m1-kzz" },
    ],
  },
] as const;

function computeChi(A: number, fy: number, E: number, I: number, Lcr: number, alpha: number): number {
  const Ncr = (Math.PI ** 2 * E * I) / Lcr ** 2;
  const lb = Math.sqrt((A * fy) / Ncr);
  const phi = 0.5 * (1 + alpha * (lb - 0.2) + lb ** 2);
  return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
}

function computeChiLT(Wpl_y: number, fy: number, M_cr: number, alpha_LT: number, lLT0: number, betaLT: number): number {
  const lb = Math.sqrt((Wpl_y * fy) / M_cr);
  const phi = 0.5 * (1 + alpha_LT * (lb - lLT0) + betaLT * lb ** 2);
  const val = 1 / (phi + Math.sqrt(phi ** 2 - betaLT * lb ** 2));
  return Math.min(1, Math.min(val, 1 / lb ** 2));
}

export const ulsBeamColumn62M1: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_Rk: ({ A, fy }) => A * fy,
    M_y_Rk: ({ Wpl_y, fy }) => Wpl_y * fy,
    M_z_Rk: ({ Wpl_z, fy }) => Wpl_z * fy,
    chi_y: ({ A, fy, E, Iy, Lcr_y, alpha_y }) => computeChi(A, fy, E, Iy, Lcr_y, alpha_y),
    chi_z: ({ A, fy, E, Iz, Lcr_z, alpha_z }) => computeChi(A, fy, E, Iz, Lcr_z, alpha_z),
    chi_LT: ({ Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT }) =>
      computeChiLT(Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT),
    lambda_bar_y: ({ A, fy, E, Iy, Lcr_y }) =>
      Math.sqrt((A * fy) / ((Math.PI ** 2 * E * Iy) / Lcr_y ** 2)),
    lambda_bar_z: ({ A, fy, E, Iz, Lcr_z }) =>
      Math.sqrt((A * fy) / ((Math.PI ** 2 * E * Iz) / Lcr_z ** 2)),
    k_zy: ({ Cm_y, lambda_bar_y, N_Ed, chi_y, N_Rk, gamma_M1 }) => {
      // Method 1: k_zy = 0.6 · k_yy
      const NbyRd = (chi_y * N_Rk) / gamma_M1;
      const k_yy_val = Math.min(
        Cm_y * (1 + (lambda_bar_y - 0.2) * (Math.abs(N_Ed) / NbyRd)),
        Cm_y * (1 + 0.8 * (Math.abs(N_Ed) / NbyRd)),
      );
      return 0.6 * k_yy_val;
    },
    k_zz: ({ Cm_z, lambda_bar_z, N_Ed, chi_z, N_Rk, gamma_M1 }) => {
      const NbzRd = (chi_z * N_Rk) / gamma_M1;
      return Math.min(
        Cm_z * (1 + (2 * lambda_bar_z - 0.6) * (Math.abs(N_Ed) / NbzRd)),
        Cm_z * (1 + 1.4 * (Math.abs(N_Ed) / NbzRd)),
      );
    },
    bc_62_m1_check: ({ N_Ed, M_y_Ed, M_z_Ed, chi_z, chi_LT, N_Rk, M_y_Rk, M_z_Rk, gamma_M1, k_zy, k_zz }) => {
      const term1 = Math.abs(N_Ed) / ((chi_z * N_Rk) / gamma_M1);
      const term2 = k_zy * Math.abs(M_y_Ed) / ((chi_LT * M_y_Rk) / gamma_M1);
      const term3 = k_zz * Math.abs(M_z_Ed) / (M_z_Rk / gamma_M1);
      return term1 + term2 + term3;
    },
  },
};
