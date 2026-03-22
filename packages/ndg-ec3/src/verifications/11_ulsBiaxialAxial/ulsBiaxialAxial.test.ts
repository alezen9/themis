import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { Ec3VerificationError } from "../../errors";
import check from "./ulsBiaxialAxial";

const customAnnex = { id: "custom", coefficients: { gamma_M0: 1.05 } };

const baselineInputs = {
  M_y_Ed: 26_900_000,
  M_z_Ed: 5_000_000,
  N_Ed: -100_000,
  section_shape: "I",
  section_class: 2,
  A: 2848,
  b: 100,
  h: 200,
  tf: 8.5,
  tw: 5.6,
  t: 5.6,
  Wel_y: 194_300,
  Wel_z: 38_997,
  Wpl_y: 220_600,
  Wpl_z: 44_612,
  fy: 355,
};

describe("check-11 biaxial-axial", () => {
  it("computes class 1/2 eq. (6.41) interaction with axial reduction terms", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });

    const nPlRd =
      (baselineInputs.A * baselineInputs.fy) /
      customAnnex.coefficients.gamma_M0;
    const n = Math.abs(baselineInputs.N_Ed) / nPlRd;

    const aWRaw =
      (baselineInputs.A - 2 * baselineInputs.b * baselineInputs.tf) /
      baselineInputs.A;
    const aW = Math.min(aWRaw, 0.5);

    const aFRaw =
      (baselineInputs.A - 2 * baselineInputs.b * baselineInputs.tf) /
      baselineInputs.A;
    const aF = Math.min(aFRaw, 0.5);

    const axialY = Math.min(1, (1 - n) / (1 - 0.5 * aW));
    const axialZRatio = (n - aF) / (1 - aF);
    const axialZ = n <= aF ? 1 : 1 - axialZRatio ** 2;

    const mNyRd =
      ((baselineInputs.Wpl_y * baselineInputs.fy) /
        customAnnex.coefficients.gamma_M0) *
      axialY;
    const mNzRd =
      ((baselineInputs.Wpl_z * baselineInputs.fy) /
        customAnnex.coefficients.gamma_M0) *
      axialZ;

    const ratioY = Math.abs(baselineInputs.M_y_Ed) / mNyRd;
    const ratioZ = Math.abs(baselineInputs.M_z_Ed) / mNzRd;

    const alpha = 2;
    const beta = Math.max(1, 5 * n);
    const expected = ratioY ** alpha + ratioZ ** beta;

    expect(result.cache.n).toBeCloseTo(n, 12);
    expect(result.cache.k_y).toBeCloseTo(axialY, 12);
    expect(result.cache.k_z).toBeCloseTo(axialZ, 12);
    expect(result.cache.alpha_biax).toBeCloseTo(alpha, 12);
    expect(result.cache.beta_biax).toBeCloseTo(beta, 12);
    expect(result.ratio).toBeCloseTo(expected, 12);
  });

  it("uses class 3 stress criterion from eq. (6.42)", () => {
    const result = evaluate(check, {
      inputs: { ...baselineInputs, section_class: 3 },
      annex: customAnnex,
    });

    const sigmaN = Math.abs(baselineInputs.N_Ed) / baselineInputs.A;
    const sigmaMy = Math.abs(baselineInputs.M_y_Ed) / baselineInputs.Wel_y;
    const sigmaMz = Math.abs(baselineInputs.M_z_Ed) / baselineInputs.Wel_z;
    const sigmaX = sigmaN + sigmaMy + sigmaMz;
    const sigmaLimit = baselineInputs.fy / customAnnex.coefficients.gamma_M0;
    const expected = sigmaX / sigmaLimit;

    expect(result.ratio).toBeCloseTo(expected, 12);
  });

  it("keeps I-shape exponents alpha = 2 and beta = max(1, 5n)", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });

    expect(result.cache.alpha_biax).toBe(2);
    expect(result.cache.beta_biax).toBeCloseTo(
      Math.max(1, 5 * result.cache.n),
      12,
    );
  });

  it("uses CHS exponents alpha = 2 and beta = 2", () => {
    const result = evaluate(check, {
      inputs: { ...baselineInputs, section_shape: "CHS" },
      annex: customAnnex,
    });

    expect(result.cache.alpha_biax).toBe(2);
    expect(result.cache.beta_biax).toBe(2);
  });

  it("uses RHS exponent branch alpha = beta = min(1.66/(1-1.13n^2), 6)", () => {
    const result = evaluate(check, {
      inputs: { ...baselineInputs, section_shape: "RHS" },
      annex: customAnnex,
    });

    const expected = Math.min(1.66 / (1 - 1.13 * result.cache.n ** 2), 6);

    expect(result.cache.rhs_exp).toBeCloseTo(expected, 12);
    expect(result.cache.alpha_biax).toBeCloseTo(expected, 12);
    expect(result.cache.beta_biax).toBeCloseTo(expected, 12);
  });

  it("caps RHS exponents at 6 when 1 - 1.13*n^2 <= 0", () => {
    const rhsInputs = {
      ...baselineInputs,
      section_shape: "RHS",
      section_class: 1,
      M_y_Ed: 1_000_000,
      M_z_Ed: 500_000,
    };
    const nPlRd =
      (rhsInputs.A * rhsInputs.fy) / customAnnex.coefficients.gamma_M0;
    const highNEd = -0.95 * nPlRd;

    const result = evaluate(check, {
      inputs: { ...rhsInputs, N_Ed: highNEd },
      annex: customAnnex,
    });

    expect(result.cache.n).toBeGreaterThan(0.94);
    expect(result.cache.rhs_exp).toBe(6);
    expect(result.cache.alpha_biax).toBe(6);
    expect(result.cache.beta_biax).toBe(6);
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
    expect(tension.cache.k_y).toBeCloseTo(compression.cache.k_y, 12);
    expect(tension.cache.k_z).toBeCloseTo(compression.cache.k_z, 12);
    expect(tension.ratio).toBeCloseTo(compression.ratio, 12);
  });

  it("passes at ratio = 1", () => {
    const base = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 0 },
      annex: customAnnex,
    });
    const scale = 1 / Math.sqrt(base.ratio);

    const result = evaluate(check, {
      inputs: {
        ...baselineInputs,
        M_z_Ed: 0,
        M_y_Ed: baselineInputs.M_y_Ed * scale,
      },
      annex: customAnnex,
    });

    expect(result.ratio).toBeCloseTo(1, 10);
    expect(result.passed).toBe(true);
  });

  it("fails when ratio is above 1", () => {
    const base = evaluate(check, {
      inputs: { ...baselineInputs, M_z_Ed: 0 },
      annex: customAnnex,
    });
    const scale = 1.01 / Math.sqrt(base.ratio);

    const result = evaluate(check, {
      inputs: {
        ...baselineInputs,
        M_z_Ed: 0,
        M_y_Ed: baselineInputs.M_y_Ed * scale,
      },
      annex: customAnnex,
    });

    expect(result.ratio).toBeGreaterThan(1);
    expect(result.passed).toBe(false);
  });

  it("throws invalid-input-domain when reduced y denominator becomes <= 0", () => {
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

  it("throws invalid-input-domain when Wpl_z <= 0 for class 1/2", () => {
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

  it("throws invalid-input-domain when h <= 0 for RHS", () => {
    try {
      evaluate(check, {
        inputs: { ...baselineInputs, section_shape: "RHS", h: 0 },
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

  it("matches reference display value for a baseline biaxial-axial case", () => {
    const result = evaluate(check, {
      inputs: baselineInputs,
      annex: customAnnex,
    });

    expect(result.ratio.toFixed(3)).toBe("0.462");
  });
});

const parityAnnex = { id: "parity", coefficients: { gamma_M0: 1.05 } };

describe("check-11 reference scenarios", () => {
  it("returns expected utilization for I-section class-1 reference values", () => {
    const inputs = {
      M_y_Ed: 50_000_000,
      M_z_Ed: 10_000_000,
      N_Ed: 200_000,
      section_shape: "I",
      section_class: 1,
      A: 5381,
      b: 150,
      h: 300,
      tf: 10.7,
      tw: 7.1,
      t: 10.7,
      Wel_y: 557_074,
      Wel_z: 80_504,
      Wpl_y: 628_356,
      Wpl_z: 125_219,
      fy: 235,
    };

    const result = evaluate(check, { inputs, annex: parityAnnex });

    expect(result.ratio.toFixed(3)).toBe("0.483");
    expect(result.passed).toBe(true);
  });

  it("returns expected utilization for RHS class-1 reference values", () => {
    const inputs = {
      M_y_Ed: 7_000_000,
      M_z_Ed: 3_000_000,
      N_Ed: -30_000,
      section_shape: "RHS",
      section_class: 1,
      A: 1_915,
      b: 50,
      h: 90,
      tf: 8,
      tw: 8,
      t: 8,
      Wel_y: 38_569,
      Wel_z: 25_830,
      Wpl_y: 51_407,
      Wpl_z: 32_941,
      fy: 235,
    };

    const result = evaluate(check, { inputs, annex: parityAnnex });

    expect(result.cache.n.toFixed(3)).toBe("0.070");
    expect(result.cache.alpha_biax.toFixed(3)).toBe("1.669");
    expect(result.cache.beta_biax.toFixed(3)).toBe("1.669");
    expect(result.ratio.toFixed(3)).toBe("0.659");
    expect(result.passed).toBe(true);
  });

  it("returns expected stress utilization for IPE600 class-3 reference values", () => {
    const inputs = {
      M_y_Ed: 0,
      M_z_Ed: 0,
      N_Ed: -3_000_000,
      section_shape: "I",
      section_class: 3,
      A: 15_598,
      b: 220,
      h: 600,
      tf: 19,
      tw: 12,
      t: 19,
      Wel_y: 3_069_449,
      Wel_z: 307_940,
      Wpl_y: 3_512_400,
      Wpl_z: 485_649,
      fy: 235,
    };

    const result = evaluate(check, { inputs, annex: parityAnnex });

    expect(result.cache.sigma_N.toFixed(1)).toBe("192.3");
    expect(result.cache.sigma_limit.toFixed(1)).toBe("223.8");
    expect(result.ratio.toFixed(3)).toBe("0.859");
    expect(result.passed).toBe(true);
  });

  it("throws invalid-input-domain when reduced resistance collapses for IPE300 class-2 high-axial case", () => {
    const inputs = {
      M_y_Ed: 50_000_000,
      M_z_Ed: 10_000_000,
      N_Ed: -3_000_000,
      section_shape: "I",
      section_class: 2,
      A: 5_381,
      b: 150,
      h: 300,
      tf: 10.7,
      tw: 7.1,
      t: 10.7,
      Wel_y: 557_074,
      Wel_z: 80_504,
      Wpl_y: 628_356,
      Wpl_z: 125_219,
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
