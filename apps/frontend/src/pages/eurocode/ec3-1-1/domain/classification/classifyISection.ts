import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { classifyOutstandPart } from "./classifyOutstandPart";
import { max } from "./utils";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm">;
type FabricationType = Ec3FormValues["fabrication_type"];

export const classifyISection = (
  section_id: string,
  i_geometry: Geometry,
  fy_MPa: number,
  fabrication_type: FabricationType,
  actions: Actions,
) => {
  const { N_Ed_kN, M_y_Ed_kNm, M_z_Ed_kNm } = actions;
  const { h_mm, b_mm, tw_mm, tf_mm, r_mm } = i_geometry;
  const { A_mm2, Wel_y_mm3, Wel_z_mm3 } = computeSectionProperties({
    shape: "I",
    section_id,
    i_geometry,
  });

  const N_Ed_N = N_Ed_kN * 1_000;
  const M_y_Ed_Nmm = M_y_Ed_kNm * 1_000_000;
  const M_z_Ed_Nmm = M_z_Ed_kNm * 1_000_000;

  const epsilon = Math.sqrt(235 / fy_MPa);
  const webHeight_mm = Math.max(h_mm - 2 * tf_mm - 2 * r_mm, 0);
  const webSlenderness = webHeight_mm / tw_mm;
  const flangeOutstand_mm = Math.max((b_mm - tw_mm - 2 * r_mm) / 2, 0);
  const flangeSlenderness = flangeOutstand_mm / tf_mm;

  const axialCompression = -N_Ed_N / A_mm2;
  const yBendingCompression = -M_y_Ed_Nmm / Wel_y_mm3;
  const zBendingTipCompression = -M_z_Ed_Nmm / Wel_z_mm3;
  const webToTipRatio = Math.min((tw_mm + 2 * r_mm) / b_mm, 1);
  const zBendingWebCompression = zBendingTipCompression * webToTipRatio;

  const topStress = axialCompression + yBendingCompression;
  const bottomStress = axialCompression - yBendingCompression;

  const webClass = classifyInternalPart({
    slenderness: webSlenderness,
    epsilon,
    fy_MPa,
    stressEdgeA: topStress,
    stressEdgeB: bottomStress,
  });

  const flangeClass = max(
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: topStress - zBendingWebCompression,
      tipStress: topStress - zBendingTipCompression,
    }),
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: topStress + zBendingWebCompression,
      tipStress: topStress + zBendingTipCompression,
    }),
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: bottomStress - zBendingWebCompression,
      tipStress: bottomStress - zBendingTipCompression,
    }),
    classifyOutstandPart({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      webStress: bottomStress + zBendingWebCompression,
      tipStress: bottomStress + zBendingTipCompression,
    }),
  );

  const sectionClass = max(webClass, flangeClass);
  if (sectionClass === 4) throw new Error("Class 4 is not supported");

  return sectionClass;
};
