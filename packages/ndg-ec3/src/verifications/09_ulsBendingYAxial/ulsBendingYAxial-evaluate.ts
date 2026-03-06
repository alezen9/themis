import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingYAxial-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  M_pl_y_Rd: ({ Wpl_y, fy, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_y * fy) / gamma_M0;
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: N_Ed must be finite",
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
          "bending-y-axial: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return abs_N_Ed / N_pl_Rd;
  },

  a_w_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tf) / A;
  },

  a_w_rhs: ({ A, b, t }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(t) || t <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: t must be > 0",
        details: { t, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * t) / A;
  },

  a_w_chs: () => {
    return 0.5;
  },

  a_w: ({ section_shape, a_w_i, a_w_rhs, a_w_chs }) => {
    const areaRatioByShape =
      section_shape === "I"
        ? a_w_i
        : section_shape === "RHS"
          ? a_w_rhs
          : a_w_chs;

    if (!Number.isFinite(areaRatioByShape) || areaRatioByShape < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: area ratio must be >= 0",
        details: { areaRatioByShape, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(areaRatioByShape, 0.5);
  },

  is_n_le_half_a_w: ({ n, a_w }) => {
    return n <= 0.5 * a_w ? 1 : 0;
  },

  k_y: ({ is_n_le_half_a_w, n, a_w }) => {
    if (is_n_le_half_a_w === 1) {
      return 1;
    }

    const denominator = 1 - 0.5 * a_w;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: denominator (1 - 0.5 a_w) must be > 0 (division by zero)",
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

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.9" },
      });
    }

    return Math.abs(M_y_Ed);
  },

  utilization_class12: ({ abs_M_y_Ed, M_N_y_Rd }) => {
    if (!Number.isFinite(M_N_y_Rd) || M_N_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: denominator M_N_y_Rd must be > 0 (division by zero)",
        details: { M_N_y_Rd, sectionRef: "6.2.9.1" },
      });
    }

    return abs_M_y_Ed / M_N_y_Rd;
  },

  sigma_N: ({ abs_N_Ed, A }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.2" },
      });
    }

    return abs_N_Ed / A;
  },

  sigma_M_y: ({ abs_M_y_Ed, Wel_y }) => {
    if (!Number.isFinite(Wel_y) || Wel_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: Wel_y must be > 0",
        details: { Wel_y, sectionRef: "6.2.9.2" },
      });
    }

    return abs_M_y_Ed / Wel_y;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_y }) => {
    return sigma_N + sigma_M_y;
  },

  sigma_limit: ({ fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.9.2" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial: gamma_M0 must be > 0",
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
          "bending-y-axial: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.9.2" },
      });
    }

    return sigma_x_class3 / sigma_limit;
  },

  bending_y_axial_check: ({ section_class, utilization_class12, utilization_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial: section_class must be an integer in {1,2,3}",
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

    return section_class === 3 ? utilization_class3 : utilization_class12;
  },
});
