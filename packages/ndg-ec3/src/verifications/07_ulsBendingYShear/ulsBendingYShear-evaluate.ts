import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingYShear-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
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

  u_z: ({ V_z_Ed, V_pl_z_Rd }) => {
    if (!Number.isFinite(V_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: V_z_Ed must be finite",
        details: { V_z_Ed, sectionRef: "6.2.8" },
      });
    }
    if (!Number.isFinite(V_pl_z_Rd) || V_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: denominator V_pl_z_Rd must be > 0 (division by zero)",
        details: { V_pl_z_Rd, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(V_z_Ed) / V_pl_z_Rd;
  },

  rho_z_1: () => 0,

  rho_z_2: ({ u_z }) => (2 * u_z - 1) ** 2,

  A_w: ({ hw, tw }) => {
    if (!Number.isFinite(hw) || hw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: hw must be > 0",
        details: { hw, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
      });
    }

    return hw * tw;
  },

  M_y_V_Rd_i: ({ W_y_res, rho_z, A_w, tw, fy, gamma_M0 }) => {
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

    if (!Number.isFinite(A_w) || A_w <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: A_w must be > 0",
        details: { A_w, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
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

    const M_c_y_Rd = (W_y_res * fy) / gamma_M0;
    const W_y_eff = W_y_res - (rho_z * A_w ** 2) / (4 * tw);
    if (W_y_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: reduced W_y_eff must be > 0",
        details: { W_y_eff, sectionRef: "6.2.8" },
      });
    }
    return Math.min((W_y_eff * fy) / gamma_M0, M_c_y_Rd);
  },

  M_y_V_Rd_rhs_chs: ({ W_y_res, rho_z, fy, gamma_M0 }) => {
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

    const M_c_y_Rd = (W_y_res * fy) / gamma_M0;
    const W_y_eff = W_y_res * (1 - rho_z);
    return Math.min((W_y_eff * fy) / gamma_M0, M_c_y_Rd);
  },

  bending_y_shear_check: ({ M_y_Ed, M_y_V_Rd }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-shear: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(M_y_V_Rd) || M_y_V_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-shear: denominator M_y_V_Rd must be > 0 (division by zero)",
        details: { M_y_V_Rd, sectionRef: "6.2.8" },
      });
    }

    return Math.abs(M_y_Ed) / M_y_V_Rd;
  },
});
