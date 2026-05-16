import { steelGradesMap } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../Form/schema/schema";
import type { Actions, Part, SectionClass } from "./types";
import { EPSILON2 } from "./utils";

type Geometry = Ec3FormValues["chs_geometry"];

export const classifyChsSection = (
  geometry: Geometry,
  steel_grade_id: string,
  actions: Actions,
): [SectionClass, Part[]] => {
  const { d_mm, t_mm } = geometry;
  const ratio = d_mm / t_mm;

  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error("Steel grade not found");
  const { fy_MPa, fy_above_40_MPa } = steelGrade;
  const final_fy_Mpa = t_mm > 40 ? (fy_above_40_MPa ?? fy_MPa) : fy_MPa;

  const epsilon2 = 235 / final_fy_Mpa;

  const part: Part = {
    label: "Tube",
    type: "tubular",
    metadata: {
      fy_MPa: final_fy_Mpa,
      epsilon2,
      dOverT: ratio,
      stressDistribution:
        actions.N_Ed_kN === 0
          ? "no-stress"
          : actions.N_Ed_kN > 0
            ? "tension"
            : "compression",
    },
    trace: [],
  };

  if (actions.N_Ed_kN === 0) {
    part.trace.push({ label: "Class 1", satisfied: true, note: "No stress" });
    return [1, [part]];
  }

  if (actions.N_Ed_kN > 0) {
    part.trace.push({
      label: "Class 1",
      satisfied: true,
      note: "Tension only",
    });
    return [1, [part]];
  }

  part.trace.push(trace1({ ratio, epsilon2 }));
  if (ratio <= 50 * epsilon2) return [1, [part]];

  part.trace.push(trace2({ ratio, epsilon2 }));
  if (ratio <= 70 * epsilon2) return [2, [part]];

  part.trace.push(trace3({ ratio, epsilon2 }));
  if (ratio <= 90 * epsilon2) return [3, [part]];

  part.trace.push({
    label: "Class 4",
    satisfied: false,
    note: "Not supported",
  });

  return [4, [part]];
};

type ChsTraceInput = { ratio: number; epsilon2: number };

const trace1 = (input: ChsTraceInput) =>
  createChsTrace({
    ...input,
    label: "Class 1",
    sectionClass: 1,
    limit: `50${EPSILON2}`,
    satisfied: input.ratio <= 50 * input.epsilon2,
  });

const trace2 = (input: ChsTraceInput) =>
  createChsTrace({
    ...input,
    label: "Class 2",
    sectionClass: 2,
    limit: `70${EPSILON2}`,
    satisfied: input.ratio <= 70 * input.epsilon2,
  });

const trace3 = (input: ChsTraceInput) =>
  createChsTrace({
    ...input,
    label: "Class 3",
    sectionClass: 3,
    limit: `90${EPSILON2}`,
    satisfied: input.ratio <= 90 * input.epsilon2,
  });

type ChsTraceLimitInput = ChsTraceInput & {
  label: `Class ${SectionClass}`;
  sectionClass: 1 | 2 | 3;
  limit: string;
  satisfied: boolean;
};

const createChsTrace = (input: ChsTraceLimitInput) => ({
  label: input.label,
  ratio: input.ratio,
  limit: input.limit,
  satisfied: input.satisfied,
});
