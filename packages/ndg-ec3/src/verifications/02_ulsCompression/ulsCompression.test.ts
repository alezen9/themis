import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import check from "./ulsCompression";
import { Ec3VerificationError } from "../../errors";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = { A: 2848, fy: 355, N_Ed: -100_000 };

describe("check-02 compression", () => {
  it("computes plastic resistance and utilization from EC3 formula inputs", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });
    const expectedNcRd =
      (baselineInputs.A * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const expectedRatio = Math.abs(baselineInputs.N_Ed) / expectedNcRd;

    expect(result.cache.N_c_Rd).toBeCloseTo(expectedNcRd, 12);
    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
  });

  it("increases utilization when compression magnitude increases", () => {
    const r1 = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: -50_000 },
      annex: customAnnex,
    }).ratio;
    const r2 = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: -100_000 },
      annex: customAnnex,
    }).ratio;
    const r3 = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: -150_000 },
      annex: customAnnex,
    }).ratio;

    expect(r1).toBeLessThan(r2);
    expect(r2).toBeLessThan(r3);
  });

  it("passes at ratio = 1", () => {
    const ncRd =
      (baselineInputs.A * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const result = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: -ncRd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(1, 12);
    expect(result.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const ncRd =
      (baselineInputs.A * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const result = evaluate(check, {
      inputs: { ...baselineInputs, N_Ed: -1.01 * ncRd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeGreaterThan(1);
    expect(result.passed).toBe(false);
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

  it("throws invalid-input-domain when A is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, A: Number.NaN },
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

  it("throws not-applicable-load-case when N_Ed = 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, N_Ed: 0 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("not-applicable-load-case");
    }
  });

  it("throws not-applicable-load-case when N_Ed > 0", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, N_Ed: 100_000 },
        annex: customAnnex,
      });
      throw new Error("expected evaluation to fail");
    } catch (error) {
      expect(error).toBeInstanceOf(Ec3VerificationError);
      if (!(error instanceof Ec3VerificationError)) throw error;
      expect(error.type).toBe("not-applicable-load-case");
    }
  });
});

const parityAnnex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

describe("check-02 reference scenarios", () => {
  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const result = evaluate(check, {
      inputs: { A: 680, fy: 235, N_Ed: -3_000 },
      annex: parityAnnex,
    });

    expect(result.cache.N_c_Rd).toBeCloseTo(152_190.476, 0);
    expect(result.ratio).toBeCloseTo(0.02, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const result = evaluate(check, {
      inputs: { A: 1_915, fy: 235, N_Ed: -30_000 },
      annex: parityAnnex,
    });

    expect(result.cache.N_c_Rd).toBeCloseTo(428_595.238, 0);
    expect(result.ratio).toBeCloseTo(0.07, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for IPE300 class-2 reference values", () => {
    const result = evaluate(check, {
      inputs: { A: 5_381, fy: 235, N_Ed: -3_000_000 },
      annex: parityAnnex,
    });

    expect(result.cache.N_c_Rd).toBeCloseTo(1_204_319.048, 0);
    expect(result.ratio).toBeCloseTo(2.491, 3);
    expect(result.passed).toBe(false);
  });

  it("returns expected resistance and utilization for IPE600 class-3 reference values", () => {
    const result = evaluate(check, {
      inputs: { A: 15_598, fy: 235, N_Ed: -3_000_000 },
      annex: parityAnnex,
    });

    expect(result.cache.N_c_Rd).toBeCloseTo(3_490_980.952, 0);
    expect(result.ratio).toBeCloseTo(0.859, 3);
    expect(result.passed).toBe(true);
  });
});
