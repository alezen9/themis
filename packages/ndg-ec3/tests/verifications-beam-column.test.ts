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

const inputs: Record<string, number | string> = {
  N_Ed: -100_000,
  M_y_Ed: 10_000_000,
  M_z_Ed: 2_000_000,
  A: 2848,
  Wel_y: 200_000,
  Wel_z: 50_000,
  Wpl_y: 220_600,
  Wpl_z: 47_940,
  Av_y: 2848,
  Av_z: 1424,
  tw: 5.6,
  hw: 181.2,
  fy: 355,
  E: 210_000,
  G: 81_000,
  Iy: 19_430_000,
  Iz: 1_424_000,
  It: 69_800,
  Iw: 12_990_000_000,
  L: 3000,
  k_y: 1.0,
  k_z: 1.0,
  k_LT: 1.0,
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
  section_shape: "I",
  section_class: 2,
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
