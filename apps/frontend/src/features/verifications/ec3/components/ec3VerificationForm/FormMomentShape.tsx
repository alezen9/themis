import { useFormContext, useWatch } from "react-hook-form";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputSelect } from "@components/inputs/InputSelect";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  LOAD_APPLICATION_LT_OPTIONS,
  MOMENT_SHAPE_OPTIONS,
  SUPPORT_CONDITION_OPTIONS,
} from "../../options";
import { Ec3FieldLabel, getError } from "./shared";

export const FormMomentShape = () => {
  const {
    control,
    formState: { errors },
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
  const yIsLinear = momentShapeY === "linear";
  const zIsLinear = momentShapeZ === "linear";
  const ltIsLinear = momentShapeLt === "linear";

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Moment Shape</legend>
      <div className="space-y-3">
        <InputSelect
          label={<Ec3FieldLabel text="Moment Shape y" tex="\mu_y" />}
          name="moment_shape_y"
          options={MOMENT_SHAPE_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputNumber
          name="psi_y"
          label={<Ec3FieldLabel text="Moment Gradient y" tex="\psi_y" />}
          suffix="[ -1 . . 1 ]"
          step="any"
          disabled={!yIsLinear}
          error={yIsLinear ? getError(errors, "psi_y") : undefined}
        />

        <InputSelect
          label="Support Condition y"
          name="support_condition_y"
          disabled={!yNeedsSupport}
          options={SUPPORT_CONDITION_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label={<Ec3FieldLabel text="Moment Shape z" tex="\mu_z" />}
          name="moment_shape_z"
          options={MOMENT_SHAPE_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputNumber
          name="psi_z"
          label={<Ec3FieldLabel text="Moment Gradient z" tex="\psi_z" />}
          suffix="[ -1 . . 1 ]"
          step="any"
          disabled={!zIsLinear}
          error={zIsLinear ? getError(errors, "psi_z") : undefined}
        />

        <InputSelect
          label="Support Condition z"
          name="support_condition_z"
          disabled={!zNeedsSupport}
          options={SUPPORT_CONDITION_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label={<Ec3FieldLabel text="Moment Shape LT" tex="\mu_{LT}" />}
          name="moment_shape_LT"
          disabled={!torsionalActive}
          options={MOMENT_SHAPE_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputNumber
          name="psi_LT"
          label={<Ec3FieldLabel text="Moment Gradient LT" tex="\psi_{LT}" />}
          suffix="[ -1 . . 1 ]"
          step="any"
          disabled={!torsionalActive || !ltIsLinear}
          error={
            torsionalActive && ltIsLinear
              ? getError(errors, "psi_LT")
              : undefined
          }
        />

        <InputSelect
          label="Support Condition LT"
          name="support_condition_LT"
          disabled={!torsionalActive || !ltNeedsSupport}
          options={SUPPORT_CONDITION_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label="Load Application LT"
          name="load_application_LT"
          disabled={!torsionalActive || !ltNeedsSupport}
          options={LOAD_APPLICATION_LT_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />
      </div>
    </fieldset>
  );
};
