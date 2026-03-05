import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check_15_ulsBucklingY from "./ulsBucklingY";

const annex = { id: "test", coefficients: { gamma_M1: 1.05 } };

const baseInputs = {
  section_class: 1,
  A: 5381,
  fy: 235,
  E: 210_000,
  Iy: 83_560_000,
  L: 5000,
  k_y: 1,
  alpha_y: 0.21,
};

describe("check_15_ulsBucklingY", () => {
  it("computes buckling utilization for a compression member", () => {
    const result = evaluate(check_15_ulsBucklingY, {
      inputs: { ...baseInputs, N_Ed: -1_100_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(0.966, 3);
    expect(result.passed).toBe(true);
  });

  it("throws not-applicable-load-case for tension", () => {
    try {
      evaluate(check_15_ulsBucklingY, {
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
const annex = { id: "parity", coefficients: { gamma_M1: 1.05 } };

const baseInputs = {
  section_class: 1,
  A: 5381,
  fy: 235,
  E: 210_000,
  Iy: 83_560_000,
  L: 5000,
  k_y: 1,
  alpha_y: 0.21,
};

describe("check-15 parity", () => {
  it("matches Test_High compression.pdf", () => {
    const result = evaluate(check_15_ulsBucklingY, {
      inputs: { ...baseInputs, N_Ed: -1_100_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(0.966, 3);
    expect(result.passed).toBe(true);
  });

  it("matches Test_High shear.pdf", () => {
    const result = evaluate(check_15_ulsBucklingY, {
      inputs: { ...baseInputs, N_Ed: -30_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(0.026, 3);
    expect(result.passed).toBe(true);
  });

  it("throws not-applicable-load-case for N_Ed >= 0", () => {
    try {
      evaluate(check_15_ulsBucklingY, {
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

}
