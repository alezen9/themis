import type { SteelGrade } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { classifyOutstandPart } from "./classifyOutstandPart";
import { max } from "./utils";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm">;
type FabricationType = Extract<
  Ec3FormValues["fabrication_type"],
  "rolled" | "welded"
>;

export const classifyISection = (
  section_id: string,
  i_geometry: Geometry,
  steelGrade: SteelGrade,
  fabrication_type: FabricationType,
  actions: Actions,
) => {
  const { N_Ed_kN, M_y_Ed_kNm, M_z_Ed_kNm } = actions;
  const { h_mm, b_mm, tw_mm, tf_mm, r_mm } = i_geometry;
  const { A_mm2, Iy_mm4, Iz_mm4 } = computeSectionProperties({
    shape: "I",
    section_id,
    i_geometry,
  });

  const controllingThickness_mm = Math.max(tw_mm, tf_mm);
  const fy_MPa =
    controllingThickness_mm > 40
      ? (steelGrade.fy_above_40_MPa ?? steelGrade.fy_MPa)
      : steelGrade.fy_MPa;

  const N_Ed_N = N_Ed_kN * 1_000;
  const M_y_Ed_Nmm = M_y_Ed_kNm * 1_000_000;
  const M_z_Ed_Nmm = M_z_Ed_kNm * 1_000_000;

  const epsilon = Math.sqrt(235 / fy_MPa);
  const webHeight_mm = Math.max(h_mm - 2 * tf_mm - 2 * r_mm, 0);
  const webSlenderness = webHeight_mm / tw_mm;
  const flangeOutstand_mm = Math.max((b_mm - tw_mm - 2 * r_mm) / 2, 0);
  const flangeSlenderness = flangeOutstand_mm / tf_mm;

  const stressAt = (y_mm: number, z_mm: number) =>
    N_Ed_N / A_mm2 +
    (M_y_Ed_Nmm * z_mm) / Iy_mm4 +
    (M_z_Ed_Nmm * y_mm) / Iz_mm4;

  const webTopStress = stressAt(0, h_mm / 2 - tf_mm - r_mm);
  const webBottomStress = stressAt(0, -h_mm / 2 + tf_mm + r_mm);

  const topFlangeZ_mm = h_mm / 2 - tf_mm / 2;
  const bottomFlangeZ_mm = -h_mm / 2 + tf_mm / 2;
  const leftFreeEdgeY_mm = -b_mm / 2;
  const leftWebEdgeY_mm = -tw_mm / 2 - r_mm;
  const rightWebEdgeY_mm = tw_mm / 2 + r_mm;
  const rightFreeEdgeY_mm = b_mm / 2;

  const webClass = classifyInternalPart({
    slenderness: webSlenderness,
    epsilon,
    fy_MPa,
    stressEdgeA: webTopStress,
    stressEdgeB: webBottomStress,
  });

  const flangeClass = max(
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: stressAt(leftWebEdgeY_mm, topFlangeZ_mm),
      tipStress: stressAt(leftFreeEdgeY_mm, topFlangeZ_mm),
    }),
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: stressAt(rightWebEdgeY_mm, topFlangeZ_mm),
      tipStress: stressAt(rightFreeEdgeY_mm, topFlangeZ_mm),
    }),
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: stressAt(leftWebEdgeY_mm, bottomFlangeZ_mm),
      tipStress: stressAt(leftFreeEdgeY_mm, bottomFlangeZ_mm),
    }),
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: stressAt(rightWebEdgeY_mm, bottomFlangeZ_mm),
      tipStress: stressAt(rightFreeEdgeY_mm, bottomFlangeZ_mm),
    }),
  );

  const sectionClass = max(webClass, flangeClass);
  if (sectionClass === 4) throw new Error("Class 4 is not supported");

  return sectionClass;
};
