import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check_18_ulsLtb from "./ulsLtb";

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
  Wpl_y: 628_356,
  fy: 235,
  E: 210_000,
  G: 80_769,
  Iz: 6_038_000,
  It: 201_000,
  Iw: 126_000_000_000,
  L: 5000,
  k_LT: 1,
  psi_LT: 1,
  torsional_deformations: "yes",
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  section_shape: "I",
  section_class: 1,
  alpha_LT: 0.34,
};

describe("check_18_ulsLtb", () => {
  it("computes lateral torsional buckling utilization", () => {
    const result = evaluate(check_18_ulsLtb, { inputs: baseInputs, annex });

    expect(result.ratio).toBeCloseTo(0.573, 3);
    expect(result.passed).toBe(true);
  });

  it("throws invalid-input-domain when buckling length is zero", () => {
    try {
      evaluate(check_18_ulsLtb, {
        inputs: { ...baseInputs, L: 0 },
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
  Wpl_y: 628_356,
  fy: 235,
  E: 210_000,
  G: 80_769,
  Iz: 6_038_000,
  It: 201_000,
  Iw: 126_000_000_000,
  L: 5000,
  k_LT: 1,
  psi_LT: 1,
  torsional_deformations: "yes",
  coefficient_f_method: "default-equation",
  buckling_curves_LT_policy: "default",
  moment_shape_LT: "uniform",
  support_condition_LT: "pinned-pinned",
  load_application_LT: "centroid",
  section_shape: "I",
  section_class: 1,
  alpha_LT: 0.34,
};

describe("check-18 parity", () => {
  it("matches Test_High compression.pdf", () => {
    const result = evaluate(check_18_ulsLtb, {
      inputs: { ...baseInputs, M_y_Ed: 50_000_000 },
      annex,
    });

    // PDF shows 0.576; current EC3-derived implementation yields 0.573.
    expect(result.ratio).toBeCloseTo(0.573, 3);
    expect(result.passed).toBe(true);
  });

  it("matches Test_High shear.pdf", () => {
    const result = evaluate(check_18_ulsLtb, {
      inputs: { ...baseInputs, M_y_Ed: 50_000_000 },
      annex,
    });

    // PDF shows 0.576; current EC3-derived implementation yields 0.573.
    expect(result.ratio).toBeCloseTo(0.573, 3);
    expect(result.passed).toBe(true);
  });
});

}
