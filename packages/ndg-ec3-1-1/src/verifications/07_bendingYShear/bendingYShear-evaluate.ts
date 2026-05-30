import { defineEvaluators } from "@ndg/ndg-core";
import {
  assertFinite,
  assertNonNegative,
  assertPositive,
} from "../../assertions";
import { nodes } from "./bendingYShear-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_z_Rd_N: ({ Av_z_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(Av_z_mm2, "bending-y-shear: Av_z_mm2 must be > 0");
    assertPositive(fy_MPa, "bending-y-shear: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-y-shear: gamma_M0 must be > 0");

    return (Av_z_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  u_z: ({ V_z_Ed_N, V_pl_z_Rd_N }) => {
    assertFinite(V_z_Ed_N, "bending-y-shear: V_z_Ed_N must be finite");
    assertPositive(
      V_pl_z_Rd_N,
      "bending-y-shear: denominator V_pl_z_Rd_N must be > 0 (division by zero)",
    );

    return Math.abs(V_z_Ed_N) / V_pl_z_Rd_N;
  },

  rho_z_1: () => 0,

  rho_z_2: ({ u_z }) => (2 * u_z - 1) ** 2,

  A_w_mm2: ({ hw_mm, tw_mm }) => {
    assertPositive(hw_mm, "bending-y-shear: hw_mm must be > 0");
    assertPositive(tw_mm, "bending-y-shear: tw_mm must be > 0");

    return hw_mm * tw_mm;
  },

  M_y_V_Rd_i_Nmm: ({
    W_y_res_mm3,
    rho_z,
    A_w_mm2,
    tw_mm,
    fy_MPa,
    gamma_M0,
  }) => {
    assertPositive(W_y_res_mm3, "bending-y-shear: W_y_res_mm3 must be > 0");
    assertNonNegative(rho_z, "bending-y-shear: rho_z must be >= 0");
    assertPositive(A_w_mm2, "bending-y-shear: A_w_mm2 must be > 0");
    assertPositive(tw_mm, "bending-y-shear: tw_mm must be > 0");
    assertPositive(fy_MPa, "bending-y-shear: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-y-shear: gamma_M0 must be > 0");

    const M_c_y_Rd_Nmm = (W_y_res_mm3 * fy_MPa) / gamma_M0;
    const W_y_eff_mm3 = W_y_res_mm3 - (rho_z * A_w_mm2 ** 2) / (4 * tw_mm);
    assertPositive(
      W_y_eff_mm3,
      "bending-y-shear: reduced W_y_eff_mm3 must be > 0",
    );
    return Math.min((W_y_eff_mm3 * fy_MPa) / gamma_M0, M_c_y_Rd_Nmm);
  },

  M_y_V_Rd_rhs_chs_Nmm: ({ W_y_res_mm3, rho_z, fy_MPa, gamma_M0 }) => {
    assertPositive(W_y_res_mm3, "bending-y-shear: W_y_res_mm3 must be > 0");
    assertNonNegative(rho_z, "bending-y-shear: rho_z must be >= 0");
    assertPositive(fy_MPa, "bending-y-shear: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-y-shear: gamma_M0 must be > 0");

    const M_c_y_Rd_Nmm = (W_y_res_mm3 * fy_MPa) / gamma_M0;
    const W_y_eff_mm3 = W_y_res_mm3 * (1 - rho_z);
    return Math.min((W_y_eff_mm3 * fy_MPa) / gamma_M0, M_c_y_Rd_Nmm);
  },

  ratio: ({ M_y_Ed_Nmm, M_y_V_Rd_Nmm }) => {
    assertFinite(M_y_Ed_Nmm, "bending-y-shear: M_y_Ed_Nmm must be finite");
    assertPositive(
      M_y_V_Rd_Nmm,
      "bending-y-shear: denominator M_y_V_Rd_Nmm must be > 0 (division by zero)",
    );

    return Math.abs(M_y_Ed_Nmm) / M_y_V_Rd_Nmm;
  },
});
