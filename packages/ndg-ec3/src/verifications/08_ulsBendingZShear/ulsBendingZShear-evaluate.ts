import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingZShear-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
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

  u_y: ({ V_y_Ed, V_pl_y_Rd }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.8" },
      });
    }
    if (!Number.isFinite(V_pl_y_Rd) || V_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(V_y_Ed) / V_pl_y_Rd;
  },

  rho_y_1: () => 0,

  rho_y_2: ({ u_y }) => (2 * u_y - 1) ** 2,

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

  M_z_V_Rd_i: ({ W_z_res, W_z_web, rho_y, fy, gamma_M0 }) => {
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

    const W_z_eff = W_z_res - rho_y * (W_z_res - W_z_web);
    if (W_z_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: reduced W_z_eff must be > 0",
        details: { W_z_eff, sectionRef: "6.2.8" },
      });
    }
    return (W_z_eff * fy) / gamma_M0;
  },

  M_z_V_Rd_rhs_chs: ({ W_z_res, rho_y, fy, gamma_M0 }) => {
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

    const W_z_eff = W_z_res * (1 - rho_y);
    return (W_z_eff * fy) / gamma_M0;
  },

  bending_z_shear_check: ({ M_z_Ed, M_z_V_Rd }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-z-shear: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(M_z_V_Rd) || M_z_V_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-z-shear: denominator M_z_V_Rd must be > 0 (division by zero)",
        details: { M_z_V_Rd, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(M_z_Ed) / M_z_V_Rd;
  },
});
