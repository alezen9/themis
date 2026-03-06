import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check from "./ulsBendingYAxial";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = {
  M_y_Ed: 26_900_000,
  N_Ed: -100_000,
  section_shape: "I",
  section_class: 2,
  A: 2848,
  b: 100,
  tf: 8.5,
  t: 5.6,
  Wel_y: 194_300,
  Wpl_y: 220_600,
  fy: 355,
};

describe("check-09 bending-y-axial", () => {
  it("computes the axial reduction chain and ratio from EC3 formulas", () => {
    const inputs = { ...baselineInputs, N_Ed: -500_000 };
    const result = evaluate(check, { inputs, annex: customAnnex });

    const nPlRd = (inputs.A * inputs.fy) / customAnnex.coefficients.gamma_M0;
    const n = Math.abs(inputs.N_Ed) / nPlRd;
    const aRaw = (inputs.A - 2 * inputs.b * inputs.tf) / inputs.A;
    const a = Math.min(aRaw, 0.5);
    const axialRatio = (1 - n) / (1 - 0.5 * a);
    const axialFactor = n <= 0.5 * a ? 1 : Math.min(1, axialRatio);
    const mPlRd = (inputs.Wpl_y * inputs.fy) / customAnnex.coefficients.gamma_M0;
    const mNyRd = mPlRd * axialFactor;
    const ratio = Math.abs(inputs.M_y_Ed) / mNyRd;

    expect(result.cache.N_pl_Rd).toBeCloseTo(nPlRd, 10);
    expect(result.cache.n).toBeCloseTo(n, 12);
    expect(result.cache.a_w).toBeCloseTo(a, 12);
    expect(result.cache.k_y).toBeCloseTo(axialFactor, 12);
    expect(result.cache.M_N_y_Rd).toBeCloseTo(mNyRd, 8);
    expect(result.ratio).toBeCloseTo(ratio, 12);
    expect(result.passed).toBe(result.ratio <= 1);
  });

  it("uses class 1/2 interaction and class 3 stress criterion", () => {
    const class2 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 2 },
      annex: customAnnex,
    });
    const class3 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 3 },
      annex: customAnnex,
    });

    const expectedClass2MplRd =
      (baselineInputs.Wpl_y * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const expectedClass3SigmaN = Math.abs(baselineInputs.N_Ed) / baselineInputs.A;
    const expectedClass3SigmaMy =
      Math.abs(baselineInputs.M_y_Ed) / baselineInputs.Wel_y;
    const expectedClass3 =
      (expectedClass3SigmaN + expectedClass3SigmaMy) /
      (baselineInputs.fy / customAnnex.coefficients.gamma_M0);

    expect(class2.cache.M_pl_y_Rd).toBeCloseTo(expectedClass2MplRd, 8);
    expect(class2.ratio).toBeCloseTo(
      Math.abs(baselineInputs.M_y_Ed) / class2.cache.M_N_y_Rd,
      12,
    );
    expect(class3.cache.sigma_M_y).toBeCloseTo(expectedClass3SigmaMy, 12);
    expect(class3.ratio).toBeCloseTo(expectedClass3, 12);
  });

  it("keeps axial_factor = 1 at the n = 0.5*a_w threshold", () => {
    const nPlRd =
      (baselineInputs.A * baselineInputs.fy) / customAnnex.coefficients.gamma_M0;
    const aWRaw =
      (baselineInputs.A - 2 * baselineInputs.b * baselineInputs.tf) /
      baselineInputs.A;
    const aW = Math.min(aWRaw, 0.5);
    const thresholdNEd = -0.5 * aW * nPlRd;

    const result = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: thresholdNEd },
      annex: customAnnex,
    });

    expect(result.cache.k_y).toBeCloseTo(1, 12);
  });

  it("reduces axial_factor when n is just above 0.5*a_w", () => {
    const nPlRd =
      (baselineInputs.A * baselineInputs.fy) / customAnnex.coefficients.gamma_M0;
    const aWRaw =
      (baselineInputs.A - 2 * baselineInputs.b * baselineInputs.tf) /
      baselineInputs.A;
    const aW = Math.min(aWRaw, 0.5);
    const aboveThresholdNEd = -0.5001 * aW * nPlRd;

    const result = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: aboveThresholdNEd },
      annex: customAnnex,
    });

    expect(result.cache.k_y).toBeLessThan(1);
  });

  it("applies axial reduction for both tension and compression (|N_Ed|)", () => {
    const compression = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: -500_000 },
      annex: customAnnex,
    });
    const tension = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: 500_000 },
      annex: customAnnex,
    });

    expect(tension.cache.n).toBeCloseTo(compression.cache.n, 12);
    expect(tension.ratio).toBeCloseTo(compression.ratio, 12);
  });

  it("increases utilization when |M_y_Ed| increases", () => {
    const r1 = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 10_000_000 },
      annex: customAnnex,
    }).ratio;
    const r2 = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 26_900_000 },
      annex: customAnnex,
    }).ratio;
    const r3 = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 40_000_000 },
      annex: customAnnex,
    }).ratio;

    expect(r1).toBeLessThan(r2);
    expect(r2).toBeLessThan(r3);
  });

  it("passes at ratio = 1", () => {
    const initial = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });

    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: initial.cache.M_N_y_Rd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(1, 12);
    expect(result.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const initial = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });

    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 1.01 * initial.cache.M_N_y_Rd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeGreaterThan(1);
    expect(result.passed).toBe(false);
  });

  it("throws invalid-input-domain when reduced M_N_y_Rd denominator is <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, N_Ed: 2_000_000 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
      expect(error.message).toContain("denominator M_N_y_Rd");
    }
  });

  it("throws invalid-input-domain when section_class is 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when section_class is 5", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: 5 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when section_class is non-integer", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: 2.5 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when section_class is NaN", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, section_class: Number.NaN },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when A <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, A: 0 },
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

  it("throws invalid-input-domain when Wpl_y <= 0 for class 1/2", () => {
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
        inputs: { ...baselineInputs, section_class: 3, Wel_y: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("throws invalid-input-domain when b <= 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, b: 0 },
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

  it("throws invalid-input-domain when t <= 0 for RHS", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, section_shape: "RHS", t: 0 },
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

  it("throws invalid-input-domain when N_Ed is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, N_Ed: Number.NaN },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
    }
  });

  it("matches reference display rounding for a baseline bending-y with axial case", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });

    expect((result.cache.M_N_y_Rd / 1_000_000).toFixed(1)).toBe("74.6");
    expect(result.ratio.toFixed(3)).toBe("0.361");
  });
});

