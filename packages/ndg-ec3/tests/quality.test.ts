import { describe, it, expect } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import {
  ulsTension,
  ulsBucklingY,
  ulsBucklingZ,
  ulsBendingY,
  ulsBendingYShear,
  ulsBeamColumn61M1,
  ulsBeamColumn62M1,
  ulsBeamColumn61M2,
  ulsBeamColumn62M2,
  ec3Verifications,
} from "../src/verifications";
import { computeChi, computeChiLT } from "../src/helpers/reduction-factors";

// ── Shared test fixtures ──

const inputs: Record<string, number | string> = {
  N_Ed: 200_000,
  M_y_Ed: 20_000_000,
  M_z_Ed: 5_000_000,
  V_y_Ed: 10_000,
  V_z_Ed: 50_000,
  A: 2848,
  Wpl_y: 220_600,
  Wpl_z: 57_700,
  Av_y: 2848,
  Av_z: 1424,
  tw: 5.6,
  hw: 181.2,
  section_shape: "I",
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
  alpha_y: 0.21,
  alpha_z: 0.34,
  alpha_LT: 0.34,
  M_cr: 100_000_000,
  Cm_y: 0.9,
  Cm_z: 0.9,
  Cm_LT: 0.9,
};

const annex = {
  id: "eurocode",
  coefficients: {
    gamma_M0: 1.0,
    gamma_M1: 1.0,
    gamma_M2: 1.25,
    eta: 1.2,
    lambda_LT_0: 0.4,
    beta_LT: 0.75,
  },
};

// ── 1. Cross-verification sanity ──

describe("cross-verification sanity", () => {
  it("Eq.6.61 M1 and M2 share k_yy/k_yz (differ only in Eq.6.62)", () => {
    // Per Eurocode, M1 and M2 differ only in k_zy (Eq.6.62), not k_yy/k_yz (Eq.6.61)
    const r1 = evaluate(ulsBeamColumn61M1, { inputs, annex });
    const r2 = evaluate(ulsBeamColumn61M2, { inputs, annex });
    expect(r1.cache.k_yy).toBeCloseTo(r2.cache.k_yy as number, 10);
    expect(r1.cache.k_yz).toBeCloseTo(r2.cache.k_yz as number, 10);
    // But Eq.6.62 k_zy differs (tested in separate test above)
  });

  it("Eq.6.62 M1 and M2 produce different ratios", () => {
    const r1 = evaluate(ulsBeamColumn62M1, { inputs, annex });
    const r2 = evaluate(ulsBeamColumn62M2, { inputs, annex });
    expect(r1.ratio).not.toBeCloseTo(r2.ratio, 6);
  });

  it("Eq.6.61 and Eq.6.62 same method produce different ratios", () => {
    const r61 = evaluate(ulsBeamColumn61M1, { inputs, annex });
    const r62 = evaluate(ulsBeamColumn62M1, { inputs, annex });
    expect(r61.ratio).not.toBeCloseTo(r62.ratio, 6);
  });

  it("buckling-y ratio < buckling-z ratio for IPE (Iy >> Iz)", () => {
    const ry = evaluate(ulsBucklingY, { inputs, annex });
    const rz = evaluate(ulsBucklingZ, { inputs, annex });
    expect(ry.ratio).toBeLessThan(rz.ratio);
  });

  it("bending-y-shear ratio >= bending-y ratio", () => {
    const rPure = evaluate(ulsBendingY, { inputs, annex });
    const rCombined = evaluate(ulsBendingYShear, { inputs, annex });
    // combined check accounts for shear interaction so ratio >= pure (or equal if shear is low)
    expect(rCombined.ratio).toBeGreaterThanOrEqual(rPure.ratio - 1e-10);
  });

  it("all 22 verifications produce finite positive ratios", () => {
    for (const v of ec3Verifications) {
      const r = evaluate(v, { inputs, annex });
      expect(r.ratio).toBeGreaterThan(0);
      expect(isFinite(r.ratio)).toBe(true);
    }
  });
});

// ── 2. Golden-value snapshot ──

