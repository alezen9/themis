import { defineEvaluators } from "@ndg/ndg-core";
import { assertFinite, assertPositive } from "../../assertions";
import { nodes } from "./bendingZ-nodes";

export const evaluate = defineEvaluators(nodes, {
  M_c_z_Rd_Nmm: ({ W_z_res_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(W_z_res_mm3, "bending-z: W_z_res_mm3 must be > 0", {
      W_z_res_mm3,
      sectionRef: "6.2.5",
    });
    assertPositive(fy_MPa, "bending-z: fy_MPa must be > 0", {
      fy_MPa,
      sectionRef: "6.2.5",
    });
    assertPositive(gamma_M0, "bending-z: gamma_M0 must be > 0", {
      gamma_M0,
      sectionRef: "6.1",
    });

    return (W_z_res_mm3 * fy_MPa) / gamma_M0;
  },

  ratio: ({ M_z_Ed_Nmm, M_c_z_Rd_Nmm }) => {
    assertFinite(M_z_Ed_Nmm, "bending-z: M_z_Ed_Nmm must be finite", {
      M_z_Ed_Nmm,
      sectionRef: "6.2.5",
    });
    assertPositive(
      M_c_z_Rd_Nmm,
      "bending-z: denominator M_c_z_Rd_Nmm must be > 0 (division by zero)",
      { M_c_z_Rd_Nmm, sectionRef: "6.2.5" },
    );

    return Math.abs(M_z_Ed_Nmm) / M_c_z_Rd_Nmm;
  },
});
