import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check_14_ulsBiaxialAxialShear from "./ulsBiaxialAxialShear";

const annex = { id: "test", coefficients: { gamma_M0: 1.05 } };

const baseInputs = {
  M_y_Ed: 50_000_000,
  M_z_Ed: 10_000_000,
  N_Ed: -30_000,
  V_y_Ed: 350_000,
  V_z_Ed: 80_000,
  section_shape: "I",
  section_class: 1,
  A: 5381,
  b: 150,
  h: 300,
  tf: 10.7,
  Wpl_y: 628_356,
  Wel_z: 80_504,
  Wpl_z: 125_219,
  Av_y: 3210,
  Av_z: 2568,
  tw: 7.1,
  fy: 235,
};

describe("check_14_ulsBiaxialAxialShear", () => {
  it("computes finite high-shear utilization", () => {
    const result = evaluate(check_14_ulsBiaxialAxialShear, { inputs: baseInputs, annex });

    expect(result.ratio).toBeCloseTo(0.93, 2);
    expect(result.passed).toBe(true);
  });

  it("throws invalid-input-domain when reduced resistance collapses", () => {
    try {
      evaluate(check_14_ulsBiaxialAxialShear, {
        inputs: { ...baseInputs, N_Ed: -2_000_000 },
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
const annex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

const baseInputs = {
  M_y_Ed: 50_000_000,
  M_z_Ed: 10_000_000,
  section_shape: "I",
  section_class: 1,
  A: 5381,
  b: 150,
  h: 300,
  tf: 10.7,
  Wpl_y: 628_356,
  Wel_z: 80_504,
  Wpl_z: 125_219,
  Av_y: 3210,
  Av_z: 2568,
  tw: 7.1,
  fy: 235,
};

describe("check-14 parity", () => {
  it("matches Test_High shear.pdf", () => {
    const result = evaluate(check_14_ulsBiaxialAxialShear, {
      inputs: {
        ...baseInputs,
        N_Ed: -30_000,
        V_y_Ed: 350_000,
        V_z_Ed: 80_000,
      },
      annex,
    });

    expect(result.ratio).toBeCloseTo(0.93, 2);
    expect(result.passed).toBe(true);
  });

  it("matches Test_Shear near failure.pdf", () => {
    const result = evaluate(check_14_ulsBiaxialAxialShear, {
      inputs: {
        ...baseInputs,
        N_Ed: -30_000,
        V_y_Ed: 410_000,
        V_z_Ed: 80_000,
      },
      annex,
    });

    expect(result.ratio).toBeCloseTo(5.363, 0);
    expect(result.passed).toBe(false);
  });
});

}
