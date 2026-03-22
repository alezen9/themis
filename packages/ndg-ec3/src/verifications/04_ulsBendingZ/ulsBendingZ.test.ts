import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import check from "./ulsBendingZ";
import { Ec3VerificationError } from "../../errors";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = {
  M_z_Ed: 5_000_000,
  section_class: 2,
  Wpl_z: 44_612,
  Wel_z: 28_474,
  fy: 355,
};

describe("check-04 bending-z", () => {
  it("computes resistance and utilization from EC3 formula inputs", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });
    const expectedMcRd =
      (baselineInputs.Wpl_z * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const expectedRatio = Math.abs(baselineInputs.M_z_Ed) / expectedMcRd;

    expect(result.cache.M_c_z_Rd).toBeCloseTo(expectedMcRd, 12);
    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
  });

  it("uses Wpl_z for class 1 or 2 and Wel_z for class 3", () => {
    const class2 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 2 },
      annex: customAnnex,
    });
    const class3 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 3 },
      annex: customAnnex,
    });

    expect(class2.cache.W_z_res).toBe(baselineInputs.Wpl_z);
    expect(class3.cache.W_z_res).toBe(baselineInputs.Wel_z);
    expect(class3.ratio).toBeGreaterThan(class2.ratio);
  });

  it("keeps class 1 and class 2 on the same Wpl_z branch", () => {
    const class1 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 1 },
      annex: customAnnex,
    });
    const class2 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 2 },
      annex: customAnnex,
    });

    expect(class1.cache.W_z_res).toBe(baselineInputs.Wpl_z);
    expect(class2.cache.W_z_res).toBe(baselineInputs.Wpl_z);
    expect(class1.cache.M_c_z_Rd).toBeCloseTo(class2.cache.M_c_z_Rd, 12);
    expect(class1.ratio).toBeCloseTo(class2.ratio, 12);
  });

  it("gives the same ratio for equal positive and negative moment magnitude", () => {
    const positive = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 4_000_000 },
      annex: customAnnex,
    });
    const negative = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: -4_000_000 },
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
    const mcRd =
      (baselineInputs.Wpl_z * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: mcRd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(1, 12);
    expect(result.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const mcRd =
      (baselineInputs.Wpl_z * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 1.01 * mcRd },
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
      evaluate(check, { inputs: baselineInputs, annex: brokenAnnex });
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
});

const parityAnnex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

describe("check-04 reference scenarios", () => {
  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const inputs = {
      M_z_Ed: 1_500_000,
      section_class: 1,
      Wpl_z: 9_416,
      Wel_z: 6_689,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMcRd =
      (inputs.Wpl_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.M_c_z_Rd).toBeCloseTo(expectedMcRd, 12);
    expect(Number(result.cache.M_c_z_Rd) / 1_000_000).toBeCloseTo(2.1, 1);
    expect(result.ratio).toBeCloseTo(0.712, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const inputs = {
      M_z_Ed: 3_000_000,
      section_class: 1,
      Wpl_z: 32_941,
      Wel_z: 25_830,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMcRd =
      (inputs.Wpl_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.M_c_z_Rd).toBeCloseTo(expectedMcRd, 12);
    expect(Number(result.cache.M_c_z_Rd) / 1_000_000).toBeCloseTo(7.4, 1);
    expect(result.ratio).toBeCloseTo(0.407, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-2 reference values", () => {
    const inputs = {
      M_z_Ed: 10_000_000,
      section_class: 2,
      Wpl_z: 125_219,
      Wel_z: 80_504,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMcRd =
      (inputs.Wpl_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.M_c_z_Rd).toBeCloseTo(expectedMcRd, 12);
    expect(Number(result.cache.M_c_z_Rd) / 1_000_000).toBeCloseTo(28.0, 1);
    expect(result.ratio).toBeCloseTo(0.357, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-3 reference values", () => {
    const inputs = {
      M_z_Ed: 0,
      section_class: 3,
      Wpl_z: 485_649,
      Wel_z: 307_940,
      fy: 235,
    };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedMcRd =
      (inputs.Wel_z * inputs.fy) / parityAnnex.coefficients.gamma_M0;

    expect(result.cache.M_c_z_Rd).toBeCloseTo(expectedMcRd, 12);
    expect(Number(result.cache.M_c_z_Rd) / 1_000_000).toBeCloseTo(68.9, 1);
    expect(result.ratio).toBeCloseTo(0, 12);
    expect(result.passed).toBe(true);
  });
});
