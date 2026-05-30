import { defineEvaluators } from "@ndg/ndg-core";
import { assertFinite, assertPositive } from "../../assertions";
import { nodes } from "./shearY-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_y_Rd_N: ({ Av_y_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(Av_y_mm2, "shear-y: Av_y_mm2 must be > 0", {
      Av_y_mm2,
      sectionRef: "6.2.6",
    });
    assertPositive(fy_MPa, "shear-y: fy_MPa must be > 0", {
      fy_MPa,
      sectionRef: "6.2.6",
    });
    assertPositive(gamma_M0, "shear-y: gamma_M0 must be > 0", {
      gamma_M0,
      sectionRef: "6.1",
    });

    return (Av_y_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  ratio: ({ V_y_Ed_N, V_pl_y_Rd_N }) => {
    assertFinite(V_y_Ed_N, "shear-y: V_y_Ed_N must be finite", {
      V_y_Ed_N,
      sectionRef: "6.2.6",
    });
    assertPositive(
      V_pl_y_Rd_N,
      "shear-y: denominator V_pl_y_Rd_N must be > 0 (division by zero)",
      { V_pl_y_Rd_N, sectionRef: "6.2.6" },
    );

    return Math.abs(V_y_Ed_N) / V_pl_y_Rd_N;
  },
});
