import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./ulsBeamColumn62M2-nodes";
import type { Ec3EvaluatorInputs } from "../../ec3-evaluator-inputs";
import { Ec3VerificationError } from "../../errors";
export const evaluate = defineEvaluators<Nodes, Ec3EvaluatorInputs>({
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

    if (isMomentUniform) return 1;

    if (isMomentLinear && isPsiOutOfRange) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: psi_LT must be within [-1, 1]",
        details: { psi_LT, sectionRef: "Table 6.6" },
      });
    }

    if (isMomentLinear) {
      const denominator = 1.33 - 0.33 * psi_LT;
      if (denominator <= 0) {
        throw new Ec3VerificationError({
          type: "invalid-input-domain",
          message:
            "beam-column-62-m2: denominator for k_c must be > 0 (division by zero)",
          details: { denominator, sectionRef: "Table 6.6" },
        });
      }
      return 1 / denominator;
    }

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
        message: "beam-column-62-m2: k_c must be > 0",
        details: { k_c, sectionRef: "Table 6.6" },
      });
    }
    return 1 / k_c ** 2;
  },
  psi_y_eff: ({ moment_shape_y, support_condition_y, psi_y }): number => {
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
          "beam-column-62-m2: psi_y is required when moment_shape_y is linear",
        details: { moment_shape_y, sectionRef: "Annex B Table B.3" },
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
  psi_z_eff: ({ moment_shape_z, support_condition_z, psi_z }): number => {
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
          "beam-column-62-m2: psi_z is required when moment_shape_z is linear",
        details: { moment_shape_z, sectionRef: "Annex B Table B.3" },
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
  psi_LT_eff: ({ moment_shape_LT, psi_LT, k_c }) => {
    if (moment_shape_LT === "uniform") return 1;
    if (moment_shape_LT === "linear") return psi_LT;
    const psiEquivalent = (1.33 - 1 / k_c) / 0.33;
    return Math.max(-1, Math.min(1, psiEquivalent));
  },
  Cm_y: ({ psi_y_eff }) => Math.max(0.4, 0.6 + 0.4 * psi_y_eff),
  Cm_z: ({ psi_z_eff }) => Math.max(0.4, 0.6 + 0.4 * psi_z_eff),
  Cm_LT: ({ psi_LT_eff }) => Math.max(0.4, 0.6 + 0.4 * psi_LT_eff),
  M_cr: ({ L, k_LT, Iz, It, Iw, C1, pi, E, G, section_shape }) => {
    if (section_shape === "RHS" || section_shape === "CHS") {
      // Closed sections are treated as not susceptible to LTB in this path,
      // so use a very large finite critical moment instead of Infinity.
      return Number.MAX_VALUE;
    }
    if (Iz <= 0 || It <= 0 || Iw <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: Iz, It and Iw must be > 0",
      });
    const lcrLT = L * k_LT;
    if (!Number.isFinite(lcrLT) || lcrLT <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: L*k_LT must be > 0",
      });
    if (C1 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: C1 must be > 0",
      });
    const eulerTerm = (pi ** 2 * E * Iz) / lcrLT ** 2;
    const torsionTerm = Iw / Iz + (lcrLT ** 2 * G * It) / (pi ** 2 * E * Iz);
    if (!Number.isFinite(torsionTerm) || torsionTerm <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: invalid torsion term",
      });
    return C1 * eulerTerm * Math.sqrt(torsionTerm);
  },
  N_Rk: ({ A, fy }) => A * fy,
  M_y_Rk: ({ Wpl_y, Wel_y, fy, section_class }) =>
    (section_class >= 3 ? Wel_y : Wpl_y) * fy,
  M_z_Rk: ({ Wpl_z, Wel_z, fy, section_class }) =>
    (section_class >= 3 ? Wel_z : Wpl_z) * fy,
  N_cr_y: ({ pi, E, Iy, L, k_y }) => {
    const denominator = L * k_y;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: denominator (L*k_y)^2 must be > 0 (division by zero)",
      });
    }
    return (pi ** 2 * E * Iy) / denominator ** 2;
  },
  N_cr_z: ({ pi, E, Iz, L, k_z }) => {
    const denominator = L * k_z;
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: denominator (L*k_z)^2 must be > 0 (division by zero)",
      });
    }
    return (pi ** 2 * E * Iz) / denominator ** 2;
  },
  lambda_bar_y: ({ A, fy, N_cr_y }) => {
    const value = (A * fy) / N_cr_y;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: lambda_bar_y_sq must be >= 0",
      });
    }
    return Math.sqrt(value);
  },
  lambda_bar_z: ({ A, fy, N_cr_z }) => {
    const value = (A * fy) / N_cr_z;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: lambda_bar_z_sq must be >= 0",
      });
    }
    return Math.sqrt(value);
  },
  phi_y: ({ alpha_y, A, fy, N_cr_y }) =>
    0.5 *
    (1 + alpha_y * (Math.sqrt((A * fy) / N_cr_y) - 0.2) + (A * fy) / N_cr_y),
  chi_y: ({ phi_y, A, fy, N_cr_y }) => {
    const radicand = phi_y ** 2 - (A * fy) / N_cr_y;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: chi_y radicand must be >= 0 for square root",
      });
    }
    const denominator = phi_y + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: denominator for chi_y must be > 0 (division by zero)",
      });
    }
    return Math.min(1, 1 / denominator);
  },
  phi_z: ({ alpha_z, lambda_bar_z }) =>
    0.5 * (1 + alpha_z * (lambda_bar_z - 0.2) + lambda_bar_z ** 2),
  chi_z: ({ phi_z, lambda_bar_z }) => {
    const radicand = phi_z ** 2 - lambda_bar_z ** 2;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: chi_z radicand must be >= 0 for square root",
      });
    }
    const denominator = phi_z + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: denominator for chi_z must be > 0 (division by zero)",
      });
    }
    return Math.min(1, 1 / denominator);
  },
  lambda_LT: ({ Wpl_y, Wel_y, fy, M_cr, section_class }) => {
    if (M_cr <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: M_cr must be > 0",
      });
    const W_y = section_class >= 3 ? Wel_y : Wpl_y;
    const value = (W_y * fy) / M_cr;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: lambda_LT_sq must be finite and >= 0",
      });
    }
    return Math.sqrt(value);
  },
  alpha_LT_eff: ({ alpha_LT, buckling_curves_LT_policy }) =>
    (buckling_curves_LT_policy ?? "default") === "general" ? 0.34 : alpha_LT,
  phi_LT: ({ alpha_LT_eff, lambda_LT, lambda_LT_0, beta_LT }) =>
    0.5 *
    (1 + alpha_LT_eff * (lambda_LT - lambda_LT_0) + beta_LT * lambda_LT ** 2),
  chi_LT: ({ phi_LT, beta_LT, lambda_LT }) => {
    if (lambda_LT === 0) {
      return 1;
    }
    const radicand = phi_LT ** 2 - beta_LT * lambda_LT ** 2;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: chi_LT radicand must be >= 0 for square root",
      });
    }
    if (!Number.isFinite(lambda_LT) || lambda_LT <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: denominator lambda_LT must be > 0 (division by zero)",
      });
    }
    const denominator = phi_LT + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "beam-column-62-m2: denominator for chi_LT must be > 0 (division by zero)",
      });
    }
    return Math.min(1, Math.min(1 / denominator, 1 / lambda_LT ** 2));
  },
  f_LT: (args) => {
    const { coefficient_f_method, lambda_LT, k_c } = args;
    if ((coefficient_f_method ?? "default-equation") === "force-1.0") return 1;
    if (!Number.isFinite(lambda_LT) || lambda_LT < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: lambda_LT must be finite and >= 0",
        details: { lambda_LT, sectionRef: "6.3.2.3" },
      });
    }
    if (k_c <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: k_c must be > 0",
        details: { k_c, sectionRef: "Table 6.6" },
      });
    }
    const centered = lambda_LT - 0.8;
    const raw = 1 - 0.5 * (1 - k_c) * (1 - 2 * centered ** 2);
    return Math.min(1, raw);
  },
  chi_LT_mod: ({ chi_LT, f_LT }) => {
    if (f_LT <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: f_LT must be > 0",
      });
    return Math.min(1, chi_LT / f_LT);
  },
  N_b_y_Rd: ({ chi_y, N_Rk, gamma_M1 }) => (chi_y * N_Rk) / gamma_M1,
  n_y: ({ N_Ed, N_b_y_Rd }) => {
    if (N_b_y_Rd <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: NbyRd must be > 0",
      });
    if (N_Ed > 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "beam-column-62-m2: check is only applicable for compression (N_Ed < 0)",
        details: { N_Ed, sectionRef: "6.3.3" },
      });
    }
    return -N_Ed / N_b_y_Rd;
  },
  k_yy_closed: ({ Cm_y, lambda_bar_y, n_y, section_class }) => {
    if (section_class >= 3) {
      return Math.min(
        Cm_y * (1 + 0.6 * lambda_bar_y * n_y),
        Cm_y * (1 + 0.6 * n_y),
      );
    }
    return Math.min(
      Cm_y * (1 + (lambda_bar_y - 0.2) * n_y),
      Cm_y * (1 + 0.8 * n_y),
    );
  },
  N_b_z_Rd: ({ chi_z, N_Rk, gamma_M1 }) => (chi_z * N_Rk) / gamma_M1,
  n_z: ({
    N_Ed,
    N_b_z_Rd,
    torsional_deformations,
    interaction_factor_method,
  }) => {
    if (N_b_z_Rd <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: NbzRd must be > 0",
      });
    if ((torsional_deformations ?? "yes") !== "yes") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "beam-column-62-m2: torsional deformations are disabled",
        details: { torsional_deformations, sectionRef: "6.3.3" },
      });
    }
    if ((interaction_factor_method ?? "both") === "method1") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "beam-column-62-m2: interaction factor method set to method1",
        details: { interaction_factor_method, sectionRef: "6.3.3(5)" },
      });
    }
    if (N_Ed > 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "beam-column-62-m2: check is only applicable for compression (N_Ed < 0)",
        details: { N_Ed, sectionRef: "6.3.3" },
      });
    }
    return -N_Ed / N_b_z_Rd;
  },
  k_zz: ({ Cm_z, lambda_bar_z, n_z, section_shape, section_class }) => {
    if (section_class >= 3) {
      return Math.min(
        Cm_z * (1 + 0.6 * lambda_bar_z * n_z),
        Cm_z * (1 + 0.6 * n_z),
      );
    }
    if (section_shape === "I") {
      return Math.min(
        Cm_z * (1 + (2 * lambda_bar_z - 0.6) * n_z),
        Cm_z * (1 + 1.4 * n_z),
      );
    }
    return Math.min(
      Cm_z * (1 + (lambda_bar_z - 0.2) * n_z),
      Cm_z * (1 + 0.8 * n_z),
    );
  },
  k_zy_i: ({ lambda_bar_z, Cm_LT, n_z, section_class }) => {
    const reserve = Cm_LT - 0.25;
    if (reserve === 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "beam-column-62-m2: Cm_LT = 0.25 causes division by zero",
      });
    const coeff = section_class >= 3 ? 0.05 : 0.1;
    if (lambda_bar_z < 0.4) {
      const lowA = 0.6 + lambda_bar_z;
      const lowB = 1 - ((coeff * lambda_bar_z) / reserve) * n_z;
      return Math.min(lowA, lowB);
    }
    const highA = 1 - ((coeff * lambda_bar_z) / reserve) * n_z;
    const highB = 1 - (coeff / reserve) * n_z;
    return Math.max(highA, highB);
  },
  k_zy_closed: ({ k_yy_closed, section_class }) =>
    section_class >= 3 ? k_yy_closed : 0.6 * k_yy_closed,
  k_zy: ({ k_zy_i, k_zy_closed }) => {
    if (typeof k_zy_i === "number") return k_zy_i;
    if (typeof k_zy_closed === "number") return k_zy_closed;
    throw new Ec3VerificationError({
      type: "evaluation-error",
      message: "beam-column-62-m2: no active k_zy branch",
    });
  },
  bc_62_term1: ({ N_Ed, chi_z, N_Rk, gamma_M1 }) => {
    if (N_Ed > 0) {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message:
          "beam-column-62-m2: check is only applicable for compression (N_Ed < 0)",
        details: { N_Ed, sectionRef: "6.3.3" },
      });
    }
    return -N_Ed / ((chi_z * N_Rk) / gamma_M1);
  },
  bc_62_term2: ({ k_zy, M_y_Ed, chi_LT_mod, M_y_Rk, gamma_M1 }) =>
    (k_zy * Math.abs(M_y_Ed)) / ((chi_LT_mod * M_y_Rk) / gamma_M1),
  bc_62_term3: ({ k_zz, M_z_Ed, M_z_Rk, gamma_M1 }) =>
    (k_zz * Math.abs(M_z_Ed)) / (M_z_Rk / gamma_M1),
  bc_62_m2_check: ({ bc_62_term1, bc_62_term2, bc_62_term3 }) =>
    bc_62_term1 + bc_62_term2 + bc_62_term3,
});
