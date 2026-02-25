import { describe, it, expect } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import { combinedVerifications } from "../src/verifications";

const annex = { id: "eurocode", coefficients: { gamma_M0: 1.0 } };

// Common inputs for an IPE100-like section
const inputs: Record<string, number> = {
  M_y_Ed: 2_000_000,
  M_z_Ed: 500_000,
  N_Ed: 50_000,
  V_z_Ed: 10_000,
  V_y_Ed: 5_000,
  A: 1032,
  Wpl_y: 39410,
  Wpl_z: 9146000,
  Av_z: 508,
  Av_y: 627,
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

  it("bending-y-shear: no reduction when V < 0.5·Vpl", () => {
    // V_z_Ed = 10_000, V_pl_z_Rd = 508*355/√3 ≈ 104_150 → ratio = 0.096 < 0.5
    const r = evaluate(combinedVerifications[0], { inputs, annex });
    // rho should be 0, so M_V_y_Rd = Wpl_y * fy = 39410 * 355
    expect(r.cache.rho_z).toBe(0);
    expect(r.cache.M_V_y_Rd).toBeCloseTo(39410 * 355, 0);
  });

  it("bending-y-shear: reduces when V > 0.5·Vpl", () => {
    const highShear = { ...inputs, V_z_Ed: 80_000 };
    const r = evaluate(combinedVerifications[0], { inputs: highShear, annex });
    expect(r.cache.rho_z).toBeGreaterThan(0);
    expect(r.cache.M_V_y_Rd).toBeLessThan(39410 * 355);
  });

  it("biaxial-axial: alpha=2, beta=max(1,5n)", () => {
    const r = evaluate(combinedVerifications[4], { inputs, annex });
    expect(r.cache.alpha_biax).toBe(2);
    const n = Math.abs(50_000) / (1032 * 355);
    expect(r.cache.beta_biax).toBeCloseTo(Math.max(1, 5 * n), 6);
  });
});
