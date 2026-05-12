import { steelGradesMap } from "../../data/steelGrades";
import { computePointStress } from "./computePointStress";
import { Context, Part, RawPart, SectionClass } from "./types";

export const classifyInternalPart = (
  rawPart: RawPart,
  steel_grade_id: string,
  ctx: Context,
): [SectionClass, Part] => {
  const { c_mm, t_mm, internalPoints } = rawPart;
  if (!c_mm || !t_mm || !internalPoints)
    throw new Error("Invalid internal part");

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");

  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const final_fy_Mpa = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;
  const epsilon = Math.sqrt(235 / final_fy_Mpa);
  const cOverT = c_mm / t_mm;
  const sigma_a_MPa = computePointStress(internalPoints.a, ctx);
  const sigma_b_MPa = computePointStress(internalPoints.b, ctx);
  const stressDistribution = getInternalPartStressDistribution(
    sigma_a_MPa,
    sigma_b_MPa,
    ctx,
  );

  const part: Part = {
    label: rawPart.label,
    type: rawPart.type,
    metadata: {
      fy_MPa: final_fy_Mpa,
      epsilon,
      cOverT,
      sigma_a_MPa,
      sigma_b_MPa,
      stressDistribution,
    },
    trace: [],
  };

  switch (stressDistribution) {
    case "neutral":
      return classifyInternalPartNeutral(part);
    case "tension":
      return classifyInternalPartTension(part);
    case "compression":
      return classifyInternalPartCompression(part);
    case "bending":
      return classifyInternalPartBending(part);
    case "compression-bending":
      return classifyInternalPartCompressionBending(part, rawPart, ctx);
  }
};

const classifyInternalPartNeutral = (part: Part): [SectionClass, Part] => {
  part.trace.push({ label: "Class 1", satisfied: true, note: "Neutral" });
  return [1, part];
};

const classifyInternalPartTension = (part: Part): [SectionClass, Part] => {
  part.trace.push({ label: "Class 1", satisfied: true, note: "Tension only" });
  return [1, part];
};

const classifyInternalPartCompression = (part: Part): [SectionClass, Part] => {
  const { cOverT, epsilon } = part.metadata;
  if (cOverT === undefined || epsilon === undefined) throw new Error();

  part.trace.push({
    label: "Class 1",
    ratio: cOverT,
    limit: "33ε",
    satisfied: cOverT <= 33 * epsilon,
  });
  if (cOverT <= 33 * epsilon) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: "38ε",
    satisfied: cOverT <= 38 * epsilon,
  });
  if (cOverT <= 38 * epsilon) return [2, part];

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: "42ε",
    satisfied: cOverT <= 42 * epsilon,
  });
  if (cOverT <= 42 * epsilon) return [3, part];

  part.trace.push({
    label: "Class 4",
    satisfied: false,
    note: "Not supported",
  });

  return [4, part];
};

const classifyInternalPartBending = (part: Part): [SectionClass, Part] => {
  const { cOverT, epsilon } = part.metadata;
  if (cOverT === undefined || epsilon === undefined) throw new Error();

  part.trace.push({
    label: "Class 1",
    ratio: cOverT,
    limit: "72ε",
    satisfied: cOverT <= 72 * epsilon,
  });
  if (cOverT <= 72 * epsilon) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: "83ε",
    satisfied: cOverT <= 83 * epsilon,
  });
  if (cOverT <= 83 * epsilon) return [2, part];

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: "124ε",
    satisfied: cOverT <= 124 * epsilon,
  });
  if (cOverT <= 124 * epsilon) return [3, part];

  part.trace.push({
    label: "Class 4",
    satisfied: false,
    note: "Not supported",
  });

  return [4, part];
};

