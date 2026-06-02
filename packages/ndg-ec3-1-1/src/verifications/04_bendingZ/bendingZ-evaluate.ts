import { defineEvaluators } from "@ndg/ndg-core";
import { assertPositive } from "../../assertions";
import { nodes } from "./bendingZ-nodes";

export const evaluate = defineEvaluators(nodes, {
  M_c_z_Rd_Nmm: ({ W_z_res_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(W_z_res_mm3, "bending-z: W_z_res_mm3 must be > 0");
    assertPositive(fy_MPa, "bending-z: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z: gamma_M0 must be > 0");

    return (W_z_res_mm3 * fy_MPa) / gamma_M0;
  },

  utilisation: ({ M_z_Ed_Nmm, M_c_z_Rd_Nmm }) => {
    assertPositive(
      M_c_z_Rd_Nmm,
      "bending-z: denominator M_c_z_Rd_Nmm must be > 0 (division by zero)",
    );

    return Math.abs(M_z_Ed_Nmm) / M_c_z_Rd_Nmm;
  },
});
