import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@ndg/ndg-core";
import { ec3Verifications } from "../src/verifications";
import { toEc3VerificationFailure } from "../src/errors";

type ExpectedOk = {
  outcome: "ok";
  ratio: number;
  display: string;
  tolerance?: number;
  intermediates?: Record<string, number>;
};

type ExpectedNa = {
  outcome: "not_applicable";
  type: string;
  display: "N/A";
};

type CheckExpectation = {
  checkId: number;
  verification: string;
  expected: ExpectedOk | ExpectedNa;
};

type ParityCase = {
  id: string;
  engineInputs: Record<string, number | string>;
  annexCoefficients: Record<string, number>;
  checks: CheckExpectation[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, "../benchmarks/ec3-calculator-parity/case-01-eurocodeapplied-ipe200.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as ParityCase;

const assertClose = (actual: number, expected: number, tol: number) => {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol);
};

describe("calculator parity conformance", () => {
  it("has 22 expectations", () => {
    expect(fixture.checks).toHaveLength(22);
  });

  for (const c of fixture.checks) {
    it(`check ${c.checkId} (${c.verification})`, () => {
      const def = ec3Verifications[c.checkId - 1];
      const annex = { id: "calculator-parity", coefficients: fixture.annexCoefficients };

      if (c.expected.outcome === "ok") {
        const r = evaluate(def, { inputs: fixture.engineInputs, annex });
        assertClose(r.ratio, c.expected.ratio, c.expected.tolerance ?? 1e-3);
        return;
      }

      try {
        evaluate(def, { inputs: fixture.engineInputs, annex });
        throw new Error("expected evaluation to throw");
      } catch (error) {
        const failure = toEc3VerificationFailure(error);
        expect(failure.type).toBe(c.expected.type);
      }
    });
  }
});
