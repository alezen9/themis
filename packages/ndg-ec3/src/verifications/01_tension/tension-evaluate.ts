import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./tension-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  N_pl_Rd_kN: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "tension: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.3" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "tension: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.3" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "tension: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (A_mm2 * fy_MPa) / gamma_M0;
  },
  ratio: ({ N_Ed_kN, N_pl_Rd_kN }) => {
    if (!Number.isFinite(N_Ed_kN)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "tension: N_Ed_kN must be finite",
        details: { N_Ed_kN, sectionRef: "6.2.3" },
      });
    }

    if (N_Ed_kN <= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "tension: load case not applicable for sign of N_Ed_kN",
        details: { N_Ed_kN, sectionRef: "6.2.3" },
      });
    }

    if (!Number.isFinite(N_pl_Rd_kN) || N_pl_Rd_kN <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "tension: denominator N_pl_Rd_kN must be > 0 (division by zero)",
        details: { N_pl_Rd_kN, sectionRef: "6.2.3" },
      });
    }
    return N_Ed_kN / N_pl_Rd_kN;
  },
});
