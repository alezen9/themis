import { defineEvaluators } from "@ndg/ndg-core";
import { assertFinite, assertPositive } from "../../assertions";
import { nodes } from "./bendingY-nodes";

export const evaluate = defineEvaluators(nodes, {
  M_c_y_Rd_Nmm: ({ W_y_res_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(W_y_res_mm3, "bending-y: W_y_res_mm3 must be > 0");
    assertPositive(fy_MPa, "bending-y: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-y: gamma_M0 must be > 0");

    return (W_y_res_mm3 * fy_MPa) / gamma_M0;
  },

  ratio: ({ M_y_Ed_Nmm, M_c_y_Rd_Nmm }) => {
    assertFinite(M_y_Ed_Nmm, "bending-y: M_y_Ed_Nmm must be finite");
    assertPositive(
      M_c_y_Rd_Nmm,
      "bending-y: denominator M_c_y_Rd_Nmm must be > 0 (division by zero)",
    );

    return Math.abs(M_y_Ed_Nmm) / M_c_y_Rd_Nmm;
  },
});
