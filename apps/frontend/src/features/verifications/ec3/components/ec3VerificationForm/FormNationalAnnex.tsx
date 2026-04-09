import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { InputNumber } from "../../../../../components/inputs/InputNumber";
import { InputSelect } from "../../../../../components/inputs/InputSelect";
import type { Ec3FormValues } from "../../domain/formSchema";
import { ANNEXES } from "../../hooks/useEc3Workbench";
import { getError } from "./shared";

export const FormNationalAnnex = () => {
  const {
    control,
    formState: { errors },
    register,
    setValue,
  } = useFormContext<Ec3FormValues>();
  const annexId = useWatch({ control, name: "annexId" }) || ANNEXES[0]?.id;

  useEffect(() => {
    const annex = ANNEXES.find((candidate) => candidate.id === annexId);
    if (!annex) {
      return;
    }

    setValue("gamma_M0", annex.coefficients.gamma_M0, { shouldValidate: true });
    setValue("gamma_M1", annex.coefficients.gamma_M1, { shouldValidate: true });
    setValue("lambda_LT_0", annex.coefficients.lambda_LT_0, {
      shouldValidate: true,
    });
    setValue("beta_LT", annex.coefficients.beta_LT, { shouldValidate: true });
  }, [annexId, setValue]);

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">National Annex</legend>
      <div className="space-y-3">
        <InputSelect
          label="Annex"
          error={getError(errors, "annexId")}
          {...register("annexId")}
        >
          {ANNEXES.map((annex) => (
            <option key={annex.id} value={annex.id}>
              {annex.name}
            </option>
          ))}
        </InputSelect>

        <InputNumber
          label="gamma_M0"
          step="any"
          error={getError(errors, "gamma_M0")}
          {...register("gamma_M0", { valueAsNumber: true })}
        />
        <InputNumber
          label="gamma_M1"
          step="any"
          error={getError(errors, "gamma_M1")}
          {...register("gamma_M1", { valueAsNumber: true })}
        />
        <InputNumber
          label="lambda_LT_0"
          step="any"
          error={getError(errors, "lambda_LT_0")}
          {...register("lambda_LT_0", { valueAsNumber: true })}
        />
        <InputNumber
          label="beta_LT"
          step="any"
          error={getError(errors, "beta_LT")}
          {...register("beta_LT", { valueAsNumber: true })}
        />
      </div>
    </fieldset>
  );
};
