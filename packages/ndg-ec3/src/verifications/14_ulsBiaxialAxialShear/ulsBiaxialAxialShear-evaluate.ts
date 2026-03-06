import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import type { Nodes } from "./ulsBiaxialAxialShear-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";

export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
  V_pl_z_Rd: ({ Av_z, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z * fy) / (Math.sqrt(3) * gamma_M0);
  },

  V_pl_y_Rd: ({ Av_y, fy, gamma_M0 }) => {
    if (!Number.isFinite(Av_y) || Av_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_y must be > 0",
        details: { Av_y, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y * fy) / (Math.sqrt(3) * gamma_M0);
  },

  abs_V_z_Ed: ({ V_z_Ed }) => {
    if (!Number.isFinite(V_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: V_z_Ed must be finite",
        details: { V_z_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_z_Ed);
  },

  abs_V_y_Ed: ({ V_y_Ed }) => {
    if (!Number.isFinite(V_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: V_y_Ed must be finite",
        details: { V_y_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_y_Ed);
  },

  rho_z: ({ abs_V_z_Ed, V_pl_z_Rd }) => {
    if (!Number.isFinite(V_pl_z_Rd) || V_pl_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator V_pl_z_Rd must be > 0 (division by zero)",
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
          "biaxial-axial-shear: denominator V_pl_y_Rd must be > 0 (division by zero)",
        details: { V_pl_y_Rd, sectionRef: "6.2.10" },
      });
    }

    const shearUtilization = abs_V_y_Ed / V_pl_y_Rd;
    return shearUtilization <= 0.5 ? 0 : (2 * shearUtilization - 1) ** 2;
  },

  N_pl_Rd: ({ A, fy, gamma_M0 }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A * fy) / gamma_M0;
  },

  abs_N_Ed: ({ N_Ed }) => {
    if (!Number.isFinite(N_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: N_Ed must be finite",
        details: { N_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(N_Ed);
  },

  n: ({ abs_N_Ed, N_pl_Rd }) => {
    if (!Number.isFinite(N_pl_Rd) || N_pl_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator N_pl_Rd must be > 0 (division by zero)",
        details: { N_pl_Rd, sectionRef: "6.2.10" },
      });
    }

    return abs_N_Ed / N_pl_Rd;
  },

  a_w_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tf) / A;
  },

  a_w_rhs: ({ A, b, tw }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tw) / A;
  },

  a_w_chs: () => {
    return 0.5;
  },

  a_w: ({ section_shape, a_w_i, a_w_rhs, a_w_chs }) => {
    const reductionParameter =
      section_shape === "I"
        ? a_w_i
        : section_shape === "RHS"
          ? a_w_rhs
          : a_w_chs;

    if (!Number.isFinite(reductionParameter) || reductionParameter < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: reduction parameter a_w must be >= 0",
        details: { reductionParameter, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(reductionParameter, 0.5);
  },

  a_f_i: ({ A, b, tf }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b) || b <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: b must be > 0",
        details: { b, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tf must be > 0",
        details: { tf, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * b * tf) / A;
  },

  a_f_rhs: ({ A, h, tw }) => {
    if (!Number.isFinite(A) || A <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: A must be > 0",
        details: { A, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: h must be > 0",
        details: { h, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.9.1" },
      });
    }

    return (A - 2 * h * tw) / A;
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
        message: "biaxial-axial-shear: reduction parameter a_f must be >= 0",
        details: { reductionParameter, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(reductionParameter, 0.5);
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
          "biaxial-axial-shear: denominator (1 - 0.5 a_w) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(1, (1 - n) / denominator);
  },

  Wpl_y_eff_i: ({ Wpl_y, b, h, tf, tw, rho_y, rho_z }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(h) || h <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: b and h must be > 0",
        details: { b, h, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tf) || tf <= 0 || !Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tf and tw must be > 0",
        details: { tf, tw, sectionRef: "6.2.10" },
      });
    }

    const reducedFlangeThickness = (1 - rho_y) * tf;
    const reducedWebThickness = (1 - rho_z) * tw;

    if (!Number.isFinite(reducedFlangeThickness) || reducedFlangeThickness <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: reduced flange thickness must be > 0",
        details: { reducedFlangeThickness, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(reducedWebThickness) || reducedWebThickness <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: reduced web thickness must be > 0",
        details: { reducedWebThickness, sectionRef: "6.2.10" },
      });
    }

    const unreducedReference =
      b * tf * (h - tf) + (tw * (h - 2 * tf) ** 2) / 4;
    const reducedReference =
      b * reducedFlangeThickness * (h - reducedFlangeThickness) +
      (reducedWebThickness * (h - 2 * reducedFlangeThickness) ** 2) / 4;
    const rootOffset = Wpl_y - unreducedReference;
    const effectiveWpl = reducedReference + rootOffset;

    if (!Number.isFinite(effectiveWpl) || effectiveWpl <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y_eff_i must be > 0",
        details: { effectiveWpl, sectionRef: "6.2.10" },
      });
    }

    return effectiveWpl;
  },

  Wpl_y_eff_rhs: ({ Wpl_y, rho_z, Av_z, tw }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.10" },
      });
    }

    const effectiveWpl = Wpl_y - (rho_z * Av_z ** 2) / (4 * tw);
    if (!Number.isFinite(effectiveWpl) || effectiveWpl <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y_eff_rhs must be > 0",
        details: { effectiveWpl, sectionRef: "6.2.10" },
      });
    }

    return effectiveWpl;
  },

  Wpl_y_eff_chs: ({ Wpl_y, rho_z, Av_z, tw }) => {
    if (!Number.isFinite(Wpl_y) || Wpl_y <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y must be > 0",
        details: { Wpl_y, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.10" },
      });
    }

    const effectiveWpl = Wpl_y - (rho_z * Av_z ** 2) / (4 * tw);
    if (!Number.isFinite(effectiveWpl) || effectiveWpl <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y_eff_chs must be > 0",
        details: { effectiveWpl, sectionRef: "6.2.10" },
      });
    }

    return effectiveWpl;
  },

  Wpl_y_eff: ({ section_shape, Wpl_y_eff_i, Wpl_y_eff_rhs, Wpl_y_eff_chs }) => {
    if (section_shape === "I") return Wpl_y_eff_i;
    if (section_shape === "RHS") return Wpl_y_eff_rhs;
    if (section_shape === "CHS") return Wpl_y_eff_chs;
    const unknownSectionShape: never = section_shape;
    return unknownSectionShape;
  },

  M_y_V_Rd: ({ Wpl_y_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_y_eff) || Wpl_y_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_y_eff must be > 0",
        details: { Wpl_y_eff, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_y_eff * fy) / gamma_M0;
  },

  M_NV_y_Rd: ({ M_y_V_Rd, k_y }) => {
    const reducedResistance = M_y_V_Rd * k_y;
    if (!Number.isFinite(reducedResistance) || reducedResistance <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator M_NV_y_Rd must be > 0 (division by zero)",
        details: { reducedResistance, sectionRef: "6.2.9.1" },
      });
    }

    return reducedResistance;
  },

  Wpl_z_web: ({ Av_z, tw }) => {
    if (!Number.isFinite(Av_z) || Av_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Av_z must be > 0",
        details: { Av_z, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(tw) || tw <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: tw must be > 0",
        details: { tw, sectionRef: "6.2.8" },
      });
    }

    return (Av_z * tw) / 4;
  },

  W_z_res_class12: ({ Wpl_z }) => {
    if (!Number.isFinite(Wpl_z) || Wpl_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_z must be > 0",
        details: { Wpl_z, sectionRef: "6.2.5" },
      });
    }

    return Wpl_z;
  },

  W_z_res_class3: ({ Wel_z }) => {
    if (!Number.isFinite(Wel_z) || Wel_z <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wel_z must be > 0",
        details: { Wel_z, sectionRef: "6.2.5" },
      });
    }

    return Wel_z;
  },

  W_z_res: ({ section_class, W_z_res_class12, W_z_res_class3 }) => {
    if (!Number.isFinite(section_class) || !Number.isInteger(section_class)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: section_class must be an integer in {1,2,3}",
        details: { section_class, sectionRef: "6.2.10" },
      });
    }

    if (section_class < 1 || section_class > 3) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: section_class must be in {1,2,3}",
        details: { section_class, sectionRef: "6.2.10" },
      });
    }

    return section_class === 3 ? W_z_res_class3 : W_z_res_class12;
  },

  Wpl_z_eff: ({ W_z_res, rho_y, Wpl_z_web }) => {
    if (!Number.isFinite(W_z_res) || W_z_res <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: W_z_res must be > 0",
        details: { W_z_res, sectionRef: "6.2.8" },
      });
    }

    const effectiveWpl = W_z_res - rho_y * (W_z_res - Wpl_z_web);
    if (!Number.isFinite(effectiveWpl) || effectiveWpl <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_z_eff must be > 0",
        details: { effectiveWpl, sectionRef: "6.2.8" },
      });
    }

    return effectiveWpl;
  },

  M_z_V_Rd: ({ Wpl_z_eff, fy, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_z_eff) || Wpl_z_eff <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: Wpl_z_eff must be > 0",
        details: { Wpl_z_eff, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(fy) || fy <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: fy must be > 0",
        details: { fy, sectionRef: "6.2.8" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_z_eff * fy) / gamma_M0;
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
          "biaxial-axial-shear: denominator (1 - a_f) must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.2.9.1" },
      });
    }

    return 1 - ((n - a_f) / denominator) ** 2;
  },

  M_NV_z_Rd: ({ M_z_V_Rd, k_z }) => {
    const reducedResistance = M_z_V_Rd * k_z;
    if (!Number.isFinite(reducedResistance) || reducedResistance <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator M_NV_z_Rd must be > 0 (division by zero)",
        details: { reducedResistance, sectionRef: "6.2.9.1" },
      });
    }

    return reducedResistance;
  },

  alpha_biax: ({ section_shape, n }) => {
    if (section_shape !== "RHS") {
      return 2;
    }

    const denominator = 1 - 1.13 * n ** 2;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      return 6;
    }

    return Math.min(1.66 / denominator, 6);
  },

  beta_biax: ({ section_shape, n }) => {
    if (section_shape === "CHS") {
      return 2;
    }

    if (section_shape === "RHS") {
      const denominator = 1 - 1.13 * n ** 2;
      if (!Number.isFinite(denominator) || denominator <= 0) {
        return 6;
      }

      return Math.min(1.66 / denominator, 6);
    }

    return Math.max(1, 5 * n);
  },

  abs_M_y_Ed: ({ M_y_Ed }) => {
    if (!Number.isFinite(M_y_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: M_y_Ed must be finite",
        details: { M_y_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(M_y_Ed);
  },

  abs_M_z_Ed: ({ M_z_Ed }) => {
    if (!Number.isFinite(M_z_Ed)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "biaxial-axial-shear: M_z_Ed must be finite",
        details: { M_z_Ed, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(M_z_Ed);
  },

  biaxial_axial_shear_check: ({
    abs_M_y_Ed,
    M_NV_y_Rd,
    alpha_biax,
    abs_M_z_Ed,
    M_NV_z_Rd,
    beta_biax,
  }) => {
    if (!Number.isFinite(M_NV_y_Rd) || M_NV_y_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator M_NV_y_Rd must be > 0 (division by zero)",
        details: { M_NV_y_Rd, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(M_NV_z_Rd) || M_NV_z_Rd <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "biaxial-axial-shear: denominator M_NV_z_Rd must be > 0 (division by zero)",
        details: { M_NV_z_Rd, sectionRef: "6.2.10" },
      });
    }

    return (abs_M_y_Ed / M_NV_y_Rd) ** alpha_biax +
      (abs_M_z_Ed / M_NV_z_Rd) ** beta_biax;
  },
});
