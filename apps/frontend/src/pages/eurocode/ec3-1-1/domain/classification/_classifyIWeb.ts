import { SectionClass } from "./utils";
import { IClassificationGeometry } from "./_getIClassificationGeometry";

export const classifyIWebInCompression = (
  ratio: number,
  epsilon: number,
): SectionClass => {
  if (ratio <= 33 * epsilon) return 1;
  if (ratio <= 38 * epsilon) return 2;
  if (ratio <= 42 * epsilon) return 3;

  return 4;
};

export const classifyIWebInBending = (
  ratio: number,
  epsilon: number,
): SectionClass => {
  if (ratio <= 72 * epsilon) return 1;
  if (ratio <= 83 * epsilon) return 2;
  if (ratio <= 124 * epsilon) return 3;

  return 4;
};

export const classifyIWebInCompressionAndBending = (
  geometry: IClassificationGeometry,
  fy_MPa: number,
  epsilon: number,
  N_Ed_kN: number,
): SectionClass => {
  const { h_mm, b_mm, tw_mm, tf_mm, webDepth_mm, webRatio } = geometry;

  const compressionForce_N = Math.abs(N_Ed_kN) * 1000;
  const area_mm2 = 2 * b_mm * tf_mm + webDepth_mm * tw_mm;
  const alphaRaw =
    compressionForce_N / (2 * webDepth_mm * fy_MPa * tw_mm) + 0.5;
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

  return 4;
};
