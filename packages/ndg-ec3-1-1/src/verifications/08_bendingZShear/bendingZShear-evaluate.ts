import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { nodes } from "./bendingZShear-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_y_Rd_N: ({ Av_y_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Av_y_mm2) || Av_y_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: Av_y_mm2 must be > 0",
        details: { Av_y_mm2, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  u_y: ({ V_y_Ed_N, V_pl_y_Rd_N }) => {
    if (!Number.isFinite(V_y_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: V_y_Ed_N must be finite",
        details: { V_y_Ed_N, sectionRef: "6.2.8" },
      });
    }
    if (!Number.isFinite(V_pl_y_Rd_N) || V_pl_y_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: denominator V_pl_y_Rd_N must be > 0 (division by zero)",
        details: { V_pl_y_Rd_N, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(V_y_Ed_N) / V_pl_y_Rd_N;
  },

  rho_y_1: () => 0,

  rho_y_2: ({ u_y }) => (2 * u_y - 1) ** 2,

  W_z_web_mm3: ({ tw_mm, h_mm, tf_mm }) => {
    if (!Number.isFinite(tw_mm) || tw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: tw_mm must be > 0",
        details: { tw_mm, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(h_mm) || h_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: h_mm must be > 0",
        details: { h_mm, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tf_mm) || tf_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: tf_mm must be > 0",
        details: { tf_mm, sectionRef: "6.2.8" },
      });
    }

    const hw_mm = h_mm - 2 * tf_mm;
    if (!Number.isFinite(hw_mm) || hw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: h_mm - 2tf must be > 0",
        details: { h_mm, tf_mm, sectionRef: "6.2.8" },
      });
    }

    return (tw_mm ** 2 * hw_mm) / 4;
  },

  M_z_V_Rd_i_Nmm: ({ W_z_res_mm3, W_z_web_mm3, rho_y, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res_mm3) || W_z_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_res_mm3 must be > 0",
        details: { W_z_res_mm3, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(W_z_web_mm3) || W_z_web_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_web_mm3 must be > 0",
        details: { W_z_web_mm3, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    const M_c_z_Rd_Nmm = (W_z_res_mm3 * fy_MPa) / gamma_M0;
    const W_z_eff_mm3 = W_z_res_mm3 - rho_y * (W_z_res_mm3 - W_z_web_mm3);
    if (W_z_eff_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: reduced W_z_eff_mm3 must be > 0",
        details: { W_z_eff_mm3, sectionRef: "6.2.8" },
      });
    }
    return Math.min((W_z_eff_mm3 * fy_MPa) / gamma_M0, M_c_z_Rd_Nmm);
  },

  M_z_V_Rd_rhs_chs_Nmm: ({ W_z_res_mm3, rho_y, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res_mm3) || W_z_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_res_mm3 must be > 0",
        details: { W_z_res_mm3, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    const M_c_z_Rd_Nmm = (W_z_res_mm3 * fy_MPa) / gamma_M0;
    const W_z_eff_mm3 = W_z_res_mm3 * (1 - rho_y);
    return Math.min((W_z_eff_mm3 * fy_MPa) / gamma_M0, M_c_z_Rd_Nmm);
  },

  ratio: ({ M_z_Ed_Nmm, M_z_V_Rd_Nmm }) => {
    if (!Number.isFinite(M_z_Ed_Nmm)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: M_z_Ed_Nmm must be finite",
        details: { M_z_Ed_Nmm, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(M_z_V_Rd_Nmm) || M_z_V_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: denominator M_z_V_Rd_Nmm must be > 0 (division by zero)",
        details: { M_z_V_Rd_Nmm, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(M_z_Ed_Nmm) / M_z_V_Rd_Nmm;
  },
});
