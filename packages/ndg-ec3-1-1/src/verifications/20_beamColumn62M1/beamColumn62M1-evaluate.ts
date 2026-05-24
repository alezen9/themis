import { defineEvaluators } from "@ndg/ndg-core";
import { nodes } from "./beamColumn62M1-nodes";
import { Ec3VerificationError } from "../../errors";
export const evaluate = defineEvaluators(nodes, {
  k_c: (args) => {
    const {
      moment_shape_LT,
      psi_LT,
      support_condition_LT,
      load_application_LT,
    } = args;

    const isMomentUniform = moment_shape_LT === "uniform";
    const isMomentLinear = moment_shape_LT === "linear";
    const isMomentParabolic = moment_shape_LT === "parabolic";
    const isSupportPinnedPinned = support_condition_LT === "pinned-pinned";
    const isSupportFixedPinned = support_condition_LT === "fixed-pinned";
    const isLoadTopFlange = load_application_LT === "top-flange";
    const isLoadCentroid = load_application_LT === "centroid";
    const isPsiOutOfRange = psi_LT < -1 || psi_LT > 1;
    const linearDenominator = 1.33 - 0.33 * psi_LT;

    if (isMomentUniform) return 1;
    if (isMomentLinear && isPsiOutOfRange) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: psi_LT must be within [-1, 1]",
        details: { psi_LT, sectionRef: "Table 6.6" },
      });
    }
    if (isMomentLinear && linearDenominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: denominator for k_c must be > 0 (division by zero)",
        details: { denominator: linearDenominator, sectionRef: "Table 6.6" },
      });
    }
    if (isMomentLinear) return 1 / linearDenominator;

    if (isMomentParabolic && isSupportPinnedPinned && isLoadTopFlange)
      return 0.9;
    if (isMomentParabolic && isSupportPinnedPinned && isLoadCentroid)
      return 0.94;
    if (isMomentParabolic && isSupportPinnedPinned) return 0.91;
    if (isMomentParabolic && isSupportFixedPinned && isLoadTopFlange)
      return 0.86;
    if (isMomentParabolic && isSupportFixedPinned && isLoadCentroid) return 0.9;
    if (isMomentParabolic && isSupportFixedPinned) return 0.87;
    if (isMomentParabolic && isLoadTopFlange) return 0.82;
    if (isMomentParabolic && isLoadCentroid) return 0.86;
    if (isMomentParabolic) return 0.83;

    if (isSupportPinnedPinned && isLoadTopFlange) return 0.77;
    if (isSupportPinnedPinned && isLoadCentroid) return 0.86;
    if (isSupportPinnedPinned) return 0.82;
    if (isSupportFixedPinned && isLoadTopFlange) return 0.73;
    if (isSupportFixedPinned && isLoadCentroid) return 0.82;
    if (isSupportFixedPinned) return 0.78;
    if (isLoadTopFlange) return 0.7;
    if (isLoadCentroid) return 0.79;
    return 0.75;
  },
  C1: (args) => {
    const { k_c } = args;
    if (k_c <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: k_c must be > 0",
        details: { k_c, sectionRef: "Table 6.6" },
      });
    }
    return 1 / k_c ** 2;
  },
  abs_N_Ed_N: ({
    N_Ed_N,
    torsional_deformations,
    interaction_factor_method,
  }) => {
    if ((torsional_deformations ?? "yes") !== "yes") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "beam-column-62-m1: torsional deformations are disabled",
        details: { torsional_deformations, sectionRef: "6.3.3" },
      });
    }
    if ((interaction_factor_method ?? "both") === "method2") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "beam-column-62-m1: interaction factor method set to method2",
        details: { interaction_factor_method, sectionRef: "6.3.3(5)" },
      });
    }
    if (N_Ed_N > 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "beam-column-62-m1: check is only applicable for compression (N_Ed_N < 0)",
        details: { N_Ed_N, sectionRef: "6.3.3" },
      });
    }
    return -N_Ed_N;
  },
  abs_M_y_Ed_Nmm: ({ M_y_Ed_Nmm }) => Math.abs(M_y_Ed_Nmm),
  abs_M_z_Ed_Nmm: ({ M_z_Ed_Nmm }) => Math.abs(M_z_Ed_Nmm),
  N_cr_y_N: ({ pi, E_MPa, Iy_mm4, L_mm, k_y }) => {
    const denominator = L_mm * k_y;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: denominator (L_mm*k_y)^2 must be > 0 (division by zero)",
      });
    }
    return (pi ** 2 * E_MPa * Iy_mm4) / denominator ** 2;
  },
  N_cr_z_N: ({ pi, E_MPa, Iz_mm4, L_mm, k_z }) => {
    const denominator = L_mm * k_z;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: denominator (L_mm*k_z)^2 must be > 0 (division by zero)",
      });
    }
    return (pi ** 2 * E_MPa * Iz_mm4) / denominator ** 2;
  },
  ip2_mm2: ({ Iy_mm4, Iz_mm4, A_mm2 }) => {
    if (A_mm2 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: A_mm2 must be > 0",
      });
    const value = (Iy_mm4 + Iz_mm4) / A_mm2;
    if (value <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid polar radius term",
      });
    return value;
  },
  ncr_t_warp_N: ({ pi, E_MPa, Iw_mm6, L_mm, k_z }) => {
    const denominator = L_mm * k_z;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: denominator (L_mm*k_z)^2 must be > 0 (division by zero)",
      });
    }
    return (pi ** 2 * E_MPa * Iw_mm6) / denominator ** 2;
  },
  N_cr_T_N: ({
    Iy_mm4,
    Iz_mm4,
    It_mm4,
    Iw_mm6,
    G_MPa,
    ncr_t_warp_N,
    ip2_mm2,
  }) => {
    if (Iy_mm4 <= 0 || Iz_mm4 <= 0 || It_mm4 <= 0 || Iw_mm6 <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: Iy_mm4, Iz_mm4, It_mm4 and Iw_mm6 must be > 0",
      });
    }
    return (G_MPa * It_mm4 + ncr_t_warp_N) / ip2_mm2;
  },
  N_cr_TF_N: ({ N_cr_T_N, N_cr_z_N }) => Math.min(N_cr_T_N, N_cr_z_N),
  M_cr_Nmm: ({
    L_mm,
    k_LT,
    Iz_mm4,
    It_mm4,
    Iw_mm6,
    C1,
    pi,
    E_MPa,
    G_MPa,
    section_shape,
  }) => {
    if (section_shape === "RHS" || section_shape === "CHS") {
      // Closed sections are treated as not susceptible to LTB in this path,
      // so use a very large finite critical moment instead of Infinity.
      return Number.MAX_VALUE;
    }
    const lcrLT = L_mm * k_LT;
    if (!Number.isFinite(lcrLT) || lcrLT <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: L_mm*k_LT must be > 0",
      });
    if (Iz_mm4 <= 0 || It_mm4 <= 0 || Iw_mm6 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: Iz_mm4, It_mm4 and Iw_mm6 must be > 0",
      });
    if (C1 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: C1 must be > 0",
      });
    const eulerTerm = (pi ** 2 * E_MPa * Iz_mm4) / lcrLT ** 2;
    const torsionTerm =
      Iw_mm6 / Iz_mm4 +
      (lcrLT ** 2 * G_MPa * It_mm4) / (pi ** 2 * E_MPa * Iz_mm4);
    if (!Number.isFinite(torsionTerm) || torsionTerm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid torsion term",
      });
    }
    return C1 * eulerTerm * Math.sqrt(torsionTerm);
  },
  lambda_bar_0: ({
    Wpl_y_mm3,
    Wel_y_mm3,
    fy_MPa,
    C1,
    M_cr_Nmm,
    section_class,
  }) => {
    if (C1 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: C1 must be > 0",
      });
    const W_y = section_class >= 3 ? Wel_y_mm3 : Wpl_y_mm3;
    return Math.sqrt((W_y * fy_MPa * C1) / M_cr_Nmm);
  },
  it_over_iy: ({ It_mm4, Iy_mm4 }) => It_mm4 / Iy_mm4,
  a_LT: ({ it_over_iy }) => Math.max(1 - it_over_iy, 0),
  eta_y_m_over_n: ({ abs_M_y_Ed_Nmm, abs_N_Ed_N }) => {
    if (abs_N_Ed_N < 1e-9) return 0;
    return abs_M_y_Ed_Nmm / abs_N_Ed_N;
  },
  eta_y_area_ratio: ({ A_mm2, Wel_y_mm3 }) => A_mm2 / Wel_y_mm3,
  eta_y: ({ eta_y_m_over_n, eta_y_area_ratio }) =>
    eta_y_m_over_n * eta_y_area_ratio,
  psi_y_eff: (args): number => {
    const { moment_shape_y, support_condition_y, psi_y } = args;
    const isMomentUniform = moment_shape_y === "uniform";
    const isMomentLinear = moment_shape_y === "linear";
    const isMomentParabolic = moment_shape_y === "parabolic";
    const isMomentTriangular = moment_shape_y === "triangular";
    const isSupportPinnedPinned = support_condition_y === "pinned-pinned";
    const isSupportFixedPinned = support_condition_y === "fixed-pinned";
    const isPsiMissing = typeof psi_y !== "number" || Number.isNaN(psi_y);

    if (isMomentUniform) return 1;
    if (isMomentLinear && isPsiMissing) {
      throw new Ec3VerificationError({
        type: "missing-input",
        message:
          "beam-column-62-m1: psi_y is required when moment_shape_y is linear",
        details: { moment_shape_y, sectionRef: "Annex A_mm2 Table A_mm2.2" },
      });
    }
    if (isMomentLinear) return psi_y;
    if (isMomentParabolic && isSupportPinnedPinned) return 0;
    if (isMomentParabolic && isSupportFixedPinned) return 0.5;
    if (isMomentParabolic) return 1;
    if (isMomentTriangular && isSupportPinnedPinned) return 0;
    if (isMomentTriangular && isSupportFixedPinned) return 0.75;
    if (isMomentTriangular) return 1;
    if (isSupportPinnedPinned) return 0;
    if (isSupportFixedPinned) return 0.75;
    return 1;
  },
  psi_z_eff: (args): number => {
    const { moment_shape_z, support_condition_z, psi_z } = args;
    const isMomentUniform = moment_shape_z === "uniform";
    const isMomentLinear = moment_shape_z === "linear";
    const isMomentParabolic = moment_shape_z === "parabolic";
    const isMomentTriangular = moment_shape_z === "triangular";
    const isSupportPinnedPinned = support_condition_z === "pinned-pinned";
    const isSupportFixedPinned = support_condition_z === "fixed-pinned";
    const isPsiMissing = typeof psi_z !== "number" || Number.isNaN(psi_z);

    if (isMomentUniform) return 1;
    if (isMomentLinear && isPsiMissing) {
      throw new Ec3VerificationError({
        type: "missing-input",
        message:
          "beam-column-62-m1: psi_z is required when moment_shape_z is linear",
        details: { moment_shape_z, sectionRef: "Annex A_mm2 Table A_mm2.2" },
      });
    }
    if (isMomentLinear) return psi_z;
    if (isMomentParabolic && isSupportPinnedPinned) return 0;
    if (isMomentParabolic && isSupportFixedPinned) return 0.5;
    if (isMomentParabolic) return 1;
    if (isMomentTriangular && isSupportPinnedPinned) return 0;
    if (isMomentTriangular && isSupportFixedPinned) return 0.75;
    if (isMomentTriangular) return 1;
    if (isSupportPinnedPinned) return 0;
    if (isSupportFixedPinned) return 0.75;
    return 1;
  },
  ncr_y_ratio: ({ abs_N_Ed_N, N_cr_y_N }) => {
    if (N_cr_y_N <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: N_cr_y_N must be > 0",
      });
    return abs_N_Ed_N / N_cr_y_N;
  },
  ncr_z_ratio: ({ abs_N_Ed_N, N_cr_z_N }) => {
    if (N_cr_z_N <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: N_cr_z_N must be > 0",
      });
    return abs_N_Ed_N / N_cr_z_N;
  },
  Cmy_0: ({ psi_y_eff, ncr_y_ratio }) =>
    0.79 + 0.21 * psi_y_eff + 0.36 * (psi_y_eff - 0.33) * ncr_y_ratio,
  Cmz_0: ({ psi_z_eff, ncr_z_ratio }) =>
    0.79 + 0.21 * psi_z_eff + 0.36 * (psi_z_eff - 0.33) * ncr_z_ratio,
  ncr_t_ratio: ({ abs_N_Ed_N, N_cr_T_N }) => {
    if (N_cr_T_N <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: N_cr_T_N must be > 0",
      });
    return abs_N_Ed_N / N_cr_T_N;
  },
  ncr_tf_ratio: ({ abs_N_Ed_N, N_cr_TF_N }) => {
    if (N_cr_TF_N <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: N_cr_TF_N must be > 0",
      });
    return abs_N_Ed_N / N_cr_TF_N;
  },
  cm_branch_limit: ({ ncr_z_ratio, ncr_tf_ratio, C1 }) =>
    0.2 * Math.sqrt(C1) * ((1 - ncr_z_ratio) * (1 - ncr_tf_ratio)) ** 0.25,
  cm_branch_active: ({ lambda_bar_0, cm_branch_limit }) =>
    lambda_bar_0 > cm_branch_limit ? 1 : 0,
  cm_amp: ({ eta_y, a_LT }) => {
    const sqrtTerm = Math.sqrt(Math.max(0, eta_y * a_LT));
    const denominator = 1 + sqrtTerm;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid C_m denominator",
      });
    }
    return sqrtTerm / denominator;
  },
  cmReserve: ({ ncr_z_ratio, ncr_t_ratio }) =>
    (1 - ncr_z_ratio) * (1 - ncr_t_ratio),
  Cm_y: ({ Cmy_0, cm_branch_active, cm_amp, cmReserve }) => {
    if (cm_branch_active === 0) return Cmy_0;
    if (cmReserve <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid C_m denominator",
      });
    return Cmy_0 + (1 - Cmy_0) * cm_amp;
  },
  Cm_z: ({ Cmz_0 }) => Cmz_0,
  Cm_y_aug: ({ Cmy_0, cm_amp }) => Cmy_0 + (1 - Cmy_0) * cm_amp,
  Cm_LT: ({ cm_branch_active, Cm_y_aug, a_LT, cmReserve }) => {
    if (cm_branch_active === 0) return 1;
    if (cmReserve <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid denominator for C_m,LT",
      });
    const value = (Cm_y_aug ** 2 * a_LT) / Math.sqrt(cmReserve);
    return Math.max(value, 1);
  },
  N_Rk_N: ({ A_mm2, fy_MPa }) => A_mm2 * fy_MPa,
  M_y_Rk_Nmm: ({ Wpl_y_mm3, Wel_y_mm3, fy_MPa, section_class }) =>
    (section_class >= 3 ? Wel_y_mm3 : Wpl_y_mm3) * fy_MPa,
  M_z_Rk_Nmm: ({ Wpl_z_mm3, Wel_z_mm3, fy_MPa, section_class }) =>
    (section_class >= 3 ? Wel_z_mm3 : Wpl_z_mm3) * fy_MPa,
  wy: ({ Wpl_y_mm3, Wel_y_mm3 }) => Math.min(Wpl_y_mm3 / Wel_y_mm3, 1.5),
  wz: ({ Wpl_z_mm3, Wel_z_mm3 }) => Math.min(Wpl_z_mm3 / Wel_z_mm3, 1.5),
  chi_y: ({ A_mm2, fy_MPa, E_MPa, Iy_mm4, L_mm, k_y, alpha_y }) => {
    const denominator = L_mm * k_y;
    if (!Number.isFinite(denominator) || denominator <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: denominator (L_mm*k_y)^2 must be > 0 (division by zero)",
      });
    const Ncr = (Math.PI ** 2 * E_MPa * Iy_mm4) / denominator ** 2;
    if (Ncr === 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid Ncr,y",
      });
    const lb = Math.sqrt((A_mm2 * fy_MPa) / Ncr);
    const phi = 0.5 * (1 + alpha_y * (lb - 0.2) + lb ** 2);
    return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
  },
  chi_z: ({ A_mm2, fy_MPa, E_MPa, Iz_mm4, L_mm, k_z, alpha_z }) => {
    const denominator = L_mm * k_z;
    if (!Number.isFinite(denominator) || denominator <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m1: denominator (L_mm*k_z)^2 must be > 0 (division by zero)",
      });
    const Ncr = (Math.PI ** 2 * E_MPa * Iz_mm4) / denominator ** 2;
    if (Ncr === 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid Ncr,z",
      });
    const lb = Math.sqrt((A_mm2 * fy_MPa) / Ncr);
    const phi = 0.5 * (1 + alpha_z * (lb - 0.2) + lb ** 2);
    return Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
  },
  alpha_LT_eff: ({ alpha_LT, buckling_curves_LT_policy }) =>
    (buckling_curves_LT_policy ?? "default") === "general" ? 0.34 : alpha_LT,
  chi_LT: ({
    Wpl_y_mm3,
    Wel_y_mm3,
    fy_MPa,
    M_cr_Nmm,
    alpha_LT_eff,
    lambda_LT_0,
    beta_LT,
    section_class,
  }) => {
    if (M_cr_Nmm <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: M_cr_Nmm must be > 0",
      });
    const W_y = section_class >= 3 ? Wel_y_mm3 : Wpl_y_mm3;
    const lb = Math.sqrt((W_y * fy_MPa) / M_cr_Nmm);
    const phi =
      0.5 * (1 + alpha_LT_eff * (lb - lambda_LT_0) + beta_LT * lb ** 2);
    const val = 1 / (phi + Math.sqrt(phi ** 2 - beta_LT * lb ** 2));
    return Math.min(1, Math.min(val, 1 / lb ** 2));
  },
  f_LT: (args) => {
    const {
      coefficient_f_method,
      Wpl_y_mm3,
      Wel_y_mm3,
      fy_MPa,
      M_cr_Nmm,
      k_c,
      section_class,
    } = args;
    if ((coefficient_f_method ?? "default-equation") === "force-1.0") return 1;
    if (M_cr_Nmm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: M_cr_Nmm must be > 0",
      });
    }
    if (k_c <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: k_c must be > 0",
        details: { k_c, sectionRef: "Table 6.6" },
      });
    }
    const W_y = section_class >= 3 ? Wel_y_mm3 : Wpl_y_mm3;
    const lambdaBarLT = Math.sqrt((W_y * fy_MPa) / M_cr_Nmm);
    const centered = lambdaBarLT - 0.8;
    const raw = 1 - 0.5 * (1 - k_c) * (1 - 2 * centered ** 2);
    return Math.min(1, raw);
  },
  chi_LT_mod: ({ chi_LT, f_LT }) => {
    if (f_LT <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: f_LT must be > 0",
      });
    return Math.min(1, chi_LT / f_LT);
  },
  lambda_bar_y: ({ A_mm2, fy_MPa, N_cr_y_N }) =>
    Math.sqrt((A_mm2 * fy_MPa) / N_cr_y_N),
  lambda_bar_z: ({ A_mm2, fy_MPa, N_cr_z_N }) =>
    Math.sqrt((A_mm2 * fy_MPa) / N_cr_z_N),
  n_pl: ({ abs_N_Ed_N, N_Rk_N, gamma_M1 }) => abs_N_Ed_N / (N_Rk_N / gamma_M1),
  lambda_bar_max: ({ lambda_bar_y, lambda_bar_z }) =>
    Math.max(lambda_bar_y, lambda_bar_z),
  b_LT: ({
    a_LT,
    lambda_bar_0,
    abs_M_y_Ed_Nmm,
    abs_M_z_Ed_Nmm,
    chi_LT,
    M_y_Rk_Nmm,
    M_z_Rk_Nmm,
  }) => {
    if (chi_LT <= 0 || M_y_Rk_Nmm <= 0 || M_z_Rk_Nmm <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid b_LT denominator",
      });
    return (
      (0.5 * a_LT * lambda_bar_0 ** 2 * abs_M_y_Ed_Nmm * abs_M_z_Ed_Nmm) /
      (chi_LT * M_y_Rk_Nmm * M_z_Rk_Nmm)
    );
  },
  c_LT: ({
    a_LT,
    lambda_bar_0,
    abs_M_y_Ed_Nmm,
    lambda_bar_z,
    Cm_y,
    chi_LT,
    M_y_Rk_Nmm,
  }) => {
    const denom = (5 + lambda_bar_z ** 4) * Cm_y * chi_LT * M_y_Rk_Nmm;
    if (denom <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid c_LT denominator",
      });
    return (10 * a_LT * lambda_bar_0 ** 2 * abs_M_y_Ed_Nmm) / denom;
  },
  d_LT: ({
    a_LT,
    lambda_bar_0,
    abs_M_y_Ed_Nmm,
    abs_M_z_Ed_Nmm,
    lambda_bar_z,
    Cm_y,
    Cm_z,
    chi_LT,
    M_y_Rk_Nmm,
    M_z_Rk_Nmm,
  }) => {
    const denom =
      (0.1 + lambda_bar_z ** 4) *
      Cm_y *
      chi_LT *
      M_y_Rk_Nmm *
      Cm_z *
      M_z_Rk_Nmm;
    if (denom <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid d_LT denominator",
      });
    return (2 * a_LT * lambda_bar_0 * abs_M_y_Ed_Nmm * abs_M_z_Ed_Nmm) / denom;
  },
  e_LT: ({
    a_LT,
    lambda_bar_0,
    abs_M_y_Ed_Nmm,
    lambda_bar_z,
    Cm_y,
    chi_LT,
    M_y_Rk_Nmm,
  }) => {
    const denom = (0.1 + lambda_bar_z ** 4) * Cm_y * chi_LT * M_y_Rk_Nmm;
    if (denom <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid e_LT denominator",
      });
    return (1.7 * a_LT * lambda_bar_0 * abs_M_y_Ed_Nmm) / denom;
  },
  C_yy: ({
    Cm_y,
    n_pl,
    lambda_bar_y,
    lambda_bar_z,
    wy,
    b_LT,
    Wel_y_mm3,
    Wpl_y_mm3,
  }) => {
    if (n_pl <= 1e-12) return 0.953;
    const lambda_bar_max = Math.max(lambda_bar_y, lambda_bar_z);
    const raw =
      1 +
      (wy - 1) *
        ((2 -
          (1.6 / wy) * Cm_y ** 2 * lambda_bar_max -
          (1.6 / wy) * Cm_y ** 2 * lambda_bar_max ** 2) *
          n_pl -
          b_LT);
    return Math.max(raw, Wel_y_mm3 / Wpl_y_mm3);
  },
  C_yz: ({
    Cm_z,
    n_pl,
    lambda_bar_y,
    lambda_bar_z,
    wz,
    c_LT,
    Wel_z_mm3,
    wy,
    Wpl_z_mm3,
  }) => {
    if (n_pl <= 1e-12) return 0.866;
    const lambda_bar_max = Math.max(lambda_bar_y, lambda_bar_z);
    const raw =
      1 +
      (wz - 1) *
        ((2 - (14 * Cm_z ** 2 * lambda_bar_max ** 2) / wz ** 5) * n_pl - c_LT);
    return Math.max(raw, (0.6 * Math.sqrt(wz / wy) * Wel_z_mm3) / Wpl_z_mm3);
  },
  C_zy: ({
    Cm_y,
    n_pl,
    lambda_bar_y,
    lambda_bar_z,
    wy,
    d_LT,
    Wel_y_mm3,
    wz,
    Wpl_y_mm3,
  }) => {
    if (n_pl <= 1e-12) return 0.998;
    const lambda_bar_max = Math.max(lambda_bar_y, lambda_bar_z);
    const raw =
      1 +
      (wy - 1) *
        ((2 - (14 * Cm_y ** 2 * lambda_bar_max ** 2) / wy ** 5) * n_pl - d_LT);
    return Math.max(raw, (0.6 * Math.sqrt(wy / wz) * Wel_y_mm3) / Wpl_y_mm3);
  },
  C_zz: ({
    Cm_z,
    n_pl,
    lambda_bar_y,
    lambda_bar_z,
    wz,
    e_LT,
    Wel_z_mm3,
    Wpl_z_mm3,
  }) => {
    if (n_pl <= 1e-12) return 1;
    const lambda_bar_max = Math.max(lambda_bar_y, lambda_bar_z);
    const raw =
      1 +
      (wz - 1) *
        ((2 -
          (1.6 / wz) * Cm_z ** 2 * lambda_bar_max -
          (1.6 / wz) * Cm_z ** 2 * lambda_bar_max ** 2) *
          n_pl -
          e_LT);
    return Math.max(raw, Wel_z_mm3 / Wpl_z_mm3);
  },
  k_yyReserve: ({ ncr_y_ratio, chi_y }) => {
    const denom = 1 - chi_y * ncr_y_ratio;
    if (denom <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid k_yy denominator",
      });
    return denom;
  },
  k_yy: ({ Cm_y, Cm_LT, C_yy, k_yyReserve, section_class }) => {
    if (section_class >= 3) return (Cm_y * Cm_LT) / k_yyReserve;
    return (Cm_y * Cm_LT * (1 / C_yy)) / k_yyReserve;
  },
  k_zzReserve: ({ ncr_z_ratio, chi_z }) => {
    const denom = 1 - chi_z * ncr_z_ratio;
    if (denom <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid k_zz denominator",
      });
    return denom;
  },
  k_zz: ({ Cm_z, C_zz, k_zzReserve, section_class }) => {
    if (section_class >= 3) return Cm_z / k_zzReserve;
    return (Cm_z * (1 / C_zz)) / k_zzReserve;
  },
  k_zy: ({
    Cm_y,
    Cm_LT,
    C_zy,
    wy,
    wz,
    ncr_y_ratio,
    ncr_z_ratio,
    chi_z,
    section_class,
  }) => {
    const mu_z = (1 - ncr_z_ratio) / (1 - chi_z * ncr_z_ratio);
    const denom = 1 - ncr_y_ratio;
    if (!Number.isFinite(denom) || denom <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid k_zy denominator",
      });
    if (section_class >= 3) return (Cm_y * Cm_LT * mu_z) / denom;
    return (
      (Cm_y * Cm_LT * mu_z * (1 / C_zy) * 0.6 * Math.sqrt(wy / wz)) / denom
    );
  },
  bc_62_term1: ({ abs_N_Ed_N, chi_z, N_Rk_N, gamma_M1 }) => {
    const denominator = (chi_z * N_Rk_N) / gamma_M1;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid denominator for term 1",
      });
    }
    return abs_N_Ed_N / denominator;
  },
  bc_62_term2: ({ k_zy, abs_M_y_Ed_Nmm, chi_LT_mod, M_y_Rk_Nmm, gamma_M1 }) => {
    const denominator = (chi_LT_mod * M_y_Rk_Nmm) / gamma_M1;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid denominator for term 2",
      });
    }
    return k_zy * (abs_M_y_Ed_Nmm / denominator);
  },
  bc_62_term3: ({ k_zz, abs_M_z_Ed_Nmm, M_z_Rk_Nmm, gamma_M1 }) => {
    const denominator = M_z_Rk_Nmm / gamma_M1;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m1: invalid denominator for term 3",
      });
    }
    return k_zz * (abs_M_z_Ed_Nmm / denominator);
  },
  bc_62_m1_check: ({ bc_62_term1, bc_62_term2, bc_62_term3 }) =>
    bc_62_term1 + bc_62_term2 + bc_62_term3,
});
