import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBiaxialAxial-nodes";

export const evaluate = defineEvaluators<Nodes>({
  W_y_res_class12: ({ Wpl_y }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.5" },
      });
    }
    return Wpl_y;
  },

  W_y_res_class3: ({ Wel_y }) => {
    if (!Number.isFinite(Wel_y) || Wel_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_y must be > 0",
        details: { Wel_y, sectionRef: "6.2.5" },
      });
    }
    return Wel_y;
  },

  W_y_res: ({ section_class, W_y_res_class12, W_y_res_class3 }) => {
    return section_class === 3 ? W_y_res_class3 : W_y_res_class12;
  },

  W_z_res_class12: ({ Wpl_z }) => {
    if (!Number.isFinite(Wpl_z) || Wpl_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wpl_z must be > 0",
        details: { Wpl_z, sectionRef: "6.2.5" },
      });
    }
    return Wpl_z;
  },

  W_z_res_class3: ({ Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.5" },
      });
    }
    return Wel_z;
  },

  W_z_res: ({ section_class, W_z_res_class12, W_z_res_class3 }) => {
    return section_class === 3 ? W_z_res_class3 : W_z_res_class12;
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
  },

  N_c_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(N_Ed);
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.9.2" },
      });
    }

    return Math.abs(N_Ed);
  },

  n: ({ N_c_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return N_c_Ed / N_pl_Rd;
  },

  a_w_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }
    return (A - 2 * b * tf) / A;
  },

  a_w_rhs: ({ A, b, t }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(t) || t <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: t must be > 0",
        details: { t, sectionRef: "6.2.9.1" },
      });
    }
    return (A - 2 * b * t) / A;
  },

  a_w_chs: () => {
    return 0.5;
  },

  a_w: ({ section_shape, a_w_i, a_w_rhs, a_w_chs }) => {
    const reductionParameter =
      section_shape === "I"
        ? a_w_i
        : section_shape === "RHS"
          ? a_w_rhs
          : a_w_chs;

    if (!Number.isFinite(reductionParameter) || reductionParameter < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: reduction parameter a_w must be >= 0",
        details: { reductionParameter, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(reductionParameter, 0.5);
  },

  a_f_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tf) / A;
  },

  a_f_rhs: ({ A, h, t }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: h must be > 0",
        details: { h, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(t) || t <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: t must be > 0",
        details: { t, sectionRef: "6.2.9.1" },
      });
    }
    return (A - 2 * h * t) / A;
  },

  a_f_chs: () => {
    return 0.5;
  },

  a_f: ({ section_shape, a_f_i, a_f_rhs, a_f_chs }) => {
    const reductionParameter =
      section_shape === "I"
        ? a_f_i
        : section_shape === "RHS"
          ? a_f_rhs
          : a_f_chs;

    if (!Number.isFinite(reductionParameter) || reductionParameter < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: reduction parameter a_f must be >= 0",
        details: { reductionParameter, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(reductionParameter, 0.5);
  },

  M_pl_y_Rd: ({ W_y_res, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_y_res) || W_y_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: W_y_res must be > 0",
        details: { W_y_res, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (W_y_res * fy) / gamma_M0;
  },

  M_pl_z_Rd: ({ W_z_res, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return (W_z_res * fy) / gamma_M0;
  },

  k_y: ({ n, a_w }) => {
    const denominator = 1 - 0.5 * a_w;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator (1 - 0.5 a_w) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  M_N_y_Rd: ({ M_pl_y_Rd, k_y }) => {
    const M_N_y_Rd = M_pl_y_Rd * k_y;
    if (!Number.isFinite(M_N_y_Rd) || M_N_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_y_Rd must be > 0 (division by zero)",
        details: { M_N_y_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return M_N_y_Rd;
  },

  k_z: ({ n, a_f }) => {
    const denominator = 1 - a_f;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator (1 - a_f) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    if (n <= a_f) {
      return 1;
    }

    return 1 - ((n - a_f) / denominator) ** 2;
  },

  M_N_z_Rd: ({ M_pl_z_Rd, k_z }) => {
    const M_N_z_Rd = M_pl_z_Rd * k_z;
    if (!Number.isFinite(M_N_z_Rd) || M_N_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_z_Rd must be > 0 (division by zero)",
        details: { M_N_z_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return M_N_z_Rd;
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

  alpha_biax: ({ section_shape, alpha_biax_i, alpha_biax_rhs, alpha_biax_chs }) => {
    if (section_shape === "I") return alpha_biax_i;
    if (section_shape === "RHS") return alpha_biax_rhs;
    if (section_shape === "CHS") return alpha_biax_chs;
    const unknownSectionShape: never = section_shape;
    return unknownSectionShape;
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

  beta_biax: ({ section_shape, beta_biax_i, beta_biax_rhs, beta_biax_chs }) => {
    if (section_shape === "I") return beta_biax_i;
    if (section_shape === "RHS") return beta_biax_rhs;
    if (section_shape === "CHS") return beta_biax_chs;
    const unknownSectionShape: never = section_shape;
    return unknownSectionShape;
  },

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(M_y_Ed);
  },

  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(M_z_Ed);
  },

  utilization_y: ({ abs_M_y_Ed, M_N_y_Rd }) => {
    if (!Number.isFinite(M_N_y_Rd) || M_N_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_y_Rd must be > 0 (division by zero)",
        details: { M_N_y_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return abs_M_y_Ed / M_N_y_Rd;
  },

  utilization_z: ({ abs_M_z_Ed, M_N_z_Rd }) => {
    if (!Number.isFinite(M_N_z_Rd) || M_N_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator M_N_z_Rd must be > 0 (division by zero)",
        details: { M_N_z_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return abs_M_z_Ed / M_N_z_Rd;
  },

  utilization_class12: ({ utilization_y, alpha_biax, utilization_z, beta_biax }) => {
    return utilization_y ** alpha_biax + utilization_z ** beta_biax;
  },

  sigma_N: ({ abs_N_Ed, A }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.2" },
      });
    }
    return abs_N_Ed / A;
  },

  sigma_M_y: ({ abs_M_y_Ed, Wel_y }) => {
    if (!Number.isFinite(Wel_y) || Wel_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_y must be > 0",
        details: { Wel_y, sectionRef: "6.2.9.2" },
      });
    }
    return abs_M_y_Ed / Wel_y;
  },

  sigma_M_z: ({ abs_M_z_Ed, Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.9.2" },
      });
    }
    return abs_M_z_Ed / Wel_z;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_y, sigma_M_z }) => {
    return sigma_N + sigma_M_y + sigma_M_z;
  },

  sigma_limit: ({ fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.9.2" },
      });
    }
    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }
    return fy / gamma_M0;
  },

  utilization_class3: ({ sigma_x_class3, sigma_limit }) => {
    if (!Number.isFinite(sigma_limit) || sigma_limit <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.9.2" },
      });
    }

    return sigma_x_class3 / sigma_limit;
  },

  biaxial_axial_check: ({ section_class, utilization_class12, utilization_class3 }) => {
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

    return section_class === 3 ? utilization_class3 : utilization_class12;
  },
});
