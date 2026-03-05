import { describe, expect, it } from "vitest";
import { computeSectionProperties } from "./compute-section-properties";

describe("computeSectionProperties", () => {
  it("uses rolled buckling curves for predefined-style I input", () => {
    const properties = computeSectionProperties({
      shape: "I",
      fabricationType: "rolled",
      h: 300,
      b: 100,
      tw: 6,
      tf: 10,
      r: 8,
    });

    expect(properties.bucklingY).toBe("a");
    expect(properties.bucklingZ).toBe("b");
  });

  it("uses welded buckling curves for custom I input", () => {
    const properties = computeSectionProperties({
      shape: "I",
      fabricationType: "welded",
      h: 300,
      b: 100,
      tw: 6,
      tf: 10,
      r: 8,
    });

    expect(properties.bucklingY).toBe("b");
    expect(properties.bucklingZ).toBe("c");
  });

  it("switches RHS buckling curves by fabrication type", () => {
    const rolled = computeSectionProperties({
      shape: "RHS",
      fabricationType: "rolled",
      h: 200,
      b: 100,
      tw: 8,
      ro: 12,
      ri: 8,
    });
    const welded = computeSectionProperties({
      shape: "RHS",
      fabricationType: "welded",
      h: 200,
      b: 100,
      tw: 8,
      ro: 12,
      ri: 8,
    });

    expect(rolled.bucklingY).toBe("a");
    expect(rolled.bucklingZ).toBe("a");
    expect(welded.bucklingY).toBe("b");
    expect(welded.bucklingZ).toBe("b");
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

  it("prefers precomputed values when provided", () => {
    const properties = computeSectionProperties({
      shape: "I",
      fabricationType: "rolled",
      h: 300,
      b: 100,
      tw: 6,
      tf: 10,
      r: 8,
      A: 1234,
      Iy: 2345,
      Iz: 3456,
      Wpl_y: 4567,
      Wpl_z: 5678,
      It: 6789,
      Iw: 7890,
    });

    expect(properties.A).toBe(1234);
    expect(properties.Iy).toBe(2345);
    expect(properties.Iz).toBe(3456);
    expect(properties.Wpl_y).toBe(4567);
    expect(properties.Wpl_z).toBe(5678);
    expect(properties.It).toBe(6789);
    expect(properties.Iw).toBe(7890);
  });

  it("computes missing values while preserving provided precomputed ones", () => {
    const h = 200;
    const b = 100;
    const tw = 8;
    const ro = 12;
    const ri = 8;
    const providedArea = 9999;
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
      A: providedArea,
    });

    expect(properties.A).toBe(providedArea);
    expect(properties.Iy).toBeCloseTo(expectedIy, 6);
    expect(properties.Av_y).toBeCloseTo((providedArea * b) / (b + h), 6);
  });
});
