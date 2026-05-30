import { defineEvaluators } from "@ndg/ndg-core";
import { assertFinite, assertPositive } from "../../assertions";
import { nodes } from "./bendingY-nodes";

export const evaluate = defineEvaluators(nodes, {
  M_c_y_Rd_Nmm: ({ W_y_res_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(W_y_res_mm3, "bending-y: W_y_res_mm3 must be > 0", {
      W_y_res_mm3,
      sectionRef: "6.2.5",
    });
    assertPositive(fy_MPa, "bending-y: fy_MPa must be > 0", {
      fy_MPa,
      sectionRef: "6.2.5",
    });
    assertPositive(gamma_M0, "bending-y: gamma_M0 must be > 0", {
      gamma_M0,
      sectionRef: "6.1",
    });

    return (W_y_res_mm3 * fy_MPa) / gamma_M0;
  },

  ratio: ({ M_y_Ed_Nmm, M_c_y_Rd_Nmm }) => {
    assertFinite(M_y_Ed_Nmm, "bending-y: M_y_Ed_Nmm must be finite", {
      M_y_Ed_Nmm,
      sectionRef: "6.2.5",
    });
    assertPositive(
      M_c_y_Rd_Nmm,
      "bending-y: denominator M_c_y_Rd_Nmm must be > 0 (division by zero)",
      { M_c_y_Rd_Nmm, sectionRef: "6.2.5" },
    );

    return Math.abs(M_y_Ed_Nmm) / M_c_y_Rd_Nmm;
  },
});
