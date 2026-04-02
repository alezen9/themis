import { describe, expect, it } from "vitest";
import { computeBucklingProperties } from "../buckling/buckling";
import { computeSectionProperties } from "./sectionProperties";

describe("computeSectionProperties", () => {
  it("uses rolled buckling curves for predefined-style I input", () => {
    const properties = computeBucklingProperties({
      shape: "I",
      fabricationType: "rolled",
      h: 300,
      b: 100,
      tw: 6,
      tf: 10,
      r: 8,
    });

    expect(properties.buckling_curve_y).toBe("a");
    expect(properties.buckling_curve_z).toBe("b");
  });

  it("uses welded buckling curves for custom I input", () => {
    const properties = computeBucklingProperties({
      shape: "I",
      fabricationType: "welded",
      h: 300,
      b: 100,
      tw: 6,
      tf: 10,
      r: 8,
    });

    expect(properties.buckling_curve_y).toBe("b");
    expect(properties.buckling_curve_z).toBe("c");
  });

  it("switches RHS buckling curves by fabrication type", () => {
    const rolled = computeBucklingProperties({
      shape: "RHS",
      fabricationType: "rolled",
      h: 200,
      b: 100,
      tw: 8,
      ro: 12,
      ri: 8,
    });
    const welded = computeBucklingProperties({
      shape: "RHS",
      fabricationType: "welded",
      h: 200,
      b: 100,
      tw: 8,
      ro: 12,
      ri: 8,
    });

    expect(rolled.buckling_curve_y).toBe("a");
    expect(rolled.buckling_curve_z).toBe("a");
    expect(welded.buckling_curve_y).toBe("b");
    expect(welded.buckling_curve_z).toBe("b");
  });

  it("uses RHS inner and outer corner radii in custom area calculation", () => {
    const tighterCorners = computeSectionProperties({
      shape: "RHS",
      fabricationType: "rolled",
      h: 200,
      b: 100,
      tw: 8,
      ro: 10,
      ri: 6,
    });
    const widerCorners = computeSectionProperties({
      shape: "RHS",
      fabricationType: "rolled",
      h: 200,
      b: 100,
      tw: 8,
      ro: 16,
      ri: 12,
    });

    expect(widerCorners.A).toBeLessThan(tighterCorners.A);
  });

  it("computes section properties directly from geometry inputs", () => {
    const h = 200;
    const b = 100;
    const tw = 8;
    const ro = 12;
    const ri = 8;
    const hi = h - 2 * tw;
    const bi = b - 2 * tw;
    const expectedIy = (b * h ** 3 - bi * hi ** 3) / 12;

    const properties = computeSectionProperties({
      shape: "RHS",
      fabricationType: "rolled",
      h,
      b,
      tw,
      ro,
      ri,
    });

    expect(properties.Iy).toBeCloseTo(expectedIy, 6);
    expect(properties.Av_y).toBeCloseTo((properties.A * b) / (b + h), 6);
  });

  it("sets non-applicable geometric fields to zero", () => {
    const chs = computeSectionProperties({
      shape: "CHS",
      fabricationType: "rolled",
      d: 200,
      t: 8,
    });
    const rhs = computeSectionProperties({
      shape: "RHS",
      fabricationType: "rolled",
      h: 200,
      b: 120,
      tw: 8,
      ro: 12,
      ri: 8,
    });

    expect(chs.tw).toBe(0);
    expect(chs.hw).toBe(0);
    expect(chs.h).toBe(0);
    expect(chs.b).toBe(0);
    expect(chs.tf).toBe(0);

    expect(rhs.tf).toBe(0);
    expect(rhs.t).toBe(0);
    expect(rhs.d).toBe(0);
  });
});
