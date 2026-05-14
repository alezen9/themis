import { clamp } from "lodash-es";
import { steelGradesMap } from "../../data/steelGrades";
import { computePointStress } from "./computePointStress";
import { getStressDistribution } from "./getStressDistribution";
import type { Context, Part, RawPart, SectionClass } from "./types";
import { ALPHA, EPSILON, PSI } from "./utils";

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
  const alpha = computeAlpha(
    rawPart,
    final_fy_Mpa,
    sigma_a_MPa,
    sigma_b_MPa,
    ctx,
  );
  const stressDistribution = getStressDistribution(sigma_a_MPa, sigma_b_MPa);

  const part: Part = {
    label: rawPart.label,
    type: rawPart.type,
    controlPoints: [internalPoints.a, internalPoints.b],
    metadata: {
      fy_MPa: final_fy_Mpa,
      epsilon,
      cOverT,
      alpha,
      sigma_a_MPa,
      sigma_b_MPa,
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
      return classifyBending(part);
    case "compression-bending":
      return classifyCompressionBending(part, rawPart);
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
    limit: `33${EPSILON}`,
    satisfied: cOverT <= 33 * epsilon,
  });
  if (cOverT <= 33 * epsilon) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: `38${EPSILON}`,
    satisfied: cOverT <= 38 * epsilon,
  });
  if (cOverT <= 38 * epsilon) return [2, part];

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: `42${EPSILON}`,
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

const classifyBending = (part: Part): [SectionClass, Part] => {
  const { cOverT, epsilon } = part.metadata;
  if (cOverT === undefined || epsilon === undefined) throw new Error();

  part.trace.push({
    label: "Class 1",
    ratio: cOverT,
    limit: `72${EPSILON}`,
    satisfied: cOverT <= 72 * epsilon,
  });
  if (cOverT <= 72 * epsilon) return [1, part];

  part.trace.push({
    label: "Class 2",
    ratio: cOverT,
    limit: `83${EPSILON}`,
    satisfied: cOverT <= 83 * epsilon,
  });
  if (cOverT <= 83 * epsilon) return [2, part];

  part.trace.push({
    label: "Class 3",
    ratio: cOverT,
    limit: `124${EPSILON}`,
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

const classifyCompressionBending = (
  part: Part,
  rawPart: RawPart,
): [SectionClass, Part] => {
  const { c_mm, t_mm } = rawPart;
  const { cOverT, epsilon, sigma_a_MPa, sigma_b_MPa, alpha } = part.metadata;

  if (
    c_mm === undefined ||
    t_mm === undefined ||
    cOverT === undefined ||
    epsilon === undefined ||
    alpha === undefined ||
    sigma_a_MPa === undefined ||
    sigma_b_MPa === undefined
  )
    throw new Error();

  if (alpha > 0.5) {
    part.trace.push({
      label: "Class 1",
      ratio: cOverT,
      limit: `396${EPSILON} / (13${ALPHA} - 1)`,
      satisfied: cOverT <= (396 * epsilon) / (13 * alpha - 1),
    });
    if (cOverT <= (396 * epsilon) / (13 * alpha - 1)) return [1, part];
  } else {
    part.trace.push({
      label: "Class 1",
      ratio: cOverT,
      limit: `36${EPSILON} / ${ALPHA}`,
      satisfied: cOverT <= (36 * epsilon) / alpha,
    });
    if (cOverT <= (36 * epsilon) / alpha) return [1, part];
  }

  if (alpha > 0.5) {
    part.trace.push({
      label: "Class 2",
      ratio: cOverT,
      limit: `456${EPSILON} / (13${ALPHA} - 1)`,
      satisfied: cOverT <= (456 * epsilon) / (13 * alpha - 1),
    });
    if (cOverT <= (456 * epsilon) / (13 * alpha - 1)) return [2, part];
  } else {
    part.trace.push({
      label: "Class 2",
      ratio: cOverT,
      limit: `41.5${EPSILON} / ${ALPHA}`,
      satisfied: cOverT <= (41.5 * epsilon) / alpha,
    });
    if (cOverT <= (41.5 * epsilon) / alpha) return [2, part];
  }

  const psi = computePsi(sigma_a_MPa, sigma_b_MPa);
  part.metadata.psi = psi;

  if (psi > -1) {
    part.trace.push({
      label: "Class 3",
      ratio: cOverT,
      limit: `42${EPSILON} / (0.67 + 0.33${PSI})`,
      satisfied: cOverT <= (42 * epsilon) / (0.67 + 0.33 * psi),
    });
    if (cOverT <= (42 * epsilon) / (0.67 + 0.33 * psi)) return [3, part];
  } else {
    part.trace.push({
      label: "Class 3",
      ratio: cOverT,
      limit: `62${EPSILON}(1 - ${PSI})√(-${PSI})`,
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

const computeAlpha = (
  rawPart: RawPart,
  fy_Mpa: number,
  sigma_a_MPa: number,
  sigma_b_MPa: number,
  ctx: Context,
) => {
  const areBothZero = sigma_a_MPa === 0 && sigma_b_MPa === 0;
  const areBothPositive = sigma_a_MPa >= 0 && sigma_b_MPa >= 0;
  const areBothNegative = sigma_a_MPa < 0 && sigma_b_MPa < 0;

  if (areBothNegative || areBothZero || areBothPositive) return 1;

  const { c_mm = 0, t_mm = 0, sectionWebCount = 1 } = rawPart;
  const { N_Ed_kN = 0 } = ctx;
  const N_Ed_N = N_Ed_kN * 1_000;
  const A_mm2 = c_mm * t_mm;
  const alpha = -N_Ed_N / (2 * sectionWebCount * A_mm2 * fy_Mpa) + 0.5;
  return clamp(alpha, 0, 1);
};

const computePsi = (sigma_a_MPa: number, sigma_b_MPa: number) => {
  const sigma1_MPa = Math.min(sigma_a_MPa, sigma_b_MPa);
  const sigma2_MPa = sigma1_MPa === sigma_a_MPa ? sigma_b_MPa : sigma_a_MPa;

  if (sigma1_MPa === 0) return 0;
  return sigma2_MPa / sigma1_MPa;
};
