import { useFormContext, useWatch } from "react-hook-form";
import { InputRadioGroup } from "@components/inputs/InputRadioGroup";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputToggle } from "@components/inputs/InputToggle";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  BUCKLING_CURVES_LT_POLICY_OPTIONS,
  COEFFICIENT_F_METHOD_OPTIONS,
  INTERACTION_FACTOR_METHOD_OPTIONS,
} from "../../options";
import { Ec3FieldLabel } from "./shared";

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
        <InputToggle
          label="Torsional Deformations"
          name="torsional_deformations"
          checkedValue="yes"
          uncheckedValue="no"
        />

        <InputSelect
          label="Interaction Factor Method"
          name="interaction_factor_method"
          options={INTERACTION_FACTOR_METHOD_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputRadioGroup
          label={<Ec3FieldLabel text="f Method" tex="f" />}
          name="coefficient_f_method"
          disabled={!torsionalActive}
          orientation="inline"
          options={COEFFICIENT_F_METHOD_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputRadioGroup
          label="LT Curves Policy"
          name="buckling_curves_LT_policy"
          disabled={!torsionalActive}
          orientation="inline"
          options={BUCKLING_CURVES_LT_POLICY_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      </div>
    </fieldset>
  );
};
