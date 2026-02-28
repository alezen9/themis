import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluate } from "@ndg/ndg-core";
import { ec3Verifications } from "../src/verifications";
import { toEc3VerificationFailure } from "../src/errors";

type Scenario = {
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

type Fixture = {
  checkId: number;
  verification: string;
  annexCoefficients: Record<string, number>;
  scenarios: Scenario[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const benchDir = path.resolve(__dirname, "../benchmarks/ec3");

const relTol = 1e-5;
const absTol = 1e-8;

const assertClose = (actual: number, expected: number) => {
  const diff = Math.abs(actual - expected);
  const lim = Math.max(absTol, relTol * Math.max(1, Math.abs(expected)));
  expect(diff).toBeLessThanOrEqual(lim);
};

describe("independent derivation conformance", () => {
  const jsonFiles = fs.readdirSync(benchDir).filter((f) => /^\d{2}-uls-.*\.json$/.test(f)).sort();

  it("has paired markdown + json artifacts for all 22 checks", () => {
    expect(jsonFiles).toHaveLength(22);
    for (const file of jsonFiles) {
      const mdFile = file.replace(/\.json$/, ".md");
      expect(fs.existsSync(path.join(benchDir, mdFile)), `${mdFile} is missing`).toBe(true);
    }
  });

  for (const file of jsonFiles) {
    it(`${file} stays numerically conformant`, () => {
      const fixture = JSON.parse(fs.readFileSync(path.join(benchDir, file), "utf8")) as Fixture;
      const idx = fixture.checkId - 1;
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(ec3Verifications.length);
      const verification = ec3Verifications[idx];
      expect(fixture.scenarios).toHaveLength(12);

      const mdFile = file.replace(/\.json$/, ".md");
      const mdContent = fs.readFileSync(path.join(benchDir, mdFile), "utf8");

      for (const scenario of fixture.scenarios) {
        expect(mdContent).toContain(`### ${scenario.scenarioId}`);

        if (scenario.expected.outcome === "ok") {
          const result = evaluate(verification, {
            inputs: scenario.inputs,
            annex: { id: "benchmark", coefficients: fixture.annexCoefficients },
          });

          assertClose(result.ratio, scenario.expected.ratio);
          for (const [key, expected] of Object.entries(scenario.expected.intermediates)) {
            assertClose(Number(result.cache[key]), expected);
          }
          continue;
        }

        try {
          evaluate(verification, {
            inputs: scenario.inputs,
            annex: { id: "benchmark", coefficients: fixture.annexCoefficients },
          });
          throw new Error("expected evaluation to throw");
        } catch (error) {
          const failure = toEc3VerificationFailure(error);
          expect(failure.type).toBe(scenario.expected.type);
          if (scenario.expected.messageIncludes) {
            expect(failure.message ?? "").toContain(scenario.expected.messageIncludes);
          }
        }
      }
    });
  }
});
