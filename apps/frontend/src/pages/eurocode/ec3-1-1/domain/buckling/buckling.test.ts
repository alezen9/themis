import { describe, expect, it } from "vitest";
import { getBucklingCurves } from "./buckling";

const baseInput = {
  i_geometry: { h_mm: 300, b_mm: 150, tf_mm: 40, tw_mm: 7.1, r_mm: 15 },
  steel_grade_id: "EN10025-2:S355",
  buckling_curves_LT_policy: "default-rolled-welded",
} as const;

describe("[EC3-1-1] getBucklingCurves", () => {
  it("uses EC3 Table 6.2 rolled I-section non-S460 branches", () => {
    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        i_geometry: { ...baseInput.i_geometry, h_mm: 121, b_mm: 100 },
      }),
    ).toMatchObject({ y: "a", z: "b" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        i_geometry: {
          ...baseInput.i_geometry,
          h_mm: 121,
          b_mm: 100,
          tf_mm: 41,
        },
      }),
    ).toMatchObject({ y: "b", z: "c" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        i_geometry: {
          ...baseInput.i_geometry,
          h_mm: 120,
          b_mm: 100,
          tf_mm: 100,
        },
      }),
    ).toMatchObject({ y: "b", z: "c" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        i_geometry: {
          ...baseInput.i_geometry,
          h_mm: 120,
          b_mm: 100,
          tf_mm: 101,
        },
      }),
    ).toMatchObject({ y: "d", z: "d" });
  });

  it("uses EC3 Table 6.2 rolled I-section S460 branches", () => {
    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        steel_grade_id: "EN10025-3:S460 N / NL",
        i_geometry: { ...baseInput.i_geometry, h_mm: 121, b_mm: 100 },
      }),
    ).toMatchObject({ y: "a0", z: "a0" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        steel_grade_id: "EN10025-3:S460 N / NL",
        i_geometry: {
          ...baseInput.i_geometry,
          h_mm: 121,
          b_mm: 100,
          tf_mm: 41,
        },
      }),
    ).toMatchObject({ y: "a", z: "a" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        steel_grade_id: "EN10025-3:S460 N / NL",
        i_geometry: {
          ...baseInput.i_geometry,
          h_mm: 120,
          b_mm: 100,
          tf_mm: 100,
        },
      }),
    ).toMatchObject({ y: "a", z: "a" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        steel_grade_id: "EN10025-3:S460 N / NL",
        i_geometry: {
          ...baseInput.i_geometry,
          h_mm: 120,
          b_mm: 100,
          tf_mm: 101,
        },
      }),
    ).toMatchObject({ y: "c", z: "c" });
  });

  it("uses EC3 Table 6.2 welded I-section branches", () => {
    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "welded",
      }),
    ).toMatchObject({ y: "b", z: "c" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "welded",
        i_geometry: { ...baseInput.i_geometry, tf_mm: 41 },
      }),
    ).toMatchObject({ y: "c", z: "d" });
  });

  it("uses EC3 Table 6.2 hollow hot/cold branches", () => {
    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "RHS",
        fabrication_type: "hot-formed",
      }),
    ).toMatchObject({ y: "a", z: "a" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "CHS",
        fabrication_type: "hot-formed",
        steel_grade_id: "EN10025-3:S460 N / NL",
      }),
    ).toMatchObject({ y: "a0", z: "a0" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "RHS",
        fabrication_type: "cold-formed",
        steel_grade_id: "EN10025-3:S460 N / NL",
      }),
    ).toMatchObject({ y: "c", z: "c" });
  });

  it("uses Table 6.4 for the general LT policy", () => {
    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        buckling_curves_LT_policy: "general",
        i_geometry: { ...baseInput.i_geometry, h_mm: 200, b_mm: 100 },
      }),
    ).toMatchObject({ lt: "a" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "welded",
        buckling_curves_LT_policy: "general",
        i_geometry: { ...baseInput.i_geometry, h_mm: 201, b_mm: 100 },
      }),
    ).toMatchObject({ lt: "d" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "RHS",
        fabrication_type: "hot-formed",
        buckling_curves_LT_policy: "general",
      }),
    ).toMatchObject({ lt: "d" });
  });

  it("uses Table 6.5 for the default I-section LT policy", () => {
    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        i_geometry: { ...baseInput.i_geometry, h_mm: 200, b_mm: 100 },
      }),
    ).toMatchObject({ lt: "b" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "rolled",
        i_geometry: { ...baseInput.i_geometry, h_mm: 201, b_mm: 100 },
      }),
    ).toMatchObject({ lt: "c" });

    expect(
      getBucklingCurves({
        ...baseInput,
        shape: "I",
        fabrication_type: "welded",
      }),
    ).toMatchObject({ lt: "c" });
  });
});
