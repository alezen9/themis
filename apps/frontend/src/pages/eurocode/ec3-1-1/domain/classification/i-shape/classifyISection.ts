import { clamp } from "lodash-es";
import { steelGradesMap } from "../../../data/steelGrades";
import { Ec3FormValues } from "../../../Form/schema";
import { computeGeometryProperties } from "../../geometry/computeGeometryProperties";
import { maxClass, SectionClass, type Part, type RawPart } from "../utils";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm">;
type SteelGradeId = Ec3FormValues["steel_grade_id"];
type Point = { y_mm: number; z_mm: number };
type Context = ReturnType<typeof computeGeometryProperties> & Actions;

export const classifyISection = (
  i_geometry: Geometry,
  steel_grade_id: SteelGradeId,
  section_id: string,
  actions: Actions,
): [SectionClass, Part[]] => {
  const geometricProperties = computeGeometryProperties({
    shape: "I",
    i_geometry,
    section_id,
  });
  const ctx = { ...geometricProperties, ...actions };

  const rawParts = decompose(i_geometry);

  const classifiedParts = rawParts.map((rawPart) => {
    if (rawPart.type === "outstand")
      return classifyOutstandPart(rawPart, steel_grade_id, ctx);
    return classifyInternalPart(rawPart, steel_grade_id, ctx);
  });

  const sectionClass = maxClass(...classifiedParts.map(([c]) => c));
  const parts = classifiedParts.map(([, p]) => p);

  return [sectionClass, parts];
};

const decompose = (geometry: Geometry): RawPart[] => {
  const { h_mm, b_mm, tw_mm, tf_mm, r_mm } = geometry;
  const flange_c_mm = (b_mm - tw_mm) / 2 - r_mm;
  const web_c_mm = h_mm - 2 * tf_mm - 2 * r_mm;

  return [
    {
      label: "Top left flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      points: {
        supported: { y_mm: h_mm / 2 - tf_mm / 2, z_mm: -(tw_mm / 2 + r_mm) },
        tip: { y_mm: h_mm / 2 - tf_mm / 2, z_mm: -b_mm / 2 },
      },
    },
    {
      label: "Top right flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      points: {
        supported: { y_mm: h_mm / 2 - tf_mm / 2, z_mm: tw_mm / 2 + r_mm },
        tip: { y_mm: h_mm / 2 - tf_mm / 2, z_mm: b_mm / 2 },
      },
    },
    { label: "Web", type: "internal", c_mm: web_c_mm, t_mm: tw_mm },
    {
      label: "Bottom left flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      points: {
        supported: { y_mm: -h_mm / 2 + tf_mm / 2, z_mm: -(tw_mm / 2 + r_mm) },
        tip: { y_mm: -h_mm / 2 + tf_mm / 2, z_mm: -b_mm / 2 },
      },
    },
    {
      label: "Bottom right flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      points: {
        supported: { y_mm: -h_mm / 2 + tf_mm / 2, z_mm: tw_mm / 2 + r_mm },
        tip: { y_mm: -h_mm / 2 + tf_mm / 2, z_mm: b_mm / 2 },
      },
    },
  ];
};

const classifyOutstandPart = (
  rawPart: RawPart,
  steel_grade_id: SteelGradeId,
  ctx: Context,
): [SectionClass, Part] => {
  const { c_mm, t_mm, points } = rawPart;
  if (!c_mm || !t_mm || !points) throw new Error("Invalid outstand part");

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");

  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const final_fy_Mpa = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;
  const epsilon = Math.sqrt(235 / final_fy_Mpa);
  const cOverT = c_mm / t_mm;
  const sigma_supported_MPa = computePointStress(points.supported, ctx);
  const sigma_tip_MPa = computePointStress(points.tip, ctx);
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
    case "tension":
      return classifyOutstandPartTension(part);
    case "compression":
      return classifyOutstandPartCompression(part);
    case "bending":
    case "compression-bending":
      return classifyOutstandPartBendingCompression(part);
  }
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

