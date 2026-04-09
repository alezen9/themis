import { useFormContext, useWatch } from "react-hook-form";
import { InputSelect } from "../../../../../components/inputs/InputSelect";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  TORSIONAL_DEFORMATION_OPTIONS,
} from "../../options";
import { getError } from "./shared";

export const FormStability = () => {
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
      <legend className="px-1 text-xs font-semibold">Stability Options</legend>
      <div className="space-y-3">
        <InputSelect
          label="Torsional"
          error={getError(errors, "torsional_deformations")}
          {...register("torsional_deformations")}
        >
          {TORSIONAL_DEFORMATION_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </InputSelect>

        <InputSelect
          label="k-method"
          error={getError(errors, "interaction_factor_method")}
          {...register("interaction_factor_method")}
        >
          {INTERACTION_FACTOR_METHOD_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </InputSelect>

        {torsionalActive && (
          <InputSelect
            label="f method"
            error={getError(errors, "coefficient_f_method")}
            {...register("coefficient_f_method")}
          >
            {COEFFICIENT_F_METHOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}

        {torsionalActive && (
          <InputSelect
            label="LT curves"
            error={getError(errors, "buckling_curves_LT_policy")}
            {...register("buckling_curves_LT_policy")}
          >
            {BUCKLING_CURVES_LT_POLICY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}
      </div>
    </fieldset>
  );
};
