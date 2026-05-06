import type { SteelGrade } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { max } from "./utils";

type Geometry = Ec3FormValues["rhs_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm">;

export const classifyRhsSection = (
  section_id: string,
  rhs_geometry: Geometry,
  steelGrade: SteelGrade,
  actions: Actions,
) => {
  const { N_Ed_kN, M_y_Ed_kNm, M_z_Ed_kNm } = actions;
  const { h_mm, b_mm, tw_mm, ri_mm } = rhs_geometry;
  const { A_mm2, Iy_mm4, Iz_mm4 } = computeSectionProperties({
    shape: "RHS",
    section_id,
    rhs_geometry,
  });

  const fy_MPa =
    tw_mm > 40
      ? (steelGrade.fy_above_40_MPa ?? steelGrade.fy_MPa)
      : steelGrade.fy_MPa;

  const N_Ed_N = N_Ed_kN * 1_000;
  const M_y_Ed_Nmm = M_y_Ed_kNm * 1_000_000;
  const M_z_Ed_Nmm = M_z_Ed_kNm * 1_000_000;

  const epsilon = Math.sqrt(235 / fy_MPa);
  const wallDepth_mm = Math.max(h_mm - 2 * (ri_mm + tw_mm), 0);
  const wallWidth_mm = Math.max(b_mm - 2 * (ri_mm + tw_mm), 0);
  const depthSlenderness = wallDepth_mm / tw_mm;
  const widthSlenderness = wallWidth_mm / tw_mm;

  const stressAt = (y_mm: number, z_mm: number) =>
    N_Ed_N / A_mm2 +
    (M_y_Ed_Nmm * z_mm) / Iy_mm4 +
    (M_z_Ed_Nmm * y_mm) / Iz_mm4;

  const topLeftStress = stressAt(-b_mm / 2, h_mm / 2);
  const topRightStress = stressAt(b_mm / 2, h_mm / 2);
  const bottomLeftStress = stressAt(-b_mm / 2, -h_mm / 2);
  const bottomRightStress = stressAt(b_mm / 2, -h_mm / 2);

  const sectionClass = max(
    classifyInternalPart({
      slenderness: widthSlenderness,
      epsilon,
      fy_MPa,
      stressEdgeA: topLeftStress,
      stressEdgeB: topRightStress,
    }),
    classifyInternalPart({
      slenderness: widthSlenderness,
      epsilon,
      fy_MPa,
      stressEdgeA: bottomLeftStress,
      stressEdgeB: bottomRightStress,
    }),
    classifyInternalPart({
      slenderness: depthSlenderness,
      epsilon,
      fy_MPa,
      stressEdgeA: topLeftStress,
      stressEdgeB: bottomLeftStress,
    }),
    classifyInternalPart({
      slenderness: depthSlenderness,
      epsilon,
      fy_MPa,
      stressEdgeA: topRightStress,
      stressEdgeB: bottomRightStress,
    }),
  );
  if (sectionClass === 4) throw new Error("Class 4 is not supported");

  return sectionClass;
};
