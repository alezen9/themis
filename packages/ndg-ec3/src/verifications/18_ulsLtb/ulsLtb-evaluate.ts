import { defineEvaluators } from "@ndg/ndg-core";
import type { Nodes } from "./ulsLtb-nodes";
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
    const linearDenominator = 1.33 - 0.33 * psi_LT;

    if (isMomentUniform) return 1;
    if (isMomentLinear && isPsiOutOfRange) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: psi_LT must be within [-1, 1]",
        details: { psi_LT, sectionRef: "Table 6.6" },
      });
    }
    if (isMomentLinear && linearDenominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: denominator for k_c must be > 0 (division by zero)",
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
        message: "ltb: k_c must be > 0",
        details: { k_c, sectionRef: "Table 6.6" },
      });
    }
    return 1 / k_c ** 2;
  },
  M_cr: ({ torsional_deformations, L, k_LT, Iz, It, Iw, C1, pi, E, G, section_shape }) => {
    if (section_shape === "RHS" || section_shape === "CHS") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "ltb: not applicable for closed sections (RHS/CHS)",
        details: { section_shape, sectionRef: "6.3.2" },
      });
    }
    if ((torsional_deformations ?? "yes") !== "yes") {
      throw new Ec3VerificationError({
        type: "not-applicable-load-case",
        message: "ltb: torsional deformations are disabled",
        details: { torsional_deformations, sectionRef: "6.3.2.3" },
      });
    }
    if (Iz <= 0 || It <= 0 || Iw <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: Iz, It and Iw must be > 0",
      });
    const lcrLT = L * k_LT;
    if (!Number.isFinite(lcrLT) || lcrLT <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: L*k_LT must be > 0",
      });
    if (C1 <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: C1 must be > 0",
      });
    const eulerTerm = (pi ** 2 * E * Iz) / lcrLT ** 2;
    const torsionTerm = Iw / Iz + (lcrLT ** 2 * G * It) / (pi ** 2 * E * Iz);
    if (!Number.isFinite(torsionTerm) || torsionTerm <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: invalid torsion term",
      });
    }
    return C1 * eulerTerm * Math.sqrt(torsionTerm);
  },
  lambda_bar_LT: ({ W_y_res, fy, M_cr }) => {
    if (M_cr <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: M_cr must be > 0",
      });
    const value = (W_y_res * fy) / M_cr;
    if (!Number.isFinite(value) || value < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: lambda_bar_LT_sq must be >= 0",
      });
    }
    const lambda = Math.sqrt(value);
    if (!Number.isFinite(lambda) || lambda < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: lambda_bar_LT must be >= 0",
      });
    }
    return lambda;
  },
  phi_LT: ({ alpha_LT, lambda_bar_LT, lambda_LT_0, beta_LT }) =>
    0.5 *
    (1 +
      alpha_LT * (lambda_bar_LT - lambda_LT_0) +
      beta_LT * lambda_bar_LT ** 2),
  chi_LT: ({ phi_LT, beta_LT, lambda_bar_LT, buckling_curves_LT_policy }) => {
    const radicand = phi_LT ** 2 - beta_LT * lambda_bar_LT ** 2;
    if (!Number.isFinite(radicand) || radicand < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: chi_LT radicand must be >= 0 for square root",
        details: { radicand, sectionRef: "6.3.2.3" },
      });
    }
    if (!Number.isFinite(lambda_bar_LT) || lambda_bar_LT <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message:
          "ltb: denominator lambda_bar_LT must be > 0 (division by zero)",
        details: { lambda_bar_LT, sectionRef: "6.3.2.3" },
      });
    }
    const denominator = phi_LT + Math.sqrt(radicand);
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: denominator for chi_LT must be > 0 (division by zero)",
        details: { denominator, sectionRef: "6.3.2.3" },
      });
    }
    const uncapped = 1 / denominator;
    const isGeneral = (buckling_curves_LT_policy ?? "default") === "general";
    if (isGeneral) {
      // Eq 6.56: only cap at 1.0
      return Math.min(1, uncapped);
    }
    // Eq 6.57 (rolled/welded): cap at 1.0 AND 1/lambda_bar_LT^2
    const cap = 1 / lambda_bar_LT ** 2;
    return Math.min(1, Math.min(uncapped, cap));
  },
  f_LT: (args) => {
    const { coefficient_f_method, lambda_bar_LT, k_c } = args;
    if ((coefficient_f_method ?? "default-equation") === "force-1.0") return 1;
    if (!Number.isFinite(lambda_bar_LT) || lambda_bar_LT < 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: lambda_bar_LT must be finite and >= 0",
        details: { lambda_bar_LT, sectionRef: "6.3.2.3" },
      });
    }
    if (k_c <= 0) {
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: k_c must be > 0",
        details: { k_c, sectionRef: "Table 6.6" },
      });
    }
    const centered = lambda_bar_LT - 0.8;
    const raw = 1 - 0.5 * (1 - k_c) * (1 - 2 * centered ** 2);
    return Math.min(1, raw);
  },
  chi_LT_mod: ({ chi_LT, f_LT }) => {
    if (f_LT <= 0)
      throw new Ec3VerificationError({
        type: "invalid-input-domain",
        message: "ltb: f_LT must be > 0",
      });
    return Math.min(1, chi_LT / f_LT);
  },
  M_b_Rd: ({ chi_LT_mod, W_y_res, fy, gamma_M1 }) =>
    (chi_LT_mod * W_y_res * fy) / gamma_M1,
  abs_M_y_Ed: ({ M_y_Ed }) => Math.abs(M_y_Ed),
  ltb_check: ({ abs_M_y_Ed, M_b_Rd }) => abs_M_y_Ed / M_b_Rd,
});
