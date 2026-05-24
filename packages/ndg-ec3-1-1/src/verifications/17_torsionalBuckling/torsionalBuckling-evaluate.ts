import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./torsionalBuckling-nodes";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators(nodes, {
  ip2_mm2: ({ Iy_mm4, Iz_mm4, A_mm2 }) => {
    if (A_mm2 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: A_mm2 must be > 0",
      });
    return (Iy_mm4 + Iz_mm4) / A_mm2;
  },
  N_cr_T_N: ({ ip2_mm2, G_MPa, It_mm4, pi, E_MPa, Iw_mm6, L_mm, k_T, k_z }) => {
    const lcr = L_mm * (k_T ?? k_z ?? 1);
    if (!Number.isFinite(lcr) || lcr <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: L_mm*(k_T or k_z) must be > 0",
      });
    if (It_mm4 <= 0 || Iw_mm6 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: It_mm4 and Iw_mm6 must be > 0",
      });
    }
    if (ip2_mm2 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: invalid polar radius of gyration term",
      });
    const ncrTerm = G_MPa * It_mm4 + (pi ** 2 * E_MPa * Iw_mm6) / lcr ** 2;
    return ncrTerm / ip2_mm2;
  },
  N_cr_governing_N: ({ N_cr_T_N }) => {
    if (N_cr_T_N <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: invalid governing critical force",
      });
    // For the supported doubly-symmetric members in this package, the
    // torsional-flexural critical force collapses to the torsional one.
    return N_cr_T_N;
  },
  lambda_bar_TF: ({ A_mm2, fy_MPa, N_cr_governing_N }) => {
    const value = (A_mm2 * fy_MPa) / N_cr_governing_N;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: lambda_bar_TF_sq must be >= 0",
      });
    }
    return Math.sqrt(value);
  },
  phi_TF: ({ alpha_z, lambda_bar_TF }) =>
    0.5 * (1 + alpha_z * (lambda_bar_TF - 0.2) + lambda_bar_TF ** 2),
  chi_TF: ({ phi_TF, lambda_bar_TF }) => {
    const radicand = phi_TF ** 2 - lambda_bar_TF ** 2;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "torsional-buckling: chi_TF radicand must be >= 0 for square root",
      });
    }
    const denominator = phi_TF + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "torsional-buckling: denominator for chi_TF must be > 0 (division by zero)",
      });
    }
    return Math.min(1, 1 / denominator);
  },
  N_b_TF_Rd_N: ({ chi_TF, A_mm2, fy_MPa, gamma_M1 }) =>
    (chi_TF * A_mm2 * fy_MPa) / gamma_M1,
  abs_N_Ed_N: ({ N_Ed_N, torsional_deformations, section_shape }) => {
    if (section_shape === "RHS" || section_shape === "CHS") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "torsional-buckling: closed hollow sections are covered by flexural buckling for this check",
        details: { section_shape, sectionRef: "6.3.1.4(1)" },
      });
    }
    if ((torsional_deformations ?? "yes") !== "yes") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "torsional-buckling: torsional deformations are disabled",
        details: { torsional_deformations, sectionRef: "6.3.1.4" },
      });
    }
    if (N_Ed_N >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "torsional-buckling: verification is only applicable for compression (N_Ed_N < 0)",
        details: { N_Ed_N, sectionRef: "6.3.1.4" },
      });
    }
    return -N_Ed_N;
  },
  torsional_buckling_check: ({ abs_N_Ed_N, N_b_TF_Rd_N }) =>
    abs_N_Ed_N / N_b_TF_Rd_N,
});
