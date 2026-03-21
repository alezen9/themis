import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check from "./ulsBendingYShear";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = {
  M_y_Ed: 20_000_000,
  V_z_Ed: 50_000,
  section_class: 2,
  section_shape: "I",
  Wpl_y: 220_600,
  Wel_y: 194_300,
  Av_z: 1_424,
  hw: 183,
  tw: 5.6,
  fy: 355,
};

describe("check-07 bending-y-shear", () => {
  it("computes reduced bending resistance and utilization when rho_z = 0", () => {
    const result = evaluate(check, { inputs: baselineInputs, annex: customAnnex });
    const expectedVplRd =
      (baselineInputs.Av_z * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const expectedRhoRatio = Math.abs(baselineInputs.V_z_Ed) / expectedVplRd;
    const expectedMyVRd =
      (baselineInputs.Wpl_y * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const expectedRatio = Math.abs(baselineInputs.M_y_Ed) / expectedMyVRd;

    expect(expectedRhoRatio).toBeLessThanOrEqual(0.5);
    expect(result.cache.rho_z).toBe(0);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(expectedMyVRd, 12);
    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
  });

  it("applies EC3 reduction when V_z_Ed / V_pl_z_Rd > 0.5", () => {
    const inputs = { ...baselineInputs, V_z_Ed: 180_000 };
    const result = evaluate(check, { inputs, annex: customAnnex });
    const vplRd =
      (inputs.Av_z * inputs.fy) / (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const rhoRatio = Math.abs(inputs.V_z_Ed) / vplRd;
    const rhoExpected = (2 * rhoRatio - 1) ** 2;
    const A_w = inputs.hw * inputs.tw;
    const reductionExpected = (rhoExpected * A_w ** 2) / (4 * inputs.tw);
    const myVRdExpected = Math.min(
      ((inputs.Wpl_y - reductionExpected) * inputs.fy) / customAnnex.coefficients.gamma_M0,
      (inputs.Wpl_y * inputs.fy) / customAnnex.coefficients.gamma_M0,
    );

    expect(rhoRatio).toBeGreaterThan(0.5);
    expect(result.cache.rho_z).toBeCloseTo(rhoExpected, 12);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(myVRdExpected, 10);
    expect(result.cache.M_y_V_Rd).toBeLessThan(
      (inputs.Wpl_y * inputs.fy) / customAnnex.coefficients.gamma_M0,
    );
  });

  it("keeps rho_z at zero when V_z_Ed / V_pl_z_Rd is exactly 0.5", () => {
    const V_pl_z_Rd =
      (baselineInputs.Av_z * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const inputs = {
      ...baselineInputs,
      V_z_Ed: 0.5 * V_pl_z_Rd,
    };
    const result = evaluate(check, { inputs, annex: customAnnex });
    const expectedMyVRd =
      (inputs.Wpl_y * inputs.fy) / customAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_z).toBe(0);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(expectedMyVRd, 12);
  });

  it("applies RHS high-shear branch with direct M_y_V_Rd_rhs_chs branch", () => {
    const inputs = {
      M_y_Ed: 7_000_000,
      V_z_Ed: 120_000,
      section_class: 1,
      section_shape: "RHS",
      Wpl_y: 51_407,
      Wel_y: 38_569,
      Av_z: 1_231,
      tw: 8,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: customAnnex });
    const V_pl_z_Rd =
      (inputs.Av_z * inputs.fy) / (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const rhoRatio = Math.abs(inputs.V_z_Ed) / V_pl_z_Rd;
    const rhoExpected = (2 * rhoRatio - 1) ** 2;
    const W_y_eff_expected = inputs.Wpl_y * (1 - rhoExpected);
    const M_y_V_Rd_expected =
      (W_y_eff_expected * inputs.fy) / customAnnex.coefficients.gamma_M0;

    expect(rhoRatio).toBeGreaterThan(0.5);
    expect(result.cache.rho_z).toBeCloseTo(rhoExpected, 12);
    expect(result.cache.M_y_V_Rd_rhs_chs).toBeCloseTo(M_y_V_Rd_expected, 10);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(M_y_V_Rd_expected, 10);
  });

  it("uses Wpl_y for class 1 or 2 and Wel_y for class 3", () => {
    const class2 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 2 },
      annex: customAnnex,
    });
    const class3 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 3 },
      annex: customAnnex,
    });

    expect(class2.cache.W_y_res).toBe(baselineInputs.Wpl_y);
    expect(class3.cache.W_y_res).toBe(baselineInputs.Wel_y);
    expect(class3.ratio).toBeGreaterThan(class2.ratio);
  });

  it("gives the same ratio for equal moment and shear magnitudes with opposite signs", () => {
    const positive = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 15_000_000, V_z_Ed: 45_000 },
      annex: customAnnex,
    });
    const negative = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: -15_000_000, V_z_Ed: -45_000 },
      annex: customAnnex,
    });

    expect(positive.ratio).toBeCloseTo(negative.ratio, 12);
  });

  it("increases utilization when |M_y_Ed| increases", () => {
    const r1 = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 10_000_000 },
      annex: customAnnex,
    }).ratio;
    const r2 = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 20_000_000 },
      annex: customAnnex,
    }).ratio;
    const r3 = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 30_000_000 },
      annex: customAnnex,
    }).ratio;

    expect(r1).toBeLessThan(r2);
    expect(r2).toBeLessThan(r3);
  });

  it("passes at ratio = 1", () => {
    const initial = evaluate(check, { inputs: baselineInputs, annex: customAnnex });
    const atLimit = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: initial.cache.M_y_V_Rd },
      annex: customAnnex,
    });

    expect(atLimit.ratio).toBeCloseTo(1, 12);
    expect(atLimit.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const initial = evaluate(check, { inputs: baselineInputs, annex: customAnnex });
    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 1.01 * initial.cache.M_y_V_Rd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeGreaterThan(1);
    expect(result.passed).toBe(false);
  });

  it("throws when section_class is 0 (no active selector branch)", () => {
    expect(() =>
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: 0 },
        annex: customAnnex,
      }),
    ).toThrow("must have exactly one active child, got 0");
  });

  it("throws when section_class is 4 (no active selector branch)", () => {
    expect(() =>
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: 4 },
        annex: customAnnex,
      }),
    ).toThrow("must have exactly one active child, got 0");
  });

  it("throws when section_class is non-integer (no active selector branch)", () => {
    expect(() =>
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: 2.5 },
        annex: customAnnex,
      }),
    ).toThrow("must have exactly one active child, got 0");
  });

  it("throws when section_class is NaN (no active selector branch)", () => {
    expect(() =>
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: Number.NaN },
        annex: customAnnex,
      }),
    ).toThrow("must have exactly one active child, got 0");
  });

  it("throws invalid-input-domain when Wpl_y <= 0 for class 1 or 2", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Wpl_y: 0, section_class: 2 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when Wel_y <= 0 for class 3", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Wel_y: 0, section_class: 3 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when Av_z <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Av_z: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when tw <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, tw: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when fy <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, fy: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when gamma_M0 <= 0", () => {
    const brokenAnnex = { id: "custom", coefficients: { gamma_M0: 0 } };

    try {
      evaluate(check, {
        inputs: baselineInputs,
        annex: brokenAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when M_y_Ed is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, M_y_Ed: Number.NaN },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when V_z_Ed is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, V_z_Ed: Number.NaN },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });
});

