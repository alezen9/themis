import type { SteelGrade } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../Form/schema";
import { computeSectionProperties } from "../geometry/computeSectionProperties";
import { classifyInternalPart } from "./classifyInternalPart";
import { computeInternalElasticState } from "./elasticStress";
import {
  computeCompressionFraction,
  solvePlasticCompressionState,
} from "./plasticCompression";
import { createRectangle, max } from "./utils";

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
  const compressionStressAt = (y_mm: number, z_mm: number) =>
    -stressAt(y_mm, z_mm);
  const plasticState = solvePlasticCompressionState({
    polygons: [
      createRectangle({ y_mm: 0, z_mm: h_mm / 2 - tw_mm / 2 }, b_mm, tw_mm),
      createRectangle({ y_mm: 0, z_mm: -h_mm / 2 + tw_mm / 2 }, b_mm, tw_mm),
      createRectangle(
        { y_mm: -b_mm / 2 + tw_mm / 2, z_mm: 0 },
        tw_mm,
        h_mm - 2 * tw_mm,
      ),
      createRectangle(
        { y_mm: b_mm / 2 - tw_mm / 2, z_mm: 0 },
        tw_mm,
        h_mm - 2 * tw_mm,
      ),
    ],
    fy_MPa,
    N_Ed_N,
    M_y_Ed_Nmm,
    M_z_Ed_Nmm,
  });

  const leftTopWallPoint = {
    y_mm: -b_mm / 2 + tw_mm + ri_mm,
    z_mm: h_mm / 2 - tw_mm / 2,
  };
  const rightTopWallPoint = {
    y_mm: b_mm / 2 - tw_mm - ri_mm,
    z_mm: h_mm / 2 - tw_mm / 2,
  };
  const leftBottomWallPoint = {
    y_mm: -b_mm / 2 + tw_mm + ri_mm,
    z_mm: -h_mm / 2 + tw_mm / 2,
  };
  const rightBottomWallPoint = {
    y_mm: b_mm / 2 - tw_mm - ri_mm,
    z_mm: -h_mm / 2 + tw_mm / 2,
  };
  const topLeftWallPoint = {
    y_mm: -b_mm / 2 + tw_mm / 2,
    z_mm: h_mm / 2 - tw_mm - ri_mm,
  };
  const bottomLeftWallPoint = {
    y_mm: -b_mm / 2 + tw_mm / 2,
    z_mm: -h_mm / 2 + tw_mm + ri_mm,
  };
  const topRightWallPoint = {
    y_mm: b_mm / 2 - tw_mm / 2,
    z_mm: h_mm / 2 - tw_mm - ri_mm,
  };
  const bottomRightWallPoint = {
    y_mm: b_mm / 2 - tw_mm / 2,
    z_mm: -h_mm / 2 + tw_mm + ri_mm,
  };

  const sectionClass = max(
    classifyRhsWall({
      slenderness: widthSlenderness,
      epsilon,
      fy_MPa,
      plasticState,
      compressionStressAt,
      start: leftTopWallPoint,
      end: rightTopWallPoint,
    }),
    classifyRhsWall({
      slenderness: widthSlenderness,
      epsilon,
      fy_MPa,
      plasticState,
      compressionStressAt,
      start: leftBottomWallPoint,
      end: rightBottomWallPoint,
    }),
    classifyRhsWall({
      slenderness: depthSlenderness,
      epsilon,
      fy_MPa,
      plasticState,
      compressionStressAt,
      start: topLeftWallPoint,
      end: bottomLeftWallPoint,
    }),
    classifyRhsWall({
      slenderness: depthSlenderness,
      epsilon,
      fy_MPa,
      plasticState,
      compressionStressAt,
      start: topRightWallPoint,
      end: bottomRightWallPoint,
    }),
  );
  if (sectionClass === 4) throw new Error("Class 4 is not supported");

  return sectionClass;
};

type Point = { y_mm: number; z_mm: number };

type ClassifyRhsWallInput = {
  slenderness: number;
  epsilon: number;
  fy_MPa: number;
  plasticState: Parameters<typeof computeCompressionFraction>[0];
  compressionStressAt: (y_mm: number, z_mm: number) => number;
  start: Point;
  end: Point;
};

const classifyRhsWall = (input: ClassifyRhsWallInput) => {
  const {
    slenderness,
    epsilon,
    fy_MPa,
    plasticState,
    compressionStressAt,
    start,
    end,
  } = input;
  const elasticState = computeInternalElasticState({
    stressA_MPa: compressionStressAt(start.y_mm, start.z_mm),
    stressB_MPa: compressionStressAt(end.y_mm, end.z_mm),
  });

  return classifyInternalPart({
    slenderness,
    epsilon,
    fy_MPa,
    alpha: computeCompressionFraction(plasticState, start, end),
    psi: elasticState.psi,
    compressionStress_MPa: elasticState.compressionStress_MPa,
    tensionStress_MPa: elasticState.tensionStress_MPa,
  });
};
