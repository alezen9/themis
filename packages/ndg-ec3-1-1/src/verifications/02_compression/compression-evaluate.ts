import { defineEvaluators } from "../../define";
import { nodes } from "./compression-nodes";
import {
  assertApplicable,
  assertFinite,
  assertPositive,
} from "../../assertions";

export const evaluate = defineEvaluators(nodes, {
  N_c_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(A_mm2, "A_mm2 must be > 0");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  utilisation: ({ N_Ed_N, N_c_Rd_N }) => {
    assertFinite(N_Ed_N, "N_Ed_N must be a valid and finite value");
    assertApplicable(N_Ed_N < 0, "load case not applicable for sign of N_Ed_N");
    assertPositive(N_c_Rd_N, "denominator N_c_Rd_N must be > 0");

    return Math.abs(N_Ed_N) / N_c_Rd_N;
  },
});
