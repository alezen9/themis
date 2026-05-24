import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { nodes } from "./biaxialAxial-nodes";

export const evaluate = defineEvaluators(nodes, {
  W_y_res_class12_mm3: ({ Wpl_y_mm3 }) => {
    if (!Number.isFinite(Wpl_y_mm3) || Wpl_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wpl_y_mm3 must be > 0",
        details: { Wpl_y_mm3, sectionRef: "6.2.5" },
      });
    }
    return Wpl_y_mm3;
  },

  W_y_res_class3_mm3: ({ Wel_y_mm3 }) => {
    if (!Number.isFinite(Wel_y_mm3) || Wel_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_y_mm3 must be > 0",
        details: { Wel_y_mm3, sectionRef: "6.2.5" },
      });
    }
    return Wel_y_mm3;
  },

  W_z_res_class12_mm3: ({ Wpl_z_mm3 }) => {
    if (!Number.isFinite(Wpl_z_mm3) || Wpl_z_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wpl_z_mm3 must be > 0",
        details: { Wpl_z_mm3, sectionRef: "6.2.5" },
      });
    }
    return Wpl_z_mm3;
  },

  W_z_res_class3_mm3: ({ Wel_z_mm3 }) => {
    if (!Number.isFinite(Wel_z_mm3) || Wel_z_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_z_mm3 must be > 0",
        details: { Wel_z_mm3, sectionRef: "6.2.5" },
      });
    }
    return Wel_z_mm3;
  },

  N_pl_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.4" },
      });
    }
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.4" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  N_c_Ed_N: ({ N_Ed_N }) => {
    if (!Number.isFinite(N_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: N_Ed_N must be finite",
        details: { N_Ed_N, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(N_Ed_N);
  },

  abs_N_Ed_N: ({ N_Ed_N }) => {
    if (!Number.isFinite(N_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: N_Ed_N must be finite",
        details: { N_Ed_N, sectionRef: "6.2.9.2" },
      });
    }

    return Math.abs(N_Ed_N);
  },

  n: ({ N_c_Ed_N, N_pl_Rd_N }) => {
    if (!Number.isFinite(N_pl_Rd_N) || N_pl_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator N_pl_Rd_N must be > 0 (division by zero)",
        details: { N_pl_Rd_N, sectionRef: "6.2.9.1" },
      });
    }

    return N_c_Ed_N / N_pl_Rd_N;
  },

  a_w_i: ({ A_mm2, b_mm, tf_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(tf_mm) || tf_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: tf_mm must be > 0",
        details: { tf_mm, sectionRef: "6.2.9.1" },
      });
    }
    return Math.min((A_mm2 - 2 * b_mm * tf_mm) / A_mm2, 0.5);
  },

  a_w_rhs: ({ A_mm2, b_mm, t_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(t_mm) || t_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: t_mm must be > 0",
        details: { t_mm, sectionRef: "6.2.9.1" },
      });
    }
    return Math.min((A_mm2 - 2 * b_mm * t_mm) / A_mm2, 0.5);
  },

  a_w_chs: () => {
    return 0.5;
  },

  a_f_i: ({ A_mm2, b_mm, tf_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(tf_mm) || tf_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: tf_mm must be > 0",
        details: { tf_mm, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min((A_mm2 - 2 * b_mm * tf_mm) / A_mm2, 0.5);
  },

  a_f_rhs: ({ A_mm2, h_mm, t_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(h_mm) || h_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: h_mm must be > 0",
        details: { h_mm, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(t_mm) || t_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: t_mm must be > 0",
        details: { t_mm, sectionRef: "6.2.9.1" },
      });
    }
    return Math.min((A_mm2 - 2 * h_mm * t_mm) / A_mm2, 0.5);
  },

  a_f_chs: () => {
    return 0.5;
  },

  M_pl_y_Rd_Nmm: ({ W_y_res_mm3, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(W_y_res_mm3) || W_y_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: W_y_res_mm3 must be > 0",
        details: { W_y_res_mm3, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (W_y_res_mm3 * fy_MPa) / gamma_M0;
  },

  M_pl_z_Rd_Nmm: ({ W_z_res_mm3, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res_mm3) || W_z_res_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: W_z_res_mm3 must be > 0",
        details: { W_z_res_mm3, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (W_z_res_mm3 * fy_MPa) / gamma_M0;
  },

  k_y_i: ({ n, a_w }) => {
    const a_w_half = 0.5 * a_w;
    if (n <= a_w_half) return 1;

    const denominator = 1 - a_w_half;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator (1 - 0.5*a_w) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return 1 - ((n - a_w_half) / denominator) ** 2;
  },

  k_y_rhs_chs: ({ n, a_w }) => {
    const denominator = 1 - 0.5 * a_w;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator (1 - 0.5*a_w) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  M_N_y_Rd_Nmm: ({ M_pl_y_Rd_Nmm, k_y }) => {
    const M_N_y_Rd_Nmm = M_pl_y_Rd_Nmm * k_y;
    if (!Number.isFinite(M_N_y_Rd_Nmm) || M_N_y_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_y_Rd_Nmm must be > 0 (division by zero)",
        details: { M_N_y_Rd_Nmm, sectionRef: "6.2.9.1" },
      });
    }

    return M_N_y_Rd_Nmm;
  },

  k_z_i: ({ n, a_f }) => {
    if (n <= a_f) return 1;

    const denominator = 1 - a_f;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator (1 - a_f) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return 1 - ((n - a_f) / denominator) ** 2;
  },

  k_z_rhs_chs: ({ n, a_f }) => {
    const denominator = 1 - 0.5 * a_f;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator (1 - 0.5*a_f) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  M_N_z_Rd_Nmm: ({ M_pl_z_Rd_Nmm, k_z }) => {
    const M_N_z_Rd_Nmm = M_pl_z_Rd_Nmm * k_z;
    if (!Number.isFinite(M_N_z_Rd_Nmm) || M_N_z_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_z_Rd_Nmm must be > 0 (division by zero)",
        details: { M_N_z_Rd_Nmm, sectionRef: "6.2.9.1" },
      });
    }

    return M_N_z_Rd_Nmm;
  },

  rhs_exp: ({ n }) => {
    const rhsExpFactor = 1 - 1.13 * n ** 2;
    if (rhsExpFactor <= 0) return 6;
    return Math.min(1.66 / rhsExpFactor, 6);
  },

  alpha_biax_i: () => {
    return 2;
  },

  alpha_biax_rhs: ({ rhs_exp }) => {
    return rhs_exp;
  },

  alpha_biax_chs: () => {
    return 2;
  },

  beta_biax_i: ({ n }) => {
    return Math.max(1, 5 * n);
  },

  beta_biax_rhs: ({ rhs_exp }) => {
    return rhs_exp;
  },

  beta_biax_chs: () => {
    return 2;
  },

  abs_M_y_Ed_Nmm: ({ M_y_Ed_Nmm }) => {
    if (!Number.isFinite(M_y_Ed_Nmm)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: M_y_Ed_Nmm must be finite",
        details: { M_y_Ed_Nmm, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(M_y_Ed_Nmm);
  },

  abs_M_z_Ed_Nmm: ({ M_z_Ed_Nmm }) => {
    if (!Number.isFinite(M_z_Ed_Nmm)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: M_z_Ed_Nmm must be finite",
        details: { M_z_Ed_Nmm, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(M_z_Ed_Nmm);
  },

  utilization_y: ({ abs_M_y_Ed_Nmm, M_N_y_Rd_Nmm }) => {
    if (!Number.isFinite(M_N_y_Rd_Nmm) || M_N_y_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_y_Rd_Nmm must be > 0 (division by zero)",
        details: { M_N_y_Rd_Nmm, sectionRef: "6.2.9.1" },
      });
    }

    return abs_M_y_Ed_Nmm / M_N_y_Rd_Nmm;
  },

  utilization_z: ({ abs_M_z_Ed_Nmm, M_N_z_Rd_Nmm }) => {
    if (!Number.isFinite(M_N_z_Rd_Nmm) || M_N_z_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_z_Rd_Nmm must be > 0 (division by zero)",
        details: { M_N_z_Rd_Nmm, sectionRef: "6.2.9.1" },
      });
    }

    return abs_M_z_Ed_Nmm / M_N_z_Rd_Nmm;
  },

  utilization_class12: ({
    utilization_y,
    alpha_biax,
    utilization_z,
    beta_biax,
  }) => {
    return utilization_y ** alpha_biax + utilization_z ** beta_biax;
  },

  sigma_N_MPa: ({ abs_N_Ed_N, A_mm2 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.2" },
      });
    }
    return abs_N_Ed_N / A_mm2;
  },

  sigma_M_y_MPa: ({ abs_M_y_Ed_Nmm, Wel_y_mm3 }) => {
    if (!Number.isFinite(Wel_y_mm3) || Wel_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_y_mm3 must be > 0",
        details: { Wel_y_mm3, sectionRef: "6.2.9.2" },
      });
    }
    return abs_M_y_Ed_Nmm / Wel_y_mm3;
  },

  sigma_M_z_MPa: ({ abs_M_z_Ed_Nmm, Wel_z_mm3 }) => {
    if (!Number.isFinite(Wel_z_mm3) || Wel_z_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_z_mm3 must be > 0",
        details: { Wel_z_mm3, sectionRef: "6.2.9.2" },
      });
    }
    return abs_M_z_Ed_Nmm / Wel_z_mm3;
  },

  sigma_x_class3_MPa: ({ sigma_N_MPa, sigma_M_y_MPa, sigma_M_z_MPa }) => {
    return sigma_N_MPa + sigma_M_y_MPa + sigma_M_z_MPa;
  },

  sigma_limit_MPa: ({ fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.9.2" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return fy_MPa / gamma_M0;
  },

  utilization_class3: ({ sigma_x_class3_MPa, sigma_limit_MPa }) => {
    if (!Number.isFinite(sigma_limit_MPa) || sigma_limit_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator sigma_limit_MPa must be > 0 (division by zero)",
        details: { sigma_limit_MPa, sectionRef: "6.2.9.2" },
      });
    }

    return sigma_x_class3_MPa / sigma_limit_MPa;
  },

  biaxial_axial_check: ({
    section_class,
    utilization_class12,
    utilization_class3,
  }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (typeof utilization_class12 === "number") {
      return utilization_class12;
    }
    if (typeof utilization_class3 === "number") {
      return utilization_class3;
    }

    throw new Ec3VerificationError({
      type: "evaluation-error",
      message: "biaxial-axial: no active utilization branch was selected",
      details: { sectionRef: "6.2.9" },
    });
  },
});
