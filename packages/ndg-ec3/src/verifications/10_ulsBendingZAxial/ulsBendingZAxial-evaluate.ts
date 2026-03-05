import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZAxial-nodes";

export const evaluate = defineEvaluators<Nodes>({
  M_pl_z_Rd: ({ Wpl_z, fy, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_z) || Wpl_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: Wpl_z must be > 0",
        details: { Wpl_z, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.5" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_z * fy) / gamma_M0;
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
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

  a_f_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tf) / A;
  },

  a_f_rhs: ({ A, h, t }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: h must be > 0",
        details: { h, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(t) || t <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: t must be > 0",
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
        message: "bending-z-axial: reduction parameter must be >= 0",
        details: { reductionParameter, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(reductionParameter, 0.5);
  },

  is_n_le_a_f: ({ n, a_f }) => {
    return n <= a_f ? 1 : 0;
  },

  k_z: ({ is_n_le_a_f, n, a_f }) => {
    if (is_n_le_a_f === 1) {
      return 1;
    }

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

  sigma_N: ({ abs_N_Ed, A }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: A must be > 0",
        details: { A, sectionRef: "6.2.9.2" },
      });
    }

    return abs_N_Ed / A;
  },

  sigma_M_z: ({ abs_M_z_Ed, Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.9.2" },
      });
    }

    return abs_M_z_Ed / Wel_z;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_z }) => {
    return sigma_N + sigma_M_z;
  },

  sigma_limit: ({ fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: fy must be > 0",
        details: { fy, sectionRef: "6.2.9.2" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial: gamma_M0 must be > 0",
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
          "bending-z-axial: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.9.2" },
      });
    }

    return sigma_x_class3 / sigma_limit;
  },

  bending_z_axial_check: ({ section_class, utilization_class12, utilization_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial: section_class must be an integer in {1,2,3}",
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

    return section_class === 3 ? utilization_class3 : utilization_class12;
  },
});
