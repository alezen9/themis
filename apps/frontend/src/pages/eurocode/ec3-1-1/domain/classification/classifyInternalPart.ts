import { steelGradesMap } from "../../data/steelGrades";
import { computePointStress } from "./computePointStress";
import { computePsi } from "./computePsi";
import { Context, Part, RawPart, SectionClass } from "./types";

export const classifyInternalPart = (
  rawPart: RawPart,
  steel_grade_id: string,
  ctx: Context,
): [SectionClass, Part] => {
  const { c_mm, t_mm, points } = rawPart;
  if (!c_mm || !t_mm || !points) throw new Error("Invalid internal part");

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");

  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const final_fy_Mpa = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;
  const epsilon = Math.sqrt(235 / final_fy_Mpa);
  const cOverT = c_mm / t_mm;
  const sigma_supported_MPa = computePointStress(points.supported, ctx);
  const sigma_tip_MPa = computePointStress(points.tip, ctx);
  const stressDistribution = getInternalPartStressDistribution(
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
    case "tension":
      return classifyInternalPartTension(part);
    case "compression":
      return classifyInternalPartCompression(part);
    case "bending":
      return classifyInternalPartBending(part);
    case "compression-bending":
      return classifyInternalPartCompressionBending(part);
  }
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
): [SectionClass, Part] => {
  const { cOverT, epsilon, sigma_supported_MPa, sigma_tip_MPa } = part.metadata;

  if (
    cOverT === undefined ||
    epsilon === undefined ||
    sigma_supported_MPa === undefined ||
    sigma_tip_MPa === undefined
  )
    throw new Error();

  const alpha = computeInternalAlpha(sigma_supported_MPa, sigma_tip_MPa);
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

  const psi = computePsi(sigma_supported_MPa, sigma_tip_MPa);
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
  sigma_supported_MPa: number,
  sigma_tip_MPa: number,
) => {
  const isSupportedInCompression = sigma_supported_MPa < 0;
  const isTipInCompression = sigma_tip_MPa < 0;

  if (isSupportedInCompression && isTipInCompression) return 1;
  if (!isSupportedInCompression && !isTipInCompression) return 0;

  const sigma_supported_abs_MPa = Math.abs(sigma_supported_MPa);
  const sigma_tip_abs_MPa = Math.abs(sigma_tip_MPa);
  const compressionStress_MPa = isSupportedInCompression
    ? sigma_supported_abs_MPa
    : sigma_tip_abs_MPa;
  const tensionStress_MPa = isSupportedInCompression
    ? sigma_tip_abs_MPa
    : sigma_supported_abs_MPa;

  return compressionStress_MPa / (compressionStress_MPa + tensionStress_MPa);
};

const getInternalPartStressDistribution = (
  sigma_supported_MPa: number,
  sigma_tip_MPa: number,
  ctx: Context,
): NonNullable<Part["metadata"]["stressDistribution"]> => {
  const { N_Ed_kN = 0, M_y_Ed_kNm = 0, M_z_Ed_kNm = 0 } = ctx;
  const hasBending = M_y_Ed_kNm !== 0 || M_z_Ed_kNm !== 0;
  const areBothInTension = sigma_supported_MPa >= 0 && sigma_tip_MPa >= 0;
  const areBothInCompression = sigma_supported_MPa < 0 && sigma_tip_MPa < 0;

  if (areBothInTension) return "tension";
  if (areBothInCompression)
    return hasBending ? "compression-bending" : "compression";
  if (N_Ed_kN === 0) return "bending";
  return "compression-bending";
};
