import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@ndg/ndg-core";
import { ec3Verifications } from "../src/verifications";

type CheckExpectation = {
  checkId: number;
  expected:
    | { outcome: "ok"; intermediates?: Record<string, number> }
    | { outcome: "not_applicable" };
};

type ParityCase = {
  engineInputs: Record<string, number | string>;
  annexCoefficients: Record<string, number>;
  checks: CheckExpectation[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, "../benchmarks/ec3-calculator-parity/case-01-eurocodeapplied-ipe200.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as ParityCase;

const assertClose = (actual: number, expected: number) => {
  const tol = Math.max(1e-6, 1e-2 * Math.max(1, Math.abs(expected)));
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol);
};

describe("calculator parity intermediates", () => {
  for (const c of fixture.checks) {
    if (c.expected.outcome !== "ok" || !c.expected.intermediates) continue;

    it(`check ${c.checkId} intermediates`, () => {
      const def = ec3Verifications[c.checkId - 1];
      const annex = { id: "calculator-parity", coefficients: fixture.annexCoefficients };
      const r = evaluate(def, { inputs: fixture.engineInputs, annex });

      for (const [key, expected] of Object.entries(c.expected.intermediates)) {
        assertClose(Number(r.cache[key]), expected);
      }
    });
  }
});
