import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./compression-nodes";
import { Ec3VerificationError } from "../../errors";
import { assertFinite, assertPositive } from "../../assertions";

export const evaluate = defineEvaluators(nodes, {
  N_c_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(A_mm2, "compression: A_mm2 must be > 0", {
      A_mm2,
      sectionRef: "6.2.4",
    });
    assertPositive(fy_MPa, "compression: fy_MPa must be > 0", {
      fy_MPa,
      sectionRef: "6.2.4",
    });
    assertPositive(gamma_M0, "compression: gamma_M0 must be > 0", {
      gamma_M0,
      sectionRef: "6.1",
    });

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  ratio: ({ N_Ed_N, N_c_Rd_N }) => {
    assertFinite(N_Ed_N, "compression: N_Ed_N must be finite", {
      N_Ed_N,
      sectionRef: "6.2.4",
    });

    if (N_Ed_N >= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "compression: load case not applicable for sign of N_Ed_N",
        details: { N_Ed_N, sectionRef: "6.2.4" },
      });
    }

    assertPositive(
      N_c_Rd_N,
      "compression: denominator N_c_Rd_N must be > 0 (division by zero)",
      { N_c_Rd_N, sectionRef: "6.2.4" },
    );

    return Math.abs(N_Ed_N) / N_c_Rd_N;
  },
});
