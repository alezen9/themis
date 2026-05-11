import { Ec3FormValues } from "../../Form/schema";
import { computeGeometryProperties } from "../geometry/computeGeometryProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { Actions, Part, RawPart, SectionClass } from "./types";
import { maxClass } from "./utils";

type Geometry = Ec3FormValues["rhs_geometry"];

export const classifyRhsSection = (
  rhs_geometry: Geometry,
  steel_grade_id: string,
  section_id: string,
  actions: Actions,
): [SectionClass, Part[]] => {
  const geometricProperties = computeGeometryProperties({
    shape: "RHS",
    rhs_geometry,
    section_id,
  });
  const ctx = { ...geometricProperties, ...actions };

  const rawParts = decompose(rhs_geometry);
  const classifiedParts = rawParts.map((rawPart) =>
    classifyInternalPart(rawPart, steel_grade_id, ctx),
  );

  const sectionClass = maxClass(...classifiedParts.map(([c]) => c));
  const parts = classifiedParts.map(([, p]) => p);

  return [sectionClass, parts];
};

const decompose = (geometry: Geometry): RawPart[] => {
  const { h_mm, b_mm, tw_mm, ro_mm } = geometry;
  const horizontalWall_c_mm = b_mm - 2 * ro_mm;
  const verticalWall_c_mm = h_mm - 2 * ro_mm;

  return [
    {
      label: "Top wall",
      type: "internal",
      c_mm: horizontalWall_c_mm,
      t_mm: tw_mm,
      points: {
        supported: {
          y_mm: -horizontalWall_c_mm / 2,
          z_mm: h_mm / 2 - tw_mm / 2,
        },
        tip: { y_mm: horizontalWall_c_mm / 2, z_mm: h_mm / 2 - tw_mm / 2 },
      },
    },
    {
      label: "Right wall",
      type: "internal",
      c_mm: verticalWall_c_mm,
      t_mm: tw_mm,
      points: {
        supported: { y_mm: b_mm / 2 - tw_mm / 2, z_mm: verticalWall_c_mm / 2 },
        tip: { y_mm: b_mm / 2 - tw_mm / 2, z_mm: -verticalWall_c_mm / 2 },
      },
    },
    {
      label: "Bottom wall",
      type: "internal",
      c_mm: horizontalWall_c_mm,
      t_mm: tw_mm,
      points: {
        supported: {
          y_mm: -horizontalWall_c_mm / 2,
          z_mm: -h_mm / 2 + tw_mm / 2,
        },
        tip: { y_mm: horizontalWall_c_mm / 2, z_mm: -h_mm / 2 + tw_mm / 2 },
      },
    },
    {
      label: "Left wall",
      type: "internal",
      c_mm: verticalWall_c_mm,
      t_mm: tw_mm,
      points: {
        supported: { y_mm: -b_mm / 2 + tw_mm / 2, z_mm: verticalWall_c_mm / 2 },
        tip: { y_mm: -b_mm / 2 + tw_mm / 2, z_mm: -verticalWall_c_mm / 2 },
      },
    },
  ];
};
