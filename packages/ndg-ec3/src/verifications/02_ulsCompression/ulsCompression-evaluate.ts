import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsCompression-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  N_c_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
  },

  compression_check: ({ N_Ed, N_c_Rd }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.4" },
      });
    }

    if (N_Ed >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "compression: load case not applicable for sign of N_Ed",
        details: { N_Ed, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(N_c_Rd) || N_c_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: denominator N_c_Rd must be > 0 (division by zero)",
        details: { N_c_Rd, sectionRef: "6.2.4" },
      });
    }

    return Math.abs(N_Ed) / N_c_Rd;
  },
});
