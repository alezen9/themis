import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsShearY-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  V_pl_y_Rd: ({ Av_y_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Av_y_mm2) || Av_y_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-y: Av_y_mm2 must be > 0",
        details: { Av_y_mm2, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-y: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-y: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  ratio: ({ V_y_Ed, V_pl_y_Rd }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "shear-y: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.6" },
      });
    }
    if (!Number.isFinite(V_pl_y_Rd) || V_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "shear-y: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.6" },
      });
    }

    return Math.abs(V_y_Ed) / V_pl_y_Rd;
  },
});
