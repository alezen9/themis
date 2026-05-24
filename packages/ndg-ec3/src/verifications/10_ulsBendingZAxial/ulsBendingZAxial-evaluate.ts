import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZAxial-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  M_pl_z_Rd: ({ Wpl_z_mm3, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_z_mm3) || Wpl_z_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: Wpl_z_mm3 must be > 0",
        details: { Wpl_z_mm3, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_z_mm3 * fy_MPa) / gamma_M0;
  },

  N_pl_Rd: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.9" },
      });
    }

    return Math.abs(N_Ed);
  },

  n: ({ abs_N_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return abs_N_Ed / N_pl_Rd;
  },

  a_f_i: ({ A_mm2, b_mm, tf_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf_mm) || tf_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: tf_mm must be > 0",
        details: { tf_mm, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min((A_mm2 - 2 * b_mm * tf_mm) / A_mm2, 0.5);
  },

  a_f_rhs: ({ A_mm2, h_mm, t_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(h_mm) || h_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: h_mm must be > 0",
        details: { h_mm, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(t_mm) || t_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: t_mm must be > 0",
        details: { t_mm, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min((A_mm2 - 2 * h_mm * t_mm) / A_mm2, 0.5);
  },

  a_f_chs: () => {
    return 0.5;
  },

  k_z_i: ({ n, a_f }) => {
    if (n <= a_f) return 1;

    const denominator = 1 - a_f;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial: denominator (1 - a_f) must be > 0 (division by zero)",
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
          "bending-z-axial: denominator (1 - 0.5*a_f) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  M_N_z_Rd: ({ M_pl_z_Rd, k_z }) => {
    if (!Number.isFinite(M_pl_z_Rd) || M_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: M_pl_z_Rd must be > 0",
        details: { M_pl_z_Rd, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(k_z)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: k_z must be finite",
        details: { k_z, sectionRef: "6.2.9.1" },
      });
    }

    const reducedResistance = M_pl_z_Rd * k_z;
    if (!Number.isFinite(reducedResistance) || reducedResistance <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial: denominator M_N_z_Rd must be > 0 (division by zero)",
        details: { reducedResistance, sectionRef: "6.2.9.1" },
      });
    }

    return reducedResistance;
  },

  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.9" },
      });
    }

    return Math.abs(M_z_Ed);
  },

  utilization_class12: ({ abs_M_z_Ed, M_N_z_Rd }) => {
    if (!Number.isFinite(M_N_z_Rd) || M_N_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial: denominator M_N_z_Rd must be > 0 (division by zero)",
        details: { M_N_z_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return abs_M_z_Ed / M_N_z_Rd;
  },

  sigma_N: ({ abs_N_Ed, A_mm2 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.2" },
      });
    }

    return abs_N_Ed / A_mm2;
  },

  sigma_M_z: ({ abs_M_z_Ed, Wel_z_mm3 }) => {
    if (!Number.isFinite(Wel_z_mm3) || Wel_z_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: Wel_z_mm3 must be > 0",
        details: { Wel_z_mm3, sectionRef: "6.2.9.2" },
      });
    }

    return abs_M_z_Ed / Wel_z_mm3;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_z }) => {
    return sigma_N + sigma_M_z;
  },

  sigma_limit: ({ fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.9.2" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return fy_MPa / gamma_M0;
  },

  utilization_class3: ({ sigma_x_class3, sigma_limit }) => {
    if (!Number.isFinite(sigma_limit) || sigma_limit <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.9.2" },
      });
    }

    return sigma_x_class3 / sigma_limit;
  },

  ratio: ({ section_class, utilization_class12, utilization_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: section_class must be in {1,2,3}",
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
      message: "bending-z-axial: no active utilization branch was selected",
      details: { sectionRef: "6.2.9" },
    });
  },
});
