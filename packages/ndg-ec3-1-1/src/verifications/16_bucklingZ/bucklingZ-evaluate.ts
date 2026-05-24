import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./bucklingZ-nodes";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators(nodes, {
  N_cr_z_N: ({ pi, E_MPa, Iz_mm4, L_mm, k_z }) => {
    if (!Number.isFinite(L_mm) || !Number.isFinite(k_z)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-z: L_mm and k_z must be finite",
        details: { L_mm, k_z, sectionRef: "6.3.1.2" },
      });
    }
    const denominatorBase = L_mm * k_z;
    if (!Number.isFinite(denominatorBase) || denominatorBase <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator (L_mm*k_z)^2 must be > 0 (division by zero)",
        details: { L_mm, k_z, sectionRef: "6.3.1.2" },
      });
    }
    return (pi ** 2 * E_MPa * Iz_mm4) / denominatorBase ** 2;
  },
  lambda_bar_z: ({ A_mm2, fy_MPa, N_cr_z_N }) => {
    if (!Number.isFinite(N_cr_z_N) || N_cr_z_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator N_cr_z_N must be > 0 (division by zero)",
        details: { N_cr_z_N, sectionRef: "6.3.1.2" },
      });
    }
    const value = (A_mm2 * fy_MPa) / N_cr_z_N;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-z: lambda_bar_z_sq must be >= 0",
        details: { lambda_bar_z_sq: value, sectionRef: "6.3.1.2" },
      });
    }
    const lambda = Math.sqrt(value);
    if (!Number.isFinite(lambda) || lambda < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-z: lambda_bar_z must be >= 0",
        details: { lambda_bar_z: lambda, sectionRef: "6.3.1.2" },
      });
    }
    return lambda;
  },
  phi_z: ({ alpha_z, lambda_bar_z }) =>
    0.5 * (1 + alpha_z * (lambda_bar_z - 0.2) + lambda_bar_z ** 2),
  chi_z: ({ phi_z, lambda_bar_z }) => {
    const radicand = phi_z ** 2 - lambda_bar_z ** 2;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-z: chi_z radicand must be >= 0 for square root",
        details: { radicand, sectionRef: "6.3.1.2" },
      });
    }
    const denominator = phi_z + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator for chi_z must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.3.1.2" },
      });
    }
    return Math.min(1, 1 / denominator);
  },
  N_b_z_Rd_N: ({ chi_z, A_mm2, fy_MPa, gamma_M1 }) => {
    if (!Number.isFinite(gamma_M1) || gamma_M1 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator gamma_M1 must be > 0 (division by zero)",
        details: { gamma_M1, sectionRef: "6.1" },
      });
    }
    return (chi_z * A_mm2 * fy_MPa) / gamma_M1;
  },
  abs_N_Ed_N: ({ N_Ed_N }) => {
    if (N_Ed_N >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "buckling-z: verification is only applicable for compression (N_Ed_N < 0)",
        details: { N_Ed_N, sectionRef: "6.3.1.1" },
      });
    }
    return -N_Ed_N;
  },
  buckling_z_check: ({ abs_N_Ed_N, N_b_z_Rd_N }) => {
    if (!Number.isFinite(N_b_z_Rd_N) || N_b_z_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator N_b_z_Rd_N must be > 0 (division by zero)",
        details: { N_b_z_Rd_N, sectionRef: "6.3.1.1" },
      });
    }
    return abs_N_Ed_N / N_b_z_Rd_N;
  },
});
