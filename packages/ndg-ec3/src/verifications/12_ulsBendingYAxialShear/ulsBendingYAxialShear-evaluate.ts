import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBendingYAxialShear-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  N_c_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(N_Ed);
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(N_Ed);
  },

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(M_y_Ed);
  },

  abs_V_z_Ed: ({ V_z_Ed }) => {
    if (!Number.isFinite(V_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: V_z_Ed must be finite",
        details: { V_z_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_z_Ed);
  },

  abs_V_y_Ed: ({ V_y_Ed }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_y_Ed);
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
  },

  n: ({ N_c_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.10" },
      });
    }

    return N_c_Ed / N_pl_Rd;
  },

  V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z * fy) / (Math.sqrt(3) * gamma_M0);
  },

  V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y * fy) / (Math.sqrt(3) * gamma_M0);
  },

  rho_z: ({ abs_V_z_Ed, V_pl_z_Rd }) => {
    if (!Number.isFinite(V_pl_z_Rd) || V_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator V_pl_z_Rd must be > 0 (division by zero)",
        details: { V_pl_z_Rd, sectionRef: "6.2.10" },
      });
    }

    const shearUtilization = abs_V_z_Ed / V_pl_z_Rd;
    return shearUtilization <= 0.5 ? 0 : (2 * shearUtilization - 1) ** 2;
  },

  rho_y: ({ abs_V_y_Ed, V_pl_y_Rd }) => {
    if (!Number.isFinite(V_pl_y_Rd) || V_pl_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.10" },
      });
    }

    const shearUtilization = abs_V_y_Ed / V_pl_y_Rd;
    return shearUtilization <= 0.5 ? 0 : (2 * shearUtilization - 1) ** 2;
  },

  a_w_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    const areaRatio = (A - 2 * b * tf) / A;
    if (!Number.isFinite(areaRatio) || areaRatio < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: a_w_i must be >= 0",
        details: { areaRatio, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(areaRatio, 0.5);
  },

  a_w_rhs: ({ A, b, tw }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.9.1" },
      });
    }

    const areaRatio = (A - 2 * b * tw) / A;
    if (!Number.isFinite(areaRatio) || areaRatio < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: a_w_rhs must be >= 0",
        details: { areaRatio, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(areaRatio, 0.5);
  },

  a_w_chs: () => 0.5,

  a_w_half: ({ a_w }) => 0.5 * a_w,

  k_y_1: () => 1,

  k_y_2: ({ n, a_w }) => {
    if (!Number.isFinite(n)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: n must be finite",
        details: { n, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(a_w) || a_w < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: a_w must be >= 0",
        details: { a_w, sectionRef: "6.2.9.1" },
      });
    }

    const denominator = 1 - 0.5 * a_w;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator (1 - 0.5 a_w) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  Wpl_y_eff_i: ({ Wpl_y, b, h, tf, tw, rho_y, rho_z }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: b and h must be > 0",
        details: { b, h, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0 || !Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tf and tw must be > 0",
        details: { tf, tw, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(rho_y) || rho_y < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: rho_y must be >= 0",
        details: { rho_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.10" },
      });
    }

    const reducedFlangeThickness = (1 - rho_y) * tf;
    const reducedWebThickness = (1 - rho_z) * tw;

    if (!Number.isFinite(reducedFlangeThickness) || reducedFlangeThickness <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: reduced flange thickness must be > 0",
        details: { reducedFlangeThickness, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(reducedWebThickness) || reducedWebThickness <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: reduced web thickness must be > 0",
        details: { reducedWebThickness, sectionRef: "6.2.10" },
      });
    }

    const unreducedReference =
      b * tf * (h - tf) + (tw * (h - 2 * tf) ** 2) / 4;
    const reducedReference =
      b * reducedFlangeThickness * (h - reducedFlangeThickness) +
      (reducedWebThickness * (h - 2 * reducedFlangeThickness) ** 2) / 4;
    const rootOffset = Wpl_y - unreducedReference;
    const Wpl_y_eff_i = reducedReference + rootOffset;

    if (!Number.isFinite(Wpl_y_eff_i) || Wpl_y_eff_i <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_i must be > 0",
        details: { Wpl_y_eff_i, sectionRef: "6.2.10" },
      });
    }

    return Wpl_y_eff_i;
  },

  Wpl_y_eff_rhs: ({ Wpl_y, rho_z, Av_z, tw }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.10" },
      });
    }

    const Wpl_y_eff_rhs = Wpl_y - (rho_z * Av_z ** 2) / (4 * tw);
    if (!Number.isFinite(Wpl_y_eff_rhs) || Wpl_y_eff_rhs <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_rhs must be > 0",
        details: { Wpl_y_eff_rhs, sectionRef: "6.2.10" },
      });
    }

    return Wpl_y_eff_rhs;
  },

  Wpl_y_eff_chs: ({ Wpl_y, rho_z, Av_z, tw }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.10" },
      });
    }

    const Wpl_y_eff_chs = Wpl_y - (rho_z * Av_z ** 2) / (4 * tw);
    if (!Number.isFinite(Wpl_y_eff_chs) || Wpl_y_eff_chs <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_chs must be > 0",
        details: { Wpl_y_eff_chs, sectionRef: "6.2.10" },
      });
    }

    return Wpl_y_eff_chs;
  },

  Wpl_y_eff: ({ Wpl_y_eff_i, Wpl_y_eff_rhs, Wpl_y_eff_chs }) => {
    if (typeof Wpl_y_eff_i === "number") return Wpl_y_eff_i;
    if (typeof Wpl_y_eff_rhs === "number") return Wpl_y_eff_rhs;
    if (typeof Wpl_y_eff_chs === "number") return Wpl_y_eff_chs;

    throw new Ec3VerificationError({
      type: "evaluation-error",
      message: "bending-y-axial-shear: no active section-shape branch was selected",
      details: { sectionRef: "6.2.10" },
    });
  },

  M_y_V_Rd: ({ Wpl_y_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_y_eff) || Wpl_y_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff must be > 0",
        details: { Wpl_y_eff, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_y_eff * fy) / gamma_M0;
  },

  M_NV_y_Rd: ({ M_y_V_Rd, k_y }) => {
    const M_NV_y_Rd = M_y_V_Rd * k_y;
    if (!Number.isFinite(M_NV_y_Rd) || M_NV_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator M_NV_y_Rd must be > 0 (division by zero)",
        details: { M_NV_y_Rd, sectionRef: "6.2.10" },
      });
    }

    return M_NV_y_Rd;
  },

  utilization_class12: ({ abs_M_y_Ed, M_NV_y_Rd }) => {
    if (!Number.isFinite(M_NV_y_Rd) || M_NV_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator M_NV_y_Rd must be > 0 (division by zero)",
        details: { M_NV_y_Rd, sectionRef: "6.2.10" },
      });
    }

    return abs_M_y_Ed / M_NV_y_Rd;
  },

  sigma_N: ({ abs_N_Ed, A }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.10" },
      });
    }

    return abs_N_Ed / A;
  },

  sigma_M_y: ({ abs_M_y_Ed, Wel_y }) => {
    if (!Number.isFinite(Wel_y) || Wel_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wel_y must be > 0",
        details: { Wel_y, sectionRef: "6.2.10" },
      });
    }

    return abs_M_y_Ed / Wel_y;
  },

  sigma_x_class3: ({ sigma_N, sigma_M_y }) => {
    return sigma_N + sigma_M_y;
  },

  tau_y: ({ abs_V_y_Ed, Av_y }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.10" },
      });
    }

    return abs_V_y_Ed / Av_y;
  },

  tau_z: ({ abs_V_z_Ed, Av_z }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.10" },
      });
    }

    return abs_V_z_Ed / Av_z;
  },

  sigma_v_class3: ({ sigma_x_class3, tau_y, tau_z }) => {
    const sigma_v_class3 = Math.sqrt(
      sigma_x_class3 ** 2 + 3 * (tau_y ** 2 + tau_z ** 2),
    );

    if (!Number.isFinite(sigma_v_class3) || sigma_v_class3 < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: sigma_v_class3 must be finite",
        details: { sigma_v_class3, sectionRef: "6.2.10" },
      });
    }

    return sigma_v_class3;
  },

  sigma_limit: ({ fy, gamma_M0 }) => {
    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return fy / gamma_M0;
  },

  utilization_class3: ({ sigma_v_class3, sigma_limit }) => {
    if (!Number.isFinite(sigma_limit) || sigma_limit <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator sigma_limit must be > 0 (division by zero)",
        details: { sigma_limit, sectionRef: "6.2.10" },
      });
    }

    return sigma_v_class3 / sigma_limit;
  },

  bending_y_axial_shear_check: ({ section_class, utilization_class12, utilization_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.10" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.10" },
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
      message: "bending-y-axial-shear: no active utilization branch was selected",
      details: { sectionRef: "6.2.10" },
    });
  },
});
