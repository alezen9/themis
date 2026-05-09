import { steelGradesMap } from "../../../data/steelGrades";
import { Ec3FormValues } from "../../../Form/schema";
import { ClassificationTrace, getEpsilon2 } from "../utils";

type Geometry = Ec3FormValues["chs_geometry"];

export const classifyChsSection = (
  geometry: Geometry,
  steel_grade_id: Ec3FormValues["steel_grade_id"],
) => {
  const trace: ClassificationTrace[] = [];
  const { d_mm, t_mm } = geometry;
  const ratio = d_mm / t_mm;

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");
  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const fy = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;

  const epsilon2 = getEpsilon2(fy);

  trace.push(trace1({ ratio, epsilon2, fy_MPa: fy }));
  if (ratio <= 50 * epsilon2) return [1, trace] as const;

  trace.push(trace2({ ratio, epsilon2, fy_MPa: fy }));
  if (ratio <= 70 * epsilon2) return [2, trace] as const;

  trace.push(trace3({ ratio, epsilon2, fy_MPa: fy }));
  if (ratio <= 90 * epsilon2) return [3, trace] as const;

  return [4, trace] as const;
};

type ChsTraceInput = { ratio: number; epsilon2: number; fy_MPa: number };

const trace1 = (input: ChsTraceInput) =>
  createChsTrace({
    ...input,
    label: "Class 1",
    sectionClass: 1,
    limit: 50 * input.epsilon2,
    formula: "50\ε²",
  });

const trace2 = (input: ChsTraceInput) =>
  createChsTrace({
    ...input,
    label: "Class 2",
    sectionClass: 2,
    limit: 70 * input.epsilon2,
    formula: "70\ε²",
  });

const trace3 = (input: ChsTraceInput) =>
  createChsTrace({
    ...input,
    label: "Class 3",
    sectionClass: 3,
    limit: 90 * input.epsilon2,
    formula: "90\ε²",
  });

type ChsTraceLimitInput = ChsTraceInput & {
  label: string;
  sectionClass: 1 | 2 | 3;
  limit: number;
  formula: string;
};

const createChsTrace = (input: ChsTraceLimitInput): ClassificationTrace => ({
  label: input.label,
  part: "Panel n.1 - Tube",
  sectionClass: input.sectionClass,
  ratio: { label: "d / t", value: input.ratio },
  limit: { label: "Limit", value: input.limit, formula: input.formula },
  values: [
    { label: "fᵧ", value: input.fy_MPa, unit: "MPa" },
    { label: "\ε²", value: input.epsilon2 },
  ],
  passed: input.ratio <= input.limit,
});
