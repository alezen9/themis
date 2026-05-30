import { defineEvaluators } from "@ndg/ndg-core";
import {
  assertFinite,
  assertNonNegative,
  assertPositive,
} from "../../assertions";
import { nodes } from "./bendingZShear-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_y_Rd_N: ({ Av_y_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(Av_y_mm2, "bending-z-shear: Av_y_mm2 must be > 0");
    assertPositive(fy_MPa, "bending-z-shear: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z-shear: gamma_M0 must be > 0");

    return (Av_y_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  u_y: ({ V_y_Ed_N, V_pl_y_Rd_N }) => {
    assertFinite(V_y_Ed_N, "bending-z-shear: V_y_Ed_N must be finite");
    assertPositive(
      V_pl_y_Rd_N,
      "bending-z-shear: denominator V_pl_y_Rd_N must be > 0 (division by zero)",
    );

    return Math.abs(V_y_Ed_N) / V_pl_y_Rd_N;
  },

  rho_y_1: () => 0,

  rho_y_2: ({ u_y }) => (2 * u_y - 1) ** 2,

  W_z_web_mm3: ({ tw_mm, h_mm, tf_mm }) => {
    assertPositive(tw_mm, "bending-z-shear: tw_mm must be > 0");
    assertPositive(h_mm, "bending-z-shear: h_mm must be > 0");
    assertPositive(tf_mm, "bending-z-shear: tf_mm must be > 0");

    const hw_mm = h_mm - 2 * tf_mm;
    assertPositive(hw_mm, "bending-z-shear: h_mm - 2tf must be > 0");

    return (tw_mm ** 2 * hw_mm) / 4;
  },

  M_z_V_Rd_i_Nmm: ({ W_z_res_mm3, W_z_web_mm3, rho_y, fy_MPa, gamma_M0 }) => {
    assertPositive(W_z_res_mm3, "bending-z-shear: W_z_res_mm3 must be > 0");
    assertPositive(W_z_web_mm3, "bending-z-shear: W_z_web_mm3 must be > 0");
    assertNonNegative(rho_y, "bending-z-shear: rho_y must be >= 0");
    assertPositive(fy_MPa, "bending-z-shear: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z-shear: gamma_M0 must be > 0");

    const M_c_z_Rd_Nmm = (W_z_res_mm3 * fy_MPa) / gamma_M0;
    const W_z_eff_mm3 = W_z_res_mm3 - rho_y * (W_z_res_mm3 - W_z_web_mm3);
    assertPositive(
      W_z_eff_mm3,
      "bending-z-shear: reduced W_z_eff_mm3 must be > 0",
    );
    return Math.min((W_z_eff_mm3 * fy_MPa) / gamma_M0, M_c_z_Rd_Nmm);
  },

  M_z_V_Rd_rhs_chs_Nmm: ({ W_z_res_mm3, rho_y, fy_MPa, gamma_M0 }) => {
    assertPositive(W_z_res_mm3, "bending-z-shear: W_z_res_mm3 must be > 0");
    assertNonNegative(rho_y, "bending-z-shear: rho_y must be >= 0");
    assertPositive(fy_MPa, "bending-z-shear: fy_MPa must be > 0");
    assertPositive(gamma_M0, "bending-z-shear: gamma_M0 must be > 0");

    const M_c_z_Rd_Nmm = (W_z_res_mm3 * fy_MPa) / gamma_M0;
    const W_z_eff_mm3 = W_z_res_mm3 * (1 - rho_y);
    return Math.min((W_z_eff_mm3 * fy_MPa) / gamma_M0, M_c_z_Rd_Nmm);
  },

  ratio: ({ M_z_Ed_Nmm, M_z_V_Rd_Nmm }) => {
    assertFinite(M_z_Ed_Nmm, "bending-z-shear: M_z_Ed_Nmm must be finite");
    assertPositive(
      M_z_V_Rd_Nmm,
      "bending-z-shear: denominator M_z_V_Rd_Nmm must be > 0 (division by zero)",
    );

    return Math.abs(M_z_Ed_Nmm) / M_z_V_Rd_Nmm;
  },
});
