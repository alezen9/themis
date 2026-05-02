import { describe, expect, it } from "vitest";
import { computeChsSectionClassification } from "./sectionClassificationChs";

describe("computeChsSectionClassification", () => {
  it("returns class 1 when d/t is below the class 1 tubular limit", () => {
    const sectionClass = computeChsSectionClassification({
      shape: "CHS",
      fy: 235,
      d: 99.8,
      t: 2,
    });

    expect(sectionClass).toBe(1);
  });

  it("returns class 2 when d/t is between class 1 and class 2 limits", () => {
    const sectionClass = computeChsSectionClassification({
      shape: "CHS",
      fy: 235,
      d: 120,
      t: 2,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 when d/t is between class 2 and class 3 limits", () => {
    const sectionClass = computeChsSectionClassification({
      shape: "CHS",
      fy: 235,
      d: 160,
      t: 2,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 4 when d/t is above the class 3 tubular limit", () => {
    const sectionClass = computeChsSectionClassification({
      shape: "CHS",
      fy: 235,
      d: 190,
      t: 2,
    });

    expect(sectionClass).toBe(4);
  });

  it("returns the same class for mixed load when geometry and fy are unchanged", () => {
    const sectionClass = computeChsSectionClassification({
      shape: "CHS",
      fy: 235,
      d: 120,
      t: 2,
      N_Ed: -250_000,
      M_y_Ed: 10_000_000,
      M_z_Ed: -7_000_000,
    });

    expect(sectionClass).toBe(2);
  });
});
