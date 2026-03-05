import { describe, expect, it } from "vitest";
import { computeChsClass } from "./computeChsClass";

describe("computeChsClass", () => {
  it("returns class 1 when d/t is below the class 1 tubular limit", () => {
    const sectionClass = computeChsClass({
      sectionShape: "CHS",
      yieldStrength: 235,
      diameter: 99.8,
      wallThickness: 2,
    });

    expect(sectionClass).toBe(1);
  });

  it("returns class 2 when d/t is between class 1 and class 2 limits", () => {
    const sectionClass = computeChsClass({
      sectionShape: "CHS",
      yieldStrength: 235,
      diameter: 120,
      wallThickness: 2,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 when d/t is between class 2 and class 3 limits", () => {
    const sectionClass = computeChsClass({
      sectionShape: "CHS",
      yieldStrength: 235,
      diameter: 160,
      wallThickness: 2,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 4 when d/t is above the class 3 tubular limit", () => {
    const sectionClass = computeChsClass({
      sectionShape: "CHS",
      yieldStrength: 235,
      diameter: 190,
      wallThickness: 2,
    });

    expect(sectionClass).toBe(4);
  });

  it("returns the same class for mixed load when geometry and fy are unchanged", () => {
    const sectionClass = computeChsClass({
      sectionShape: "CHS",
      yieldStrength: 235,
      diameter: 120,
      wallThickness: 2,
      crossSectionArea: 500,
      elasticSectionModulusY: 20_000,
      elasticSectionModulusZ: 20_000,
      axialForceEd: -250_000,
      bendingMomentYEd: 10_000_000,
      bendingMomentZEd: -7_000_000,
    });

    expect(sectionClass).toBe(2);
  });
});
