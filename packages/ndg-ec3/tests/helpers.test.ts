import { describe, it, expect } from "vitest";
import { computeChi, computeChiLT } from "../src/helpers/reduction-factors";
import {
  computeKyy,
  computeKzz,
  computeKyzMethod1,
  computeKzyMethod1,
  computeKzyMethod2,
} from "../src/helpers/interaction-factors";

// ── computeChi (§6.3.1.2) ──

describe("computeChi", () => {
  // Reference: IPE200, S355, E=210000
  const A = 2848;
  const fy = 355;
  const E = 210_000;
  const Iy = 19_430_000;
  const alpha = 0.21; // curve a

  it("returns 1.0 for stocky member (very short Lcr)", () => {
    // Lcr so small that lambda_bar << 0.2 → chi = 1.0
    const chi = computeChi(A, fy, E, Iy, 100, alpha);
    expect(chi).toBe(1);
  });

  it("returns chi < 1 for slender member", () => {
    const chi = computeChi(A, fy, E, Iy, 5000, alpha);
    expect(chi).toBeLessThan(1);
    expect(chi).toBeGreaterThan(0);
  });

  it("decreases with increasing Lcr", () => {
    const chi3000 = computeChi(A, fy, E, Iy, 3000, alpha);
    const chi6000 = computeChi(A, fy, E, Iy, 6000, alpha);
    expect(chi6000).toBeLessThan(chi3000);
  });

  it("decreases with higher imperfection factor", () => {
    const chiA = computeChi(A, fy, E, Iy, 4000, 0.21); // curve a
    const chiB = computeChi(A, fy, E, Iy, 4000, 0.34); // curve b
    const chiC = computeChi(A, fy, E, Iy, 4000, 0.49); // curve c
    expect(chiB).toBeLessThan(chiA);
    expect(chiC).toBeLessThan(chiB);
  });

  it("matches hand calculation for known values", () => {
    // Lcr=3000, IPE200 strong axis
    const Ncr = (Math.PI ** 2 * E * Iy) / 3000 ** 2;
    const lb = Math.sqrt((A * fy) / Ncr);
    const phi = 0.5 * (1 + alpha * (lb - 0.2) + lb ** 2);
    const expected = Math.min(1, 1 / (phi + Math.sqrt(phi ** 2 - lb ** 2)));
    expect(computeChi(A, fy, E, Iy, 3000, alpha)).toBeCloseTo(expected, 10);
  });

  it("is always capped at 1.0", () => {
    // Even with alpha=0, chi ≤ 1
    const chi = computeChi(A, fy, E, Iy, 500, 0);
    expect(chi).toBeLessThanOrEqual(1);
  });

  it("throws when Lcr = 0", () => {
    expect(() => computeChi(A, fy, E, Iy, 0, alpha)).toThrow("Lcr must be > 0");
  });
});

// ── computeChiLT (§6.3.2.3) ──

describe("computeChiLT", () => {
  const Wpl_y = 220_600;
  const fy = 355;
  const alpha_LT = 0.34;
  const lLT0 = 0.4;
  const betaLT = 0.75;

  it("returns 1.0 when M_cr is very large (stocky beam)", () => {
    // Very large M_cr → lambda_bar_LT ≈ 0 → chi_LT = 1.0
    const chi = computeChiLT(Wpl_y, fy, 1e15, alpha_LT, lLT0, betaLT);
    expect(chi).toBe(1);
  });

  it("returns chi_LT < 1 for moderate M_cr", () => {
    const chi = computeChiLT(Wpl_y, fy, 100_000_000, alpha_LT, lLT0, betaLT);
    expect(chi).toBeLessThan(1);
    expect(chi).toBeGreaterThan(0);
  });

  it("decreases with decreasing M_cr", () => {
    const chi_high = computeChiLT(Wpl_y, fy, 200_000_000, alpha_LT, lLT0, betaLT);
    const chi_low = computeChiLT(Wpl_y, fy, 50_000_000, alpha_LT, lLT0, betaLT);
    expect(chi_low).toBeLessThan(chi_high);
  });

  it("is bounded by 1/lambda_bar_LT² cap", () => {
    // For very slender beams, chi_LT is capped at 1/lambda²
    const M_cr = 20_000_000; // low → high slenderness
    const chi = computeChiLT(Wpl_y, fy, M_cr, alpha_LT, lLT0, betaLT);
    const lb = Math.sqrt((Wpl_y * fy) / M_cr);
    expect(chi).toBeLessThanOrEqual(1 / lb ** 2 + 1e-10); // small tolerance
  });

  it("matches hand calculation", () => {
    const M_cr = 100_000_000;
    const lb = Math.sqrt((Wpl_y * fy) / M_cr);
    const phi = 0.5 * (1 + alpha_LT * (lb - lLT0) + betaLT * lb ** 2);
    const val = 1 / (phi + Math.sqrt(phi ** 2 - betaLT * lb ** 2));
    const expected = Math.min(1, Math.min(val, 1 / lb ** 2));
    expect(computeChiLT(Wpl_y, fy, M_cr, alpha_LT, lLT0, betaLT)).toBeCloseTo(expected, 10);
  });

  it("throws when M_cr = 0", () => {
    expect(() => computeChiLT(Wpl_y, fy, 0, alpha_LT, lLT0, betaLT)).toThrow("M_cr must be > 0");
  });

  it("throws when M_cr < 0", () => {
    expect(() => computeChiLT(Wpl_y, fy, -100, alpha_LT, lLT0, betaLT)).toThrow("M_cr must be > 0");
  });
});

