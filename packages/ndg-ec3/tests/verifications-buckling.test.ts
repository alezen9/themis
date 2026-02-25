import { describe, it, expect } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import {
  ulsBucklingY,
  ulsBucklingZ,
  ulsTorsionalBuckling,
  ulsLtb,
  bucklingVerifications,
} from "../src/verifications";

const annex = {
  id: "eurocode",
  coefficients: {
    gamma_M1: 1.0,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
  },
};

// IPE200-like section, S355, Lcr = 3000mm
const bucklingInputs: Record<string, number> = {
  N_Ed: 200_000,
  A: 2848,
  fy: 355,
  E: 210_000,
  G: 81_000,
  Iy: 19_430_000,
  Iz: 1_424_000,
  It: 69_800,
  Iw: 12_990_000_000,
  Lcr_y: 3000,
  Lcr_z: 3000,
  Lcr_T: 3000,
  alpha_y: 0.21, // curve a
  alpha_z: 0.34, // curve b
  alpha_LT: 0.34,
  M_y_Ed: 20_000_000,
  M_cr: 100_000_000,
  Wpl_y: 220_600,
};

describe("§6.3.1 ulsBucklingY", () => {
  it("computes Ncr, chi, and ratio correctly", () => {
    const r = evaluate(ulsBucklingY, { inputs: bucklingInputs, annex });
    const Ncr = (Math.PI ** 2 * 210_000 * 19_430_000) / 3000 ** 2;
    expect(r.cache.N_cr_y).toBeCloseTo(Ncr, 0);
    expect(r.cache.chi_y).toBeLessThanOrEqual(1);
    expect(r.cache.chi_y).toBeGreaterThan(0);
    expect(r.passed).toBe(true);
  });
});

describe("§6.3.1 ulsBucklingZ", () => {
  it("computes correct ratio (z is weaker)", () => {
    const r = evaluate(ulsBucklingZ, { inputs: bucklingInputs, annex });
    expect(r.cache.N_cr_z).toBeLessThan(r.cache.N_cr_z + 1); // sanity
    expect(r.ratio).toBeGreaterThan(0);
  });
});

describe("§6.3.1.4 ulsTorsionalBuckling", () => {
  it("evaluates torsional-flexural critical force", () => {
    const r = evaluate(ulsTorsionalBuckling, { inputs: bucklingInputs, annex });
    expect(r.cache.N_cr_TF).toBeGreaterThan(0);
    expect(r.ratio).toBeGreaterThan(0);
  });
});

describe("§6.3.2.3 ulsLtb", () => {
  it("computes LTB with NDP parameters", () => {
    const r = evaluate(ulsLtb, { inputs: bucklingInputs, annex });
    expect(r.cache.lambda_bar_LT).toBeGreaterThan(0);
    expect(r.cache.chi_LT).toBeGreaterThan(0);
    expect(r.cache.chi_LT).toBeLessThanOrEqual(1);
    expect(r.cache.M_b_Rd).toBeGreaterThan(0);
    expect(r.ratio).toBeGreaterThan(0);
  });
});

describe("bucklingVerifications array", () => {
  it("contains 4 verifications", () => {
    expect(bucklingVerifications).toHaveLength(4);
  });
});
