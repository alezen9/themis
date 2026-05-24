import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./compression-nodes";
import { Ec3VerificationError } from "../../errors";

export const evaluate = defineEvaluators(nodes, {
  N_c_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
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

  ratio: ({ N_Ed_N, N_c_Rd_N }) => {
    if (!Number.isFinite(N_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "compression: N_Ed_N must be finite",
        details: { N_Ed_N, sectionRef: "6.2.4" },
      });
    }

    if (N_Ed_N >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "compression: load case not applicable for sign of N_Ed_N",
        details: { N_Ed_N, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(N_c_Rd_N) || N_c_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "compression: denominator N_c_Rd_N must be > 0 (division by zero)",
        details: { N_c_Rd_N, sectionRef: "6.2.4" },
      });
    }

    return Math.abs(N_Ed_N) / N_c_Rd_N;
  },
});
