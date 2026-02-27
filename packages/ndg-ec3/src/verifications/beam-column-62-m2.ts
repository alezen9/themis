import type { VerificationDefinition } from "@ndg/ndg-core";
import { input, coeff, derived, check } from "@ndg/ndg-core";
import { computeChi, computeChiLT } from "../helpers/reduction-factors";
import { computeKzz, computeKzyMethod2 } from "../helpers/interaction-factors";

/**
 * §6.3.3 Eq.6.62 Method 2 (Annex B)
 * N_Ed/(χ_z·N_Rk/γ_M1) + k_zy·M_y_Ed/(χ_LT·M_y_Rk/γ_M1) + k_zz·M_z_Ed/(M_z_Rk/γ_M1) ≤ 1.0
 */

const p = "beam-column-62-m2";

const nodes = [
  input(p, "N_Ed", "Axial force", { unit: "N" }),
  input(p, "M_y_Ed", "Bending moment y", { unit: "N·mm" }),
  input(p, "M_z_Ed", "Bending moment z", { unit: "N·mm" }),
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
  input(p, "Cm_y", "Cm,y"),
  input(p, "Cm_z", "Cm,z"),
  input(p, "Cm_LT", "Cm,LT"),
  coeff(p, "gamma_M1", "Partial factor", { sectionRef: "6.1" }, { symbol: "\\gamma_{M1}" }),
  coeff(p, "lambda_LT_0", "LTB plateau", { sectionRef: "6.3.2.3" }),
  coeff(p, "beta_LT", "LTB beta", { sectionRef: "6.3.2.3" }),
  derived(p, "N_Rk", "N_Rk", ["A", "fy"]),
  derived(p, "M_y_Rk", "M_y_Rk", ["Wpl_y", "fy"]),
  derived(p, "M_z_Rk", "M_z_Rk", ["Wpl_z", "fy"]),
  derived(p, "chi_y", "χ_y", ["A", "fy", "E", "Iy", "Lcr_y", "alpha_y"]),
  derived(p, "chi_z", "χ_z", ["A", "fy", "E", "Iz", "Lcr_z", "alpha_z"]),
  derived(p, "chi_LT", "χ_LT", ["Wpl_y", "fy", "M_cr", "alpha_LT", "lambda_LT_0", "beta_LT"]),
  derived(p, "lambda_bar_z", "λ̄_z", ["A", "fy", "E", "Iz", "Lcr_z"]),
  derived(p, "k_zy", "k_zy", ["Cm_LT", "lambda_bar_z", "N_Ed", "chi_z", "N_Rk", "gamma_M1"]),
  derived(p, "k_zz", "k_zz", ["Cm_z", "lambda_bar_z", "N_Ed", "chi_z", "N_Rk", "gamma_M1"]),
  check(p, "bc_62_m2_check", "Beam-column Eq.6.62 Method 2", [
    "N_Ed", "M_y_Ed", "M_z_Ed",
    "chi_z", "chi_LT",
    "N_Rk", "M_y_Rk", "M_z_Rk",
    "gamma_M1", "k_zy", "k_zz",
  ], {
    verificationExpression: "\\frac{N_{Ed}}{\\chi_z N_{Rk}/\\gamma_{M1}} + k_{zy}\\frac{M_{y,Ed}}{\\chi_{LT} M_{y,Rk}/\\gamma_{M1}} + k_{zz}\\frac{M_{z,Ed}}{M_{z,Rk}/\\gamma_{M1}} \\leq 1.0",
    meta: { sectionRef: "6.3.3", verificationRef: "(6.62)" },
  }),
] as const;

export const ulsBeamColumn62M2: VerificationDefinition<typeof nodes> = {
  nodes,
  evaluate: {
    N_Rk: ({ A, fy }) => A * fy,
    M_y_Rk: ({ Wpl_y, fy }) => Wpl_y * fy,
    M_z_Rk: ({ Wpl_z, fy }) => Wpl_z * fy,
    chi_y: ({ A, fy, E, Iy, Lcr_y, alpha_y }) => computeChi(A, fy, E, Iy, Lcr_y, alpha_y),
    chi_z: ({ A, fy, E, Iz, Lcr_z, alpha_z }) => computeChi(A, fy, E, Iz, Lcr_z, alpha_z),
    chi_LT: ({ Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT }) =>
      computeChiLT(Wpl_y, fy, M_cr, alpha_LT, lambda_LT_0, beta_LT),
    lambda_bar_z: ({ A, fy, E, Iz, Lcr_z }) =>
      Math.sqrt((A * fy) / ((Math.PI ** 2 * E * Iz) / Lcr_z ** 2)),
    k_zy: ({ Cm_LT, lambda_bar_z, N_Ed, chi_z, N_Rk, gamma_M1 }) => {
      const NbzRd = (chi_z * N_Rk) / gamma_M1;
      return computeKzyMethod2(Cm_LT, lambda_bar_z, N_Ed, NbzRd);
    },
    k_zz: ({ Cm_z, lambda_bar_z, N_Ed, chi_z, N_Rk, gamma_M1 }) => {
      const NbzRd = (chi_z * N_Rk) / gamma_M1;
      return computeKzz(Cm_z, lambda_bar_z, N_Ed, NbzRd);
    },
    bc_62_m2_check: ({ N_Ed, M_y_Ed, M_z_Ed, chi_z, chi_LT, N_Rk, M_y_Rk, M_z_Rk, gamma_M1, k_zy, k_zz }) => {
      const term1 = Math.abs(N_Ed) / ((chi_z * N_Rk) / gamma_M1);
      const term2 = k_zy * Math.abs(M_y_Ed) / ((chi_LT * M_y_Rk) / gamma_M1);
      const term3 = k_zz * Math.abs(M_z_Ed) / (M_z_Rk / gamma_M1);
      return term1 + term2 + term3;
    },
  },
};