// ── k-factor helpers (§6.3.3, Annex B Table B.1) ──

describe("computeKyy", () => {
  it("returns Cm_y when N_Ed = 0 (no axial force)", () => {
    expect(computeKyy(0.9, 1.0, 0, 1_000_000)).toBeCloseTo(0.9, 10);
  });

  it("increases with axial force ratio", () => {
    const k_low = computeKyy(0.9, 1.0, 100_000, 1_000_000);
    const k_high = computeKyy(0.9, 1.0, 500_000, 1_000_000);
    expect(k_high).toBeGreaterThan(k_low);
  });

  it("is bounded by Cm_y*(1+0.8*n) cap", () => {
    // Very high lambda_bar_y should hit the cap
    const Cm_y = 0.9;
    const lambda_bar_y = 5.0;
    const N_Ed = 800_000;
    const NbyRd = 1_000_000;
    const n = N_Ed / NbyRd;
    const k = computeKyy(Cm_y, lambda_bar_y, N_Ed, NbyRd);
    expect(k).toBeLessThanOrEqual(Cm_y * (1 + 0.8 * n) + 1e-10);
  });

  it("handles negative N_Ed (uses absolute value)", () => {
    const k_pos = computeKyy(0.9, 1.0, 200_000, 1_000_000);
    const k_neg = computeKyy(0.9, 1.0, -200_000, 1_000_000);
    expect(k_neg).toBeCloseTo(k_pos, 10);
  });

  it("throws when NbyRd ≤ 0", () => {
    expect(() => computeKyy(0.9, 1.0, 100_000, 0)).toThrow("NbyRd must be > 0");
    expect(() => computeKyy(0.9, 1.0, 100_000, -1)).toThrow("NbyRd must be > 0");
  });
});

describe("computeKzz", () => {
  it("returns Cm_z when N_Ed = 0", () => {
    expect(computeKzz(0.9, 1.0, 0, 1_000_000)).toBeCloseTo(0.9, 10);
  });

  it("increases with axial force ratio", () => {
    const k_low = computeKzz(0.9, 1.0, 100_000, 1_000_000);
    const k_high = computeKzz(0.9, 1.0, 500_000, 1_000_000);
    expect(k_high).toBeGreaterThan(k_low);
  });

  it("is bounded by Cm_z*(1+1.4*n) cap", () => {
    const Cm_z = 0.9;
    const lambda_bar_z = 5.0;
    const N_Ed = 800_000;
    const NbzRd = 1_000_000;
    const n = N_Ed / NbzRd;
    const k = computeKzz(Cm_z, lambda_bar_z, N_Ed, NbzRd);
    expect(k).toBeLessThanOrEqual(Cm_z * (1 + 1.4 * n) + 1e-10);
  });

  it("throws when NbzRd ≤ 0", () => {
    expect(() => computeKzz(0.9, 1.0, 100_000, 0)).toThrow("NbzRd must be > 0");
  });
});