const classifyInternalPartCompressionBending = (
  part: Part,
  rawPart: RawPart,
  ctx: Context,
): [SectionClass, Part] => {
  const { c_mm, t_mm, axialPartCount = 1 } = rawPart;
  const { cOverT, epsilon, fy_MPa, sigma_a_MPa, sigma_b_MPa } = part.metadata;

  if (
    c_mm === undefined ||
    t_mm === undefined ||
    cOverT === undefined ||
    epsilon === undefined ||
    sigma_a_MPa === undefined ||
    sigma_b_MPa === undefined
  )
    throw new Error();

  const alpha = computeInternalAlpha(c_mm, t_mm, fy_MPa, axialPartCount, ctx);
  part.metadata.alpha = alpha;

  if (alpha > 0.5) {
    part.trace.push({
      label: "Class 1",
      ratio: cOverT,
      limit: "396ε / (13α - 1)",
      satisfied: cOverT <= (396 * epsilon) / (13 * alpha - 1),
    });
    if (cOverT <= (396 * epsilon) / (13 * alpha - 1)) return [1, part];
  } else {
    part.trace.push({
      label: "Class 1",
      ratio: cOverT,
      limit: "36ε / α",
      satisfied: cOverT <= (36 * epsilon) / alpha,
    });
    if (cOverT <= (36 * epsilon) / alpha) return [1, part];
  }

  if (alpha > 0.5) {
    part.trace.push({
      label: "Class 2",
      ratio: cOverT,
      limit: "456ε / (13α - 1)",
      satisfied: cOverT <= (456 * epsilon) / (13 * alpha - 1),
    });
    if (cOverT <= (456 * epsilon) / (13 * alpha - 1)) return [2, part];
  } else {
    part.trace.push({
      label: "Class 2",
      ratio: cOverT,
      limit: "41.5ε / α",
      satisfied: cOverT <= (41.5 * epsilon) / alpha,
    });
    if (cOverT <= (41.5 * epsilon) / alpha) return [2, part];
  }

  const psi = computeInternalPsi(sigma_a_MPa, sigma_b_MPa);
  part.metadata.psi = psi;

  if (psi > -1) {
    part.trace.push({
      label: "Class 3",
      ratio: cOverT,
      limit: "42ε / (0.67 + 0.33ψ)",
      satisfied: cOverT <= (42 * epsilon) / (0.67 + 0.33 * psi),
    });
    if (cOverT <= (42 * epsilon) / (0.67 + 0.33 * psi)) return [3, part];
  } else {
    part.trace.push({
      label: "Class 3",
      ratio: cOverT,
      limit: "62ε(1 - ψ)√(-ψ)",
      satisfied: cOverT <= 62 * epsilon * (1 - psi) * Math.sqrt(-psi),
    });
    if (cOverT <= 62 * epsilon * (1 - psi) * Math.sqrt(-psi)) return [3, part];
  }

  part.trace.push({
    label: "Class 4",
    satisfied: false,
    note: "Not supported",
  });

  return [4, part];
};

const computeInternalAlpha = (
  c_mm: number,
  t_mm: number,
  fy_MPa: number,
  axialPartCount: 1 | 2,
  ctx: Context,
) => {
  const { N_Ed_kN = 0 } = ctx;
  const axialForceRatio =
    (-N_Ed_kN * 1_000) / (2 * axialPartCount * c_mm * t_mm * fy_MPa);

  return Math.min(1, Math.max(0, 0.5 + axialForceRatio));
};

const computeInternalPsi = (sigma_a_MPa: number, sigma_b_MPa: number) => {
  const sigma1_MPa = Math.min(sigma_a_MPa, sigma_b_MPa);
  const sigma2_MPa = sigma1_MPa === sigma_a_MPa ? sigma_b_MPa : sigma_a_MPa;

  if (sigma1_MPa === 0) return 0;
  return sigma2_MPa / sigma1_MPa;
};

const getInternalPartStressDistribution = (
  sigma_a_MPa: number,
  sigma_b_MPa: number,
  ctx: Context,
): NonNullable<Part["metadata"]["stressDistribution"]> => {
  const { N_Ed_kN = 0 } = ctx;
  const stressTolerance_MPa = 1e-9;
  const isNeutral =
    Math.abs(sigma_a_MPa) <= stressTolerance_MPa &&
    Math.abs(sigma_b_MPa) <= stressTolerance_MPa;
  const areBothInTension =
    sigma_a_MPa > stressTolerance_MPa && sigma_b_MPa > stressTolerance_MPa;
  const areBothInCompression =
    sigma_a_MPa < -stressTolerance_MPa && sigma_b_MPa < -stressTolerance_MPa;
  const hasStressGradient =
    Math.abs(sigma_a_MPa - sigma_b_MPa) > stressTolerance_MPa;

  if (isNeutral) return "neutral";
  if (areBothInTension) return "tension";
  if (areBothInCompression)
    return hasStressGradient ? "compression-bending" : "compression";
  if (N_Ed_kN === 0) return "bending";
  return "compression-bending";
};