describe("golden-value snapshot", () => {
  it("uls-tension with Italian annex gamma_M0=1.05", () => {
    const r = evaluate(ulsTension, {
      inputs: { N_Ed: 100_000, A: 2848, fy: 355 },
      annex: { id: "italian", coefficients: { gamma_M0: 1.05 } },
    });

    const expectedNplRd = (2848 * 355) / 1.05;
    const expectedRatio = 100_000 / expectedNplRd;

    expect(r.cache.N_pl_Rd).toBeCloseTo(expectedNplRd, 2);
    expect(r.ratio).toBeCloseTo(expectedRatio, 4);
    expect(r.passed).toBe(true);
  });

  it("uls-buckling-y with Italian annex gamma_M1=1.05", () => {
    const r = evaluate(ulsBucklingY, {
      inputs,
      annex: {
        id: "italian",
        coefficients: { ...annex.coefficients, gamma_M0: 1.05, gamma_M1: 1.05 },
      },
    });

    // Hand calculation
    const Ncr = (Math.PI ** 2 * 210_000 * 19_430_000) / 3000 ** 2;
    const lb = Math.sqrt((2848 * 355) / Ncr);
    const phi = 0.5 * (1 + 0.21 * (lb - 0.2) + lb ** 2);
    const chi = Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
    const NbRd = (chi * 2848 * 355) / 1.05;
    const expectedRatio = 200_000 / NbRd;

    expect(r.cache.N_cr_y).toBeCloseTo(Ncr, 0);
    expect(r.cache.chi_y).toBeCloseTo(chi, 4);
    expect(r.cache.N_b_y_Rd).toBeCloseTo(NbRd, 0);
    expect(r.ratio).toBeCloseTo(expectedRatio, 4);
  });
});

// ── 3. Property-based (randomized invariants) ──

describe("property-based invariants", () => {
  function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  it("computeChi always returns value in (0, 1] for valid inputs (50 samples)", () => {
    for (let i = 0; i < 50; i++) {
      const A = rand(500, 50_000);
      const fy = rand(235, 460);
      const E = 210_000;
      const I = rand(100_000, 500_000_000);
      const Lcr = rand(500, 20_000);
      const alpha = rand(0.13, 0.76);
      const chi = computeChi(A, fy, E, I, Lcr, alpha);
      expect(chi).toBeGreaterThan(0);
      expect(chi).toBeLessThanOrEqual(1);
    }
  });

  it("computeChiLT always returns value in (0, 1] for valid inputs (50 samples)", () => {
    for (let i = 0; i < 50; i++) {
      const Wpl = rand(50_000, 5_000_000);
      const fy = rand(235, 460);
      const Mcr = rand(10_000_000, 1_000_000_000);
      const alphaLT = rand(0.21, 0.76);
      const lLT0 = rand(0.2, 0.4);
      const betaLT = rand(0.75, 1.0);
      const chi = computeChiLT(Wpl, fy, Mcr, alphaLT, lLT0, betaLT);
      expect(chi).toBeGreaterThan(0);
      expect(chi).toBeLessThanOrEqual(1);
    }
  });

  it("all verifications produce finite positive ratio for randomized valid inputs (10 samples)", () => {
    for (let i = 0; i < 10; i++) {
      const randomInputs: Record<string, number | string> = {
        N_Ed: rand(1000, 500_000),
        M_y_Ed: rand(100_000, 50_000_000),
        M_z_Ed: rand(100_000, 10_000_000),
        V_y_Ed: rand(1000, 100_000),
        V_z_Ed: rand(1000, 200_000),
        A: rand(1000, 30_000),
        Wpl_y: rand(50_000, 3_000_000),
        Wpl_z: rand(10_000, 500_000),
        Av_y: rand(500, 15_000),
        Av_z: rand(500, 10_000),
        tw: rand(3, 20),
        hw: rand(100, 800),
        section_shape: "I",
        fy: rand(235, 460),
        E: 210_000,
        G: 81_000,
        Iy: rand(1_000_000, 500_000_000),
        Iz: rand(100_000, 50_000_000),
        It: rand(10_000, 5_000_000),
        Iw: rand(1_000_000_000, 100_000_000_000),
        Lcr_y: rand(1000, 10_000),
        Lcr_z: rand(1000, 10_000),
        Lcr_T: rand(1000, 10_000),
        alpha_y: rand(0.13, 0.76),
        alpha_z: rand(0.13, 0.76),
        alpha_LT: rand(0.21, 0.76),
        M_cr: rand(10_000_000, 500_000_000),
        Cm_y: rand(0.4, 1.0),
        Cm_z: rand(0.4, 1.0),
        Cm_LT: rand(0.4, 1.0),
      };

      for (const v of ec3Verifications) {
        const r = evaluate(v, { inputs: randomInputs, annex });
        expect(r.ratio, `verification failed on random sample ${i}`).toBeGreaterThan(0);
        expect(isFinite(r.ratio), `non-finite ratio on random sample ${i}`).toBe(true);
      }
    }
  });
});