const computePsi = (sigmaSupported: number, sigmaTip: number) => {
  const sigmaSupportedAbs = Math.abs(sigmaSupported);
  const sigmaTipAbs = Math.abs(sigmaTip);
  const sigmaMin = Math.min(sigmaSupportedAbs, sigmaTipAbs);
  const sigmaMax = Math.max(sigmaSupportedAbs, sigmaTipAbs);
  return sigmaMin / sigmaMax;
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

const classifyInternalPart = (
  rawPart: RawPart,
  steel_grade_id: SteelGradeId,
  ctx: Context,
): [SectionClass, Part] => {
  const { c_mm, t_mm } = rawPart;
  if (!c_mm || !t_mm) throw new Error("Invalid internal part");

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");

  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const final_fy_Mpa = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;
  const epsilon = Math.sqrt(235 / final_fy_Mpa);
  const cOverT = c_mm / t_mm;
  const stressDistribution = getInternalPartStressDistribution(ctx);

  const part: Part = {
    label: rawPart.label,
    type: rawPart.type,
    metadata: { fy_MPa: final_fy_Mpa, epsilon, cOverT, stressDistribution },
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
      return classifyInternalPartCompressionBending(part, rawPart, ctx);
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
  rawPart: RawPart,
  ctx: Context,
): [SectionClass, Part] => {
  const { cOverT, epsilon, fy_MPa } = part.metadata;
  const { c_mm, t_mm } = rawPart;

  if (
    cOverT === undefined ||
    epsilon === undefined ||
    fy_MPa === undefined ||
    c_mm === undefined ||
    t_mm === undefined
  )
    throw new Error();

  const alpha =
    Math.abs((ctx.N_Ed_kN ?? 0) * 1_000) / (2 * c_mm * fy_MPa * t_mm) + 0.5;
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

  const sigma_top_MPa = computePointStress({ y_mm: c_mm / 2, z_mm: 0 }, ctx);
  const sigma_bottom_MPa = computePointStress(
    { y_mm: -c_mm / 2, z_mm: 0 },
    ctx,
  );
  const psi = computeInternalPsi(sigma_top_MPa, sigma_bottom_MPa);
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

const computeInternalPsi = (sigmaTop_MPa: number, sigmaBottom_MPa: number) => {
  const sigma1_MPa = Math.min(sigmaTop_MPa, sigmaBottom_MPa);
  const sigma2_MPa = Math.max(sigmaTop_MPa, sigmaBottom_MPa);
  return sigma2_MPa / sigma1_MPa;
};

const getInternalPartStressDistribution = (
  ctx: Context,
): NonNullable<Part["metadata"]["stressDistribution"]> => {
  const N_Ed_kN = ctx.N_Ed_kN ?? 0;
  const M_y_Ed_kNm = ctx.M_y_Ed_kNm ?? 0;
  const M_z_Ed_kNm = ctx.M_z_Ed_kNm ?? 0;
  const hasCompression = N_Ed_kN < 0;
  const hasBending = M_y_Ed_kNm !== 0 || M_z_Ed_kNm !== 0;

  if (!hasCompression && !hasBending) return "tension";
  if (hasCompression && !hasBending) return "compression";
  if (!hasCompression && hasBending) return "bending";
  return "compression-bending";
};

const computePointStress = (point: Point, ctx: Context) => {
  const { A_mm2, Iy_mm4, Iz_mm4 } = ctx;
  const N_Ed_kN = ctx.N_Ed_kN ?? 0;
  const M_y_Ed_kNm = ctx.M_y_Ed_kNm ?? 0;
  const M_z_Ed_kNm = ctx.M_z_Ed_kNm ?? 0;

  const sigmaN_MPa = (N_Ed_kN * 1_000) / A_mm2;
  const sigmaMy_MPa = ((M_y_Ed_kNm * 1_000_000) / Iy_mm4) * point.y_mm;
  const sigmaMz_MPa = ((M_z_Ed_kNm * 1_000_000) / Iz_mm4) * point.z_mm;
  return sigmaN_MPa + sigmaMy_MPa + sigmaMz_MPa;
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
