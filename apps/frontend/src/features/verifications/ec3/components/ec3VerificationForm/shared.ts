import type { FieldErrors } from "react-hook-form";
import { steelGrades } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../domain/formSchema";
type SteelGrade = (typeof steelGrades)[number];

export const gradesByNorm = steelGrades.reduce<
  { norm: string; grades: SteelGrade[] }[]
>((groups, grade) => {
  const group = groups.find((candidate) => candidate.norm === grade.norm);

  if (group) {
    group.grades.push(grade);
    return groups;
  }

  groups.push({
    norm: grade.norm,
    grades: [grade],
  });

  return groups;
}, []);

export const getError = (errors: FieldErrors<Ec3FormValues>, name: string) => {
  const message = (
    errors as Record<string, { message?: unknown } | undefined>
  )[name]?.message;

  return typeof message === "string" ? message : undefined;
};
