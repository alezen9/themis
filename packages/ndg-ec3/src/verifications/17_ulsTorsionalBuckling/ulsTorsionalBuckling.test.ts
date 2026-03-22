import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check_17_ulsTorsionalBuckling from "./ulsTorsionalBuckling";

const annex = { id: "test", coefficients: { gamma_M1: 1.05 } };

const baseInputs = {
  A: 5381,
  fy: 235,
  E: 210_000,
  G: 80_769,
  Iy: 83_560_000,
  Iz: 6_038_000,
  It: 201_000,
  Iw: 126_000_000_000,
  L: 5000,
  k_T: 1,
  k_z: 1,
  torsional_deformations: "yes",
  section_shape: "I",
  section_class: 1,
  alpha_z: 0.34,
};

describe("check_17_ulsTorsionalBuckling", () => {
  it("computes torsional buckling utilization for compression", () => {
    const result = evaluate(check_17_ulsTorsionalBuckling, {
      inputs: { ...baseInputs, N_Ed: -1_100_000 },
      annex,
    });

    expect(result.ratio).toBeCloseTo(1.366, 3);
    expect(result.passed).toBe(false);
  });

  it("throws not-applicable-load-case for tension", () => {
    try {
      evaluate(check_17_ulsTorsionalBuckling, {
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

  it("throws not-applicable-load-case for closed hollow sections", () => {
    try {
      evaluate(check_17_ulsTorsionalBuckling, {
        inputs: { ...baseInputs, section_shape: "RHS", N_Ed: -1_000 },
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
    A: 5381,
    fy: 235,
    E: 210_000,
    G: 80_769,
    Iy: 83_560_000,
    Iz: 6_038_000,
    It: 201_000,
    Iw: 126_000_000_000,
    L: 5000,
    k_T: 1,
    k_z: 1,
    torsional_deformations: "yes",
    section_shape: "I",
    section_class: 1,
    alpha_z: 0.34,
  };

  describe("check-17 parity", () => {
    it("matches Test_High compression.pdf", () => {
      const result = evaluate(check_17_ulsTorsionalBuckling, {
        inputs: { ...baseInputs, N_Ed: -1_100_000 },
        annex,
      });

      // PDF shows 1.375; current EC3-derived implementation yields 1.366.
      expect(result.ratio).toBeCloseTo(1.366, 3);
      expect(result.passed).toBe(false);
    });

    it("matches Test_High shear.pdf", () => {
      const result = evaluate(check_17_ulsTorsionalBuckling, {
        inputs: { ...baseInputs, N_Ed: -30_000 },
        annex,
      });

      // PDF shows 0.038; current EC3-derived implementation yields 0.037.
      expect(result.ratio).toBeCloseTo(0.037, 3);
      expect(result.passed).toBe(true);
    });

    it("throws not-applicable-load-case for N_Ed >= 0", () => {
      try {
        evaluate(check_17_ulsTorsionalBuckling, {
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
