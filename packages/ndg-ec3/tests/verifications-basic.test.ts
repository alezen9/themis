import { describe, it, expect } from "vitest";
import { evaluate } from "@ndg/ndg-core";
import type { EvaluationContext } from "@ndg/ndg-core";
import {
  ulsTension,
  ulsCompression,
  ulsBendingY,
  ulsBendingZ,
  ulsShearZ,
  ulsShearY,
  basicVerifications,
} from "../src/verifications";

const annex = { id: "eurocode", coefficients: { gamma_M0: 1.0 } };

describe("§6.2.3 ulsTension", () => {
  it("passes for low tensile force", () => {
    const ctx: EvaluationContext = {
      inputs: { N_Ed: 100_000, A: 1032, fy: 355 },
      annex,
    };
    const r = evaluate(ulsTension, ctx);
    expect(r.ratio).toBeCloseTo(100_000 / (1032 * 355), 6);
    expect(r.passed).toBe(true);
  });

  it("fails when force exceeds resistance", () => {
    const r = evaluate(ulsTension, {
      inputs: { N_Ed: 500_000, A: 1032, fy: 355 },
      annex,
    });
    expect(r.passed).toBe(false);
  });
});

describe("§6.2.4 ulsCompression", () => {
  it("computes correct ratio", () => {
    const r = evaluate(ulsCompression, {
      inputs: { N_Ed: 200_000, A: 1032, fy: 355 },
      annex,
    });
    expect(r.ratio).toBeCloseTo(200_000 / (1032 * 355), 6);
    expect(r.passed).toBe(true);
  });
});

describe("§6.2.5 ulsBendingY", () => {
  it("computes correct ratio", () => {
    const r = evaluate(ulsBendingY, {
      inputs: { M_y_Ed: 5_000_000, Wpl_y: 39410, fy: 355 },
      annex,
    });
    const McRd = 39410 * 355;
    expect(r.ratio).toBeCloseTo(5_000_000 / McRd, 6);
    expect(r.passed).toBe(true);
  });
});

describe("§6.2.5 ulsBendingZ", () => {
  it("computes correct ratio", () => {
    const r = evaluate(ulsBendingZ, {
      inputs: { M_z_Ed: 1_000_000, Wpl_z: 9146000, fy: 355 },
      annex,
    });
    const McRd = 9146000 * 355;
    expect(r.ratio).toBeCloseTo(1_000_000 / McRd, 6);
    expect(r.passed).toBe(true);
  });
});

describe("§6.2.6 ulsShearZ", () => {
  it("computes correct ratio", () => {
    const r = evaluate(ulsShearZ, {
      inputs: { V_z_Ed: 50_000, Av_z: 508, fy: 355 },
      annex,
    });
    const VplRd = 508 * (355 / Math.sqrt(3));
    expect(r.ratio).toBeCloseTo(50_000 / VplRd, 6);
    expect(r.passed).toBe(true);
  });
});

describe("§6.2.6 ulsShearY", () => {
  it("computes correct ratio", () => {
    const r = evaluate(ulsShearY, {
      inputs: { V_y_Ed: 30_000, Av_y: 627, fy: 355 },
      annex,
    });
    const VplRd = 627 * (355 / Math.sqrt(3));
    expect(r.ratio).toBeCloseTo(30_000 / VplRd, 6);
    expect(r.passed).toBe(true);
  });
});

describe("basicVerifications array", () => {
  it("contains 6 verifications", () => {
    expect(basicVerifications).toHaveLength(6);
  });

  it("all evaluate successfully with valid inputs", () => {
    const inputs: Record<string, number> = {
      N_Ed: 100_000,
      A: 1032,
      fy: 355,
      M_y_Ed: 1_000_000,
      M_z_Ed: 500_000,
      Wpl_y: 39410,
      Wpl_z: 9146000,
      V_z_Ed: 20_000,
      V_y_Ed: 10_000,
      Av_z: 508,
      Av_y: 627,
    };

    for (const def of basicVerifications) {
      const r = evaluate(def, { inputs, annex });
      expect(r.ratio).toBeGreaterThanOrEqual(0);
      expect(typeof r.passed).toBe("boolean");
      expect(r.trace.length).toBeGreaterThan(0);
    }
  });
});
