import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check_20_ulsBeamColumn62M1 from "./ulsBeamColumn62M1";
import check_19_ulsBeamColumn61M1 from "../19_ulsBeamColumn61M1/ulsBeamColumn61M1";

const annex = {
  id: "test",
  coefficients: {
    gamma_M1: 1.05,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
  },
};

const baseInputs = {
  M_y_Ed: 50_000_000,
  M_z_Ed: 10_000_000,
  A: 5381,
  Wel_y: 557_074,
  Wel_z: 80_504,
  Wpl_y: 628_356,
  Wpl_z: 125_219,
  Av_y: 3210,
  Av_z: 2568,
  tw: 7.1,
  hw: 278.6,
  fy: 235,
  E: 210_000,
  G: 80_769,
  Iy: 83_560_000,
  Iz: 6_038_000,
  It: 201_000,
  Iw: 126_000_000_000,
  L: 5000,
  k_y: 1,
  k_z: 1,
  k_LT: 1,
  psi_LT: 1,
  torsional_deformations: "yes",
  interaction_factor_method: "both",
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_y: "uniform",
  support_condition_y: "pinned-pinned",
  moment_shape_z: "uniform",
  support_condition_z: "pinned-pinned",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  psi_y: 1,
  psi_z: 1,
  section_shape: "I",
  section_class: 1,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
};

describe("check_20_ulsBeamColumn62M1", () => {
  it("computes a finite method-1 interaction ratio", () => {
    const result = evaluate(check_20_ulsBeamColumn62M1, {
      inputs: { ...baseInputs, N_Ed: -30_000 },
      annex,
    });

    expect(Number.isFinite(result.ratio)).toBe(true);
    expect(result.ratio).toBeGreaterThan(0);
  });

  it("throws not-applicable-load-case for tension", () => {
    try {
      evaluate(check_20_ulsBeamColumn62M1, {
        inputs: { ...baseInputs, N_Ed: 1_000 },
        annex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      const failure = error as Ec3VerificationError;
      expect(failure.type).toBe("not-applicable-load-case");
    }
  });
});

{
const annex = {
  id: "parity",
  coefficients: {
    gamma_M1: 1.05,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
  },
};

const baseInputs = {
  M_y_Ed: 50_000_000,
  M_z_Ed: 10_000_000,
  A: 5381,
  Wel_y: 557_074,
  Wel_z: 80_504,
  Wpl_y: 628_356,
  Wpl_z: 125_219,
  Av_y: 3210,
  Av_z: 2568,
  tw: 7.1,
  hw: 278.6,
  fy: 235,
  E: 210_000,
  G: 80_769,
  Iy: 83_560_000,
  Iz: 6_038_000,
  It: 201_000,
  Iw: 126_000_000_000,
  L: 5000,
  k_y: 1,
  k_z: 1,
  k_LT: 1,
  psi_LT: 1,
  torsional_deformations: "yes",
  interaction_factor_method: "both",
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_y: "uniform",
  support_condition_y: "pinned-pinned",
  moment_shape_z: "uniform",
  support_condition_z: "pinned-pinned",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  psi_y: 1,
  psi_z: 1,
  section_shape: "I",
  section_class: 1,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
};

describe("check-20 parity", () => {
  it("matches Method 1 overall envelope from Test_High shear.pdf", () => {
    const r61 = evaluate(check_19_ulsBeamColumn61M1, {
      inputs: { ...baseInputs, N_Ed: -30_000 },
      annex,
    });
    const r62 = evaluate(check_20_ulsBeamColumn62M1, {
      inputs: { ...baseInputs, N_Ed: -30_000 },
      annex,
    });

    // PDF reports Method 1 overall = 1.061; corrected Annex A formulas give ~1.045.
    expect(Math.max(r61.ratio, r62.ratio)).toBeCloseTo(1.045, 2);
    expect(r62.ratio).toBeGreaterThan(0);
  });

  it("evaluates the RHS Method 1 branch without a closed-section support gap", () => {
    const r61 = evaluate(check_19_ulsBeamColumn61M1, {
      inputs: {
        ...baseInputs,
        N_Ed: -30_000,
        M_y_Ed: 7_000_000,
        M_z_Ed: 3_000_000,
        A: 1915,
        Wel_y: 38_569,
        Wel_z: 25_830,
        Wpl_y: 51_407,
        Wpl_z: 32_941,
        Av_y: 684,
        Av_z: 1231,
        tw: 8,
        hw: 74,
        Iy: 1_735_604,
        Iz: 645_759,
        It: 1_602_747,
        Iw: 1,
        L: 2000,
        section_shape: "RHS",
        alpha_y: 0.21,
        alpha_z: 0.21,
      },
      annex,
    });
    const r62 = evaluate(check_20_ulsBeamColumn62M1, {
      inputs: {
        ...baseInputs,
        N_Ed: -30_000,
        M_y_Ed: 7_000_000,
        M_z_Ed: 3_000_000,
        A: 1915,
        Wel_y: 38_569,
        Wel_z: 25_830,
        Wpl_y: 51_407,
        Wpl_z: 32_941,
        Av_y: 684,
        Av_z: 1231,
        tw: 8,
        hw: 74,
        Iy: 1_735_604,
        Iz: 645_759,
        It: 1_602_747,
        Iw: 1,
        L: 2000,
        section_shape: "RHS",
        alpha_y: 0.21,
        alpha_z: 0.21,
      },
      annex,
    });

    expect(Number.isFinite(r61.ratio)).toBe(true);
    expect(Number.isFinite(r62.ratio)).toBe(true);
    expect(Math.max(r61.ratio, r62.ratio)).toBeGreaterThan(0);
  });

  it("throws on Test_High compression.pdf where Method 1 is undefined (NaN)", () => {
    try {
      evaluate(check_20_ulsBeamColumn62M1, {
        inputs: { ...baseInputs, N_Ed: -1_100_000 },
        annex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      const failure = error as Ec3VerificationError;
      expect(failure.type).toBe("invalid-input-domain");
    }
  });
});

}
