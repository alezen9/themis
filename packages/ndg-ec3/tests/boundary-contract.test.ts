import { describe, expect, it } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import {
  ulsBendingY,
  ulsBendingYShear,
  ulsBendingZAxial,
} from "../src/verifications";
import { toEc3VerificationFailure } from "../src/errors";

const annex = {
  id: "benchmark",
  coefficients: {
    gamma_M0: 1.0,
    gamma_M1: 1.0,
    gamma_M2: 1.25,
    eta: 1.2,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
  },
};

const baseInputs: Record<string, number | string> = {
  N_Ed: -200000,
  M_y_Ed: 20000000,
  M_z_Ed: 5000000,
  V_y_Ed: 10000,
  V_z_Ed: 50000,
  A: 2848,
  Wel_y: 200000,
  Wel_z: 50000,
  Wpl_y: 220600,
  Wpl_z: 57700,
  Av_y: 2848,
  Av_z: 1424,
  tw: 5.6,
  hw: 181.2,
  section_shape: "I",
  section_class: 2,
  fy: 355,
  E: 210000,
  G: 81000,
  Iy: 19430000,
  Iz: 1424000,
  It: 69800,
  Iw: 12990000000,
  L: 3000,
  k_y: 1,
  k_z: 1,
  k_LT: 1,
  psi_y: 0.1,
  psi_z: -0.2,
  psi_LT: 1,
    moment_shape_y: "linear",
    support_condition_y: "pinned-pinned",
    moment_shape_z: "linear",
    support_condition_z: "pinned-pinned",
    moment_shape_LT: "uniform",
    support_condition_LT: "pinned-pinned",
    load_application_LT: "centroid",
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
};

describe("boundary contract", () => {
  it("keeps rho_z = 0 at V/Vpl = 0.5 in bending-y-shear", () => {
    const Vpl = (Number(baseInputs.Av_z) * Number(baseInputs.fy)) / (Math.sqrt(3) * Number(annex.coefficients.gamma_M0));
    const result = evaluate(ulsBendingYShear, {
      inputs: { ...baseInputs, V_z_Ed: 0.5 * Vpl },
      annex,
    });
    expect(result.cache.rho_ratio).toBeCloseTo(0.5, 10);
    expect(result.cache.rho_z).toBe(0);
  });

  it("keeps axial factor = 1 at n = a_f boundary in bending-z-axial", () => {
    const Npl = (Number(baseInputs.A) * Number(baseInputs.fy)) / Number(annex.coefficients.gamma_M0);
    const result = evaluate(ulsBendingZAxial, {
      inputs: { ...baseInputs, N_Ed: -0.5 * Npl },
      annex,
    });
    expect(result.cache.n).toBeCloseTo(result.cache.a_f as number, 10);
    expect(result.cache.axial_factor).toBeCloseTo(1, 10);
  });

  it("switches from plastic (class 2) to elastic (class 3) in bending-y resistance", () => {
    const class2 = evaluate(ulsBendingY, {
      inputs: { ...baseInputs, section_class: 2 },
      annex,
    });
    const class3 = evaluate(ulsBendingY, {
      inputs: { ...baseInputs, section_class: 3 },
      annex,
    });
    expect(class2.cache.W_y_res).toBe(baseInputs.Wpl_y);
    expect(class3.cache.W_y_res).toBe(baseInputs.Wel_y);
    expect(class3.ratio).toBeGreaterThan(class2.ratio);
  });

  it("switches from compute (class 3) to NOT_APPLICABLE_SECTION_CLASS (class 4)", () => {
    const class3 = evaluate(ulsBendingY, {
      inputs: { ...baseInputs, section_class: 3 },
      annex,
    });
    expect(Number.isFinite(class3.ratio)).toBe(true);

    try {
      evaluate(ulsBendingY, {
        inputs: { ...baseInputs, section_class: 4 },
        annex,
      });
      throw new Error("expected evaluation to throw");
    } catch (error) {
      const failure = toEc3VerificationFailure(error);
      expect(failure.type).toBe("NOT_APPLICABLE_SECTION_CLASS");
    }
  });
});
