import { describe, expect, it } from "vitest";
import { computeRhsSectionClassification } from "./sectionClassificationRhs";

describe("computeRhsSectionClassification", () => {
  it("returns class 2 in uniform compression when governing wall is between 33ε and 38ε", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 110,
        b: 70,
        tw: 3,
        ri: 1.5,
        N_Ed: -100_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 25_000, Wel_z: 15_000 },
    );

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for a mixed wall stress case with intermediate psi", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 630,
        b: 120,
        tw: 10,
        ri: 5,
        N_Ed: -25_000,
        M_y_Ed: -75_000,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(3);
  });

  it("returns class 1 for depth wall slenderness just below 33ε in uniform compression", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 359,
        b: 120,
        tw: 10,
        ri: 5,
        N_Ed: -50_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(1);
  });

  it("returns class 2 for depth wall slenderness just above 33ε in uniform compression", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 364,
        b: 120,
        tw: 10,
        ri: 5,
        N_Ed: -50_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for depth wall slenderness just above 38ε in uniform compression", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 414,
        b: 120,
        tw: 10,
        ri: 5,
        N_Ed: -50_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(3);
  });

  it("returns class 4 when one wall governs above class-3 limit", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 100,
        b: 500,
        tw: 10,
        ri: 5,
        N_Ed: -50_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(4);
  });

  it("uses explicit inner radius when computing flat width c", () => {
    const sectionClass = computeRhsSectionClassification(
      {
        shape: "RHS",
        fy: 235,
        h: 370,
        b: 120,
        tw: 10,
        ri: 20,
        N_Ed: -50_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(1);
  });
});
