import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./ulsBucklingY-nodes";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators<Nodes>({
  N_cr_y: ({ pi, E, Iy, L, k_y }) => {
    if (!Number.isFinite(L) || !Number.isFinite(k_y)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-y: L and k_y must be finite",
        details: { L, k_y, sectionRef: "6.3.1.2" },
      });
    }
    const denominatorBase = L * k_y;
    if (!Number.isFinite(denominatorBase) || denominatorBase <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-y: denominator (L*k_y)^2 must be > 0 (division by zero)",
        details: { L, k_y, sectionRef: "6.3.1.2" },
      });
    }
    return (pi ** 2 * E * Iy) / denominatorBase ** 2;
  },
  lambda_bar_y: ({ A, fy, N_cr_y }) => {
    if (!Number.isFinite(N_cr_y) || N_cr_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-y: denominator N_cr_y must be > 0 (division by zero)",
        details: { N_cr_y, sectionRef: "6.3.1.2" },
      });
    }
    const value = (A * fy) / N_cr_y;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-y: lambda_bar_y_sq must be >= 0",
        details: { lambda_bar_y_sq: value, sectionRef: "6.3.1.2" },
      });
    }
    const lambda = Math.sqrt(value);
    if (!Number.isFinite(lambda) || lambda < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-y: lambda_bar_y must be >= 0",
        details: { lambda_bar_y: lambda, sectionRef: "6.3.1.2" },
      });
    }
    return lambda;
  },
  phi_y: ({ alpha_y, lambda_bar_y }) =>
    0.5 * (1 + alpha_y * (lambda_bar_y - 0.2) + lambda_bar_y ** 2),
  chi_y: ({ phi_y, lambda_bar_y }) => {
    const radicand = phi_y ** 2 - lambda_bar_y ** 2;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "buckling-y: chi_y radicand must be >= 0 for square root",
        details: { radicand, sectionRef: "6.3.1.2" },
      });
    }
    const denominator = phi_y + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-y: denominator for chi_y must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.3.1.2" },
      });
    }
    return Math.min(1, 1 / denominator);
  },
  N_b_y_Rd: ({ chi_y, A, fy, gamma_M1 }) => {
    if (!Number.isFinite(gamma_M1) || gamma_M1 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-y: denominator gamma_M1 must be > 0 (division by zero)",
        details: { gamma_M1, sectionRef: "6.1" },
      });
    }
    return (chi_y * A * fy) / gamma_M1;
  },
  abs_N_Ed: ({ N_Ed }) => {
    if (N_Ed >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "buckling-y: verification is only applicable for compression (N_Ed < 0)",
        details: { N_Ed, sectionRef: "6.3.1.1" },
      });
    }
    return -N_Ed;
  },
  buckling_y_check: ({ abs_N_Ed, N_b_y_Rd }) => {
    if (!Number.isFinite(N_b_y_Rd) || N_b_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "buckling-y: denominator N_b_y_Rd must be > 0 (division by zero)",
        details: { N_b_y_Rd, sectionRef: "6.3.1.1" },
      });
    }
    return abs_N_Ed / N_b_y_Rd;
  },
});
