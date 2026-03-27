import { describe, expect, it } from "vitest";
import { computeIShapeClass } from "./computeIShapeClass";

describe("computeIShapeClass", () => {
  it("returns class 2 in pure compression branch when web is between 33ε and 38ε", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 300,
      width: 120,
      webThickness: 7.5,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      axialForceEd: -600_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 2 in pure bending branch when web is between 72ε and 83ε", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 820,
      width: 120,
      webThickness: 10,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 1_000_000,
      axialForceEd: 0,
      bendingMomentYEd: -1_000_000,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for mixed bending-compression with intermediate web psi", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 620,
      width: 120,
      webThickness: 10,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      axialForceEd: -25_000,
      bendingMomentYEd: -75_000,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 1 for web slenderness just below the compression class-1 limit", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 349,
      width: 120,
      webThickness: 10,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      axialForceEd: -600_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(1);
  });

  it("returns class 2 for web slenderness just above the compression class-1 limit", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 351,
      width: 120,
      webThickness: 10,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      axialForceEd: -600_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for web slenderness just above the compression class-2 limit", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 401,
      width: 120,
      webThickness: 10,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      axialForceEd: -600_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 3 for flange slenderness just above 10ε", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 220,
      width: 222,
      webThickness: 20,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      axialForceEd: -600_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(3);
  });

  it("returns class 4 for flange slenderness just above 14ε", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 220,
      width: 302,
      webThickness: 20,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      axialForceEd: -600_000,
      bendingMomentYEd: 0,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(4);
  });

  it("uses the psi <= -1 internal-part class-3 branch for web classification", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 1720,
      width: 120,
      webThickness: 10,
      flangeThickness: 20,
      rootRadius: 0,
      crossSectionArea: 1000,
      elasticSectionModulusY: 1000,
      elasticSectionModulusZ: 1000,
      axialForceEd: 10_000,
      bendingMomentYEd: -20_000,
      bendingMomentZEd: 0,
    });

    expect(sectionClass).toBe(3);
  });

  it("keeps flange compression detection active when only minor-axis bending causes compression", () => {
    const sectionClass = computeIShapeClass({
      sectionShape: "I",
      yieldStrength: 235,
      depth: 220,
      width: 302,
      webThickness: 20,
      flangeThickness: 10,
      rootRadius: 0,
      crossSectionArea: 6000,
      elasticSectionModulusY: 500000,
      elasticSectionModulusZ: 1000,
      axialForceEd: 0,
      bendingMomentYEd: 0,
      bendingMomentZEd: -50_000,
    });

    expect(sectionClass).toBe(4);
  });
});
