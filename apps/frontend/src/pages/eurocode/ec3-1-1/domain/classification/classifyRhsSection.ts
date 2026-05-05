import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { max } from "./utils";

type Geometry = Ec3FormValues["rhs_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed" | "M_y_Ed" | "M_z_Ed">;

export const classifyRhsSection = (
  section_id: string,
  rhs_geometry: Geometry,
  fy: number,
  actions: Actions,
) => {
  const { N_Ed, M_y_Ed, M_z_Ed } = actions;
  const { h, b, tw, ri } = rhs_geometry;
  const { A, Wel_y, Wel_z } = computeSectionProperties({
    shape: "RHS",
    section_id,
    rhs_geometry,
  });

  const epsilon = Math.sqrt(235 / fy);
  const wallDepth = Math.max(h - 2 * (ri + tw), 0);
  const wallWidth = Math.max(b - 2 * (ri + tw), 0);
  const depthSlenderness = wallDepth / tw;
  const widthSlenderness = wallWidth / tw;

  const axialCompression = -N_Ed / A;
  const yBendingCompression = -M_y_Ed / Wel_y;
  const zBendingCompression = -M_z_Ed / Wel_z;

  const topLeftStress =
    axialCompression + yBendingCompression - zBendingCompression;
  const topRightStress =
    axialCompression + yBendingCompression + zBendingCompression;
  const bottomLeftStress =
    axialCompression - yBendingCompression - zBendingCompression;
  const bottomRightStress =
    axialCompression - yBendingCompression + zBendingCompression;

  const sectionClass = max(
    classifyInternalPart({
      slenderness: widthSlenderness,
      epsilon,
      fy,
      stressEdgeA: topLeftStress,
      stressEdgeB: topRightStress,
    }),
    classifyInternalPart({
      slenderness: widthSlenderness,
      epsilon,
      fy,
      stressEdgeA: bottomLeftStress,
      stressEdgeB: bottomRightStress,
    }),
    classifyInternalPart({
      slenderness: depthSlenderness,
      epsilon,
      fy,
      stressEdgeA: topLeftStress,
      stressEdgeB: bottomLeftStress,
    }),
    classifyInternalPart({
      slenderness: depthSlenderness,
      epsilon,
      fy,
      stressEdgeA: topRightStress,
      stressEdgeB: bottomRightStress,
    }),
  );
  if (sectionClass === 4) throw new Error("Class 4 is not supported");

  return sectionClass;
};
