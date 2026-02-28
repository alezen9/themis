import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildFullCheckAuditReport,
  renderFullCheckAuditMarkdown,
  type CalculatorParityCase,
  type MatrixBenchmarkFixture,
} from "../src";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const benchDir = path.resolve(__dirname, "../benchmarks/ec3");
const parityPath = path.resolve(__dirname, "../benchmarks/ec3-calculator-parity/case-01-eurocodeapplied-ipe200.json");
const reportJsonPath = path.resolve(benchDir, "full-check-ultra-strict-report.json");
const reportMdPath = path.resolve(benchDir, "full-check-ultra-strict-report.md");

const loadMatrixFixtures = (): MatrixBenchmarkFixture[] =>
  fs.readdirSync(benchDir)
    .filter((name) => /^\d{2}-uls-.*\.json$/.test(name))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(benchDir, name), "utf8")) as MatrixBenchmarkFixture);

describe("full check ultra-strict report drift", () => {
  it("matches committed JSON + Markdown report artifacts", () => {
    const report = buildFullCheckAuditReport({
      matrixFixtures: loadMatrixFixtures(),
      parityCase: JSON.parse(fs.readFileSync(parityPath, "utf8")) as CalculatorParityCase,
    });
    const expectedJson = `${JSON.stringify(report, null, 2)}\n`;
    const expectedMd = renderFullCheckAuditMarkdown(report);

    expect(fs.existsSync(reportJsonPath)).toBe(true);
    expect(fs.existsSync(reportMdPath)).toBe(true);
    expect(fs.readFileSync(reportJsonPath, "utf8")).toBe(expectedJson);
    expect(fs.readFileSync(reportMdPath, "utf8")).toBe(expectedMd);
  });
});
