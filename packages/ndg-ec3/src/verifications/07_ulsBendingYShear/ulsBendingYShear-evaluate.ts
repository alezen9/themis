import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingYShear-nodes";

export const evaluate = defineEvaluators<Nodes>({
  W_y_res_class12: ({ Wpl_y }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.8" },
      });
    }

    return Wpl_y;
  },

  W_y_res_class3: ({ Wel_y }) => {
    if (!Number.isFinite(Wel_y) || Wel_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: Wel_y must be > 0",
        details: { Wel_y, sectionRef: "6.2.8" },
      });
    }

    return Wel_y;
  },

  W_y_res: ({ section_class, W_y_res_class12, W_y_res_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.8" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.8" },
      });
    }

    return section_class === 3 ? W_y_res_class3 : W_y_res_class12;
  },

  V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z * fy) / (Math.sqrt(3) * gamma_M0);
  },

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(M_y_Ed);
  },

  abs_V_z_Ed: ({ V_z_Ed }) => {
    if (!Number.isFinite(V_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: V_z_Ed must be finite",
        details: { V_z_Ed, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(V_z_Ed);
  },

  rho_ratio: ({ abs_V_z_Ed, V_pl_z_Rd }) => {
    if (!Number.isFinite(V_pl_z_Rd) || V_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: denominator V_pl_z_Rd must be > 0 (division by zero)",
        details: { V_pl_z_Rd, sectionRef: "6.2.8" },
      });
    }

    return abs_V_z_Ed / V_pl_z_Rd;
  },

  rho_z: ({ rho_ratio }) => {
    return rho_ratio <= 0.5 ? 0 : (2 * rho_ratio - 1) ** 2;
  },

  W_y_eff_i: ({ W_y_res, rho_z, Av_z, tw }) => {
    if (!Number.isFinite(W_y_res) || W_y_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: W_y_res must be > 0",
        details: { W_y_res, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
      });
    }

    return W_y_res - (rho_z * Av_z ** 2) / (4 * tw);
  },

  W_y_eff_rhs: ({ W_y_res, rho_z }) => {
    if (!Number.isFinite(W_y_res) || W_y_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: W_y_res must be > 0",
        details: { W_y_res, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.8" },
      });
    }

    return W_y_res * (1 - rho_z);
  },

  W_y_eff_chs: ({ W_y_res, rho_z }) => {
    if (!Number.isFinite(W_y_res) || W_y_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: W_y_res must be > 0",
        details: { W_y_res, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.8" },
      });
    }

    return W_y_res * (1 - rho_z);
  },

  W_y_eff: ({ section_shape, W_y_eff_i, W_y_eff_rhs, W_y_eff_chs }) => {
    if (section_shape === "I") {
      return W_y_eff_i;
    }

    if (section_shape === "RHS") {
      return W_y_eff_rhs;
    }

    if (section_shape === "CHS") {
      return W_y_eff_chs;
    }

    const unknownSectionShape: never = section_shape;
    return unknownSectionShape;
  },

  M_y_V_Rd: ({ W_y_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(W_y_eff) || W_y_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: W_y_eff must be > 0",
        details: { W_y_eff, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (W_y_eff * fy) / gamma_M0;
  },

  bending_y_shear_check: ({ abs_M_y_Ed, M_y_V_Rd }) => {
    if (!Number.isFinite(M_y_V_Rd) || M_y_V_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: denominator M_y_V_Rd must be > 0 (division by zero)",
        details: { M_y_V_Rd, sectionRef: "6.2.8" },
      });
    }

    return abs_M_y_Ed / M_y_V_Rd;
  },
});
