import { useFormContext } from "react-hook-form";
import { InputSelect } from "../../../../../components/inputs/InputSelect";
import type { Ec3FormValues } from "../../domain/formSchema";
import { getError, gradesByNorm } from "./shared";

export const FormMaterial = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Material</legend>
      <InputSelect
        label="Grade"
        error={getError(errors, "gradeId")}
        {...register("gradeId")}
      >
        {gradesByNorm.map((group) => (
          <optgroup key={group.norm} label={group.norm}>
            {group.grades.map((grade) => (
              <option
                key={`${grade.norm}:${grade.id}`}
                value={`${grade.norm}:${grade.id}`}
              >
                {grade.id} (fy={grade.fy})
              </option>
            ))}
          </optgroup>
        ))}
      </InputSelect>
    </fieldset>
  );
};
