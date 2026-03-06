import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check from "./ulsBendingZShear";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = {
  M_z_Ed: 5_000_000,
  V_y_Ed: 10_000,
  section_class: 2,
  section_shape: "I",
  Wpl_z: 44_612,
  Wel_z: 38_997,
  Av_y: 1_700,
  tw: 5.6,
  h: 200,
  tf: 8.5,
  fy: 355,
};

describe("check-08 bending-z-shear", () => {
  it("computes reduced bending resistance and utilization when rho_y = 0", () => {
    const result = evaluate(check, { inputs: baselineInputs, annex: customAnnex });
    const expectedVplRd =
      (baselineInputs.Av_y * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const expectedRhoRatio = Math.abs(baselineInputs.V_y_Ed) / expectedVplRd;
    const expectedMzVRd =
      (baselineInputs.Wpl_z * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const expectedRatio = Math.abs(baselineInputs.M_z_Ed) / expectedMzVRd;

    expect(expectedRhoRatio).toBeLessThanOrEqual(0.5);
    expect(result.cache.rho_y).toBe(0);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(expectedMzVRd, 12);
    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
  });

  it("applies EC3 reduction when V_y_Ed / V_pl_y_Rd > 0.5", () => {
    const inputs = { ...baselineInputs, V_y_Ed: 200_000 };
    const result = evaluate(check, { inputs, annex: customAnnex });
    const vplRd =
      (inputs.Av_y * inputs.fy) / (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const rhoRatio = Math.abs(inputs.V_y_Ed) / vplRd;
    const rhoExpected = (2 * rhoRatio - 1) ** 2;
    const hw = inputs.h - 2 * inputs.tf;
    const wzWeb = (inputs.tw ** 2 * hw) / 4;
    const wzFlange = inputs.Wpl_z - wzWeb;
    const wzReduction = rhoExpected * wzFlange;
    const mzVRdExpected =
      ((inputs.Wpl_z - wzReduction) * inputs.fy) /
      customAnnex.coefficients.gamma_M0;

    expect(rhoRatio).toBeGreaterThan(0.5);
    expect(result.cache.rho_y).toBeCloseTo(rhoExpected, 12);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(mzVRdExpected, 10);
    expect(result.cache.M_z_V_Rd).toBeLessThan(
      (inputs.Wpl_z * inputs.fy) / customAnnex.coefficients.gamma_M0,
    );
  });

  it("keeps rho_y at zero when V_y_Ed / V_pl_y_Rd is exactly 0.5", () => {
    const V_pl_y_Rd =
      (baselineInputs.Av_y * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const inputs = {
      ...baselineInputs,
      V_y_Ed: 0.5 * V_pl_y_Rd,
    };
    const result = evaluate(check, { inputs, annex: customAnnex });
    const expectedMzVRd =
      (inputs.Wpl_z * inputs.fy) / customAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_y).toBe(0);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(expectedMzVRd, 12);
  });

  it("applies RHS high-shear branch with direct M_z_V_Rd_rhs_chs branch", () => {
    const inputs = {
      M_z_Ed: 3_000_000,
      V_y_Ed: 70_000,
      section_class: 1,
      section_shape: "RHS",
      Wpl_z: 32_941,
      Wel_z: 25_830,
      Av_y: 684,
      tw: 8,
      h: 90,
      tf: 8,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: customAnnex });
    const V_pl_y_Rd =
      (inputs.Av_y * inputs.fy) / (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const rhoRatio = Math.abs(inputs.V_y_Ed) / V_pl_y_Rd;
    const rhoExpected = (2 * rhoRatio - 1) ** 2;
    const W_z_eff_expected = inputs.Wpl_z * (1 - rhoExpected);
    const M_z_V_Rd_expected =
      (W_z_eff_expected * inputs.fy) / customAnnex.coefficients.gamma_M0;

    expect(rhoRatio).toBeGreaterThan(0.5);
    expect(result.cache.rho_y).toBeCloseTo(rhoExpected, 12);
    expect(result.cache.M_z_V_Rd_rhs_chs).toBeCloseTo(M_z_V_Rd_expected, 10);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(M_z_V_Rd_expected, 10);
  });

  it("gives the same ratio for equal moment and shear magnitudes with opposite signs", () => {
    const positive = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 4_000_000, V_y_Ed: 30_000 },
      annex: customAnnex,
    });
    const negative = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: -4_000_000, V_y_Ed: -30_000 },
      annex: customAnnex,
    });

    expect(positive.ratio).toBeCloseTo(negative.ratio, 12);
  });

  it("increases utilization when |M_z_Ed| increases", () => {
    const r1 = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 2_000_000 },
      annex: customAnnex,
    }).ratio;
    const r2 = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 5_000_000 },
      annex: customAnnex,
    }).ratio;
    const r3 = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 8_000_000 },
      annex: customAnnex,
    }).ratio;

    expect(r1).toBeLessThan(r2);
    expect(r2).toBeLessThan(r3);
  });

  it("passes at ratio = 1", () => {
    const initial = evaluate(check, { inputs: baselineInputs, annex: customAnnex });
    const atLimit = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: initial.cache.M_z_V_Rd },
      annex: customAnnex,
    });

    expect(atLimit.ratio).toBeCloseTo(1, 12);
    expect(atLimit.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const initial = evaluate(check, { inputs: baselineInputs, annex: customAnnex });
    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 1.01 * initial.cache.M_z_V_Rd },
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

  it("throws invalid-input-domain when Wpl_z <= 0 for class 1 or 2", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Wpl_z: 0, section_class: 2 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when Wel_z <= 0 for class 3", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Wel_z: 0, section_class: 3 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when Av_y <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Av_y: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when h <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, h: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when tf <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, tf: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when h - 2tf <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, h: 17, tf: 8.5 },
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

  it("throws invalid-input-domain when M_z_Ed is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, M_z_Ed: Number.NaN },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when V_y_Ed is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, V_y_Ed: Number.NaN },
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

describe("check-08 reference scenarios", () => {
  it("returns expected resistance and utilization for I-section class-2 reference values", () => {
    const inputs = {
      M_z_Ed: 10_000_000,
      V_y_Ed: 5_000,
      section_class: 2,
      section_shape: "I",
      Wpl_z: 125_219,
      Wel_z: 80_504,
      Av_y: 3_210,
      tw: 7.1,
      h: 300,
      tf: 10.7,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMzVRd = (inputs.Wpl_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_y).toBe(0);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(expectedMzVRd, 12);
    expect(result.cache.M_z_V_Rd / 1_000_000).toBeCloseTo(28.0, 1);
    expect(result.ratio).toBeCloseTo(0.357, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const inputs = {
      M_z_Ed: 3_000_000,
      V_y_Ed: 5_000,
      section_class: 1,
      section_shape: "RHS",
      Wpl_z: 32_941,
      Wel_z: 25_830,
      Av_y: 684,
      tw: 8,
      h: 90,
      tf: 8,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMzVRd = (inputs.Wpl_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_y).toBe(0);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(expectedMzVRd, 12);
    expect(result.cache.M_z_V_Rd / 1_000_000).toBeCloseTo(7.4, 1);
    expect(result.ratio).toBeCloseTo(0.407, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const inputs = {
      M_z_Ed: 1_500_000,
      V_y_Ed: 3_000,
      section_class: 1,
      section_shape: "CHS",
      Wpl_z: 9_416,
      Wel_z: 6_689,
      Av_y: 433,
      tw: 5,
      h: 60,
      tf: 5,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMzVRd = (inputs.Wpl_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_y).toBe(0);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(expectedMzVRd, 12);
    expect(result.cache.M_z_V_Rd / 1_000_000).toBeCloseTo(2.1, 1);
    expect(result.ratio).toBeCloseTo(0.712, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-3 reference values", () => {
    const inputs = {
      M_z_Ed: 0,
      V_y_Ed: 5_000,
      section_class: 3,
      section_shape: "I",
      Wpl_z: 485_649,
      Wel_z: 307_940,
      Av_y: 8_360,
      tw: 12,
      h: 600,
      tf: 19,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMzVRd = (inputs.Wel_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.rho_y).toBe(0);
    expect(result.cache.M_z_V_Rd).toBeCloseTo(expectedMzVRd, 12);
    expect(result.cache.M_z_V_Rd / 1_000_000).toBeCloseTo(68.9, 1);
    expect(result.ratio).toBeCloseTo(0, 12);
    expect(result.passed).toBe(true);
  });
});
