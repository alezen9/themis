import { describe, expect, it } from "vitest";
import { evaluateCondition } from "./evaluate-condition";

const conditionContext = { x: 5, same_x: 5, limit: 6, label: "hello" };

describe("evaluateCondition", () => {
  it("evaluates equality against literal and key operands", () => {
    expect(
      evaluateCondition({ eq: ["x", { value: 5 }] }, conditionContext),
    ).toBe(true);
    expect(
      evaluateCondition({ eq: ["x", { key: "same_x" }] }, conditionContext),
    ).toBe(true);
    expect(
      evaluateCondition({ eq: ["x", { value: 6 }] }, conditionContext),
    ).toBe(false);
  });

  it("evaluates numeric comparisons against literals and keys", () => {
    expect(
      evaluateCondition({ lt: ["x", { value: 6 }] }, conditionContext),
    ).toBe(true);
    expect(
      evaluateCondition({ lte: ["x", { key: "same_x" }] }, conditionContext),
    ).toBe(true);
    expect(
      evaluateCondition({ gt: ["limit", { key: "x" }] }, conditionContext),
    ).toBe(true);
    expect(
      evaluateCondition({ gte: ["limit", { value: 6 }] }, conditionContext),
    ).toBe(true);
  });

  it("evaluates nested and/or trees", () => {
    expect(
      evaluateCondition(
        {
          and: [
            { gt: ["x", { value: 3 }] },
            {
              or: [
                { eq: ["label", { value: "bye" }] },
                { eq: ["label", { value: "hello" }] },
              ],
            },
          ],
        },
        conditionContext,
      ),
    ).toBe(true);

    expect(
      evaluateCondition(
        {
          and: [
            { eq: ["x", { value: 1 }] },
            { eq: ["label", { value: "hello" }] },
          ],
        },
        conditionContext,
      ),
    ).toBe(false);
  });

  it("throws when a referenced key is missing", () => {
    expect(() =>
      evaluateCondition(
        { eq: ["missing_key", { value: 5 }] },
        conditionContext,
      ),
    ).toThrow(/undefined context key/);
  });

  it("throws when a numeric comparison resolves a non-number", () => {
    expect(() =>
      evaluateCondition({ gt: ["label", { value: 1 }] }, conditionContext),
    ).toThrow(/must resolve to a number/);
  });
});
