import { defineEvaluators } from "../../define";
import { nodes } from "./bending-moment-zz-nodes";
import { assertFinite, assertPositive } from "../../assertions";

export const evaluate = defineEvaluators(nodes, {
  M_pl_z_Rd_Nmm: ({ Wpl_z_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(Wpl_z_mm3, "Wpl_z_mm3 must be > 0");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return (Wpl_z_mm3 * fy_MPa) / gamma_M0;
  },

  M_el_z_Rd_Nmm: ({ Wel_z_mm3, fy_MPa, gamma_M0 }) => {
    assertPositive(Wel_z_mm3, "Wel_z_mm3 must be > 0");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return (Wel_z_mm3 * fy_MPa) / gamma_M0;
  },

  utilisation: ({ M_z_Ed_Nmm, M_c_Rd_Nmm }) => {
    assertFinite(M_z_Ed_Nmm, "M_z_Ed_Nmm must be a valid and finite value");
    assertPositive(M_c_Rd_Nmm, "Denominator M_c_Rd_Nmm must be > 0");

    return Math.abs(M_z_Ed_Nmm) / M_c_Rd_Nmm;
  },
});
