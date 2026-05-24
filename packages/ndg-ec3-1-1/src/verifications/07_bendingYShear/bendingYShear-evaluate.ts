import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { nodes } from "./bendingYShear-nodes";

export const evaluate = defineEvaluators(nodes, {
  V_pl_z_Rd_N: ({ Av_z_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Av_z_mm2) || Av_z_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: Av_z_mm2 must be > 0",
        details: { Av_z_mm2, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  u_z: ({ V_z_Ed_N, V_pl_z_Rd_N }) => {
    if (!Number.isFinite(V_z_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: V_z_Ed_N must be finite",
        details: { V_z_Ed_N, sectionRef: "6.2.8" },
      });
    }
    if (!Number.isFinite(V_pl_z_Rd_N) || V_pl_z_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: denominator V_pl_z_Rd_N must be > 0 (division by zero)",
        details: { V_pl_z_Rd_N, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(V_z_Ed_N) / V_pl_z_Rd_N;
  },

  rho_z_1: () => 0,

  rho_z_2: ({ u_z }) => (2 * u_z - 1) ** 2,

  A_w_mm2: ({ hw_mm, tw_mm }) => {
    if (!Number.isFinite(hw_mm) || hw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: hw_mm must be > 0",
        details: { hw_mm, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw_mm) || tw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: tw_mm must be > 0",
        details: { tw_mm, sectionRef: "6.2.8" },
      });
    }

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
    if (!Number.isFinite(W_y_res_mm3) || W_y_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: W_y_res_mm3 must be > 0",
        details: { W_y_res_mm3, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(A_w_mm2) || A_w_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: A_w_mm2 must be > 0",
        details: { A_w_mm2, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw_mm) || tw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: tw_mm must be > 0",
        details: { tw_mm, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    const M_c_y_Rd_Nmm = (W_y_res_mm3 * fy_MPa) / gamma_M0;
    const W_y_eff_mm3 = W_y_res_mm3 - (rho_z * A_w_mm2 ** 2) / (4 * tw_mm);
    if (W_y_eff_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: reduced W_y_eff_mm3 must be > 0",
        details: { W_y_eff_mm3, sectionRef: "6.2.8" },
      });
    }
    return Math.min((W_y_eff_mm3 * fy_MPa) / gamma_M0, M_c_y_Rd_Nmm);
  },

  M_y_V_Rd_rhs_chs_Nmm: ({ W_y_res_mm3, rho_z, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(W_y_res_mm3) || W_y_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: W_y_res_mm3 must be > 0",
        details: { W_y_res_mm3, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    const M_c_y_Rd_Nmm = (W_y_res_mm3 * fy_MPa) / gamma_M0;
    const W_y_eff_mm3 = W_y_res_mm3 * (1 - rho_z);
    return Math.min((W_y_eff_mm3 * fy_MPa) / gamma_M0, M_c_y_Rd_Nmm);
  },

  ratio: ({ M_y_Ed_Nmm, M_y_V_Rd_Nmm }) => {
    if (!Number.isFinite(M_y_Ed_Nmm)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: M_y_Ed_Nmm must be finite",
        details: { M_y_Ed_Nmm, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(M_y_V_Rd_Nmm) || M_y_V_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: denominator M_y_V_Rd_Nmm must be > 0 (division by zero)",
        details: { M_y_V_Rd_Nmm, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(M_y_Ed_Nmm) / M_y_V_Rd_Nmm;
  },
});
