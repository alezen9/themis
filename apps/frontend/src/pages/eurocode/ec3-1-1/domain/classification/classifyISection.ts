import type { SteelGrade } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { classifyOutstandPart } from "./classifyOutstandPart";
import {
  computeInternalElasticState,
  computeOutstandElasticState,
} from "./elasticStress";
import {
  computeCompressionFraction,
  isCompressed,
  solvePlasticCompressionState,
} from "./plasticCompression";
import { createRectangle, max } from "./utils";

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
  const compressionStressAt = (y_mm: number, z_mm: number) =>
    -stressAt(y_mm, z_mm);
  const plasticState = solvePlasticCompressionState({
    polygons: [
      createRectangle({ y_mm: 0, z_mm: h_mm / 2 - tf_mm / 2 }, b_mm, tf_mm),
      createRectangle({ y_mm: 0, z_mm: -h_mm / 2 + tf_mm / 2 }, b_mm, tf_mm),
      createRectangle({ y_mm: 0, z_mm: 0 }, tw_mm, h_mm - 2 * tf_mm),
    ],
    fy_MPa,
    N_Ed_N,
    M_y_Ed_Nmm,
    M_z_Ed_Nmm,
  });

  const webTop = { y_mm: 0, z_mm: h_mm / 2 - tf_mm - r_mm };
  const webBottom = { y_mm: 0, z_mm: -h_mm / 2 + tf_mm + r_mm };
  const webElasticState = computeInternalElasticState({
    stressA_MPa: compressionStressAt(webTop.y_mm, webTop.z_mm),
    stressB_MPa: compressionStressAt(webBottom.y_mm, webBottom.z_mm),
  });

  const topFlangeZ_mm = h_mm / 2 - tf_mm / 2;
  const bottomFlangeZ_mm = -h_mm / 2 + tf_mm / 2;

  const webClass = classifyInternalPart({
    slenderness: webSlenderness,
    epsilon,
    fy_MPa,
    alpha: computeCompressionFraction(plasticState, webTop, webBottom),
    psi: webElasticState.psi,
    compressionStress_MPa: webElasticState.compressionStress_MPa,
    tensionStress_MPa: webElasticState.tensionStress_MPa,
  });

  const flangeClass = max(
    classifyFlangeOutstand({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      plasticState,
      compressionStressAt,
      webPoint: { y_mm: -tw_mm / 2 - r_mm, z_mm: topFlangeZ_mm },
      tipPoint: { y_mm: -b_mm / 2, z_mm: topFlangeZ_mm },
    }),
    classifyFlangeOutstand({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      plasticState,
      compressionStressAt,
      webPoint: { y_mm: tw_mm / 2 + r_mm, z_mm: topFlangeZ_mm },
      tipPoint: { y_mm: b_mm / 2, z_mm: topFlangeZ_mm },
    }),
    classifyFlangeOutstand({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      plasticState,
      compressionStressAt,
      webPoint: { y_mm: -tw_mm / 2 - r_mm, z_mm: bottomFlangeZ_mm },
      tipPoint: { y_mm: -b_mm / 2, z_mm: bottomFlangeZ_mm },
    }),
    classifyFlangeOutstand({
      slenderness: flangeSlenderness,
      epsilon,
      fabrication_type,
      plasticState,
      compressionStressAt,
      webPoint: { y_mm: tw_mm / 2 + r_mm, z_mm: bottomFlangeZ_mm },
      tipPoint: { y_mm: b_mm / 2, z_mm: bottomFlangeZ_mm },
    }),
  );

  const sectionClass = max(webClass, flangeClass);
  if (sectionClass === 4) throw new Error("Class 4 is not supported");

  return sectionClass;
};

type Point = { y_mm: number; z_mm: number };

type ClassifyFlangeOutstandInput = {
  slenderness: number;
  epsilon: number;
  fabrication_type: FabricationType;
  plasticState: Parameters<typeof computeCompressionFraction>[0];
  compressionStressAt: (y_mm: number, z_mm: number) => number;
  webPoint: Point;
  tipPoint: Point;
};

const classifyFlangeOutstand = (input: ClassifyFlangeOutstandInput) => {
  const {
    slenderness,
    epsilon,
    fabrication_type,
    plasticState,
    compressionStressAt,
    webPoint,
    tipPoint,
  } = input;
  const elasticState = computeOutstandElasticState(
    compressionStressAt(webPoint.y_mm, webPoint.z_mm),
    compressionStressAt(tipPoint.y_mm, tipPoint.z_mm),
  );

  return classifyOutstandPart({
    slenderness,
    epsilon,
    fabrication_type,
    alpha: computeCompressionFraction(plasticState, webPoint, tipPoint),
    plasticTipInCompression: isCompressed(plasticState, tipPoint),
    elasticPsi: elasticState.psi,
    elasticTipInCompression: elasticState.tipInCompression,
  });
};
