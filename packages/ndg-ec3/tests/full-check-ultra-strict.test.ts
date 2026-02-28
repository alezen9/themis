import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildFullCheckAuditReport,
  type CalculatorParityCase,
  type MatrixBenchmarkFixture,
} from "../src";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matrixDir = path.resolve(__dirname, "../benchmarks/ec3");
const parityPath = path.resolve(__dirname, "../benchmarks/ec3-calculator-parity/case-01-eurocodeapplied-ipe200.json");

const loadMatrixFixtures = (): MatrixBenchmarkFixture[] =>
  fs.readdirSync(matrixDir)
    .filter((name) => /^\d{2}-uls-.*\.json$/.test(name))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(matrixDir, name), "utf8")) as MatrixBenchmarkFixture);

const loadParityCase = (): CalculatorParityCase =>
  JSON.parse(fs.readFileSync(parityPath, "utf8")) as CalculatorParityCase;

describe("full check ultra-strict audit", () => {
  it("covers all rows and has no hard mismatches", () => {
    const report = buildFullCheckAuditReport({
      matrixFixtures: loadMatrixFixtures(),
      parityCase: loadParityCase(),
    });

    expect(report.coverage.matrix.fixtureCount).toBe(22);
    expect(report.coverage.matrix.scenarioCount).toBe(264);
    expect(report.coverage.calculatorParity.checkCount).toBe(22);
    expect(report.summary.totalRows).toBe(286);

    expect(report.summary.computeMismatchCount).toBe(0);
    expect(report.summary.applicabilityMismatchCount).toBe(0);
    expect(report.summary.roundingOnlyWarningCount).toBeGreaterThanOrEqual(0);
  });
});
