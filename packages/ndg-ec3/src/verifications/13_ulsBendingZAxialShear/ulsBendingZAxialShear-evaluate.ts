import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZAxialShear-nodes";

export const evaluate = defineEvaluators<Nodes>({
  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(M_z_Ed);
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(N_Ed);
  },

  abs_V_y_Ed: ({ V_y_Ed }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_y_Ed);
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
  },

  n: ({ abs_N_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.10" },
      });
    }

    return abs_N_Ed / N_pl_Rd;
  },

  a_f_raw_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tf) / A;
  },

  a_f_raw_rhs: ({ A, h, t }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: h must be > 0",
        details: { h, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(t) || t <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: t must be > 0",
        details: { t, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * h * t) / A;
  },

  a_f_raw_chs: () => {
    return 0.5;
  },

  a_f_raw: ({ section_shape, a_f_raw_i, a_f_raw_rhs, a_f_raw_chs }) => {
    if (section_shape === "I") return a_f_raw_i;
    if (section_shape === "RHS") return a_f_raw_rhs;
    if (section_shape === "CHS") return a_f_raw_chs;
    const unknownSectionShape: never = section_shape;
    return unknownSectionShape;
  },

  a_f: ({ a_f_raw }) => {
    if (!Number.isFinite(a_f_raw) || a_f_raw < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: a_f_raw must be >= 0",
        details: { a_f_raw, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(a_f_raw, 0.5);
  },

  n_le_a_f: ({ n, a_f }) => {
    return n <= a_f ? 1 : 0;
  },

  axial_ratio: ({ n, a_f }) => {
    const axialDenominator = 1 - a_f;
    if (!Number.isFinite(axialDenominator) || axialDenominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: denominator axialDenominator must be > 0 (division by zero)",
        details: { axialDenominator, sectionRef: "6.2.9.1" },
      });
    }

    return (n - a_f) / axialDenominator;
  },

  axial_factor_low: () => {
    return 1;
  },

  axial_factor_high: ({ axial_ratio }) => {
    return 1 - axial_ratio ** 2;
  },

  axial_factor: ({ n_le_a_f, axial_factor_low, axial_factor_high }) => {
    return n_le_a_f === 1 ? axial_factor_low : axial_factor_high;
  },

  V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y * fy) / (Math.sqrt(3) * gamma_M0);
  },

  rho_ratio_y: ({ abs_V_y_Ed, V_pl_y_Rd }) => {
    if (!Number.isFinite(V_pl_y_Rd) || V_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.10" },
      });
    }

    return abs_V_y_Ed / V_pl_y_Rd;
  },

  rho_y: ({ rho_ratio_y }) => {
    return rho_ratio_y <= 0.5 ? 0 : (2 * rho_ratio_y - 1) ** 2;
  },

  Wpl_z_web: ({ Av_z, tw }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
      });
    }

    return (Av_z * tw) / 4;
  },

  Wpl_z_eff: ({ Wpl_z, rho_y, Wpl_z_web }) => {
    if (!Number.isFinite(Wpl_z) || Wpl_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Wpl_z must be > 0",
        details: { Wpl_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.8" },
      });
    }

    const Wpl_z_eff = Wpl_z - rho_y * (Wpl_z - Wpl_z_web);
    if (!Number.isFinite(Wpl_z_eff) || Wpl_z_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Wpl_z_eff must be > 0",
        details: { Wpl_z_eff, sectionRef: "6.2.8" },
      });
    }

    return Wpl_z_eff;
  },

  M_z_V_Rd: ({ Wpl_z_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_z_eff) || Wpl_z_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Wpl_z_eff must be > 0",
        details: { Wpl_z_eff, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_z_eff * fy) / gamma_M0;
  },

  M_NV_z_Rd: ({ M_z_V_Rd, axial_factor }) => {
    const M_NV_z_Rd = M_z_V_Rd * axial_factor;
    if (!Number.isFinite(M_NV_z_Rd) || M_NV_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: denominator M_NV_z_Rd must be > 0 (division by zero)",
        details: { M_NV_z_Rd, sectionRef: "6.2.10" },
      });
    }

    return M_NV_z_Rd;
  },

  class12_ratio: ({ abs_M_z_Ed, M_NV_z_Rd }) => {
    if (!Number.isFinite(M_NV_z_Rd) || M_NV_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: denominator M_NV_z_Rd must be > 0 (division by zero)",
        details: { M_NV_z_Rd, sectionRef: "6.2.10" },
      });
    }

    return abs_M_z_Ed / M_NV_z_Rd;
  },

  sigma_N: ({ abs_N_Ed, A }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.10" },
      });
    }

    return abs_N_Ed / A;
  },

  sigma_M_z: ({ abs_M_z_Ed, Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.10" },
      });
    }

    return abs_M_z_Ed / Wel_z;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_z }) => {
    return sigma_N + sigma_M_z;
  },

  tau_y: ({ abs_V_y_Ed, Av_y }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.10" },
      });
    }

    return abs_V_y_Ed / Av_y;
  },

  sigma_v_class3: ({ sigma_x_class3, tau_y }) => {
    const sigma_v_class3 = Math.sqrt(sigma_x_class3 ** 2 + 3 * tau_y ** 2);
    if (!Number.isFinite(sigma_v_class3) || sigma_v_class3 < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: sigma_v_class3 must be finite",
        details: { sigma_v_class3, sectionRef: "6.2.10" },
      });
    }

    return sigma_v_class3;
  },

  sigma_limit: ({ fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return fy / gamma_M0;
  },

  class3_ratio: ({ sigma_v_class3, sigma_limit }) => {
    if (!Number.isFinite(sigma_limit) || sigma_limit <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.10" },
      });
    }

    return sigma_v_class3 / sigma_limit;
  },

  bending_z_axial_shear_check: ({ section_class, class12_ratio, class3_ratio }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-axial-shear: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.10" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-axial-shear: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.10" },
      });
    }

    return section_class === 3 ? class3_ratio : class12_ratio;
  },
});
