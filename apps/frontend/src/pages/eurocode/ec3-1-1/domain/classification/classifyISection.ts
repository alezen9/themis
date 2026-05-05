import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { classifyOutstandPart } from "./classifyOutstandPart";
import { max } from "./utils";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed" | "M_y_Ed" | "M_z_Ed">;
type FabricationType = Ec3FormValues["fabrication_type"];

export const classifyISection = (
  section_id: string,
  i_geometry: Geometry,
  fy: number,
  fabrication_type: FabricationType,
  actions: Actions,
) => {
  const { N_Ed, M_y_Ed, M_z_Ed } = actions;
  const { h, b, tw, tf, r } = i_geometry;
  const { A, Wel_y, Wel_z } = computeSectionProperties({
    shape: "I",
    section_id,
    i_geometry,
  });

  const epsilon = Math.sqrt(235 / fy);
  const webHeight = Math.max(h - 2 * tf - 2 * r, 0);
  const webSlenderness = webHeight / tw;
  const flangeOutstand = Math.max((b - tw - 2 * r) / 2, 0);
  const flangeSlenderness = flangeOutstand / tf;

  const axialCompression = -N_Ed / A;
  const yBendingCompression = -M_y_Ed / Wel_y;
  const zBendingTipCompression = -M_z_Ed / Wel_z;
  const webToTipRatio = Math.min((tw + 2 * r) / b, 1);
  const zBendingWebCompression = zBendingTipCompression * webToTipRatio;

  const topStress = axialCompression + yBendingCompression;
  const bottomStress = axialCompression - yBendingCompression;

  const webClass = classifyInternalPart({
    slenderness: webSlenderness,
    epsilon,
    fy,
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
