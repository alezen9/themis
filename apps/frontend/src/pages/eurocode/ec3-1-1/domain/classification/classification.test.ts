import { describe, expect, it } from "vitest";
import { circularSections } from "../../data/circularSections";
import { flangedSections } from "../../data/flangedSections";
import { hollowSections } from "../../data/hollowSections";
import { classifyInternalPart } from "./classifyInternalPart";
import { classifyOutstandPart } from "./classifyOutstandPart";
import { classifySection } from "./classifySection";
import {
  computeCompressionFraction,
  solvePlasticCompressionState,
} from "./plasticCompression";
import { createRectangle } from "./utils";

describe("classifyInternalPart", () => {
  it("applies internal pure compression limits", () => {
    expect(
      classifyInternalPart({
        slenderness: 33,
        epsilon: 1,
        fy_MPa: 235,
        alpha: 1,
        psi: 1,
        compressionStress_MPa: 235,
        tensionStress_MPa: 0,
      }),
    ).toBe(1);

    expect(
      classifyInternalPart({
        slenderness: 39,
        epsilon: 1,
        fy_MPa: 235,
        alpha: 1,
        psi: 1,
        compressionStress_MPa: 235,
        tensionStress_MPa: 0,
      }),
    ).toBe(3);
  });

  it("applies internal pure bending limits", () => {
    expect(
      classifyInternalPart({
        slenderness: 83,
        epsilon: 1,
        fy_MPa: 235,
        alpha: 0.5,
        psi: -1,
        compressionStress_MPa: 235,
        tensionStress_MPa: 235,
      }),
    ).toBe(2);

    expect(
      classifyInternalPart({
        slenderness: 124,
        epsilon: 1,
        fy_MPa: 235,
        alpha: 0.5,
        psi: -1,
        compressionStress_MPa: 235,
        tensionStress_MPa: 235,
      }),
    ).toBe(3);
  });
});

describe("classifyOutstandPart", () => {
  it("applies rolled outstand compression limits", () => {
    expect(
      classifyOutstandPart({
        slenderness: 10,
        epsilon: 1,
        fabrication_type: "rolled",
        alpha: 1,
        plasticTipInCompression: true,
        elasticPsi: 1,
        elasticTipInCompression: true,
      }),
    ).toBe(2);
  });

  it("uses the welded tip-in-tension Class 1 and 2 denominator", () => {
    expect(
      classifyOutstandPart({
        slenderness: 50,
        epsilon: 1,
        fabrication_type: "welded",
        alpha: 0.25,
        plasticTipInCompression: false,
        elasticPsi: -0.5,
        elasticTipInCompression: false,
      }),
    ).toBe(1);
  });

  it("uses EN 1993-1-5 k_sigma branches for welded Class 3", () => {
    expect(
      classifyOutstandPart({
        slenderness: 15,
        epsilon: 1,
        fabrication_type: "welded",
        alpha: 1,
        plasticTipInCompression: true,
        elasticPsi: 0,
        elasticTipInCompression: true,
      }),
    ).toBe(3);

    expect(
      classifyOutstandPart({
        slenderness: 20,
        epsilon: 1,
        fabrication_type: "welded",
        alpha: 1,
        plasticTipInCompression: false,
        elasticPsi: 0,
        elasticTipInCompression: false,
      }),
    ).toBe(3);
  });
});

describe("solvePlasticCompressionState", () => {
  it("returns full compression for axial compression without bending", () => {
    const state = solvePlasticCompressionState({
      polygons: [createRectangle({ y_mm: 0, z_mm: 0 }, 100, 100)],
      fy_MPa: 235,
      N_Ed_N: -1_000,
      M_y_Ed_Nmm: 0,
      M_z_Ed_Nmm: 0,
    });

    expect(
      computeCompressionFraction(
        state,
        { y_mm: 0, z_mm: -50 },
        { y_mm: 0, z_mm: 50 },
      ),
    ).toBe(1);
  });

  it("finds half compression for pure bending", () => {
    const state = solvePlasticCompressionState({
      polygons: [createRectangle({ y_mm: 0, z_mm: 0 }, 100, 100)],
      fy_MPa: 235,
      N_Ed_N: 0,
      M_y_Ed_Nmm: 1_000,
      M_z_Ed_Nmm: 0,
    });

    expect(
      computeCompressionFraction(
        state,
        { y_mm: 0, z_mm: -50 },
        { y_mm: 0, z_mm: 50 },
      ),
    ).toBeCloseTo(0.5);
  });
});

describe("classifySection", () => {
  it("matches the IPE300 parity class", () => {
    const section = getSection(flangedSections, "IPE300");

    expect(
      classifySection({
        shape: "I",
        section_id: section.id,
        i_geometry: {
          h_mm: section.h_mm,
          b_mm: section.b_mm,
          tw_mm: section.tw_mm,
          tf_mm: section.tf_mm,
          r_mm: section.r_mm,
        },
        rhs_geometry: emptyRhsGeometry,
        chs_geometry: emptyChsGeometry,
        steel_grade_id: "EN10025-2:S235",
        fabrication_type: "rolled",
        N_Ed_kN: -3_000,
        M_y_Ed_kNm: 20,
        M_z_Ed_kNm: 0,
      }),
    ).toBe(2);
  });

  it("matches the RHS parity class", () => {
    const section = getSection(hollowSections, "RHS90x50x8");

    expect(
      classifySection({
        shape: "RHS",
        section_id: section.id,
        i_geometry: emptyIGeometry,
        rhs_geometry: {
          h_mm: section.h_mm,
          b_mm: section.b_mm,
          tw_mm: section.tw_mm,
          ri_mm: section.ri_mm,
          ro_mm: section.ro_mm,
        },
        chs_geometry: emptyChsGeometry,
        steel_grade_id: "EN10025-2:S235",
        fabrication_type: "hot-formed",
        N_Ed_kN: -30,
        M_y_Ed_kNm: 7,
        M_z_Ed_kNm: 3,
      }),
    ).toBe(1);
  });

  it("classifies CHS from the d/t limit", () => {
    const section = getSection(circularSections, "CHS323.9x6.3");

    expect(
      classifySection({
        shape: "CHS",
        section_id: section.id,
        i_geometry: emptyIGeometry,
        rhs_geometry: emptyRhsGeometry,
        chs_geometry: { d_mm: section.d_mm, t_mm: section.t_mm },
        steel_grade_id: "EN10025-2:S235",
        fabrication_type: "hot-formed",
        N_Ed_kN: -30,
        M_y_Ed_kNm: 7,
        M_z_Ed_kNm: 3,
      }),
    ).toBe(2);
  });
});

const emptyIGeometry = { h_mm: 1, b_mm: 1, tw_mm: 1, tf_mm: 1, r_mm: 1 };

const emptyRhsGeometry = { h_mm: 1, b_mm: 1, tw_mm: 1, ri_mm: 1, ro_mm: 1 };

const emptyChsGeometry = { d_mm: 1, t_mm: 1 };

const getSection = <T extends { id: string }>(sections: T[], id: string) => {
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Missing test section: ${id}`);
  return section;
};
