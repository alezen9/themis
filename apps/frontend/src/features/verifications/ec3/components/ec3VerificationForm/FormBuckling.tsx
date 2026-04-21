import { useFormContext, useWatch } from "react-hook-form";
import { InputNumber } from "@components/inputs/InputNumber";
import type { Ec3FormValues } from "../../domain/formSchema";
import { Ec3FieldLabel, getError } from "./shared";

export const FormBuckling = () => {
  const {
    control,
    formState: { errors },
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
          name="L"
          label={<Ec3FieldLabel text="Member Length" tex="L" />}
          suffix="m"
          step="any"
          error={getError(errors, "L")}
        />
        <InputNumber
          name="k_y"
          label={<Ec3FieldLabel text="Effective Length Factor y" tex="k_y" />}
          step="any"
          error={getError(errors, "k_y")}
        />
        <InputNumber
          name="k_z"
          label={<Ec3FieldLabel text="Effective Length Factor z" tex="k_z" />}
          step="any"
          error={getError(errors, "k_z")}
        />

        <InputNumber
          name="k_LT"
          label={
            <Ec3FieldLabel text="Lateral-Torsional Factor" tex="k_{LT}" />
          }
          step="any"
          disabled={!torsionalActive}
          error={torsionalActive ? getError(errors, "k_LT") : undefined}
        />

        <InputNumber
          name="k_T"
          label={<Ec3FieldLabel text="Torsional Factor" tex="k_T" />}
          step="any"
          disabled={!torsionalActive}
          error={torsionalActive ? getError(errors, "k_T") : undefined}
        />
      </div>
    </fieldset>
  );
};
