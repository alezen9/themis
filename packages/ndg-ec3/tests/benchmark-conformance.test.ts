import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@ndg/ndg-core";
import {
  ec3Verifications,
} from "../src/verifications";
import { toEc3VerificationFailure } from "../src/errors";

type BenchmarkScenario = {
  scenarioId: string;
  inputs: Record<string, number | string>;
  expected:
    | {
      outcome: "ok";
      ratio: number;
      intermediates: Record<string, number>;
    }
    | {
      outcome: "not_applicable";
      type: string;
      messageIncludes?: string;
    };
};

type BenchmarkFixture = {
  checkId: number;
  verification: string;
  annexCoefficients: Record<string, number>;
  scenarios: BenchmarkScenario[];
};

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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const benchDir = path.resolve(__dirname, "../benchmarks/ec3");
const matrixPath = path.resolve(benchDir, "phase-a-applicability-matrix.json");

const relTol = 1e-5;
const absTol = 1e-8;

const assertClose = (actual: number, expected: number) => {
  const diff = Math.abs(actual - expected);
  const lim = Math.max(absTol, relTol * Math.max(1, Math.abs(expected)));
  expect(diff).toBeLessThanOrEqual(lim);
};

const cellKey = (checkId: number, shape: string, sectionClass: number) =>
  `${checkId}:${shape}:${sectionClass}`;

describe("benchmark conformance (C5)", () => {
  const files = fs.readdirSync(benchDir)
    .filter((f) => /^\d{2}-uls-.*\.json$/.test(f))
    .sort();
  const matrix = JSON.parse(fs.readFileSync(matrixPath, "utf8")) as MatrixFixture;
  const expectedMatrixKeys = new Set(matrix.cells.map((cell) => cellKey(cell.checkId, cell.shape, cell.sectionClass)));
  const coveredKeys = new Set<string>();

  it("contains all 22 benchmark fixtures", () => {
    expect(files).toHaveLength(22);
  });

  it("matrix source contains exactly 264 unique cells", () => {
    expect(matrix.cells).toHaveLength(264);
    expect(expectedMatrixKeys.size).toBe(264);
  });

  for (const file of files) {
    it(file, () => {
      const fixture = JSON.parse(fs.readFileSync(path.join(benchDir, file), "utf8")) as BenchmarkFixture;
      const idx = fixture.checkId - 1;
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(ec3Verifications.length);
      const def = ec3Verifications[idx];
      expect(fixture.scenarios).toHaveLength(12);
      expect(new Set(fixture.scenarios.map((scenario) => scenario.scenarioId)).size).toBe(12);

      for (const scenario of fixture.scenarios) {
        const shape = String(scenario.inputs.section_shape) as MatrixCell["shape"];
        const sectionClass = Number(scenario.inputs.section_class) as MatrixCell["sectionClass"];
        const key = cellKey(fixture.checkId, shape, sectionClass);
        const matrixCell = matrix.cells.find((cell) =>
          cell.checkId === fixture.checkId
          && cell.shape === shape
          && cell.sectionClass === sectionClass);

        expect(matrixCell, `missing matrix cell ${key}`).toBeDefined();
        coveredKeys.add(key);

        if (scenario.expected.outcome === "ok") {
          expect(matrixCell?.outcome).toBe("compute");
          const result = evaluate(def, {
            inputs: scenario.inputs,
            annex: {
              id: "benchmark",
              coefficients: fixture.annexCoefficients,
            },
          });

          assertClose(result.ratio, scenario.expected.ratio);
          for (const [cacheKey, expected] of Object.entries(scenario.expected.intermediates)) {
            const actual = Number(result.cache[cacheKey]);
            assertClose(actual, expected);
          }
          continue;
        }

        expect(matrixCell?.outcome).toBe("not_applicable");
        try {
          evaluate(def, {
            inputs: scenario.inputs,
            annex: {
              id: "benchmark",
              coefficients: fixture.annexCoefficients,
            },
          });
          throw new Error("expected evaluation to throw");
        } catch (error) {
          const failure = toEc3VerificationFailure(error);
          expect(failure.type).toBe(scenario.expected.type);
          expect(failure.type).toBe(matrixCell?.failureType);
          if (scenario.expected.messageIncludes) {
            expect(failure.message ?? "").toContain(scenario.expected.messageIncludes);
          }
        }
      }
    });
  }

  it("covers every matrix cell exactly once across fixture scenarios", () => {
    expect(coveredKeys.size).toBe(264);
    expect(coveredKeys).toEqual(expectedMatrixKeys);
  });
});
