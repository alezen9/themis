import { defineEvaluators } from "@ndg/ndg-core";
import { assertPositive } from "../../assertions";
import { nodes } from "./shearY-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_y_Rd_N: ({ Av_y_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(Av_y_mm2, "shear-y: Av_y_mm2 must be > 0");
    assertPositive(fy_MPa, "shear-y: fy_MPa must be > 0");
    assertPositive(gamma_M0, "shear-y: gamma_M0 must be > 0");

    return (Av_y_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  utilisation: ({ V_y_Ed_N, V_pl_y_Rd_N }) => {
    
    assertPositive(
      V_pl_y_Rd_N,
      "shear-y: denominator V_pl_y_Rd_N must be > 0 (division by zero)",
    );

    return Math.abs(V_y_Ed_N) / V_pl_y_Rd_N;
  },
});
