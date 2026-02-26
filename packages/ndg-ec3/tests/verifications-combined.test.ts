import { describe, it, expect } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { combinedVerifications } from "../src/verifications";

const annex = { id: "eurocode", coefficients: { gamma_M0: 1.0 } };

// Common inputs for an IPE100-like section (tw=4.1, hw=100-2*5.7=88.6)
const inputs: Record<string, number | string> = {
  M_y_Ed: 2_000_000,
  M_z_Ed: 500_000,
  N_Ed: 50_000,
  V_z_Ed: 10_000,
  V_y_Ed: 5_000,
  A: 1032,
  Wpl_y: 39_410,
  Wpl_z: 9_146,
  Av_z: 508,
  Av_y: 627,
  tw: 4.1,
  hw: 88.6,
  section_shape: "I",
  fy: 355,
};

describe("§6.2.8–6.2.10 combined verifications", () => {
  it("contains 8 verifications", () => {
    expect(combinedVerifications).toHaveLength(8);
  });

  it("all evaluate successfully with valid inputs", () => {
    for (const def of combinedVerifications) {
      const r = evaluate(def, { inputs, annex });
      expect(r.ratio).toBeGreaterThanOrEqual(0);
      expect(typeof r.passed).toBe("boolean");
      expect(r.trace.length).toBeGreaterThan(0);
    }
  });

  it("bending-y-shear: no reduction when V < 0.5·Vpl (rho=0, M_y_V_Rd = W_pl,y·fy)", () => {
    // V_z_Ed = 10_000, V_pl_z_Rd = 508*355/√3 ≈ 104_150 → ratio = 0.096 < 0.5
    const r = evaluate(combinedVerifications[0], { inputs, annex });
    expect(r.cache.rho_z).toBe(0);
    // When rho=0, eq (6.30): M_y_V_Rd = (Wpl_y - 0·…)·fy/γM0 = Wpl_y·fy
    expect(r.cache.M_y_V_Rd).toBeCloseTo(39_410 * 355, 0);
  });

  it("bending-y-shear: applies eq (6.30) reduction when V > 0.5·Vpl", () => {
    const highShear = { ...inputs, V_z_Ed: 80_000 };
    const r = evaluate(combinedVerifications[0], { inputs: highShear, annex });
    expect(r.cache.rho_z).toBeGreaterThan(0);
    // eq (6.30): M_y_V_Rd = (Wpl_y - rho*Av_z²/(4*tw))*fy < Wpl_y*fy
    expect(r.cache.M_y_V_Rd).toBeLessThan(39_410 * 355);
    // Verify it equals the expected formula value
    const rho = r.cache.rho_z as number;
    const expected = (39_410 - rho * 508 ** 2 / (4 * 4.1)) * 355;
    expect(r.cache.M_y_V_Rd).toBeCloseTo(expected, 1);
  });

  it("biaxial-axial I-section: alpha=2, beta=max(1,5n)", () => {
    const r = evaluate(combinedVerifications[4], { inputs, annex });
    expect(r.cache.alpha_biax).toBe(2);
    const n = Math.abs(50_000) / (1032 * 355);
    expect(r.cache.beta_biax).toBeCloseTo(Math.max(1, 5 * n), 6);
  });

  it("biaxial-axial CHS: alpha=2, beta=2", () => {
    const r = evaluate(combinedVerifications[4], {
      inputs: { ...inputs, section_shape: "CHS" },
      annex,
    });
    expect(r.cache.alpha_biax).toBe(2);
    expect(r.cache.beta_biax).toBe(2);
  });

  it("biaxial-axial RHS: alpha=beta=1.66/(1-1.13n²) ≤ 6", () => {
    const r = evaluate(combinedVerifications[4], {
      inputs: { ...inputs, section_shape: "RHS" },
      annex,
    });
    const n = Math.abs(50_000) / (1032 * 355);
    const expected = Math.min(1.66 / (1 - 1.13 * n ** 2), 6);
    expect(r.cache.alpha_biax).toBeCloseTo(expected, 6);
    expect(r.cache.beta_biax).toBeCloseTo(expected, 6);
  });
});
