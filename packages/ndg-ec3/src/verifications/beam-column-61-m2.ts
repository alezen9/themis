import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, derived, check } from "@ndg/ndg-core";
import { computeChi, computeChiLT } from "../helpers/reduction-factors";
import { computeKyy, computeKzz, computeKyzMethod1 } from "../helpers/interaction-factors";

/**
 * §6.3.3 Eq.6.61 Method 2 (Annex B)
 * N_Ed/(χ_y·N_Rk/γ_M1) + k_yy·M_y_Ed/(χ_LT·M_y_Rk/γ_M1) + k_yz·M_z_Ed/(M_z_Rk/γ_M1) ≤ 1.0
 */

const p = "beam-column-61-m2";

const nodes = [
  // --- User inputs ---
  input(p, "N_Ed", "Axial force", { symbol: "N_{Ed}", unit: "N" }),
  input(p, "M_y_Ed", "Bending moment y", { symbol: "M_{y,Ed}", unit: "N·mm" }),
  input(p, "M_z_Ed", "Bending moment z", { symbol: "M_{z,Ed}", unit: "N·mm" }),
  input(p, "A", "Area", { unit: "mm²" }),
  input(p, "Wpl_y", "Plastic modulus y", { unit: "mm³" }),
  input(p, "Wpl_z", "Plastic modulus z", { unit: "mm³" }),
  input(p, "fy", "Yield strength", { unit: "MPa" }),
  input(p, "E", "Elastic modulus", { unit: "MPa" }),
  input(p, "Iy", "Inertia y", { unit: "mm⁴" }),
  input(p, "Iz", "Inertia z", { unit: "mm⁴" }),
  input(p, "Lcr_y", "Buckling length y", { unit: "mm" }),
  input(p, "Lcr_z", "Buckling length z", { unit: "mm" }),
  input(p, "alpha_y", "Imperfection factor y"),
  input(p, "alpha_z", "Imperfection factor z"),
  input(p, "alpha_LT", "LTB imperfection factor"),
  input(p, "M_cr", "Elastic critical moment", { unit: "N·mm" }),
  input(p, "Cm_y", "Equivalent moment factor y", { symbol: "C_{m,y}" }),
  input(p, "Cm_z", "Equivalent moment factor z", { symbol: "C_{m,z}" }),
  input(p, "Cm_LT", "Equivalent moment factor LT", { symbol: "C_{m,LT}" }),
  // --- Coefficients ---
  coeff(p, "gamma_M1", "Partial factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  coeff(p, "lambda_LT_0", "LTB plateau", { sectionRef: "6.3.2.3" }),
  coeff(p, "beta_LT", "LTB beta", { sectionRef: "6.3.2.3" }),
  // --- Derived/formula nodes ---
  derived(p, "N_Rk", "Characteristic axial resistance", ["A", "fy"]),
  derived(p, "M_y_Rk", "Characteristic bending resistance y", ["Wpl_y", "fy"]),
  derived(p, "M_z_Rk", "Characteristic bending resistance z", ["Wpl_z", "fy"]),
  // Buckling reduction factors (re-derived independently)
  derived(p, "chi_y", "Reduction factor y", ["A", "fy", "E", "Iy", "Lcr_y", "alpha_y"]),
  derived(p, "chi_z", "Reduction factor z", ["A", "fy", "E", "Iz", "Lcr_z", "alpha_z"]),
  derived(p, "chi_LT", "LTB reduction factor", ["Wpl_y", "fy", "M_cr", "alpha_LT", "lambda_LT_0", "beta_LT"]),
  derived(p, "lambda_bar_y", "Slenderness y", ["A", "fy", "E", "Iy", "Lcr_y"]),
  derived(p, "lambda_bar_z", "Slenderness z", ["A", "fy", "E", "Iz", "Lcr_z"]),
  // Interaction factors
  derived(p, "k_yy", "Interaction factor k_yy", ["Cm_y", "lambda_bar_y", "N_Ed", "chi_y", "N_Rk", "gamma_M1"]),
  derived(p, "k_yz", "Interaction factor k_yz", ["Cm_z", "lambda_bar_z", "N_Ed", "chi_z", "N_Rk", "gamma_M1"]),
  // Check
  check(p, "bc_61_m2_check", "Beam-column Eq.6.61 Method 2", [
    "N_Ed", "M_y_Ed", "M_z_Ed",
    "chi_y", "chi_LT",
    "N_Rk", "M_y_Rk", "M_z_Rk",
    "gamma_M1", "k_yy", "k_yz",
  ], {
    verificationExpression: "\\frac{N_{Ed}}{\\chi_y N_{Rk}/\\gamma_{M1}} + k_{yy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{yz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: { sectionRef: "6.3.3", verificationRef: "(6.61)" },
  }),
] as const;

export const ulsBeamColumn61M2: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_Rk: ({ A, fy }) => A * fy,
    M_y_Rk: ({ Wpl_y, fy }) => Wpl_y * fy,
    M_z_Rk: ({ Wpl_z, fy }) => Wpl_z * fy,
    lambda_bar_y: ({ A, fy, E, Iy, Lcr_y }) =>
      Math.sqrt((A * fy) / ((Math.PI ** 2 * E * Iy) / Lcr_y ** 2)),
    lambda_bar_z: ({ A, fy, E, Iz, Lcr_z }) =>
      Math.sqrt((A * fy) / ((Math.PI ** 2 * E * Iz) / Lcr_z ** 2)),
    chi_y: ({ A, fy, E, Iy, Lcr_y, alpha_y }) =>
      computeChi(A, fy, E, Iy, Lcr_y, alpha_y),
    chi_z: ({ A, fy, E, Iz, Lcr_z, alpha_z }) =>
      computeChi(A, fy, E, Iz, Lcr_z, alpha_z),
    chi_LT: ({ Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT }) =>
      computeChiLT(Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT),
    k_yy: ({ Cm_y, lambda_bar_y, N_Ed, chi_y, N_Rk, gamma_M1 }) => {
      const NbyRd = (chi_y * N_Rk) / gamma_M1;
      return computeKyy(Cm_y, lambda_bar_y, N_Ed, NbyRd);
    },
    k_yz: ({ Cm_z, lambda_bar_z, N_Ed, chi_z, N_Rk, gamma_M1 }) => {
      const NbzRd = (chi_z * N_Rk) / gamma_M1;
      return computeKyzMethod1(computeKzz(Cm_z, lambda_bar_z, N_Ed, NbzRd));
    },
    bc_61_m2_check: ({ N_Ed, M_y_Ed, M_z_Ed, chi_y, chi_LT, N_Rk, M_y_Rk, M_z_Rk, gamma_M1, k_yy, k_yz }) => {
      const term1 = Math.abs(N_Ed) / ((chi_y * N_Rk) / gamma_M1);
      const term2 = k_yy * Math.abs(M_y_Ed) / ((chi_LT * M_y_Rk) / gamma_M1);
      const term3 = k_yz * Math.abs(M_z_Ed) / (M_z_Rk / gamma_M1);
      return term1 + term2 + term3;
    },
  },
};
