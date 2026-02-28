import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@ndg/ndg-core";
import {
  ec3Verifications,
  ulsLtb,
  ulsTorsionalBuckling,
  ulsBeamColumn61M1,
  ulsBeamColumn62M1,
  ulsBeamColumn61M2,
  ulsBeamColumn62M2,
} from "../src/verifications";
import { toEc3VerificationFailure } from "../src/errors";

type MatrixCell = {
  checkId: number;
  shape: "I" | "RHS" | "CHS";
  sectionClass: 1 | 2 | 3 | 4;
  outcome: "compute" | "not_applicable";
  failureType?: string;
};

type MatrixFixture = {
  cells: MatrixCell[];
};

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

const baseInputsByShape: Record<MatrixCell["shape"], Record<string, number | string>> = {
  I: {
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
    fy: 355,
    E: 210000,
    G: 81000,
    Iy: 19430000,
    Iz: 1424000,
    It: 69800,
    Iw: 12990000000,
    L: 3000,
    k_y: 1.0,
    k_z: 1.0,
    k_LT: 1.0,
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
  },
  RHS: {
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
    section_shape: "RHS",
    fy: 355,
    E: 210000,
    G: 81000,
    Iy: 19430000,
    Iz: 1424000,
    It: 69800,
    Iw: 12990000000,
    L: 3000,
    k_y: 1.0,
    k_z: 1.0,
    k_LT: 1.0,
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
  },
  CHS: {
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
    section_shape: "CHS",
    fy: 355,
    E: 210000,
    G: 81000,
    Iy: 19430000,
    Iz: 1424000,
    It: 69800,
    Iw: 12990000000,
    L: 3000,
    k_y: 1.0,
    k_z: 1.0,
    k_LT: 1.0,
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
  },
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.resolve(__dirname, "../benchmarks/ec3/phase-a-applicability-matrix.json");
const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8")) as MatrixFixture;

describe("applicability contract (C4)", () => {
  it("matches matrix-driven outcomes for all 264 cells", () => {
    for (const cell of matrix.cells) {
      const verification = ec3Verifications[cell.checkId - 1];
      const label = verification.nodes.at(-1)?.key ?? `check-${cell.checkId}`;
      const inputs = {
        ...baseInputsByShape[cell.shape],
        section_class: cell.sectionClass,
      };

      if (cell.outcome === "compute") {
        const result = evaluate(verification, { inputs, annex });
        expect(Number.isFinite(result.ratio), `${label}:${cell.shape}:c${cell.sectionClass}`).toBe(true);
        expect(result.ratio).toBeGreaterThanOrEqual(0);
        continue;
      }

      try {
        evaluate(verification, { inputs, annex });
        throw new Error("expected evaluation to throw");
      } catch (error) {
        const failure = toEc3VerificationFailure(error);
        expect(failure.type, `${label}:${cell.shape}:c${cell.sectionClass}`).toBe(cell.failureType);
      }
    }
  });

  it("throws deterministic explicit errors for invalid geometric/domain inputs", () => {
    const iInputs = { ...baseInputsByShape.I, section_class: 2 };
    const invalidCases = [
      [ulsLtb, { ...iInputs, k_LT: 0 }, "must be > 0"],
      [ulsTorsionalBuckling, { ...iInputs, k_z: 0 }, "must be > 0"],
      [ulsBeamColumn61M1, { ...iInputs, A: 0 }, "must be > 0"],
      [ulsBeamColumn62M1, { ...iInputs, A: 0 }, "must be > 0"],
      [ulsBeamColumn61M2, { ...iInputs, k_y: 0 }, "must be > 0"],
      [ulsBeamColumn62M2, { ...iInputs, k_z: 0 }, "must be > 0"],
    ] as const;

    for (const [def, badInputs, message] of invalidCases) {
      expect(() => evaluate(def, { inputs: badInputs, annex })).toThrow(message);
    }
  });
});
