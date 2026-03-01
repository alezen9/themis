import { describe, expect, it } from "vitest";
import { inferSectionClassForStandardSection } from "../src/helpers/section-class-auto";

describe("section class auto inference", () => {
  it("classifies I-sections using stress-aware branch logic", () => {
    const bendingDominant = inferSectionClassForStandardSection({
      sectionShape: "I",
      fy: 235,
      h: 300,
      b: 150,
      tw: 7.1,
      tf: 10.7,
      r: 15,
      A: 5381,
      Wel_y: 557067,
      Wel_z: 80507,
      N_Ed: -100_000,
      M_y_Ed: 50_000_000,
      M_z_Ed: 10_000_000,
    });
    expect(bendingDominant).toBe(1);

    const compressionDominant = inferSectionClassForStandardSection({
      sectionShape: "I",
      fy: 235,
      h: 300,
      b: 150,
      tw: 7.1,
      tf: 10.7,
      r: 15,
      A: 5381,
      Wel_y: 557067,
      Wel_z: 80507,
      N_Ed: -400_000,
      M_y_Ed: 0,
      M_z_Ed: 0,
    });
    expect(compressionDominant).toBe(2);
  });

  it("classifies RHS sections with compression vs bending envelopes", () => {
    const compact = inferSectionClassForStandardSection({
      sectionShape: "RHS",
      fy: 235,
      h: 200,
      b: 100,
      tw: 6,
      A: 3000,
      Wel_y: 200000,
      Wel_z: 100000,
      N_Ed: -300_000,
      M_y_Ed: 0,
      M_z_Ed: 0,
    });
    expect(compact).toBeLessThanOrEqual(2);

    const slender = inferSectionClassForStandardSection({
      sectionShape: "RHS",
      fy: 235,
      h: 300,
      b: 150,
      tw: 3,
      A: 2500,
      Wel_y: 200000,
      Wel_z: 120000,
      N_Ed: -100_000,
      M_y_Ed: 20_000_000,
      M_z_Ed: 5_000_000,
    });
    expect(slender).toBeGreaterThanOrEqual(3);
  });

  it("classifies CHS sections with shell slenderness limits", () => {
    const compact = inferSectionClassForStandardSection({
      sectionShape: "CHS",
      fy: 235,
      d: 168.3,
      t: 8,
      A: 4000,
      Wel_y: 200000,
      Wel_z: 200000,
      N_Ed: -250_000,
      M_y_Ed: 0,
      M_z_Ed: 0,
    });
    expect(compact).toBe(1);

    const slender = inferSectionClassForStandardSection({
      sectionShape: "CHS",
      fy: 235,
      d: 323.9,
      t: 4,
      A: 4000,
      Wel_y: 200000,
      Wel_z: 200000,
      N_Ed: -50_000,
      M_y_Ed: 5_000_000,
      M_z_Ed: 0,
    });
    expect(slender).toBeGreaterThanOrEqual(2);
  });
});
