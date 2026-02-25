import { describe, it, expect } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import {
  ulsBeamColumn61M1,
  ulsBeamColumn62M1,
  ulsBeamColumn61M2,
  ulsBeamColumn62M2,
  beamColumnVerifications,
  ec3Verifications,
} from "../src/verifications";

const annex = {
  id: "eurocode",
  coefficients: {
    gamma_M1: 1.0,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
  },
};

const inputs: Record<string, number> = {
  N_Ed: 100_000,
  M_y_Ed: 10_000_000,
  M_z_Ed: 2_000_000,
  A: 2848,
  Wpl_y: 220_600,
  Wpl_z: 47_940,
  fy: 355,
  E: 210_000,
  Iy: 19_430_000,
  Iz: 1_424_000,
  Lcr_y: 3000,
  Lcr_z: 3000,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
  M_cr: 100_000_000,
  Cm_y: 0.9,
  Cm_z: 0.9,
  Cm_LT: 0.9,
};

describe("§6.3.3 beam-column interaction", () => {
  it("Eq.6.61 Method 1 evaluates", () => {
    const r = evaluate(ulsBeamColumn61M1, { inputs, annex });
    expect(r.ratio).toBeGreaterThan(0);
    expect(r.cache.chi_y).toBeGreaterThan(0);
    expect(r.cache.chi_y).toBeLessThanOrEqual(1);
    expect(r.cache.k_yy).toBeGreaterThan(0);
  });

  it("Eq.6.62 Method 1 evaluates", () => {
    const r = evaluate(ulsBeamColumn62M1, { inputs, annex });
    expect(r.ratio).toBeGreaterThan(0);
    expect(r.cache.chi_z).toBeLessThanOrEqual(1);
    expect(r.cache.k_zy).toBeGreaterThan(0);
  });

  it("Eq.6.61 Method 2 evaluates", () => {
    const r = evaluate(ulsBeamColumn61M2, { inputs, annex });
    expect(r.ratio).toBeGreaterThan(0);
    expect(r.cache.k_yy).toBeGreaterThan(0);
  });

  it("Eq.6.62 Method 2 evaluates", () => {
    const r = evaluate(ulsBeamColumn62M2, { inputs, annex });
    expect(r.ratio).toBeGreaterThan(0);
    expect(r.cache.k_zz).toBeGreaterThan(0);
  });

  it("beamColumnVerifications contains 4", () => {
    expect(beamColumnVerifications).toHaveLength(4);
  });

  it("ec3Verifications contains 22", () => {
    expect(ec3Verifications).toHaveLength(22);
  });
});
