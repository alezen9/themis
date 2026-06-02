import { defineEvaluators } from "@ndg/ndg-core";
import { assertPositive } from "../../assertions";
import { nodes } from "./shearZ-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_z_Rd_N: ({ Av_z_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(Av_z_mm2, "shear-z: Av_z_mm2 must be > 0");
    assertPositive(fy_MPa, "shear-z: fy_MPa must be > 0");
    assertPositive(gamma_M0, "shear-z: gamma_M0 must be > 0");

    return (Av_z_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  utilisation: ({ V_z_Ed_N, V_pl_z_Rd_N }) => {
    assertPositive(
      V_pl_z_Rd_N,
      "shear-z: denominator V_pl_z_Rd_N must be > 0 (division by zero)",
    );

    return Math.abs(V_z_Ed_N) / V_pl_z_Rd_N;
  },
});
