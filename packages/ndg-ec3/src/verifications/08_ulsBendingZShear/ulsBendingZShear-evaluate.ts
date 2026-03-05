import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZShear-nodes";

export const evaluate = defineEvaluators<Nodes>({
  W_z_res_class12: ({ Wpl_z }) => {
    if (!Number.isFinite(Wpl_z) || Wpl_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: Wpl_z must be > 0",
        details: { Wpl_z, sectionRef: "6.2.8" },
      });
    }

    return Wpl_z;
  },

  W_z_res_class3: ({ Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.8" },
      });
    }

    return Wel_z;
  },

  W_z_res: ({ section_class, W_z_res_class12, W_z_res_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.8" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.8" },
      });
    }

    return section_class === 3 ? W_z_res_class3 : W_z_res_class12;
  },

  V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y * fy) / (Math.sqrt(3) * gamma_M0);
  },

  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(M_z_Ed);
  },

  abs_V_y_Ed: ({ V_y_Ed }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(V_y_Ed);
  },

  rho_ratio: ({ abs_V_y_Ed, V_pl_y_Rd }) => {
    if (!Number.isFinite(V_pl_y_Rd) || V_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.8" },
      });
    }

    return abs_V_y_Ed / V_pl_y_Rd;
  },

  rho_y: ({ rho_ratio }) => {
    return rho_ratio <= 0.5 ? 0 : (2 * rho_ratio - 1) ** 2;
  },

  W_z_web: ({ tw, h, tf }) => {
    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: h must be > 0",
        details: { h, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: tf must be > 0",
        details: { tf, sectionRef: "6.2.8" },
      });
    }

    const hw = h - 2 * tf;
    if (!Number.isFinite(hw) || hw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: h - 2tf must be > 0",
        details: { h, tf, sectionRef: "6.2.8" },
      });
    }

    return (tw ** 2 * hw) / 4;
  },

  W_z_eff_i: ({ W_z_res, W_z_web, rho_y }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(W_z_web) || W_z_web <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_web must be > 0",
        details: { W_z_web, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.8" },
      });
    }

    const W_z_flange = W_z_res - W_z_web;
    if (!Number.isFinite(W_z_flange) || W_z_flange <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_flange must be > 0",
        details: { W_z_flange, sectionRef: "6.2.8" },
      });
    }

    return W_z_res - rho_y * W_z_flange;
  },

  W_z_eff_rhs: ({ W_z_res, rho_y }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.8" },
      });
    }

    return W_z_res * (1 - rho_y);
  },

  W_z_eff_chs: ({ W_z_res, rho_y }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.8" },
      });
    }

    return W_z_res * (1 - rho_y);
  },

  W_z_eff: ({ section_shape, W_z_eff_i, W_z_eff_rhs, W_z_eff_chs }) => {
    if (section_shape === "I") {
      return W_z_eff_i;
    }

    if (section_shape === "RHS") {
      return W_z_eff_rhs;
    }

    if (section_shape === "CHS") {
      return W_z_eff_chs;
    }

    const unknownSectionShape: never = section_shape;
    return unknownSectionShape;
  },

  M_z_V_Rd: ({ W_z_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_z_eff) || W_z_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: W_z_eff must be > 0",
        details: { W_z_eff, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_z_eff * fy) / gamma_M0;
  },

  bending_z_shear_check: ({ abs_M_z_Ed, M_z_V_Rd }) => {
    if (!Number.isFinite(M_z_V_Rd) || M_z_V_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: denominator M_z_V_Rd must be > 0 (division by zero)",
        details: { M_z_V_Rd, sectionRef: "6.2.8" },
      });
    }

    return abs_M_z_Ed / M_z_V_Rd;
  },
});
