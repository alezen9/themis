import { clamp } from "lodash-es";
import { Context, Part, RawPart, SectionClass } from "./types";
import { computePsi } from "./computePsi";
import { computePointStress } from "./computePointStress";
import { steelGradesMap } from "../../data/steelGrades";

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
  const stressDistribution = getPartStressDistribution(
    sigma_supported_MPa,
    sigma_tip_MPa,
    ctx.N_Ed_kN ?? 0,
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
    case "neutral":
      return classifyOutstandPartNeutral(part);
    case "tension":
      return classifyOutstandPartTension(part);
    case "compression":
      return classifyOutstandPartCompression(part);
    case "bending":
    case "compression-bending":
      return classifyOutstandPartBendingCompression(part);
  }
};

const classifyOutstandPartNeutral = (part: Part): [SectionClass, Part] => {
  part.trace.push({ label: "Class 1", satisfied: true, note: "Neutral" });
  return [1, part];
};

const classifyOutstandPartTension = (part: Part): [SectionClass, Part] => {
  part.trace.push({ label: "Class 1", satisfied: true, note: "Tension only" });
  return [1, part];
};

const classifyOutstandPartCompression = (part: Part): [SectionClass, Part] => {
  const { cOverT, epsilon } = part.metadata;
  if (cOverT === undefined || epsilon === undefined) throw new Error();

  part.trace.push({
    label: "Class 1",
    ratio: cOverT,
    limit: "9ε",
    satisfied: cOverT <= 9 * epsilon,
  });
  if (cOverT <= 9 * epsilon) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: "10ε",
    satisfied: cOverT <= 10 * epsilon,
  });
  if (cOverT <= 10 * epsilon) return [2, part];

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: "14ε",
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

const classifyOutstandPartBendingCompression = (
  part: Part,
): [SectionClass, Part] => {
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
    limit: isTipInCompression ? "9ε / α" : "9ε / (α√α)",
    satisfied: cOverT <= (9 * epsilon) / denominator,
  });
  if (cOverT <= (9 * epsilon) / denominator) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: isTipInCompression ? "10ε / α" : "10ε / (α√α)",
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
    limit: "21ε√kσ",
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

const getPartStressDistribution = (
  sigma_supported_MPa: number,
  sigma_tip_MPa: number,
  N_Ed_kN: number,
): NonNullable<Part["metadata"]["stressDistribution"]> => {
  if (sigma_supported_MPa >= 0 && sigma_tip_MPa >= 0) return "tension";
  if (sigma_supported_MPa < 0 && sigma_tip_MPa < 0) return "compression";
  if (N_Ed_kN === 0) return "bending";
  return "compression-bending";
};
