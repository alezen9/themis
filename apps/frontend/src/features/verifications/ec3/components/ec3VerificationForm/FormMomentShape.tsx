import { useFormContext, useWatch } from "react-hook-form";
import { InputNumber } from "../../../../../components/inputs/InputNumber";
import { InputSelect } from "../../../../../components/inputs/InputSelect";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  LOAD_APPLICATION_LT_OPTIONS,
  MOMENT_SHAPE_OPTIONS,
  SUPPORT_CONDITION_OPTIONS,
} from "../../options";
import { getError } from "./shared";

export const FormMomentShape = () => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();
  const momentShapeY = useWatch({ control, name: "moment_shape_y" });
  const momentShapeZ = useWatch({ control, name: "moment_shape_z" });
  const torsionalDeformations = useWatch({
    control,
    name: "torsional_deformations",
  });
  const momentShapeLt = useWatch({ control, name: "moment_shape_LT" });
  const torsionalActive = torsionalDeformations === "yes";
  const yNeedsSupport =
    momentShapeY === "parabolic" || momentShapeY === "triangular";
  const zNeedsSupport =
    momentShapeZ === "parabolic" || momentShapeZ === "triangular";
  const ltNeedsSupport =
    momentShapeLt === "parabolic" || momentShapeLt === "triangular";

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Moment Shape</legend>
      <div className="space-y-3">
        <InputSelect
          label="shape y"
          error={getError(errors, "moment_shape_y")}
          {...register("moment_shape_y")}
        >
          {MOMENT_SHAPE_OPTIONS.map((option) => (
            <option key={`y-${option}`} value={option}>
              {option}
            </option>
          ))}
        </InputSelect>

        {momentShapeY === "linear" && (
          <InputNumber
            label="psi_y"
            suffix="[-1,1]"
            step="any"
            error={getError(errors, "psi_y")}
            {...register("psi_y", { valueAsNumber: true })}
          />
        )}

        {yNeedsSupport && (
          <InputSelect
            label="support y"
            error={getError(errors, "support_condition_y")}
            {...register("support_condition_y")}
          >
            {SUPPORT_CONDITION_OPTIONS.map((option) => (
              <option key={`sy-${option}`} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}

        <InputSelect
          label="shape z"
          error={getError(errors, "moment_shape_z")}
          {...register("moment_shape_z")}
        >
          {MOMENT_SHAPE_OPTIONS.map((option) => (
            <option key={`z-${option}`} value={option}>
              {option}
            </option>
          ))}
        </InputSelect>

        {momentShapeZ === "linear" && (
          <InputNumber
            label="psi_z"
            suffix="[-1,1]"
            step="any"
            error={getError(errors, "psi_z")}
            {...register("psi_z", { valueAsNumber: true })}
          />
        )}

        {zNeedsSupport && (
          <InputSelect
            label="support z"
            error={getError(errors, "support_condition_z")}
            {...register("support_condition_z")}
          >
            {SUPPORT_CONDITION_OPTIONS.map((option) => (
              <option key={`sz-${option}`} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}

        {torsionalActive && (
          <InputSelect
            label="shape LT"
            error={getError(errors, "moment_shape_LT")}
            {...register("moment_shape_LT")}
          >
            {MOMENT_SHAPE_OPTIONS.map((option) => (
              <option key={`lt-${option}`} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}

        {torsionalActive && momentShapeLt === "linear" && (
          <InputNumber
            label="psi_LT"
            suffix="[-1,1]"
            step="any"
            error={getError(errors, "psi_LT")}
            {...register("psi_LT", { valueAsNumber: true })}
          />
        )}

        {torsionalActive && ltNeedsSupport && (
          <InputSelect
            label="support LT"
            error={getError(errors, "support_condition_LT")}
            {...register("support_condition_LT")}
          >
            {SUPPORT_CONDITION_OPTIONS.map((option) => (
              <option key={`slt-${option}`} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}

        {torsionalActive && ltNeedsSupport && (
          <InputSelect
            label="load LT"
            error={getError(errors, "load_application_LT")}
            {...register("load_application_LT")}
          >
            {LOAD_APPLICATION_LT_OPTIONS.map((option) => (
              <option key={`llt-${option}`} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}
      </div>
    </fieldset>
  );
};
