import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import check from "./ulsBendingY";
import { Ec3VerificationError } from "../../errors";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = {
  M_y_Ed: 20_000_000,
  section_class: 2,
  Wpl_y: 220_600,
  Wel_y: 194_300,
  fy: 355,
};

describe("check-03 bending-y", () => {
  it("computes resistance and utilization from EC3 formula inputs", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });
    const expectedMcRd =
      (baselineInputs.Wpl_y * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const expectedRatio = Math.abs(baselineInputs.M_y_Ed) / expectedMcRd;

    expect(result.cache.M_c_y_Rd).toBeCloseTo(expectedMcRd, 12);
    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
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

  it("keeps class 1 and class 2 on the same Wpl_y branch", () => {
    const class1 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 1 },
      annex: customAnnex,
    });
    const class2 = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 2 },
      annex: customAnnex,
    });

    expect(class1.cache.W_y_res).toBe(baselineInputs.Wpl_y);
    expect(class2.cache.W_y_res).toBe(baselineInputs.Wpl_y);
    expect(class1.cache.M_c_y_Rd).toBeCloseTo(class2.cache.M_c_y_Rd, 12);
    expect(class1.ratio).toBeCloseTo(class2.ratio, 12);
  });

  it("gives the same ratio for equal positive and negative moment magnitude", () => {
    const positive = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 15_000_000 },
      annex: customAnnex,
    });
    const negative = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: -15_000_000 },
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
    const mcRd =
      (baselineInputs.Wpl_y * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: mcRd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(1, 12);
    expect(result.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const mcRd =
      (baselineInputs.Wpl_y * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const result = evaluate(check, {
      inputs: { ...baselineInputs, M_y_Ed: 1.01 * mcRd },
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
});

const parityAnnex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

describe("check-03 reference scenarios", () => {
  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 1_500_000,
        section_class: 1,
        Wpl_y: 9_416,
        Wel_y: 6_689,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.cache.M_c_y_Rd).toBeCloseTo(2_107_390.476, 0);
    expect(result.ratio).toBeCloseTo(0.712, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 7_000_000,
        section_class: 1,
        Wpl_y: 51_407,
        Wel_y: 38_569,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.cache.M_c_y_Rd).toBeCloseTo(11_505_376.19, 0);
    expect(result.ratio).toBeCloseTo(0.608, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-2 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 50_000_000,
        section_class: 2,
        Wpl_y: 628_356,
        Wel_y: 557_074,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.cache.M_c_y_Rd).toBeCloseTo(140_632_057.143, 0);
    expect(result.ratio).toBeCloseTo(0.356, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-3 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 0,
        section_class: 3,
        Wpl_y: 3_512_400,
        Wel_y: 3_069_449,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.cache.M_c_y_Rd).toBeCloseTo(686_971_919.048, 0);
    expect(result.ratio).toBeCloseTo(0, 12);
    expect(result.passed).toBe(true);
  });
});
