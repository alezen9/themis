import { describe, expect, it } from "vitest";
import { computeISectionClassification } from "./sectionClassificationI";

describe("computeISectionClassification", () => {
  it("returns class 2 in pure compression branch when web is between 33ε and 38ε", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 300,
        b: 120,
        tw: 7.5,
        tf: 10,
        r: 0,
        N_Ed: -600_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(2);
  });

  it("returns class 2 in pure bending branch when web is between 72ε and 83ε", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 820,
        b: 120,
        tw: 10,
        tf: 10,
        r: 0,
        N_Ed: 0,
        M_y_Ed: -1_000_000,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 1_000_000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for mixed bending-compression with intermediate web psi", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 620,
        b: 120,
        tw: 10,
        tf: 10,
        r: 0,
        N_Ed: -25_000,
        M_y_Ed: -75_000,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(3);
  });

  it("returns class 1 for web slenderness just below the compression class-1 limit", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 349,
        b: 120,
        tw: 10,
        tf: 10,
        r: 0,
        N_Ed: -600_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(1);
  });

  it("returns class 2 for web slenderness just above the compression class-1 limit", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 351,
        b: 120,
        tw: 10,
        tf: 10,
        r: 0,
        N_Ed: -600_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(2);
  });

  it("returns class 3 for web slenderness just above the compression class-2 limit", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 401,
        b: 120,
        tw: 10,
        tf: 10,
        r: 0,
        N_Ed: -600_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(3);
  });

  it("returns class 3 for flange slenderness just above 10ε", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 220,
        b: 222,
        tw: 20,
        tf: 10,
        r: 0,
        N_Ed: -600_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(3);
  });

  it("returns class 4 for flange slenderness just above 14ε", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 220,
        b: 302,
        tw: 20,
        tf: 10,
        r: 0,
        N_Ed: -600_000,
        M_y_Ed: 0,
        M_z_Ed: 0,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 0 },
    );

    expect(sectionClass).toBe(4);
  });

  it("uses the psi <= -1 internal-part class-3 branch for web classification", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 1720,
        b: 120,
        tw: 10,
        tf: 20,
        r: 0,
        N_Ed: 10_000,
        M_y_Ed: -20_000,
        M_z_Ed: 0,
      },
      { A: 1000, Wel_y: 1000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(3);
  });

  it("keeps flange compression detection active when only minor-axis bending causes compression", () => {
    const sectionClass = computeISectionClassification(
      {
        shape: "I",
        fy: 235,
        h: 220,
        b: 302,
        tw: 20,
        tf: 10,
        r: 0,
        N_Ed: 0,
        M_y_Ed: 0,
        M_z_Ed: -50_000,
      },
      { A: 6000, Wel_y: 500000, Wel_z: 1000 },
    );

    expect(sectionClass).toBe(4);
  });
});
