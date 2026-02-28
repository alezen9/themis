import { describe, expect, it } from "vitest";
import { classifyOkComputation, formatUtilization } from "../src";

describe("full check ultra-strict display classification", () => {
  it("classifies rounding-only when strict ratio misses but display matches", () => {
    const expectedRatio = 0.1234;
    const actualRatio = 0.12345;

    const result = classifyOkComputation({
      ratioMismatch: {
        key: "ratio",
        expected: expectedRatio,
        actual: actualRatio,
        absDiff: Math.abs(actualRatio - expectedRatio),
        relDiff: Math.abs(actualRatio - expectedRatio) / Math.max(1, Math.abs(expectedRatio)),
        strictLimit: 1e-8,
      },
      intermediateMismatches: [],
      expectedDisplay: formatUtilization(expectedRatio),
      actualDisplay: formatUtilization(actualRatio),
    });

    expect(result.classification).toBe("rounding_only_warning");
  });

  it("classifies compute mismatch when any intermediate fails strict tolerance", () => {
    const expectedRatio = 0.1234;
    const actualRatio = 0.12345;

    const result = classifyOkComputation({
      ratioMismatch: {
        key: "ratio",
        expected: expectedRatio,
        actual: actualRatio,
        absDiff: Math.abs(actualRatio - expectedRatio),
        relDiff: Math.abs(actualRatio - expectedRatio) / Math.max(1, Math.abs(expectedRatio)),
        strictLimit: 1e-8,
      },
      intermediateMismatches: [{
        key: "M_cr",
        expected: 1_000_000,
        actual: 1_000_100,
        absDiff: 100,
        relDiff: 100 / 1_000_000,
        strictLimit: 0.01,
      }],
      expectedDisplay: formatUtilization(expectedRatio),
      actualDisplay: formatUtilization(actualRatio),
    });

    expect(result.classification).toBe("compute_mismatch");
  });
});
