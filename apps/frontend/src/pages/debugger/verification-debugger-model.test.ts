import { describe, expect, it } from "vitest";
import type { TraceEntry } from "@ndg/ndg-ec3";
import {
  deriveBranchStatus,
  getActivePathNodeIds,
  getDefaultSelectedCheckId,
} from "./verification-debugger-model";

describe("verification debugger model", () => {
  it("selects the first failing or erroring applicable verification by default", () => {
    expect(
      getDefaultSelectedCheckId([
        { checkId: 1, status: "passed", applicable: true },
        { checkId: 2, status: "not-applicable", applicable: false },
        { checkId: 3, status: "failed", applicable: true },
        { checkId: 4, status: "error", applicable: true },
      ]),
    ).toBe(3);

    expect(
      getDefaultSelectedCheckId([
        { checkId: 1, status: "not-applicable", applicable: false },
        { checkId: 2, status: "passed", applicable: true },
      ]),
    ).toBe(2);

    expect(
      getDefaultSelectedCheckId([
        { checkId: 8, status: "not-applicable", applicable: false },
      ]),
    ).toBe(8);
  });

  it("derives branch statuses for comparison and logical conditions", () => {
    const activeChildIds = new Set<string>();
    const conditionContext = {
      mode: "linear",
      ratio: 0.62,
      lower: 0.2,
      upper: 0.8,
    };

    expect(
      deriveBranchStatus({
        activeChildIds,
        childNodeId: "eq-child",
        condition: { eq: ["mode", { value: "uniform" }] },
        conditionContext,
        parentExecuted: true,
      }),
    ).toBe("skipped");

    expect(
      deriveBranchStatus({
        activeChildIds,
        childNodeId: "lt-child",
        condition: { lt: ["ratio", { value: 1 }] },
        conditionContext,
        parentExecuted: true,
      }),
    ).toBe("not-reached");

    expect(
      deriveBranchStatus({
        activeChildIds,
        childNodeId: "gte-child",
        condition: { gte: ["ratio", { key: "upper" }] },
        conditionContext,
        parentExecuted: true,
      }),
    ).toBe("skipped");

    expect(
      deriveBranchStatus({
        activeChildIds,
        childNodeId: "and-child",
        condition: {
          and: [
            { gt: ["ratio", { key: "lower" }] },
            { lt: ["ratio", { key: "upper" }] },
          ],
        },
        conditionContext,
        parentExecuted: true,
      }),
    ).toBe("not-reached");

    expect(
      deriveBranchStatus({
        activeChildIds,
        childNodeId: "or-child",
        condition: {
          or: [
            { eq: ["mode", { value: "parabolic" }] },
            { lte: ["ratio", { value: 0.5 }] },
          ],
        },
        conditionContext,
        parentExecuted: true,
      }),
    ).toBe("skipped");

    expect(
      deriveBranchStatus({
        activeChildIds,
        childNodeId: "unknown-child",
        condition: { eq: ["missing", { value: 1 }] },
        conditionContext,
        parentExecuted: true,
      }),
    ).toBe("unevaluated");
  });

  it("collects active path node ids from execution trace order", () => {
    const trace: TraceEntry[] = [
      {
        nodeId: "check-1",
        type: "check",
        key: "check_1",
        value: 0.82,
        children: ["derived-1"],
      },
      {
        nodeId: "derived-1",
        type: "derived",
        key: "chi_y",
        value: 0.91,
        children: [],
      },
    ];

    expect(Array.from(getActivePathNodeIds(trace))).toEqual([
      "check-1",
      "derived-1",
    ]);
  });
});
