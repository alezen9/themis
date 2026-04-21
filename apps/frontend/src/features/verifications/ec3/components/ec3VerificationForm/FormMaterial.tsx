import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { gradesByNorm } from "./shared";

export const FormMaterial = () => {
  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Material</legend>
      <InputAutocomplete
        label="Steel Grade"
        name="gradeId"
        options={gradesByNorm.flatMap((group) =>
          group.grades.map((grade) => ({
            label: `${group.norm} / ${grade.id} (fy=${grade.fy})`,
            value: `${grade.norm}:${grade.id}`,
          })),
        )}
      />
    </fieldset>
  );
};
