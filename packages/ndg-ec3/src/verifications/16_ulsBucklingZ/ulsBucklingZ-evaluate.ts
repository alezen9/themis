import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./ulsBucklingZ-nodes";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators<Nodes>({
  N_cr_z: ({ pi, E, Iz, L, k_z }) => {
    if (!Number.isFinite(L) || !Number.isFinite(k_z)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-z: L and k_z must be finite",
        details: { L, k_z, sectionRef: "6.3.1.2" },
      });
    }
    const denominatorBase = L * k_z;
    if (!Number.isFinite(denominatorBase) || denominatorBase <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator (L*k_z)^2 must be > 0 (division by zero)",
        details: { L, k_z, sectionRef: "6.3.1.2" },
      });
    }
    return (pi ** 2 * E * Iz) / denominatorBase ** 2;
  },
  lambda_bar_z: ({ A, fy, N_cr_z }) => {
    if (!Number.isFinite(N_cr_z) || N_cr_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator N_cr_z must be > 0 (division by zero)",
        details: { N_cr_z, sectionRef: "6.3.1.2" },
      });
    }
    const value = (A * fy) / N_cr_z;
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
  N_b_z_Rd: ({ chi_z, A, fy, gamma_M1 }) => {
    if (!Number.isFinite(gamma_M1) || gamma_M1 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator gamma_M1 must be > 0 (division by zero)",
        details: { gamma_M1, sectionRef: "6.1" },
      });
    }
    return (chi_z * A * fy) / gamma_M1;
  },
  abs_N_Ed: ({ N_Ed }) => {
    if (N_Ed >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "buckling-z: verification is only applicable for compression (N_Ed < 0)",
        details: { N_Ed, sectionRef: "6.3.1.1" },
      });
    }
    return -N_Ed;
  },
  buckling_z_check: ({ abs_N_Ed, N_b_z_Rd }) => {
    if (!Number.isFinite(N_b_z_Rd) || N_b_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-z: denominator N_b_z_Rd must be > 0 (division by zero)",
        details: { N_b_z_Rd, sectionRef: "6.3.1.1" },
      });
    }
    return abs_N_Ed / N_b_z_Rd;
  },
});
