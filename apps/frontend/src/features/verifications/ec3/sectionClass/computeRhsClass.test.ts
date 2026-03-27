import { describe, expect, it } from "vitest";
import { computeRhsClass } from "./computeRhsClass";

describe("computeRhsClass", () => {
  it("returns class 2 in uniform compression when governing wall is between 33ε and 38ε", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 110,
      width: 70,
      wallThickness: 3,
      innerRadius: 1.5,
      crossSectionArea: 1000,
      elasticSectionModulusY: 25_000,
      elasticSectionModulusZ: 15_000,
      axialForceEd: -100_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for a mixed wall stress case with intermediate psi", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 630,
      width: 120,
      wallThickness: 10,
      innerRadius: 5,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: -25_000,
      bendingMomentYEd: -75_000,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 1 for depth wall slenderness just below 33ε in uniform compression", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 359,
      width: 120,
      wallThickness: 10,
      innerRadius: 5,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: -50_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(1);
  });

  it("returns class 2 for depth wall slenderness just above 33ε in uniform compression", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 364,
      width: 120,
      wallThickness: 10,
      innerRadius: 5,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: -50_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for depth wall slenderness just above 38ε in uniform compression", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 414,
      width: 120,
      wallThickness: 10,
      innerRadius: 5,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: -50_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 4 when one wall governs above class-3 limit", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 100,
      width: 500,
      wallThickness: 10,
      innerRadius: 5,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: -50_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(4);
  });

  it("uses explicit inner radius when computing flat width c", () => {
    const sectionClass = computeRhsClass({
      sectionShape: "RHS",
      yieldStrength: 235,
      depth: 370,
      width: 120,
      wallThickness: 10,
      innerRadius: 20,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: -50_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(1);
  });
});
