import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check_22_ulsBeamColumn62M2 from "./ulsBeamColumn62M2";

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
  Wpl_y: 628_356,
  Wpl_z: 125_219,
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
  section_shape: "I",
  section_class: 1,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
  psi_y: 1,
  psi_z: 1,
};

describe("check_22_ulsBeamColumn62M2", () => {
  it("computes a finite method-2 interaction ratio", () => {
    const result = evaluate(check_22_ulsBeamColumn62M2, {
      inputs: { ...baseInputs, N_Ed: -30_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(1.044, 3);
    expect(result.passed).toBe(false);
  });

  it("throws not-applicable-load-case for tension", () => {
    try {
      evaluate(check_22_ulsBeamColumn62M2, {
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
  Wpl_y: 628_356,
  Wpl_z: 125_219,
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
  section_shape: "I",
  section_class: 1,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
  psi_y: 1,
  psi_z: 1,
};

describe("check-22 parity", () => {
  it("matches Test_High shear.pdf", () => {
    const result = evaluate(check_22_ulsBeamColumn62M2, {
      inputs: { ...baseInputs, N_Ed: -30_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(1.044, 3);
    expect(result.passed).toBe(false);
  });

  it("matches Test_High compression.pdf", () => {
    const result = evaluate(check_22_ulsBeamColumn62M2, {
      inputs: { ...baseInputs, N_Ed: -1_100_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(5.105, 3);
    expect(result.passed).toBe(false);
  });
});

}
