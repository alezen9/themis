import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import check from "./ulsBendingYAxialShear";
import { Ec3VerificationError } from "../../errors";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

describe("check-12 bending-y-axial-shear", () => {
  it("computes finite utilization for high-shear class-1 I-section inputs", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 50_000_000,
        N_Ed: -30_000,
        V_y_Ed: 350_000,
        V_z_Ed: 80_000,
        section_shape: "I",
        section_class: 1,
        A: 5381,
        Av_y: 3210,
        Av_z: 2568,
        b: 150,
        h: 300,
        tf: 10.7,
        tw: 7.1,
        Wpl_y: 628_356,
        Wel_y: 557_074,
        fy: 235,
      },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(0.528, 3);
    expect(result.passed).toBe(true);
  });

  it("throws invalid-input-domain when reduced class-1/2 resistance is undefined", () => {
    try {
      evaluate(check, {
        inputs: {
          M_y_Ed: 0,
          N_Ed: -3_000_000,
          V_y_Ed: 5_000,
          V_z_Ed: 10_000,
          section_shape: "I",
          section_class: 2,
          A: 5381,
          Av_y: 3210,
          Av_z: 2568,
          b: 150,
          h: 300,
          tf: 10.7,
          tw: 7.1,
          Wpl_y: 628_356,
          Wel_y: 557_074,
          fy: 235,
        },
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

describe("check-12 reference scenarios", () => {
  it("returns expected ratio for CHS class-1 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 1_500_000,
        N_Ed: -3_000,
        V_y_Ed: 0,
        V_z_Ed: 3_000,
        section_shape: "CHS",
        section_class: 1,
        A: 680,
        Av_y: 433,
        Av_z: 433,
        b: 0,
        h: 0,
        tf: 0,
        tw: 5,
        Wpl_y: 9416,
        Wel_y: 9416,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.ratio).toBeCloseTo(0.712, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected ratio for RHS class-1 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 7_000_000,
        N_Ed: -30_000,
        V_y_Ed: 5_000,
        V_z_Ed: 10_000,
        section_shape: "RHS",
        section_class: 1,
        A: 1915,
        Av_y: 684,
        Av_z: 684,
        b: 50,
        h: 90,
        tf: 8,
        tw: 8,
        Wpl_y: 51_383,
        Wel_y: 40_000,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.ratio).toBeCloseTo(0.609, 3);
    expect(result.passed).toBe(true);
  });

  it("returns expected ratio for IPE300 class-2 high-compression reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 50_000_000,
        N_Ed: -1_100_000,
        V_y_Ed: 5_000,
        V_z_Ed: 10_000,
        section_shape: "I",
        section_class: 2,
        A: 5381,
        Av_y: 3210,
        Av_z: 2568,
        b: 150,
        h: 300,
        tf: 10.7,
        tw: 7.1,
        Wpl_y: 628_356,
        Wel_y: 557_074,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.ratio).toBeCloseTo(3.277, 3);
    expect(result.passed).toBe(false);
  });

  it("returns expected ratio for IPE600 class-3 reference values", () => {
    const result = evaluate(check, {
      inputs: {
        M_y_Ed: 0,
        N_Ed: -3_000_000,
        V_y_Ed: 5_000,
        V_z_Ed: 10_000,
        section_shape: "I",
        section_class: 3,
        A: 15_598,
        Av_y: 4545,
        Av_z: 6250,
        b: 220,
        h: 600,
        tf: 21,
        tw: 15.5,
        Wpl_y: 3_823_169,
        Wel_y: 3_069_449,
        fy: 235,
      },
      annex: parityAnnex,
    });

    expect(result.ratio).toBeCloseTo(0.859, 3);
    expect(result.passed).toBe(true);
  });
});