const parityAnnex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

describe("check-09 reference scenarios", () => {
  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const inputs = {
      M_y_Ed: 1_500_000,
      N_Ed: -3_000,
      section_shape: "CHS",
      section_class: 1,
      A: 680,
      b: 60,
      tf: 5,
      t: 5,
      Wel_y: 6_689,
      Wpl_y: 9_416,
      fy: 235,
    };

    const result = evaluate(check, { inputs, annex: parityAnnex });

    expect(result.cache.n.toFixed(3)).toBe("0.020");
    expect((result.cache.M_N_y_Rd / 1_000_000).toFixed(1)).toBe("2.1");
    expect(result.ratio.toFixed(3)).toBe("0.712");
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const inputs = {
      M_y_Ed: 7_000_000,
      N_Ed: -30_000,
      section_shape: "RHS",
      section_class: 1,
      A: 1_915,
      b: 50,
      tf: 8,
      t: 8,
      Wel_y: 38_569,
      Wpl_y: 51_407,
      fy: 235,
    };

    const result = evaluate(check, { inputs, annex: parityAnnex });

    expect(result.cache.n.toFixed(3)).toBe("0.070");
    expect((result.cache.M_N_y_Rd / 1_000_000).toFixed(1)).toBe("11.5");
    expect(result.ratio.toFixed(3)).toBe("0.608");
    expect(result.passed).toBe(true);
  });

  it("returns expected stress utilization for IPE600 class-3 reference values", () => {
    const inputs = {
      M_y_Ed: 0,
      N_Ed: -3_000_000,
      section_shape: "I",
      section_class: 3,
      A: 15_598,
      b: 220,
      tf: 19,
      t: 19,
      Wel_y: 3_069_449,
      Wpl_y: 3_512_400,
      fy: 235,
    };

    const result = evaluate(check, { inputs, annex: parityAnnex });

    expect(result.cache.sigma_N.toFixed(1)).toBe("192.3");
    expect(result.cache.sigma_limit.toFixed(1)).toBe("223.8");
    expect(result.ratio.toFixed(3)).toBe("0.859");
    expect(result.passed).toBe(true);
  });

  it("throws invalid-input-domain when reduced resistance becomes non-positive for IPE300 class-2 reference values", () => {
    const inputs = {
      M_y_Ed: 50_000_000,
      N_Ed: -3_000_000,
      section_shape: "I",
      section_class: 2,
      A: 5_381,
      b: 150,
      tf: 10.7,
      t: 10.7,
      Wel_y: 557_074,
      Wpl_y: 628_356,
      fy: 235,
    };

    try {
      evaluate(check, { inputs, annex: parityAnnex });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("invalid-input-domain");
      expect(error.message).toContain("denominator M_N_y_Rd");
    }
  });
});
