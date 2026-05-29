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

const getPart = (parts: Part[], label: string) => {
  const part = parts.find(item => item.label === label);
  if (!part) throw new Error(`${label} not found`);
  return part;
};

const getPartClass = (part: Part) => part.trace.length;

describe("[EC3-1-1] classifySection I", () => {
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
    expect(topLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(-24.364);
    expect(topLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(-24.364);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expect(topRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-24.364);
    expect(topRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-24.364);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(4);
    expect(web.metadata.sigma_a_MPa).toBeCloseTo(-24.364);
    expect(web.metadata.sigma_b_MPa).toBeCloseTo(-24.364);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expect(bottomLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(-24.364);
    expect(bottomLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(-24.364);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expect(bottomRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-24.364);
    expect(bottomRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-24.364);
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
    expect(topLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(15.009);
    expect(topLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(15.009);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expect(topRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(15.009);
    expect(topRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(15.009);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expect(web.metadata.sigma_a_MPa).toBeCloseTo(12.897);
    expect(web.metadata.sigma_b_MPa).toBeCloseTo(-12.897);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expect(bottomLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(-15.009);
    expect(bottomLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(-15.009);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expect(bottomRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-15.009);
    expect(bottomRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-15.009);
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
    expect(topLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(26.636);
    expect(topLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(107.693);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expect(topRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-26.636);
    expect(topRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-107.693);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expect(web.metadata.sigma_a_MPa).toBeCloseTo(0);
    expect(web.metadata.sigma_b_MPa).toBeCloseTo(0);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expect(bottomLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(26.636);
    expect(bottomLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(107.693);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expect(bottomRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-26.636);
    expect(bottomRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-107.693);
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
    expect(topLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(41.645);
    expect(topLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(122.702);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expect(topRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-11.627);
    expect(topRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-92.684);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expect(web.metadata.sigma_a_MPa).toBeCloseTo(12.897);
    expect(web.metadata.sigma_b_MPa).toBeCloseTo(-12.897);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expect(bottomLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(11.627);
    expect(bottomLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(92.684);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expect(bottomRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-41.645);
    expect(bottomRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-122.702);
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
    expect(topLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(9.972);
    expect(topLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(9.972);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expect(topRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(9.972);
    expect(topRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(9.972);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(1);
    expect(web.metadata.sigma_a_MPa).toBeCloseTo(7.861);
    expect(web.metadata.sigma_b_MPa).toBeCloseTo(-17.933);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expect(bottomLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(-20.045);
    expect(bottomLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(-20.045);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expect(bottomRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-20.045);
    expect(bottomRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-20.045);
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
    expect(topLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(21.6);
    expect(topLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(102.657);

    const topRightFlange = getPart(parts, "Top right flange");
    expect(getPartClass(topRightFlange)).toBe(1);
    expect(topRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-31.672);
    expect(topRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-112.729);

    const web = getPart(parts, "Web");
    expect(getPartClass(web)).toBe(4);
    expect(web.metadata.sigma_a_MPa).toBeCloseTo(-5.036);
    expect(web.metadata.sigma_b_MPa).toBeCloseTo(-5.036);

    const bottomLeftFlange = getPart(parts, "Bottom left flange");
    expect(getPartClass(bottomLeftFlange)).toBe(1);
    expect(bottomLeftFlange.metadata.sigma_supported_MPa).toBeCloseTo(21.6);
    expect(bottomLeftFlange.metadata.sigma_tip_MPa).toBeCloseTo(102.657);

    const bottomRightFlange = getPart(parts, "Bottom right flange");
    expect(getPartClass(bottomRightFlange)).toBe(1);
    expect(bottomRightFlange.metadata.sigma_supported_MPa).toBeCloseTo(-31.672);
    expect(bottomRightFlange.metadata.sigma_tip_MPa).toBeCloseTo(-112.729);
  });
});

describe("[EC3-1-1] classifySection RHS", () => {
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
    expect(topWall.metadata.sigma_a_MPa).toBeCloseTo(-2.335);
    expect(topWall.metadata.sigma_b_MPa).toBeCloseTo(-2.335);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(4);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expect(rightWall.metadata.sigma_a_MPa).toBeCloseTo(-2.335);
    expect(rightWall.metadata.sigma_b_MPa).toBeCloseTo(-2.335);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(2);
    expect(bottomWall.metadata.stressDistribution).toBe("compression");
    expect(bottomWall.metadata.sigma_a_MPa).toBeCloseTo(-2.335);
    expect(bottomWall.metadata.sigma_b_MPa).toBeCloseTo(-2.335);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(4);
    expect(leftWall.metadata.stressDistribution).toBe("compression");
    expect(leftWall.metadata.sigma_a_MPa).toBeCloseTo(-2.335);
    expect(leftWall.metadata.sigma_b_MPa).toBeCloseTo(-2.335);
  });

  it("computes RHS300x200x6.3 major-axis bending stresses", () => {
    const [sectionClass, parts] = classifySection({
      ...rhsSectionBaseInput,
      N_Ed_kN: 0,
      M_y_Ed_kNm: -8.67,
      M_z_Ed_kNm: 0,
    });

    expect(sectionClass).toBe(2);

    const topWall = getPart(parts, "Top wall");
    expect(getPartClass(topWall)).toBe(1);
    expect(topWall.metadata.stressDistribution).toBe("tension");
    expect(topWall.metadata.sigma_a_MPa).toBeCloseTo(16.262);
    expect(topWall.metadata.sigma_b_MPa).toBeCloseTo(16.262);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(1);
    expect(rightWall.metadata.stressDistribution).toBe("bending");
    expect(rightWall.metadata.sigma_a_MPa).toBeCloseTo(15.57);
    expect(rightWall.metadata.sigma_b_MPa).toBeCloseTo(-15.57);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(2);
    expect(bottomWall.metadata.stressDistribution).toBe("compression");
    expect(bottomWall.metadata.sigma_a_MPa).toBeCloseTo(-16.262);
    expect(bottomWall.metadata.sigma_b_MPa).toBeCloseTo(-16.262);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("bending");
    expect(leftWall.metadata.sigma_a_MPa).toBeCloseTo(15.57);
    expect(leftWall.metadata.sigma_b_MPa).toBeCloseTo(-15.57);
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
    expect(topWall.metadata.sigma_a_MPa).toBeCloseTo(18.734);
    expect(topWall.metadata.sigma_b_MPa).toBeCloseTo(-18.734);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(4);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expect(rightWall.metadata.sigma_a_MPa).toBeCloseTo(-20.026);
    expect(rightWall.metadata.sigma_b_MPa).toBeCloseTo(-20.026);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(1);
    expect(bottomWall.metadata.stressDistribution).toBe("bending");
    expect(bottomWall.metadata.sigma_a_MPa).toBeCloseTo(18.734);
    expect(bottomWall.metadata.sigma_b_MPa).toBeCloseTo(-18.734);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("tension");
    expect(leftWall.metadata.sigma_a_MPa).toBeCloseTo(20.026);
    expect(leftWall.metadata.sigma_b_MPa).toBeCloseTo(20.026);
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
    expect(topWall.metadata.stressDistribution).toBe("compression-bending");
    expect(topWall.metadata.sigma_a_MPa).toBeCloseTo(34.996);
    expect(topWall.metadata.sigma_b_MPa).toBeCloseTo(-2.471);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(3);
    expect(rightWall.metadata.stressDistribution).toBe("compression-bending");
    expect(rightWall.metadata.sigma_a_MPa).toBeCloseTo(-4.456);
    expect(rightWall.metadata.sigma_b_MPa).toBeCloseTo(-35.596);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(1);
    expect(bottomWall.metadata.stressDistribution).toBe("compression-bending");
    expect(bottomWall.metadata.sigma_a_MPa).toBeCloseTo(2.471);
    expect(bottomWall.metadata.sigma_b_MPa).toBeCloseTo(-34.996);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("tension");
    expect(leftWall.metadata.sigma_a_MPa).toBeCloseTo(35.596);
    expect(leftWall.metadata.sigma_b_MPa).toBeCloseTo(4.456);
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
    expect(topWall.metadata.sigma_a_MPa).toBeCloseTo(14.992);
    expect(topWall.metadata.sigma_b_MPa).toBeCloseTo(14.992);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(1);
    expect(rightWall.metadata.stressDistribution).toBe("compression-bending");
    expect(rightWall.metadata.sigma_a_MPa).toBeCloseTo(14.3);
    expect(rightWall.metadata.sigma_b_MPa).toBeCloseTo(-16.841);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(2);
    expect(bottomWall.metadata.stressDistribution).toBe("compression");
    expect(bottomWall.metadata.sigma_a_MPa).toBeCloseTo(-17.533);
    expect(bottomWall.metadata.sigma_b_MPa).toBeCloseTo(-17.533);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("compression-bending");
    expect(leftWall.metadata.sigma_a_MPa).toBeCloseTo(14.3);
    expect(leftWall.metadata.sigma_b_MPa).toBeCloseTo(-16.841);
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
    expect(topWall.metadata.sigma_a_MPa).toBeCloseTo(8.79);
    expect(topWall.metadata.sigma_b_MPa).toBeCloseTo(-10.052);

    const rightWall = getPart(parts, "Right wall");
    expect(getPartClass(rightWall)).toBe(4);
    expect(rightWall.metadata.stressDistribution).toBe("compression");
    expect(rightWall.metadata.sigma_a_MPa).toBeCloseTo(-10.702);
    expect(rightWall.metadata.sigma_b_MPa).toBeCloseTo(-10.702);

    const bottomWall = getPart(parts, "Bottom wall");
    expect(getPartClass(bottomWall)).toBe(1);
    expect(bottomWall.metadata.stressDistribution).toBe("compression-bending");
    expect(bottomWall.metadata.sigma_a_MPa).toBeCloseTo(8.79);
    expect(bottomWall.metadata.sigma_b_MPa).toBeCloseTo(-10.052);

    const leftWall = getPart(parts, "Left wall");
    expect(getPartClass(leftWall)).toBe(1);
    expect(leftWall.metadata.stressDistribution).toBe("tension");
    expect(leftWall.metadata.sigma_a_MPa).toBeCloseTo(9.439);
    expect(leftWall.metadata.sigma_b_MPa).toBeCloseTo(9.439);
  });
});

describe("[EC3-1-1] classifySection CHS", () => {
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
