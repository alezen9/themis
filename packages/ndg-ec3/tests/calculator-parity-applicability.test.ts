import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@ndg/ndg-core";
import { ec3Verifications } from "../src/verifications";
import { toEc3VerificationFailure } from "../src/errors";

type CheckExpectation = {
  checkId: number;
  expected:
    | { outcome: "ok" }
    | { outcome: "not_applicable"; type: string };
};

type ParityCase = {
  engineInputs: Record<string, number | string>;
  annexCoefficients: Record<string, number>;
  checks: CheckExpectation[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, "../benchmarks/ec3-calculator-parity/case-01-eurocodeapplied-ipe200.json");
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8")) as ParityCase;

describe("calculator parity applicability", () => {
  for (const c of fixture.checks) {
    it(`check ${c.checkId} applicability`, () => {
      const def = ec3Verifications[c.checkId - 1];
      const annex = { id: "calculator-parity", coefficients: fixture.annexCoefficients };

      if (c.expected.outcome === "ok") {
        const r = evaluate(def, { inputs: fixture.engineInputs, annex });
        expect(Number.isFinite(r.ratio)).toBe(true);
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
