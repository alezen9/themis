import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingYAxial-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  M_pl_y_Rd: ({ Wpl_y_mm3, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_y_mm3) || Wpl_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: Wpl_y_mm3 must be > 0",
        details: { Wpl_y_mm3, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_y_mm3 * fy_MPa) / gamma_M0;
  },

  N_pl_Rd: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  n: ({ N_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.9.1" },
      });
    }
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(N_Ed) / N_pl_Rd;
  },

  a_w_i: ({ A_mm2, b_mm, tf_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf_mm) || tf_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: tf_mm must be > 0",
        details: { tf_mm, sectionRef: "6.2.9.1" },
      });
    }

    const areaRatio = (A_mm2 - 2 * b_mm * tf_mm) / A_mm2;
    if (!Number.isFinite(areaRatio) || areaRatio < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: a_w_i must be >= 0",
        details: { areaRatio, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(areaRatio, 0.5);
  },

  a_w_rhs: ({ A_mm2, b_mm, t_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(t_mm) || t_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: t_mm must be > 0",
        details: { t_mm, sectionRef: "6.2.9.1" },
      });
    }

    const areaRatio = (A_mm2 - 2 * b_mm * t_mm) / A_mm2;
    if (!Number.isFinite(areaRatio) || areaRatio < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: a_w_rhs must be >= 0",
        details: { areaRatio, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(areaRatio, 0.5);
  },

  a_w_chs: () => 0.5,

  k_y_i: ({ n, a_w }) => {
    const a_w_half = 0.5 * a_w;
    if (n <= a_w_half) return 1;

    const denominator = 1 - a_w_half;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: denominator (1 - 0.5*a_w) must be > 0 (division by zero)",
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
          "bending-y-axial: denominator (1 - 0.5*a_w) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  M_N_y_Rd: ({ M_pl_y_Rd, k_y }) => {
    if (!Number.isFinite(M_pl_y_Rd) || M_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: M_pl_y_Rd must be > 0",
        details: { M_pl_y_Rd, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(k_y)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: k_y must be finite",
        details: { k_y, sectionRef: "6.2.9.1" },
      });
    }

    const reducedResistance = M_pl_y_Rd * k_y;
    if (!Number.isFinite(reducedResistance) || reducedResistance <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: denominator M_N_y_Rd must be > 0 (division by zero)",
        details: { reducedResistance, sectionRef: "6.2.9.1" },
      });
    }

    return reducedResistance;
  },

  utilization_class12: ({ M_y_Ed, M_N_y_Rd }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(M_N_y_Rd) || M_N_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: denominator M_N_y_Rd must be > 0 (division by zero)",
        details: { M_N_y_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return Math.abs(M_y_Ed) / M_N_y_Rd;
  },

  sigma_N: ({ N_Ed, A_mm2 }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.9.2" },
      });
    }

    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.2" },
      });
    }

    return Math.abs(N_Ed) / A_mm2;
  },

  sigma_M_y: ({ M_y_Ed, Wel_y_mm3 }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.9.2" },
      });
    }

    if (!Number.isFinite(Wel_y_mm3) || Wel_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: Wel_y_mm3 must be > 0",
        details: { Wel_y_mm3, sectionRef: "6.2.9.2" },
      });
    }

    return Math.abs(M_y_Ed) / Wel_y_mm3;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_y }) => {
    return sigma_N + sigma_M_y;
  },

  sigma_limit: ({ fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.9.2" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: gamma_M0 must be > 0",
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
          "bending-y-axial: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.9.2" },
      });
    }

    return sigma_x_class3 / sigma_limit;
  },

  ratio: ({ section_class, utilization_class12, utilization_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.9" },
      });
    }

    if (typeof utilization_class12 === "number") return utilization_class12;
    if (typeof utilization_class3 === "number") return utilization_class3;

    throw new Ec3VerificationError({
      type: "evaluation-error",
      message: "bending-y-axial: no active utilization branch was selected",
      details: { sectionRef: "6.2.9" },
    });
  },
});
