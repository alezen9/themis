import { useFormContext, useWatch } from "react-hook-form";
import { InputSelect } from "../../../../../components/inputs/InputSelect";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
  TORSIONAL_DEFORMATION_OPTIONS,
} from "../../options";

export const FormStability = () => {
  const { control } = useFormContext<Ec3FormValues>();
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
          name="torsional_deformations"
          options={TORSIONAL_DEFORMATION_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label="k-method"
          name="interaction_factor_method"
          options={INTERACTION_FACTOR_METHOD_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label="f method"
          name="coefficient_f_method"
          disabled={!torsionalActive}
          options={COEFFICIENT_F_METHOD_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label="LT curves"
          name="buckling_curves_LT_policy"
          disabled={!torsionalActive}
          options={BUCKLING_CURVES_LT_POLICY_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      </div>
    </fieldset>
  );
};
