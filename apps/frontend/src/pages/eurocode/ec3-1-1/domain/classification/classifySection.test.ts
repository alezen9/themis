import { describe, expect, it } from "vitest";
import { classifySection } from "./classifySection";
import type { Part } from "./types";

const iSectionBaseInput = {
  shape: "I",
  fabrication_type: "rolled",
  section_id: "IPE300",
  steel_grade_id: "EN10025-2:S355",
  i_geometry: { h_mm: 300, b_mm: 150, tw_mm: 7.1, tf_mm: 10.7, r_mm: 15 },
  rhs_geometry: { h_mm: 0, b_mm: 0, tw_mm: 0, ri_mm: 0, ro_mm: 0 },
  chs_geometry: { d_mm: 0, t_mm: 0 },
} as const;

const rhsSectionBaseInput = {
  shape: "RHS",
  fabrication_type: "rolled",
  section_id: "RHS300x200x6.3",
  steel_grade_id: "EN10025-2:S355",
  i_geometry: { h_mm: 0, b_mm: 0, tw_mm: 0, tf_mm: 0, r_mm: 0 },
  rhs_geometry: { h_mm: 300, b_mm: 200, tw_mm: 6.3, ri_mm: 6.3, ro_mm: 9.4 },
  chs_geometry: { d_mm: 0, t_mm: 0 },
} as const;

const chsSectionBaseInput = {
  shape: "CHS",
  fabrication_type: "rolled",
  section_id: "custom",
  steel_grade_id: "EN10025-2:S355",
  i_geometry: { h_mm: 0, b_mm: 0, tw_mm: 0, tf_mm: 0, r_mm: 0 },
  rhs_geometry: { h_mm: 0, b_mm: 0, tw_mm: 0, ri_mm: 0, ro_mm: 0 },
  chs_geometry: { d_mm: 100, t_mm: 3 },
} as const;

const stressTolerance_MPa = 0.75;

const getPart = (parts: Part[], label: string) => {
  const part = parts.find((item) => item.label === label);
  if (!part) throw new Error(`${label} not found`);
  return part;
};

const expectStress = (actual: number | undefined, expected: number) => {
  expect(actual).toBeDefined();
  expect(Math.abs((actual ?? 0) - expected)).toBeLessThanOrEqual(
    stressTolerance_MPa,
  );
};

describe("classifySection I", () => {
  it("computes IPE300 uniform compression stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: -92.1,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(4);

    const topLeftFlange = getPart(parts, "Top left flange");
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, -17.111);

    const topRightFlange = getPart(parts, "Top right flange");
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -17.111);

    const web = getPart(parts, "Web");
    expectStress(web.metadata.sigma_a_MPa, -17.111);
    expectStress(web.metadata.sigma_b_MPa, -17.111);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, -17.111);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -17.111);
  });

  it("computes IPE300 major-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -2.17,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(1);

    const topLeftFlange = getPart(parts, "Top left flange");
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 3.888);

    const topRightFlange = getPart(parts, "Top right flange");
    expectStress(topRightFlange.metadata.sigma_tip_MPa, 3.888);

    const web = getPart(parts, "Web");
    expectStress(web.metadata.sigma_a_MPa, 3.222);
    expectStress(web.metadata.sigma_b_MPa, -3.222);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, -3.888);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -3.888);
  });

  it("computes IPE300 minor-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: -2.17,
    });

    expect(sectionClass).toBe(1);

    const topLeftFlange = getPart(parts, "Top left flange");
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 6.516);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 26.914);

    const topRightFlange = getPart(parts, "Top right flange");
    expectStress(topRightFlange.metadata.sigma_supported_MPa, -6.516);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -26.914);

    const web = getPart(parts, "Web");
    expect(web.metadata.stressDistribution).toBe("neutral");
    expect(web.trace[0]).toMatchObject({
      label: "Class 1",
      note: "Neutral",
      satisfied: true,
    });
    expectStress(web.metadata.sigma_a_MPa, 0);
    expectStress(web.metadata.sigma_b_MPa, 0);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, 6.516);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, 26.914);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -6.516);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -26.914);
  });

  it("computes IPE300 combined bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: -8.67,
    });

    expect(sectionClass).toBe(1);

    const topLeftFlange = getPart(parts, "Top left flange");
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 41.623);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 123.203);

    const topRightFlange = getPart(parts, "Top right flange");
    expectStress(topRightFlange.metadata.sigma_supported_MPa, -11.625);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -92.076);

    const web = getPart(parts, "Web");
    expectStress(web.metadata.sigma_a_MPa, 13.625);
    expectStress(web.metadata.sigma_b_MPa, -12.169);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, 11.625);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, 92.076);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -41.623);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -123.203);
  });
});

