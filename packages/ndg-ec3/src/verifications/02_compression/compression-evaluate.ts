import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./compression-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  N_c_Rd: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  ratio: ({ N_Ed, N_c_Rd }) => {
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
        message:
          "compression: denominator N_c_Rd must be > 0 (division by zero)",
        details: { N_c_Rd, sectionRef: "6.2.4" },
      });
    }

    return Math.abs(N_Ed) / N_c_Rd;
  },
});
