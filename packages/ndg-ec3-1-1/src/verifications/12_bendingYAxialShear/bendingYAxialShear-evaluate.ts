import { defineEvaluators } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import { nodes } from "./bendingYAxialShear-nodes";

export const evaluate = defineEvaluators(nodes, {
  N_c_Ed_N: ({ N_Ed_N }) => {
    if (!Number.isFinite(N_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: N_Ed_N must be finite",
        details: { N_Ed_N, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(N_Ed_N);
  },

  abs_N_Ed_N: ({ N_Ed_N }) => {
    if (!Number.isFinite(N_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: N_Ed_N must be finite",
        details: { N_Ed_N, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(N_Ed_N);
  },

  abs_M_y_Ed_Nmm: ({ M_y_Ed_Nmm }) => {
    if (!Number.isFinite(M_y_Ed_Nmm)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: M_y_Ed_Nmm must be finite",
        details: { M_y_Ed_Nmm, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(M_y_Ed_Nmm);
  },

  abs_V_z_Ed_N: ({ V_z_Ed_N }) => {
    if (!Number.isFinite(V_z_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: V_z_Ed_N must be finite",
        details: { V_z_Ed_N, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_z_Ed_N);
  },

  abs_V_y_Ed_N: ({ V_y_Ed_N }) => {
    if (!Number.isFinite(V_y_Ed_N)) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: V_y_Ed_N must be finite",
        details: { V_y_Ed_N, sectionRef: "6.2.10" },
      });
    }

    return Math.abs(V_y_Ed_N);
  },

  N_pl_Rd_N: ({ A_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.4" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (A_mm2 * fy_MPa) / gamma_M0;
  },

  n: ({ N_c_Ed_N, N_pl_Rd_N }) => {
    if (!Number.isFinite(N_pl_Rd_N) || N_pl_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator N_pl_Rd_N must be > 0 (division by zero)",
        details: { N_pl_Rd_N, sectionRef: "6.2.10" },
      });
    }

    return N_c_Ed_N / N_pl_Rd_N;
  },

  V_pl_z_Rd_N: ({ Av_z_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Av_z_mm2) || Av_z_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z_mm2 must be > 0",
        details: { Av_z_mm2, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_z_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  V_pl_y_Rd_N: ({ Av_y_mm2, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Av_y_mm2) || Av_y_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_y_mm2 must be > 0",
        details: { Av_y_mm2, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.6" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Av_y_mm2 * fy_MPa) / (Math.sqrt(3) * gamma_M0);
  },

  rho_z: ({ abs_V_z_Ed_N, V_pl_z_Rd_N }) => {
    if (!Number.isFinite(V_pl_z_Rd_N) || V_pl_z_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator V_pl_z_Rd_N must be > 0 (division by zero)",
        details: { V_pl_z_Rd_N, sectionRef: "6.2.10" },
      });
    }

    const shearUtilization = abs_V_z_Ed_N / V_pl_z_Rd_N;
    return shearUtilization <= 0.5 ? 0 : (2 * shearUtilization - 1) ** 2;
  },

  rho_y: ({ abs_V_y_Ed_N, V_pl_y_Rd_N }) => {
    if (!Number.isFinite(V_pl_y_Rd_N) || V_pl_y_Rd_N <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator V_pl_y_Rd_N must be > 0 (division by zero)",
        details: { V_pl_y_Rd_N, sectionRef: "6.2.10" },
      });
    }

    const shearUtilization = abs_V_y_Ed_N / V_pl_y_Rd_N;
    return shearUtilization <= 0.5 ? 0 : (2 * shearUtilization - 1) ** 2;
  },

  a_w_i: ({ A_mm2, b_mm, tf_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tf_mm) || tf_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tf_mm must be > 0",
        details: { tf_mm, sectionRef: "6.2.9.1" },
      });
    }

    const areaRatio = (A_mm2 - 2 * b_mm * tf_mm) / A_mm2;
    if (!Number.isFinite(areaRatio) || areaRatio < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: a_w_i must be >= 0",
        details: { areaRatio, sectionRef: "6.2.9.1" },
      });
    }

    return Math.min(areaRatio, 0.5);
  },

  a_w_rhs: ({ A_mm2, b_mm, tw_mm }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(b_mm) || b_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: b_mm must be > 0",
        details: { b_mm, sectionRef: "6.2.9.1" },
      });
    }

    if (!Number.isFinite(tw_mm) || tw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tw_mm must be > 0",
        details: { tw_mm, sectionRef: "6.2.9.1" },
      });
    }

    const areaRatio = (A_mm2 - 2 * b_mm * tw_mm) / A_mm2;
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

  Wpl_y_eff_i_mm3: ({ Wpl_y_mm3, b_mm, h_mm, tf_mm, tw_mm, rho_y, rho_z }) => {
    if (!Number.isFinite(Wpl_y_mm3) || Wpl_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_mm3 must be > 0",
        details: { Wpl_y_mm3, sectionRef: "6.2.10" },
      });
    }

    if (
      !Number.isFinite(b_mm) ||
      b_mm <= 0 ||
      !Number.isFinite(h_mm) ||
      h_mm <= 0
    ) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: b_mm and h_mm must be > 0",
        details: { b_mm, h_mm, sectionRef: "6.2.10" },
      });
    }

    if (
      !Number.isFinite(tf_mm) ||
      tf_mm <= 0 ||
      !Number.isFinite(tw_mm) ||
      tw_mm <= 0
    ) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tf_mm and tw_mm must be > 0",
        details: { tf_mm, tw_mm, sectionRef: "6.2.10" },
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

    const reducedFlangeThickness = (1 - rho_y) * tf_mm;
    const reducedWebThickness = (1 - rho_z) * tw_mm;

    if (
      !Number.isFinite(reducedFlangeThickness) ||
      reducedFlangeThickness <= 0
    ) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: reduced flange thickness must be > 0",
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
      b_mm * tf_mm * (h_mm - tf_mm) + (tw_mm * (h_mm - 2 * tf_mm) ** 2) / 4;
    const reducedReference =
      b_mm * reducedFlangeThickness * (h_mm - reducedFlangeThickness) +
      (reducedWebThickness * (h_mm - 2 * reducedFlangeThickness) ** 2) / 4;
    const rootOffset = Wpl_y_mm3 - unreducedReference;
    const Wpl_y_eff_i_mm3 = reducedReference + rootOffset;

    if (!Number.isFinite(Wpl_y_eff_i_mm3) || Wpl_y_eff_i_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_i_mm3 must be > 0",
        details: { Wpl_y_eff_i_mm3, sectionRef: "6.2.10" },
      });
    }

    return Wpl_y_eff_i_mm3;
  },

  Wpl_y_eff_rhs_mm3: ({ Wpl_y_mm3, rho_z, Av_z_mm2, tw_mm }) => {
    if (!Number.isFinite(Wpl_y_mm3) || Wpl_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_mm3 must be > 0",
        details: { Wpl_y_mm3, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(Av_z_mm2) || Av_z_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z_mm2 must be > 0",
        details: { Av_z_mm2, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tw_mm) || tw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tw_mm must be > 0",
        details: { tw_mm, sectionRef: "6.2.10" },
      });
    }

    const Wpl_y_eff_rhs_mm3 = Wpl_y_mm3 - (rho_z * Av_z_mm2 ** 2) / (4 * tw_mm);
    if (!Number.isFinite(Wpl_y_eff_rhs_mm3) || Wpl_y_eff_rhs_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_rhs_mm3 must be > 0",
        details: { Wpl_y_eff_rhs_mm3, sectionRef: "6.2.10" },
      });
    }

    return Wpl_y_eff_rhs_mm3;
  },

  Wpl_y_eff_chs_mm3: ({ Wpl_y_mm3, rho_z, Av_z_mm2, tw_mm }) => {
    if (!Number.isFinite(Wpl_y_mm3) || Wpl_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_mm3 must be > 0",
        details: { Wpl_y_mm3, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(rho_z) || rho_z < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: rho_z must be >= 0",
        details: { rho_z, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(Av_z_mm2) || Av_z_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z_mm2 must be > 0",
        details: { Av_z_mm2, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(tw_mm) || tw_mm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: tw_mm must be > 0",
        details: { tw_mm, sectionRef: "6.2.10" },
      });
    }

    const Wpl_y_eff_chs_mm3 = Wpl_y_mm3 - (rho_z * Av_z_mm2 ** 2) / (4 * tw_mm);
    if (!Number.isFinite(Wpl_y_eff_chs_mm3) || Wpl_y_eff_chs_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_chs_mm3 must be > 0",
        details: { Wpl_y_eff_chs_mm3, sectionRef: "6.2.10" },
      });
    }

    return Wpl_y_eff_chs_mm3;
  },

  Wpl_y_eff_mm3: ({
    Wpl_y_eff_i_mm3,
    Wpl_y_eff_rhs_mm3,
    Wpl_y_eff_chs_mm3,
  }) => {
    if (typeof Wpl_y_eff_i_mm3 === "number") return Wpl_y_eff_i_mm3;
    if (typeof Wpl_y_eff_rhs_mm3 === "number") return Wpl_y_eff_rhs_mm3;
    if (typeof Wpl_y_eff_chs_mm3 === "number") return Wpl_y_eff_chs_mm3;

    throw new Ec3VerificationError({
      type: "evaluation-error",
      message:
        "bending-y-axial-shear: no active section-shape branch was selected",
      details: { sectionRef: "6.2.10" },
    });
  },

  M_y_V_Rd_Nmm: ({ Wpl_y_eff_mm3, fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(Wpl_y_eff_mm3) || Wpl_y_eff_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wpl_y_eff_mm3 must be > 0",
        details: { Wpl_y_eff_mm3, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return (Wpl_y_eff_mm3 * fy_MPa) / gamma_M0;
  },

  M_NV_y_Rd_Nmm: ({ M_y_V_Rd_Nmm, k_y }) => {
    const M_NV_y_Rd_Nmm = M_y_V_Rd_Nmm * k_y;
    if (!Number.isFinite(M_NV_y_Rd_Nmm) || M_NV_y_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator M_NV_y_Rd_Nmm must be > 0 (division by zero)",
        details: { M_NV_y_Rd_Nmm, sectionRef: "6.2.10" },
      });
    }

    return M_NV_y_Rd_Nmm;
  },

  utilization_class12: ({ abs_M_y_Ed_Nmm, M_NV_y_Rd_Nmm }) => {
    if (!Number.isFinite(M_NV_y_Rd_Nmm) || M_NV_y_Rd_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator M_NV_y_Rd_Nmm must be > 0 (division by zero)",
        details: { M_NV_y_Rd_Nmm, sectionRef: "6.2.10" },
      });
    }

    return abs_M_y_Ed_Nmm / M_NV_y_Rd_Nmm;
  },

  sigma_N_MPa: ({ abs_N_Ed_N, A_mm2 }) => {
    if (!Number.isFinite(A_mm2) || A_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: A_mm2 must be > 0",
        details: { A_mm2, sectionRef: "6.2.10" },
      });
    }

    return abs_N_Ed_N / A_mm2;
  },

  sigma_M_y_MPa: ({ abs_M_y_Ed_Nmm, Wel_y_mm3 }) => {
    if (!Number.isFinite(Wel_y_mm3) || Wel_y_mm3 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Wel_y_mm3 must be > 0",
        details: { Wel_y_mm3, sectionRef: "6.2.10" },
      });
    }

    return abs_M_y_Ed_Nmm / Wel_y_mm3;
  },

  sigma_x_class3_MPa: ({ sigma_N_MPa, sigma_M_y_MPa }) => {
    return sigma_N_MPa + sigma_M_y_MPa;
  },

  tau_y_MPa: ({ abs_V_y_Ed_N, Av_y_mm2 }) => {
    if (!Number.isFinite(Av_y_mm2) || Av_y_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_y_mm2 must be > 0",
        details: { Av_y_mm2, sectionRef: "6.2.10" },
      });
    }

    return abs_V_y_Ed_N / Av_y_mm2;
  },

  tau_z_MPa: ({ abs_V_z_Ed_N, Av_z_mm2 }) => {
    if (!Number.isFinite(Av_z_mm2) || Av_z_mm2 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: Av_z_mm2 must be > 0",
        details: { Av_z_mm2, sectionRef: "6.2.10" },
      });
    }

    return abs_V_z_Ed_N / Av_z_mm2;
  },

  sigma_v_class3_MPa: ({ sigma_x_class3_MPa, tau_y_MPa, tau_z_MPa }) => {
    const sigma_v_class3_MPa = Math.sqrt(
      sigma_x_class3_MPa ** 2 + 3 * (tau_y_MPa ** 2 + tau_z_MPa ** 2),
    );

    if (!Number.isFinite(sigma_v_class3_MPa) || sigma_v_class3_MPa < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: sigma_v_class3_MPa must be finite",
        details: { sigma_v_class3_MPa, sectionRef: "6.2.10" },
      });
    }

    return sigma_v_class3_MPa;
  },

  sigma_limit_MPa: ({ fy_MPa, gamma_M0 }) => {
    if (!Number.isFinite(fy_MPa) || fy_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: fy_MPa must be > 0",
        details: { fy_MPa, sectionRef: "6.2.10" },
      });
    }

    if (!Number.isFinite(gamma_M0) || gamma_M0 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "bending-y-axial-shear: gamma_M0 must be > 0",
        details: { gamma_M0, sectionRef: "6.1" },
      });
    }

    return fy_MPa / gamma_M0;
  },

  utilization_class3: ({ sigma_v_class3_MPa, sigma_limit_MPa }) => {
    if (!Number.isFinite(sigma_limit_MPa) || sigma_limit_MPa <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "bending-y-axial-shear: denominator sigma_limit_MPa must be > 0 (division by zero)",
        details: { sigma_limit_MPa, sectionRef: "6.2.10" },
      });
    }

    return sigma_v_class3_MPa / sigma_limit_MPa;
  },

  bending_y_axial_shear_check: ({
    section_class,
    utilization_class12,
    utilization_class3,
  }) => {
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
      message:
        "bending-y-axial-shear: no active utilization branch was selected",
      details: { sectionRef: "6.2.10" },
    });
  },
});