describe("classifySection RHS", () => {
  it("computes RHS300x200x6.3 axial and major-axis bending stresses", () => {
    const [, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: -13.99,
      M_y_Ed_kNm: -0.36,
      M_z_Ed_kNm: 0,
    });

    const topWall = getPart(parts, "Top wall");
    expectStress(topWall.metadata.sigma_a_MPa, -1.63);
    expectStress(topWall.metadata.sigma_b_MPa, -1.63);

    const rightWall = getPart(parts, "Right wall");
    expectStress(rightWall.metadata.sigma_a_MPa, -1.63);
    expectStress(rightWall.metadata.sigma_b_MPa, -2.917);

    const bottomWall = getPart(parts, "Bottom wall");
    expectStress(bottomWall.metadata.sigma_a_MPa, -2.959);
    expectStress(bottomWall.metadata.sigma_b_MPa, -2.959);

    const leftWall = getPart(parts, "Left wall");
    expectStress(leftWall.metadata.sigma_a_MPa, -1.63);
    expectStress(leftWall.metadata.sigma_b_MPa, -2.917);
  });

  it("computes RHS300x200x6.3 major-axis bending stresses", () => {
    const [, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: 0,
    });

    const topWall = getPart(parts, "Top wall");
    expectStress(topWall.metadata.sigma_a_MPa, 16.607);
    expectStress(topWall.metadata.sigma_b_MPa, 16.607);

    const rightWall = getPart(parts, "Right wall");
    expectStress(rightWall.metadata.sigma_a_MPa, 15.56);
    expectStress(rightWall.metadata.sigma_b_MPa, -15.56);

    const bottomWall = getPart(parts, "Bottom wall");
    expectStress(bottomWall.metadata.sigma_a_MPa, -16.607);
    expectStress(bottomWall.metadata.sigma_b_MPa, -16.607);

    const leftWall = getPart(parts, "Left wall");
    expectStress(leftWall.metadata.sigma_a_MPa, 15.56);
    expectStress(leftWall.metadata.sigma_b_MPa, -15.56);
  });

  it("computes RHS300x200x6.3 minor-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: -8.67,
    });

    expect(sectionClass).toBe(4);

    const topWall = getPart(parts, "Top wall");
    expectStress(topWall.metadata.sigma_a_MPa, 18.716);
    expectStress(topWall.metadata.sigma_b_MPa, -18.716);

    const rightWall = getPart(parts, "Right wall");
    expectStress(rightWall.metadata.sigma_a_MPa, -20.669);
    expectStress(rightWall.metadata.sigma_b_MPa, -20.669);

    const bottomWall = getPart(parts, "Bottom wall");
    expectStress(bottomWall.metadata.sigma_a_MPa, 18.716);
    expectStress(bottomWall.metadata.sigma_b_MPa, -18.716);

    const leftWall = getPart(parts, "Left wall");
    expectStress(leftWall.metadata.sigma_a_MPa, 20.669);
    expectStress(leftWall.metadata.sigma_b_MPa, 20.669);
  });

  it("computes RHS300x200x6.3 combined bending stresses", () => {
    const [, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: -8.67,
    });

    const topWall = getPart(parts, "Top wall");
    expectStress(topWall.metadata.sigma_a_MPa, 35.323);
    expectStress(topWall.metadata.sigma_b_MPa, -2.109);

    const rightWall = getPart(parts, "Right wall");
    expectStress(rightWall.metadata.sigma_a_MPa, -4.456);
    expectStress(rightWall.metadata.sigma_b_MPa, -36.23);

    const bottomWall = getPart(parts, "Bottom wall");
    expectStress(bottomWall.metadata.sigma_a_MPa, 2.471);
    expectStress(bottomWall.metadata.sigma_b_MPa, -34.996);

    const leftWall = getPart(parts, "Left wall");
    expectStress(leftWall.metadata.sigma_a_MPa, 35.323);
    expectStress(leftWall.metadata.sigma_b_MPa, 5.109);
  });
});

describe("classifySection CHS", () => {
  it("classifies CHS compression using diameter-to-thickness limits", () => {
    const [sectionClass, parts] = classifySection({
      ...chsSectionBaseInput,
      N_Ed_kN: -10,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(2);

    const tube = getPart(parts, "Tube");
    expect(tube.metadata.dOverT).toBeCloseTo(33.333, 3);
    expect(tube.metadata.epsilon2).toBeCloseTo(235 / 355, 12);
    expect(tube.metadata.stressDistribution).toBe("compression");
    expect(tube.trace).toEqual([
      { label: "Class 1", ratio: 100 / 3, limit: "50ε²", satisfied: false },
      { label: "Class 2", ratio: 100 / 3, limit: "70ε²", satisfied: true },
    ]);
  });

  it("classifies slender CHS compression as class 4", () => {
    const [sectionClass, parts] = classifySection({
      ...chsSectionBaseInput,
      chs_geometry: { d_mm: 300, t_mm: 3 },
      N_Ed_kN: -10,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(4);

    const tube = getPart(parts, "Tube");
    expect(tube.metadata.dOverT).toBe(100);
    expect(tube.trace.at(-1)).toMatchObject({
      label: "Class 4",
      note: "Not supported",
      satisfied: false,
    });
  });

  it("classifies CHS tension as class 1", () => {
    const [sectionClass, parts] = classifySection({
      ...chsSectionBaseInput,
      N_Ed_kN: 10,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(1);

    const tube = getPart(parts, "Tube");
    expect(tube.metadata.stressDistribution).toBe("tension");
    expect(tube.trace).toEqual([
      { label: "Class 1", satisfied: true, note: "Tension only" },
    ]);
  });
});
