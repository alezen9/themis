import { InputNumber } from "@components/inputs/InputNumber";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputToggle } from "@components/inputs/InputToggle";
import { HorizontalInput } from "@components/inputs/shared";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Ec311CustomRegisterContext } from "./Form";
import {
  loadApplicationLTOptions,
  momentShapeOptions,
  supportConditionOptions,
} from "./options";
import { Ec3FormValues } from "./schema";
import {
  LatexLabel,
  Section,
  SectionTitle,
  SpacingDivider,
  TextLabel,
} from "./shared";

export const FormStabilityChecks = () => {
  const { registerBoolean, registerNumber, registerSelect } = useContext(
    Ec311CustomRegisterContext,
  );
  const { watch } = useFormContext<Ec3FormValues>();
  const includeTorsionalModes = watch("include_torsional_modes");
  const momentShape = watch("M_y_Ed_shape_LT");
  const isMomentShapeLinear = momentShape === "linear";
  const isMomentShapeParabolic = momentShape === "parabolic";
  const isMomentShapeTriangular = momentShape === "triangular";

  const showPsi = isMomentShapeLinear;
  const showSupportAndLoad = isMomentShapeParabolic || isMomentShapeTriangular;

  return (
    <Section>
      <div className="mb-2 flex w-full items-center justify-between gap-4">
        <SectionTitle className="mb-0">Stability Checks</SectionTitle>
        <InputToggle
          {...registerBoolean?.("include_torsional_modes")}
          aria-label="Toggle stability checks"
          className="h-6 w-12"
        />
      </div>

      {includeTorsionalModes && (
        <>
          <HorizontalInput name="k_T" label={<LatexLabel tex="k_T" />}>
            <InputNumber {...registerNumber?.("k_T")} />
          </HorizontalInput>

          <SpacingDivider />

          <HorizontalInput name="k_LT" label={<LatexLabel tex="k_{LT}" />}>
            <InputNumber {...registerNumber?.("k_LT")} />
          </HorizontalInput>

          <HorizontalInput
            name="M_y_Ed_shape_LT"
            label={
              <span className="flex items-baseline gap-2">
                <LatexLabel tex="M_{y,Ed}" className="text-[1.25rem]" />
                <TextLabel>shape</TextLabel>
              </span>
            }
          >
            <InputSelect
              {...registerSelect?.("M_y_Ed_shape_LT")}
              options={momentShapeOptions}
            />
          </HorizontalInput>

          {showPsi && (
            <HorizontalInput
              name="psi_y_LT"
              label={<LatexLabel tex="\psi_{y,LT}" />}
            >
              <InputNumber {...registerNumber?.("psi_y_LT")} />
            </HorizontalInput>
          )}

          {showSupportAndLoad && (
            <>
              <HorizontalInput
                name="support_condition_LT"
                label={<TextLabel>LT support</TextLabel>}
              >
                <InputSelect
                  {...registerSelect?.("support_condition_LT")}
                  options={supportConditionOptions}
                />
              </HorizontalInput>
              <HorizontalInput
                name="load_LT"
                label={<TextLabel>Load application</TextLabel>}
              >
                <InputSelect
                  {...registerSelect?.("load_LT")}
                  options={loadApplicationLTOptions}
                />
              </HorizontalInput>
            </>
          )}
        </>
      )}
    </Section>
  );
};