const parityAnnex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

describe("check-07 reference scenarios", () => {
  it("returns expected resistance and utilization for I-section class-2 reference values", () => {
    const inputs = {
      M_y_Ed: 50_000_000,
      V_z_Ed: 10_000,
      section_class: 2,
      section_shape: "I",
      Wpl_y: 628_356,
      Wel_y: 557_074,
      Av_z: 2_568,
      hw: 278.6,
      tw: 7.1,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMyVRd = (inputs.Wpl_y * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_z).toBe(0);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(expectedMyVRd, 12);
    expect(result.cache.M_y_V_Rd / 1_000_000).toBeCloseTo(140.6, 1);
    expect(result.ratio).toBeCloseTo(0.356, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const inputs = {
      M_y_Ed: 7_000_000,
      V_z_Ed: 10_000,
      section_class: 1,
      section_shape: "RHS",
      Wpl_y: 51_407,
      Wel_y: 38_569,
      Av_z: 1_231,
      tw: 8,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMyVRd = (inputs.Wpl_y * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_z).toBe(0);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(expectedMyVRd, 12);
    expect(result.cache.M_y_V_Rd / 1_000_000).toBeCloseTo(11.5, 1);
    expect(result.ratio).toBeCloseTo(0.608, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const inputs = {
      M_y_Ed: 1_500_000,
      V_z_Ed: 3_000,
      section_class: 1,
      section_shape: "CHS",
      Wpl_y: 9_416,
      Wel_y: 6_689,
      Av_z: 433,
      tw: 5,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMyVRd = (inputs.Wpl_y * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_z).toBe(0);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(expectedMyVRd, 12);
    expect(result.cache.M_y_V_Rd / 1_000_000).toBeCloseTo(2.1, 1);
    expect(result.ratio).toBeCloseTo(0.712, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-3 reference values", () => {
    const inputs = {
      M_y_Ed: 0,
      V_z_Ed: 10_000,
      section_class: 3,
      section_shape: "I",
      Wpl_y: 3_512_400,
      Wel_y: 3_069_449,
      Av_z: 8_378,
      hw: 652,
      tw: 12,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMyVRd = (inputs.Wel_y * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_z).toBe(0);
    expect(result.cache.M_y_V_Rd).toBeCloseTo(expectedMyVRd, 12);
    expect(result.cache.M_y_V_Rd / 1_000_000).toBeCloseTo(687.0, 1);
    expect(result.ratio).toBeCloseTo(0, 12);
    expect(result.passed).toBe(true);
  });
});
