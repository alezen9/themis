import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./tension-nodes";
import {
  assertApplicable,
  assertFinite,
  assertPositive,
} from "../../assertions";

export const evaluate = defineEvaluators(nodes, {
  N_pl_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(A_mm2, "tension: A_mm2 must be > 0");
    assertPositive(fy_MPa, "tension: fy_MPa must be > 0");
    assertPositive(gamma_M0, "tension: gamma_M0 must be > 0");
    return (A_mm2 * fy_MPa) / gamma_M0;
  },
  ratio: ({ N_Ed_N, N_pl_Rd_N }) => {
    assertFinite(N_Ed_N, "tension: N_Ed_N must be finite");
    assertApplicable(
      N_Ed_N > 0,
      "tension: load case not applicable for sign of N_Ed_N",
    );
    assertPositive(
      N_pl_Rd_N,
      "tension: denominator N_pl_Rd_N must be > 0 (division by zero)",
    );
    return N_Ed_N / N_pl_Rd_N;
  },
});
