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

const getPartClass = (part: Part) => part.trace.length;

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
      N_Ed_kN: -131.1,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(4);

    const topLeftFlange = getPart(parts, "Top left flange");
    expect(getPartClass(topLeftFlange)).toBe(1);
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, -24.357);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, -24.357);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expectStress(topRightFlange.metadata.sigma_supported_MPa, -24.357);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -24.357);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(4);
    expectStress(web.metadata.sigma_a_MPa, -24.357);
    expectStress(web.metadata.sigma_b_MPa, -24.357);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, -24.357);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, -24.357);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -24.357);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -24.357);
  });

  it("computes IPE300 major-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(1);

    const topLeftFlange = getPart(parts, "Top left flange");
    expect(getPartClass(topLeftFlange)).toBe(1);
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 15.554);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 15.554);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expectStress(topRightFlange.metadata.sigma_supported_MPa, 15.554);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, 15.554);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expectStress(web.metadata.sigma_a_MPa, 12.889);
    expectStress(web.metadata.sigma_b_MPa, -12.889);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, -15.554);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, -15.554);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -15.554);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -15.554);
  });

  it("computes IPE300 minor-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: -8.67,
    });

    expect(sectionClass).toBe(1);

    const topLeftFlange = getPart(parts, "Top left flange");
    expect(getPartClass(topLeftFlange)).toBe(1);
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 26.064);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 107.656);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expectStress(topRightFlange.metadata.sigma_supported_MPa, -26.064);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -107.656);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expectStress(web.metadata.sigma_a_MPa, 0.728);
    expectStress(web.metadata.sigma_b_MPa, 0.728);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, 26.064);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, 107.656);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -26.064);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -107.656);
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
    expect(getPartClass(topLeftFlange)).toBe(1);
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 41.623);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 123.203);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expectStress(topRightFlange.metadata.sigma_supported_MPa, -11.625);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -92.076);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expectStress(web.metadata.sigma_a_MPa, 13.625);
    expectStress(web.metadata.sigma_b_MPa, -12.169);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, 11.625);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, 92.076);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -41.623);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -123.203);
  });

  it("computes IPE300 axial and major-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: -27.1,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(1);

    const topLeftFlange = getPart(parts, "Top left flange");
    expect(getPartClass(topLeftFlange)).toBe(1);
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 10.522);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 10.522);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expectStress(topRightFlange.metadata.sigma_supported_MPa, 10.522);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, 10.522);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expectStress(web.metadata.sigma_a_MPa, 7.857);
    expectStress(web.metadata.sigma_b_MPa, -17.926);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, -20.592);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, -20.592);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -20.592);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -20.592);
  });

  it("computes IPE300 axial and minor-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...iSectionBaseInput,
      N_Ed_kN: -27.1,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: -8.67,
    });

    expect(sectionClass).toBe(4);

    const topLeftFlange = getPart(parts, "Top left flange");
    expect(getPartClass(topLeftFlange)).toBe(1);
    expectStress(topLeftFlange.metadata.sigma_supported_MPa, 21.067);
    expectStress(topLeftFlange.metadata.sigma_tip_MPa, 102.778);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expectStress(topRightFlange.metadata.sigma_supported_MPa, -31.672);
    expectStress(topRightFlange.metadata.sigma_tip_MPa, -112.847);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(4);
    expectStress(web.metadata.sigma_a_MPa, -4.306);
    expectStress(web.metadata.sigma_b_MPa, -4.306);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expectStress(bottomLeftFlange.metadata.sigma_supported_MPa, 21.067);
    expectStress(bottomLeftFlange.metadata.sigma_tip_MPa, 102.778);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expectStress(bottomRightFlange.metadata.sigma_supported_MPa, -31.672);
    expectStress(bottomRightFlange.metadata.sigma_tip_MPa, -112.847);
  });
});

