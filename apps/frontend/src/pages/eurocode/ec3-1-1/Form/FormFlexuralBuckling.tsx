import { HorizontalInput } from "@components/inputs/shared";
import { SpacingDivider } from "@components/Dividers";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { FormInputSelect } from "@components/inputs/FormInputSelect";
import { InputNumber } from "@components/inputs/InputNumber";
import { momentShapeOptions, supportConditionOptions } from "./options";
import { useEc311FormContext } from "./useEc311FormContext";

export const FormFlexuralBuckling = () => {
  return (
    <Section>
      <SectionTitle>Flexural Buckling</SectionTitle>
      <MomentY />
      <SpacingDivider />
      <MomentZ />
    </Section>
  );
};

const MomentY = () => {
  const { registerNumber, watch } = useEc311FormContext();
  const momentShape = watch("M_y_Ed_shape");
  const isMomentShapeLinear = momentShape === "linear";
  const isMomentShapeParabolic = momentShape === "parabolic";
  const isMomentShapeTriangular = momentShape === "triangular";

  const showPsi = isMomentShapeLinear;
  const showSupport = isMomentShapeParabolic || isMomentShapeTriangular;

  return (
    <>
      <HorizontalInput name="k_y" label={<LatexLabel tex="k_y" />}>
        <InputNumber {...registerNumber?.("k_y")} />
      </HorizontalInput>

      <HorizontalInput
        name="M_y_Ed_shape"
        label={<LatexLabel tex="M_{y} \; shape" className="text-[1.25rem]" />}
      >
        <FormInputSelect
          name="M_y_Ed_shape"
          rules={{ deps: ["psi_y", "support_condition_y"] }}
          options={momentShapeOptions}
        />
      </HorizontalInput>

      {showPsi && (
        <HorizontalInput name="psi_y" label={<LatexLabel tex="\psi_y" />}>
          <InputNumber {...registerNumber?.("psi_y")} />
        </HorizontalInput>
      )}

      {showSupport && (
        <HorizontalInput
          name="support_condition_y"
          label={<TextLabel>Support y</TextLabel>}
        >
          <FormInputSelect
            name="support_condition_y"
            options={supportConditionOptions}
          />
        </HorizontalInput>
      )}
    </>
  );
};

const MomentZ = () => {
  const { registerNumber, watch } = useEc311FormContext();
  const momentShape = watch("M_z_Ed_shape");
  const isMomentShapeLinear = momentShape === "linear";
  const isMomentShapeParabolic = momentShape === "parabolic";
  const isMomentShapeTriangular = momentShape === "triangular";

  const showPsi = isMomentShapeLinear;
  const showSupport = isMomentShapeParabolic || isMomentShapeTriangular;

  return (
    <>
      <HorizontalInput name="k_z" label={<LatexLabel tex="k_z" />}>
        <InputNumber {...registerNumber?.("k_z")} />
      </HorizontalInput>

      <HorizontalInput
        name="M_z_Ed_shape"
        label={<LatexLabel tex="M_{z} \; shape" className="text-[1.25rem]" />}
      >
        <FormInputSelect
          name="M_z_Ed_shape"
          rules={{ deps: ["psi_z", "support_condition_z"] }}
          options={momentShapeOptions}
        />
      </HorizontalInput>

      {showPsi && (
        <HorizontalInput name="psi_z" label={<LatexLabel tex="\psi_z" />}>
          <InputNumber {...registerNumber?.("psi_z")} />
        </HorizontalInput>
      )}

      {showSupport && (
        <HorizontalInput
          name="support_condition_z"
          label={<TextLabel>Support z</TextLabel>}
        >
          <FormInputSelect
            name="support_condition_z"
            options={supportConditionOptions}
          />
        </HorizontalInput>
      )}
    </>
  );
};
