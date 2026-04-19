import { useFormContext, useWatch } from "react-hook-form";
import { InputNumber } from "../../../../../components/inputs/InputNumber";
import type { Ec3FormValues } from "../../domain/formSchema";
import { getError } from "./shared";

export const FormBuckling = () => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();
  const torsionalDeformations = useWatch({
    control,
    name: "torsional_deformations",
  });
  const torsionalActive = torsionalDeformations === "yes";

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Buckling</legend>
      <div className="space-y-3">
        <InputNumber
          label="L"
          suffix="m"
          step="any"
          error={getError(errors, "L")}
          {...register("L", { valueAsNumber: true })}
        />
        <InputNumber
          label="k_y"
          step="any"
          error={getError(errors, "k_y")}
          {...register("k_y", { valueAsNumber: true })}
        />
        <InputNumber
          label="k_z"
          step="any"
          error={getError(errors, "k_z")}
          {...register("k_z", { valueAsNumber: true })}
        />

        <InputNumber
          label="k_LT"
          step="any"
          disabled={!torsionalActive}
          error={torsionalActive ? getError(errors, "k_LT") : undefined}
          {...register("k_LT", { valueAsNumber: true })}
        />

        <InputNumber
          label="k_T"
          step="any"
          disabled={!torsionalActive}
          error={torsionalActive ? getError(errors, "k_T") : undefined}
          {...register("k_T", { valueAsNumber: true })}
        />
      </div>
    </fieldset>
  );
};
