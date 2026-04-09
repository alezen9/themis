import { useFormContext } from "react-hook-form";
import { InputNumber } from "../../../../../components/inputs/InputNumber";
import type { Ec3FormValues } from "../../domain/formSchema";
import { getError } from "./shared";

export const FormActions = () => {
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Actions</legend>
      <div className="space-y-3">
        <InputNumber
          label="N_Ed"
          suffix="kN"
          step="any"
          error={getError(errors, "N_Ed")}
          {...register("N_Ed", { valueAsNumber: true })}
        />
        <InputNumber
          label="M_y_Ed"
          suffix="kNm"
          step="any"
          error={getError(errors, "M_y_Ed")}
          {...register("M_y_Ed", { valueAsNumber: true })}
        />
        <InputNumber
          label="M_z_Ed"
          suffix="kNm"
          step="any"
          error={getError(errors, "M_z_Ed")}
          {...register("M_z_Ed", { valueAsNumber: true })}
        />
        <InputNumber
          label="V_y_Ed"
          suffix="kN"
          step="any"
          error={getError(errors, "V_y_Ed")}
          {...register("V_y_Ed", { valueAsNumber: true })}
        />
        <InputNumber
          label="V_z_Ed"
          suffix="kN"
          step="any"
          error={getError(errors, "V_z_Ed")}
          {...register("V_z_Ed", { valueAsNumber: true })}
        />
      </div>
    </fieldset>
  );
};