describe("classifySection RHS", () => {
  it("computes RHS300x200x6.3 uniform compression stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: -14.24,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(4);

    const topWall = getPart(parts, "Top wall");
    expect(getPartClass(topWall)).toBe(2);
    expect(topWall.metadata.stressDistribution).toBe("compression");
    expectStress(topWall.metadata.sigma_a_MPa, -2.356);
    expectStress(topWall.metadata.sigma_b_MPa, -2.356);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(4);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expectStress(rightWall.metadata.sigma_a_MPa, -2.356);
    expectStress(rightWall.metadata.sigma_b_MPa, -2.356);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(2);
    expect(bottomWall.metadata.stressDistribution).toBe("compression");
    expectStress(bottomWall.metadata.sigma_a_MPa, -2.356);
    expectStress(bottomWall.metadata.sigma_b_MPa, -2.356);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(4);
    expect(leftWall.metadata.stressDistribution).toBe("compression");
    expectStress(leftWall.metadata.sigma_a_MPa, -2.356);
    expectStress(leftWall.metadata.sigma_b_MPa, -2.356);
  });

  it("computes RHS300x200x6.3 major-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(1);

    const topWall = getPart(parts, "Top wall");
    expect(getPartClass(topWall)).toBe(1);
    expect(topWall.metadata.stressDistribution).toBe("tension");
    expectStress(topWall.metadata.sigma_a_MPa, 16.607);
    expectStress(topWall.metadata.sigma_b_MPa, 16.607);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(1);
    expect(rightWall.metadata.stressDistribution).toBe("bending");
    expectStress(rightWall.metadata.sigma_a_MPa, 16.607);
    expectStress(rightWall.metadata.sigma_b_MPa, -15.56);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(1);
    expect(bottomWall.metadata.stressDistribution).toBe("compression");
    expectStress(bottomWall.metadata.sigma_a_MPa, -15.56);
    expectStress(bottomWall.metadata.sigma_b_MPa, -15.56);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("bending");
    expectStress(leftWall.metadata.sigma_a_MPa, 16.607);
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
    expect(getPartClass(topWall)).toBe(1);
    expect(topWall.metadata.stressDistribution).toBe("bending");
    expectStress(topWall.metadata.sigma_a_MPa, 18.716);
    expectStress(topWall.metadata.sigma_b_MPa, -18.716);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(4);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expectStress(rightWall.metadata.sigma_a_MPa, -18.716);
    expectStress(rightWall.metadata.sigma_b_MPa, -20.669);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(1);
    expect(bottomWall.metadata.stressDistribution).toBe("bending");
    expectStress(bottomWall.metadata.sigma_a_MPa, 20.669);
    expectStress(bottomWall.metadata.sigma_b_MPa, -20.669);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("tension");
    expectStress(leftWall.metadata.sigma_a_MPa, 18.716);
    expectStress(leftWall.metadata.sigma_b_MPa, 20.669);
  });

  it("computes RHS300x200x6.3 combined bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: -8.67,
    });

    expect(sectionClass).toBe(3);

    const topWall = getPart(parts, "Top wall");
    expect(getPartClass(topWall)).toBe(1);
    expect(topWall.metadata.stressDistribution).toBe("bending");
    expectStress(topWall.metadata.sigma_a_MPa, 35.323);
    expectStress(topWall.metadata.sigma_b_MPa, -2.109);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(3);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expectStress(rightWall.metadata.sigma_a_MPa, -2.109);
    expectStress(rightWall.metadata.sigma_b_MPa, -36.23);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(2);
    expect(bottomWall.metadata.stressDistribution).toBe("bending");
    expectStress(bottomWall.metadata.sigma_a_MPa, 5.109);
    expectStress(bottomWall.metadata.sigma_b_MPa, -36.23);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("tension");
    expectStress(leftWall.metadata.sigma_a_MPa, 35.323);
    expectStress(leftWall.metadata.sigma_b_MPa, 5.109);
  });

  it("computes RHS300x200x6.3 axial and major-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: -7.75,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(2);

    const topWall = getPart(parts, "Top wall");
    expect(getPartClass(topWall)).toBe(1);
    expect(topWall.metadata.stressDistribution).toBe("tension");
    expectStress(topWall.metadata.sigma_a_MPa, 15.337);
    expectStress(topWall.metadata.sigma_b_MPa, 15.337);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(1);
    expect(rightWall.metadata.stressDistribution).toBe("compression-bending");
    expectStress(rightWall.metadata.sigma_a_MPa, 15.337);
    expectStress(rightWall.metadata.sigma_b_MPa, -16.831);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(2);
    expect(bottomWall.metadata.stressDistribution).toBe("compression");
    expectStress(bottomWall.metadata.sigma_a_MPa, -16.831);
    expectStress(bottomWall.metadata.sigma_b_MPa, -16.831);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("compression-bending");
    expectStress(leftWall.metadata.sigma_a_MPa, 15.337);
    expectStress(leftWall.metadata.sigma_b_MPa, -16.831);
  });

  it("computes RHS300x200x6.3 axial and minor-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: -3.85,
      M_y_Ed_kNm: 0,
      M_z_Ed_kNm: -4.36,
    });

    expect(sectionClass).toBe(4);

    const topWall = getPart(parts, "Top wall");
    expect(getPartClass(topWall)).toBe(1);
    expect(topWall.metadata.stressDistribution).toBe("compression-bending");
    expectStress(topWall.metadata.sigma_a_MPa, 8.728);
    expectStress(topWall.metadata.sigma_b_MPa, -9.909);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(4);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expectStress(rightWall.metadata.sigma_a_MPa, -9.909);
    expectStress(rightWall.metadata.sigma_b_MPa, -10.966);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(1);
    expect(bottomWall.metadata.stressDistribution).toBe("compression-bending");
    expectStress(bottomWall.metadata.sigma_a_MPa, 9.705);
    expectStress(bottomWall.metadata.sigma_b_MPa, -10.966);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("tension");
    expectStress(leftWall.metadata.sigma_a_MPa, 8.728);
    expectStress(leftWall.metadata.sigma_b_MPa, 9.705);
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
    expect(getPartClass(tube)).toBe(1);
  });
});