describe("computeKyzMethod1 / computeKzyMethod1", () => {
  it("k_yz = 0.6 * k_zz", () => {
    expect(computeKyzMethod1(1.5)).toBeCloseTo(0.9, 10);
  });

  it("k_zy = 0.6 * k_yy", () => {
    expect(computeKzyMethod1(1.2)).toBeCloseTo(0.72, 10);
  });
});

describe("computeKzyMethod2", () => {
  it("returns ≈1 when N_Ed = 0 (λ̄_z ≥ 0.4 branch)", () => {
    const k = computeKzyMethod2(0.9, 1.0, 0, 1_000_000);
    expect(k).toBeCloseTo(1.0, 10);
  });

  it("decreases with axial force for λ̄_z ≥ 0.4 (stabilizing effect)", () => {
    const k_low = computeKzyMethod2(0.9, 1.0, 100_000, 1_000_000);
    const k_high = computeKzyMethod2(0.9, 1.0, 500_000, 1_000_000);
    expect(k_high).toBeLessThan(k_low);
  });

  it("λ̄_z ≥ 0.4 branch: uses max of two terms with min(λ̄_z,1.0) cap (eq. 133)", () => {
    // lambda_bar_z = 0.8 (≥ 0.4, ≤ 1.0 so cap has no effect here)
    const Cm_LT = 0.9;
    const lambda_bar_z = 0.8;
    const N_Ed = 300_000;
    const NbzRd = 1_000_000;
    const n = Math.abs(N_Ed) / NbzRd;
    const CmLT_term = Cm_LT - 0.25;
    const t1 = 1 - (0.1 * lambda_bar_z / CmLT_term) * n;
    const t2 = 1 - (0.1 / CmLT_term) * n;
    expect(computeKzyMethod2(Cm_LT, lambda_bar_z, N_Ed, NbzRd)).toBeCloseTo(Math.max(t1, t2), 10);
  });

  it("λ̄_z ≥ 0.4 branch: min(λ̄_z,1.0) cap applied when λ̄_z > 1.0 (eq. 133)", () => {
    const Cm_LT = 0.9;
    const N_Ed = 300_000;
    const NbzRd = 1_000_000;
    const n = Math.abs(N_Ed) / NbzRd;
    const CmLT_term = Cm_LT - 0.25;
    // Both λ̄_z = 1.5 and λ̄_z = 2.0 should give same result (capped at 1.0)
    const k15 = computeKzyMethod2(Cm_LT, 1.5, N_Ed, NbzRd);
    const k20 = computeKzyMethod2(Cm_LT, 2.0, N_Ed, NbzRd);
    expect(k15).toBeCloseTo(k20, 10);
    // And equals the λ̄_z = 1.0 result
    const t1 = 1 - (0.1 * 1.0 / CmLT_term) * n;
    const t2 = 1 - (0.1 / CmLT_term) * n;
    expect(k15).toBeCloseTo(Math.max(t1, t2), 10);
  });

  it("λ̄_z < 0.4 branch: lower bound is 0.6 + λ̄_z (eq. 132)", () => {
    const Cm_LT = 0.9;
    const lambda_bar_z = 0.2;
    const N_Ed = 0; // zero axial → formula gives 1.0, but lower bound 0.6+0.2=0.8 → max = 1.0
    const k = computeKzyMethod2(Cm_LT, lambda_bar_z, N_Ed, 1_000_000);
    expect(k).toBeGreaterThanOrEqual(0.6 + lambda_bar_z);
  });

  it("λ̄_z < 0.4 branch: lower bound 0.6+λ̄_z governs under high axial force (eq. 132)", () => {
    // High axial → formula term goes low → lower bound 0.6+0.3=0.9 governs
    const Cm_LT = 0.9;
    const lambda_bar_z = 0.3;
    const N_Ed = 900_000;
    const NbzRd = 1_000_000;
    const k = computeKzyMethod2(Cm_LT, lambda_bar_z, N_Ed, NbzRd);
    expect(k).toBeGreaterThanOrEqual(0.6 + lambda_bar_z - 1e-10);
  });

  it("throws when NbzRd ≤ 0", () => {
    expect(() => computeKzyMethod2(0.9, 1.0, 100_000, 0)).toThrow("NbzRd must be > 0");
  });

  it("throws when Cm_LT = 0.25 (division by zero)", () => {
    expect(() => computeKzyMethod2(0.25, 1.0, 100_000, 1_000_000)).toThrow("Cm_LT = 0.25");
  });
});
