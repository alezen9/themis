import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputNumber } from "@components/inputs/InputNumber";
import {
  loadApplicationLTOptions,
  momentShapeOptions,
  supportConditionOptions,
} from "./options";
import { Ec311CustomRegisterContext } from "./Form";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { InputToggle } from "@components/inputs/InputToggle";

export const FormLaterailTorsionalBuckling = () => {
  const { registerBoolean, registerNumber, registerSelect } = useContext(
    Ec311CustomRegisterContext,
  );
  const { watch } = useFormContext<Ec3FormValues>();
  const isActive = watch("active_LT");
  const momentShape = watch("M_LT_shape");
  const isMomentShapeLinear = momentShape === "linear";
  const isMomentShapeParabolic = momentShape === "parabolic";
  const isMomentShapeTriangular = momentShape === "triangular";

  const showPsi = isMomentShapeLinear;
  const showSupportAndLoad = isMomentShapeParabolic || isMomentShapeTriangular;

  return (
    <Section>
      <div className="flex items-center justify-between gap-4 w-full mb-2">
        <SectionTitle className="mb-0">Lateral Torsional Buckling</SectionTitle>
        <InputToggle {...registerBoolean?.("active_LT")} className="h-6 w-12" />
      </div>

      {isActive && (
        <>
          <HorizontalInput name="k_LT" label={<LatexLabel tex="k_{LT}" />}>
            <InputNumber {...registerNumber?.("k_LT")} />
          </HorizontalInput>

          <HorizontalInput
            name="M_LT_shape"
            label={<LatexLabel tex="M_{LT}" />}
          >
            <InputSelect
              {...registerSelect?.("M_LT_shape")}
              options={momentShapeOptions}
            />
          </HorizontalInput>

          {showPsi && (
            <HorizontalInput name="psi_LT" label={<LatexLabel tex="\psi_LT" />}>
              <InputNumber {...registerNumber?.("psi_LT")} />
            </HorizontalInput>
          )}

          {showSupportAndLoad && (
            <>
              <HorizontalInput
                name="support_condition_LT"
                label={<TextLabel>Support LT</TextLabel>}
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
