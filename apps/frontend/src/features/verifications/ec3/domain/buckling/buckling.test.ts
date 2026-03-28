import { describe, expect, it } from "vitest";
import { getBucklingCurves, getImperfectionFactor } from "./buckling";

describe("getBucklingCurves", () => {
  it("uses the slender rolled I-section rule when h/b is above 1.2", () => {
    expect(
      getBucklingCurves({
        shape: "I",
        fabricationType: "rolled",
        hOverB: 1.21,
        tf: 40,
      }),
    ).toEqual({ y: "a", z: "b", lt: "b" });
  });

  it("uses the stocky rolled I-section rule when h/b is 1.2 or below", () => {
    expect(
      getBucklingCurves({
        shape: "I",
        fabricationType: "rolled",
        hOverB: 1.2,
        tf: 100,
      }),
    ).toEqual({ y: "b", z: "c", lt: "b" });
  });

  it("switches to the thicker rolled I-section rule above tf=100", () => {
    expect(
      getBucklingCurves({
        shape: "I",
        fabricationType: "rolled",
        hOverB: 1.2,
        tf: 101,
      }),
    ).toEqual({ y: "d", z: "d", lt: "b" });
  });

  it("uses welded I-section rules based on flange thickness", () => {
    expect(
      getBucklingCurves({
        shape: "I",
        fabricationType: "welded",
        hOverB: 2.4,
        tf: 40,
      }),
    ).toEqual({ y: "b", z: "c", lt: "a" });

    expect(
      getBucklingCurves({
        shape: "I",
        fabricationType: "welded",
        hOverB: 2.4,
        tf: 41,
      }),
    ).toEqual({ y: "c", z: "d", lt: "a" });
  });

  it("uses lookup-table curves for RHS and CHS", () => {
    expect(
      getBucklingCurves({ shape: "RHS", fabricationType: "rolled" }),
    ).toEqual({ y: "a", z: "a", lt: "a" });
    expect(
      getBucklingCurves({ shape: "RHS", fabricationType: "welded" }),
    ).toEqual({ y: "b", z: "b", lt: "a" });
    expect(
      getBucklingCurves({ shape: "CHS", fabricationType: "welded" }),
    ).toEqual({ y: "a", z: "a", lt: "a" });
  });
});

describe("getImperfectionFactor", () => {
  it("returns the EC3 imperfection factor for a curve", () => {
    expect(getImperfectionFactor("a")).toBe(0.21);
    expect(getImperfectionFactor("d")).toBe(0.76);
  });
});
