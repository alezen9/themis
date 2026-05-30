import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./tension-nodes";
import { Ec3VerificationError } from "../../errors";
import { assertFinite, assertPositive } from "../../assertions";

export const evaluate = defineEvaluators(nodes, {
  N_pl_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(A_mm2, "tension: A_mm2 must be > 0", {
      A_mm2,
      sectionRef: "6.2.3",
    });
    assertPositive(fy_MPa, "tension: fy_MPa must be > 0", {
      fy_MPa,
      sectionRef: "6.2.3",
    });
    assertPositive(gamma_M0, "tension: gamma_M0 must be > 0", {
      gamma_M0,
      sectionRef: "6.1",
    });
    return (A_mm2 * fy_MPa) / gamma_M0;
  },
  ratio: ({ N_Ed_N, N_pl_Rd_N }) => {
    assertFinite(N_Ed_N, "tension: N_Ed_N must be finite", {
      N_Ed_N,
      sectionRef: "6.2.3",
    });

    if (N_Ed_N <= 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "tension: load case not applicable for sign of N_Ed_N",
        details: { N_Ed_N, sectionRef: "6.2.3" },
      });
    }

    assertPositive(
      N_pl_Rd_N,
      "tension: denominator N_pl_Rd_N must be > 0 (division by zero)",
      { N_pl_Rd_N, sectionRef: "6.2.3" },
    );
    return N_Ed_N / N_pl_Rd_N;
  },
});
