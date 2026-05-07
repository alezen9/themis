import { steelGradesMap } from "../../data/steelGrades";
import { Ec3FormValues } from "../../Form/schema";
import { getEpsilon, maxClass, throwClass4NotSupported } from "./utils";

type Geometry = Ec3FormValues["rhs_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm">;

export const classifyRhsSection = (
  geometry: Geometry,
  steel_grade_id: Ec3FormValues["steel_grade_id"],
  actions: Actions,
) => {
  const { b_mm, tw_mm, ri_mm } = geometry;
  const { N_Ed_kN, M_y_Ed_kNm } = actions;

  if (N_Ed_kN >= 0 && M_y_Ed_kNm === 0) return 1;

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");
  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const fy = tw_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;

  const epsilon = getEpsilon(fy);
  const flangeWidth_mm = b_mm - 2 * tw_mm - 2 * ri_mm;
  const flangeRatio = flangeWidth_mm / tw_mm;
  const flangeClass = classifyInternalPartInCompression(flangeRatio, epsilon);

  const isPureCompression = N_Ed_kN < 0 && M_y_Ed_kNm === 0;
  const isCompressionAndBending = N_Ed_kN < 0 && M_y_Ed_kNm !== 0;

  let webClass: 1 | 2 | 3;
  if (isPureCompression)
    webClass = classifyInternalPartInCompression(
      getWebRatio(geometry),
      epsilon,
    );
  else if (isCompressionAndBending)
    webClass = classifyInternalPartInCompressionAndBending(
      geometry,
      fy,
      epsilon,
      N_Ed_kN,
    );
  else webClass = classifyInternalPartInBending(getWebRatio(geometry), epsilon);

  return maxClass(webClass, flangeClass);
};

const getWebRatio = (geometry: Geometry) => {
  const { h_mm, tw_mm, ri_mm } = geometry;
  const webDepth_mm = h_mm - 2 * tw_mm - 2 * ri_mm;
  return webDepth_mm / tw_mm;
};

const classifyInternalPartInCompression = (ratio: number, epsilon: number) => {
  if (ratio <= 33 * epsilon) return 1;
  if (ratio <= 38 * epsilon) return 2;
  if (ratio <= 42 * epsilon) return 3;

  return throwClass4NotSupported();
};

const classifyInternalPartInBending = (ratio: number, epsilon: number) => {
  if (ratio <= 72 * epsilon) return 1;
  if (ratio <= 83 * epsilon) return 2;
  if (ratio <= 124 * epsilon) return 3;

  return throwClass4NotSupported();
};

const classifyInternalPartInCompressionAndBending = (
  geometry: Geometry,
  fy_MPa: number,
  epsilon: number,
  N_Ed_kN: number,
) => {
  const { h_mm, b_mm, tw_mm, ri_mm } = geometry;

  const webDepth_mm = h_mm - 2 * tw_mm - 2 * ri_mm;
  const webRatio = webDepth_mm / tw_mm;
  const compressionForce_N = Math.abs(N_Ed_kN) * 1000;
  const area_mm2 = h_mm * b_mm - (h_mm - 2 * tw_mm) * (b_mm - 2 * tw_mm);
  const alphaRaw =
    compressionForce_N / (4 * webDepth_mm * fy_MPa * tw_mm) + 0.5;
  const alpha = Math.min(alphaRaw, 1);

  const class1Limit =
    alpha > 0.5 ? (396 * epsilon) / (13 * alpha - 1) : (36 * epsilon) / alpha;
  if (webRatio <= class1Limit) return 1;

  const class2Limit =
    alpha > 0.5 ? (456 * epsilon) / (13 * alpha - 1) : (41.5 * epsilon) / alpha;
  if (webRatio <= class2Limit) return 2;

  const y_mm = h_mm / 2;
  const sigmaMin_MPa =
    (-y_mm * (fy_MPa - compressionForce_N / area_mm2)) / (h_mm - y_mm) +
    compressionForce_N / area_mm2;
  const psi = sigmaMin_MPa / fy_MPa;

  const class3Limit =
    psi > -1
      ? (42 * epsilon) / (0.67 + 0.33 * psi)
      : 62 * epsilon * (1 - psi) * Math.sqrt(-psi);
  if (webRatio <= class3Limit) return 3;

  return throwClass4NotSupported();
};
