import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZ-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  M_c_z_Rd: ({ W_z_res, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_z_res * fy) / gamma_M0;
  },

  bending_z_check: ({ M_z_Ed, M_c_z_Rd }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(M_c_z_Rd) || M_c_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z: denominator M_c_z_Rd must be > 0 (division by zero)",
        details: { M_c_z_Rd, sectionRef: "6.2.5" },
      });
    }

    return Math.abs(M_z_Ed) / M_c_z_Rd;
  },
});
