import { assertFinite, assertPositive } from "../../assertions";
import { defineEvaluators } from "../../define";
import { nodes } from "./shear-torsion-zz-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_c_z_Rd_N: ({ Av_z_mm2, fy_MPa, gamma_M0 }) => {
    assertPositive(Av_z_mm2, "Av_z_mm2 must be > 0");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return Av_z_mm2 * (fy_MPa / (Math.sqrt(3) * gamma_M0));
  },

  utilisation_shear_class_1_2: ({ V_z_Ed_N, V_c_z_Rd_N }) => {
    assertFinite(V_z_Ed_N, "V_z_Ed_N must be a valid and finite value");
    assertPositive(V_c_z_Rd_N, "Denominator V_c_z_Rd_N must be > 0");

    return Math.abs(V_z_Ed_N) / V_c_z_Rd_N;
  },

  utilisation_shear_class_3: ({ tau_V_z_Ed_MPa, fy_MPa, gamma_M0 }) => {
    assertFinite(
      tau_V_z_Ed_MPa,
      "tau_V_z_Ed_MPa must be a valid and finite value",
    );
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return Math.abs(tau_V_z_Ed_MPa) / (fy_MPa / (Math.sqrt(3) * gamma_M0));
  },

  utilisation_shear_torsion_class_1_2: ({ V_z_Ed_N, V_pl_T_z_Rd_N }) => {
    assertFinite(V_z_Ed_N, "V_z_Ed_N must be a valid and finite value");
    assertPositive(V_pl_T_z_Rd_N, "Denominator V_pl_T_z_Rd_N must be > 0");

    return Math.abs(V_z_Ed_N) / V_pl_T_z_Rd_N;
  },

  utilisation_shear_torsion_class_3: ({ tau_z_Ed_MPa, fy_MPa, gamma_M0 }) => {
    assertFinite(tau_z_Ed_MPa, "tau_z_Ed_MPa must be a valid and finite value");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return Math.abs(tau_z_Ed_MPa) / (fy_MPa / (Math.sqrt(3) * gamma_M0));
  },

  V_pl_T_z_Rd_N: ({ V_c_z_Rd_N, tau_T_Ed_MPa, fy_MPa, gamma_M0 }) => {
    assertPositive(V_c_z_Rd_N, "V_c_z_Rd_N must be > 0");
    assertPositive(fy_MPa, "fy_MPa must be > 0");
    assertPositive(gamma_M0, "gamma_M0 must be > 0");

    return (
      (1 - tau_T_Ed_MPa / (fy_MPa / (Math.sqrt(3) * gamma_M0))) * V_c_z_Rd_N
    );
  },

  tau_z_Ed_MPa: ({ tau_V_z_Ed_MPa, tau_T_Ed_MPa }) => {
    assertFinite(
      tau_V_z_Ed_MPa,
      "tau_V_z_Ed_MPa must be a valid and finite value",
    );
    assertFinite(tau_T_Ed_MPa, "tau_T_Ed_MPa must be a valid and finite value");

    return tau_V_z_Ed_MPa + tau_T_Ed_MPa;
  },

  tau_V_z_Ed_I_MPa: deps => {
    const tw_mm = deps["i_geometry.tw_mm"];
    assertFinite(deps.V_z_Ed_N, "V_z_Ed_N must be a valid and finite value");
    assertPositive(deps.S_y_mm3, "S_y_mm3 must be > 0");
    assertPositive(deps.Iy_mm4, "Iy_mm4 must be > 0");
    assertPositive(tw_mm, "i_geometry.tw_mm must be > 0");

    return (Math.abs(deps.V_z_Ed_N) * deps.S_y_mm3) / (deps.Iy_mm4 * tw_mm);
  },

  tau_V_z_Ed_RHS_MPa: deps => {
    const tw_mm = deps["rhs_geometry.tw_mm"];
    assertFinite(deps.V_z_Ed_N, "V_z_Ed_N must be a valid and finite value");
    assertPositive(deps.S_y_mm3, "S_y_mm3 must be > 0");
    assertPositive(deps.Iy_mm4, "Iy_mm4 must be > 0");
    assertPositive(tw_mm, "rhs_geometry.tw_mm must be > 0");

    return (Math.abs(deps.V_z_Ed_N) * deps.S_y_mm3) / (deps.Iy_mm4 * 2 * tw_mm);
  },

  tau_V_z_Ed_CHS_MPa: ({ V_z_Ed_N, A_mm2 }) => {
    assertFinite(V_z_Ed_N, "V_z_Ed_N must be a valid and finite value");
    assertPositive(A_mm2, "A_mm2 must be > 0");

    return (2 * Math.abs(V_z_Ed_N)) / A_mm2;
  },

  tau_T_Ed_MPa: ({ T_Ed_Nmm, Wt_mm3 }) => {
    assertFinite(T_Ed_Nmm, "T_Ed_Nmm must be a valid and finite value");
    assertPositive(Wt_mm3, "Wt_mm3 must be > 0");

    return Math.abs(T_Ed_Nmm) / Wt_mm3;
  },
});
