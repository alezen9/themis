import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./ulsTorsionalBuckling-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  ip2: ({ Iy, Iz, A }) => {
    if (A <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: A must be > 0",
      });
    return (Iy + Iz) / A;
  },
  N_cr_T: ({ ip2, G, It, pi, E, Iw, L, k_T, k_z }) => {
    const lcr = L * (k_T ?? k_z ?? 1);
    if (!Number.isFinite(lcr) || lcr <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: L*(k_T or k_z) must be > 0",
      });
    if (It <= 0 || Iw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: It and Iw must be > 0",
      });
    }
    if (ip2 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: invalid polar radius of gyration term",
      });
    const ncrTerm = G * It + (pi ** 2 * E * Iw) / lcr ** 2;
    return ncrTerm / ip2;
  },
  N_cr_governing: ({ N_cr_T }) => {
    if (N_cr_T <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "torsional-buckling: invalid governing critical force",
      });
    // For the supported doubly-symmetric members in this package, the
    // torsional-flexural critical force collapses to the torsional one.
    return N_cr_T;
  },
  lambda_bar_TF: ({ A, fy, N_cr_governing }) => {
    const value = (A * fy) / N_cr_governing;
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
  N_b_TF_Rd: ({ chi_TF, A, fy, gamma_M1 }) => (chi_TF * A * fy) / gamma_M1,
  abs_N_Ed: ({ N_Ed, torsional_deformations, section_shape }) => {
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
    if (N_Ed >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "torsional-buckling: verification is only applicable for compression (N_Ed < 0)",
        details: { N_Ed, sectionRef: "6.3.1.4" },
      });
    }
    return -N_Ed;
  },
  torsional_buckling_check: ({ abs_N_Ed, N_b_TF_Rd }) => abs_N_Ed / N_b_TF_Rd,
});
