import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingY-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  bending_y_check: ({ M_y_Ed, M_c_y_Rd }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(M_c_y_Rd) || M_c_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y: denominator M_c_y_Rd must be > 0 (division by zero)",
        details: { M_c_y_Rd, sectionRef: "6.2.5" },
      });
    }

    return Math.abs(M_y_Ed) / M_c_y_Rd;
  },

  M_c_y_Rd: ({ W_y_res, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_y_res) || W_y_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: W_y_res must be > 0",
        details: { W_y_res, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_y_res * fy) / gamma_M0;
  },
});
