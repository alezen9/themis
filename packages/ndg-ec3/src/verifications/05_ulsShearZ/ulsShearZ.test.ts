import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import check from "./ulsShearZ";
import { Ec3VerificationError } from "../../errors";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = { V_z_Ed: 50_000, Av_z: 1_400, fy: 355 };

describe("check-05 shear-z", () => {
  it("computes resistance and utilization from EC3 formula inputs", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });
    const expectedVplRd =
      (baselineInputs.Av_z * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const expectedRatio = Math.abs(baselineInputs.V_z_Ed) / expectedVplRd;

    expect(result.cache.V_pl_z_Rd).toBeCloseTo(expectedVplRd, 12);
    expect(result.ratio).toBeCloseTo(expectedRatio, 12);
    expect(result.passed).toBe(true);
  });

  it("gives the same ratio for equal positive and negative shear magnitude", () => {
    const positive = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: 45_000 },
      annex: customAnnex,
    });
    const negative = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: -45_000 },
      annex: customAnnex,
    });

    expect(positive.ratio).toBeCloseTo(negative.ratio, 12);
  });

  it("returns zero utilization when V_z_Ed = 0", () => {
    const result = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: 0 },
      annex: customAnnex,
    });

    expect(result.ratio).toBe(0);
    expect(result.passed).toBe(true);
  });

  it("increases utilization when |V_z_Ed| increases", () => {
    const r1 = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: 20_000 },
      annex: customAnnex,
    }).ratio;
    const r2 = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: 50_000 },
      annex: customAnnex,
    }).ratio;
    const r3 = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: 80_000 },
      annex: customAnnex,
    }).ratio;

    expect(r1).toBeLessThan(r2);
    expect(r2).toBeLessThan(r3);
  });

  it("passes at ratio = 1", () => {
    const vplRd =
      (baselineInputs.Av_z * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const result = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: vplRd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(1, 12);
    expect(result.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const vplRd =
      (baselineInputs.Av_z * baselineInputs.fy) /
      (Math.sqrt(3) * customAnnex.coefficients.gamma_M0);
    const result = evaluate(check, {
      inputs: { ...baselineInputs, V_z_Ed: 1.01 * vplRd },
      annex: customAnnex,
    });

    expect(result.ratio).toBeGreaterThan(1);
    expect(result.passed).toBe(false);
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

  it("throws invalid-input-domain when Av_z is not finite", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, Av_z: Number.NaN },
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

describe("check-05 reference scenarios", () => {
  it("returns expected resistance and utilization for I-section class-2 reference values", () => {
    const inputs = { V_z_Ed: 10_000, Av_z: 2_568, fy: 235 };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedVplRd =
      (inputs.Av_z * inputs.fy) /
      (Math.sqrt(3) * parityAnnex.coefficients.gamma_M0);

    expect(result.cache.V_pl_z_Rd).toBeCloseTo(expectedVplRd, 12);
    expect(Number(result.cache.V_pl_z_Rd) / 1_000).toBeCloseTo(331.9, 0);
    expect(result.ratio).toBeCloseTo(0.03, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for RHS class-1 reference values", () => {
    const inputs = { V_z_Ed: 10_000, Av_z: 1_231, fy: 235 };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedVplRd =
      (inputs.Av_z * inputs.fy) /
      (Math.sqrt(3) * parityAnnex.coefficients.gamma_M0);

    expect(result.cache.V_pl_z_Rd).toBeCloseTo(expectedVplRd, 12);
    expect(Number(result.cache.V_pl_z_Rd) / 1_000).toBeCloseTo(159.1, 1);
    expect(result.ratio).toBeCloseTo(0.063, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for CHS class-1 reference values", () => {
    const inputs = { V_z_Ed: 3_000, Av_z: 433, fy: 235 };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedVplRd =
      (inputs.Av_z * inputs.fy) /
      (Math.sqrt(3) * parityAnnex.coefficients.gamma_M0);

    expect(result.cache.V_pl_z_Rd).toBeCloseTo(expectedVplRd, 12);
    expect(Number(result.cache.V_pl_z_Rd) / 1_000).toBeCloseTo(56.0, 1);
    expect(result.ratio).toBeCloseTo(0.054, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected resistance and utilization for I-section class-3 reference values", () => {
    const inputs = { V_z_Ed: 10_000, Av_z: 8_378, fy: 235 };
    const result = evaluate(check, { inputs, annex: parityAnnex });
    const expectedVplRd =
      (inputs.Av_z * inputs.fy) /
      (Math.sqrt(3) * parityAnnex.coefficients.gamma_M0);

    expect(result.cache.V_pl_z_Rd).toBeCloseTo(expectedVplRd, 12);
    expect(Number(result.cache.V_pl_z_Rd) / 1_000).toBeCloseTo(1082.6, 1);
    expect(result.ratio).toBeCloseTo(0.009, 3);
    expect(result.passed).toBe(true);
  });
});
