import { clamp } from "lodash-es";
import { computePointStress } from "./computePointStress";
import { steelGradesMap } from "../../data/steelGrades";
import type { Context, Part, RawPart, SectionClass } from "./types";
import { ALPHA, EPSILON, SIGMA } from "./utils";
import { getStressDistribution } from "./getStressDistribution";

export const classifyOutstandPart = (
  rawPart: RawPart,
  steel_grade_id: string,
  ctx: Context,
): [SectionClass, Part] => {
  const { c_mm, t_mm, outstandPoints } = rawPart;
  if (!c_mm || !t_mm || !outstandPoints)
    throw new Error("Invalid outstand part");

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");

  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const final_fy_Mpa = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;
  const epsilon = Math.sqrt(235 / final_fy_Mpa);
  const cOverT = c_mm / t_mm;
  const sigma_supported_MPa = computePointStress(outstandPoints.supported, ctx);
  const sigma_tip_MPa = computePointStress(outstandPoints.tip, ctx);
  const stressDistribution = getStressDistribution(
    sigma_supported_MPa,
    sigma_tip_MPa,
    ctx,
  );

  const part: Part = {
    label: rawPart.label,
    type: rawPart.type,
    metadata: {
      fy_MPa: final_fy_Mpa,
      epsilon,
      cOverT,
      sigma_supported_MPa,
      sigma_tip_MPa,
      stressDistribution,
    },
    trace: [],
  };

  switch (stressDistribution) {
    case "no-stress":
      return classifyNoStress(part);
    case "tension":
      return classifyTension(part);
    case "compression":
      return classifyCompression(part);
    case "bending":
    case "compression-bending":
      return classifyBendingCompression(part);
  }
};

const classifyNoStress = (part: Part): [SectionClass, Part] => {
  part.trace.push({ label: "Class 1", satisfied: true, note: "No stress" });
  return [1, part];
};

const classifyTension = (part: Part): [SectionClass, Part] => {
  part.trace.push({ label: "Class 1", satisfied: true, note: "Tension only" });
  return [1, part];
};

const classifyCompression = (part: Part): [SectionClass, Part] => {
  const { cOverT, epsilon } = part.metadata;
  if (cOverT === undefined || epsilon === undefined) throw new Error();

  part.trace.push({
    label: "Class 1",
    ratio: cOverT,
    limit: `9${EPSILON}`,
    satisfied: cOverT <= 9 * epsilon,
  });
  if (cOverT <= 9 * epsilon) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: `10${EPSILON}`,
    satisfied: cOverT <= 10 * epsilon,
  });
  if (cOverT <= 10 * epsilon) return [2, part];

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: `14${EPSILON}`,
    satisfied: cOverT <= 14 * epsilon,
  });
  if (cOverT <= 14 * epsilon) return [3, part];

  part.trace.push({
    label: "Class 4",
    satisfied: false,
    note: "Not supported",
  });

  return [4, part];
};

const classifyBendingCompression = (part: Part): [SectionClass, Part] => {
  const { cOverT, epsilon, sigma_supported_MPa, sigma_tip_MPa } = part.metadata;
  if (
    cOverT === undefined ||
    epsilon === undefined ||
    sigma_supported_MPa === undefined ||
    sigma_tip_MPa === undefined
  )
    throw new Error();

  const alpha = 1;
  part.metadata.alpha = alpha;

  const isTipInCompression = sigma_tip_MPa < 0;
  const denominator = isTipInCompression ? alpha : alpha * Math.sqrt(alpha);

  part.trace.push({
    label: "Class 1",
    ratio: cOverT,
    limit: isTipInCompression
      ? `9${EPSILON} / ${ALPHA}`
      : `9${EPSILON} / (${ALPHA}√${ALPHA})`,
    satisfied: cOverT <= (9 * epsilon) / denominator,
  });
  if (cOverT <= (9 * epsilon) / denominator) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: isTipInCompression
      ? `10${EPSILON} / ${ALPHA}`
      : `10${EPSILON} / (${ALPHA}√${ALPHA})`,
    satisfied: cOverT <= (10 * epsilon) / denominator,
  });
  if (cOverT <= (10 * epsilon) / denominator) return [2, part];

  const psi = computePsi(sigma_supported_MPa, sigma_tip_MPa);
  const kSigma = computeKSigma(psi, sigma_supported_MPa, sigma_tip_MPa);
  part.metadata.psi = psi;
  part.metadata.kSigma = kSigma;

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: `21${EPSILON}√(k${SIGMA})`,
    satisfied: cOverT <= 21 * epsilon * Math.sqrt(kSigma),
  });
  if (cOverT <= 21 * epsilon * Math.sqrt(kSigma)) return [3, part];

  part.trace.push({
    label: "Class 4",
    satisfied: false,
    note: "Not supported",
  });

  return [4, part];
};

const computeKSigma = (
  psi: number,
  sigmaSupported: number,
  sigmaTip: number,
) => {
  const areBothInCompression = sigmaSupported < 0 && sigmaTip < 0;
  let row: 1 | 2 | 3 | 4;

  if (areBothInCompression) row = sigmaTip > sigmaSupported ? 1 : 3;
  else row = sigmaTip < 0 ? 2 : 4;

  if (row === 1 || row === 2) {
    const cappedPsi = clamp(psi, -3, 1);
    const cappedPsi2 = cappedPsi * cappedPsi;
    return 0.57 - 0.21 * cappedPsi + 0.07 * cappedPsi2;
  }

  const cappedPsi = clamp(psi, -1, 1);
  const cappedPsi2 = cappedPsi * cappedPsi;
  if (cappedPsi >= 0) return 0.578 / (cappedPsi + 0.34);
  return 1.7 - 5 * cappedPsi + 17.1 * cappedPsi2;
};

const computePsi = (sigmaTop_MPa: number, sigmaBottom_MPa: number) => {
  const isTopStressLarger = Math.abs(sigmaTop_MPa) >= Math.abs(sigmaBottom_MPa);
  const sigma1_MPa = isTopStressLarger ? sigmaTop_MPa : sigmaBottom_MPa;
  const sigma2_MPa = isTopStressLarger ? sigmaBottom_MPa : sigmaTop_MPa;

  if (sigma1_MPa === 0) return 0;
  return sigma2_MPa / sigma1_MPa;
};
