import { HorizontalInput } from "@components/inputs/shared";
import {
  LatexLabel,
  Section,
  SectionTitle,
  SpacingDivider,
  TextLabel,
} from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputNumber } from "@components/inputs/InputNumber";
import {
  loadApplicationLTOptions,
  momentShapeOptions,
  supportConditionOptions,
} from "./options";
import { Ec311CustomRegisterContext } from "./Form";
import { useContext } from "react";

export const FormMoment = () => {
  const { registerNumber, registerSelect } = useContext(
    Ec311CustomRegisterContext,
  );
  return (
    <Section>
      <SectionTitle>Moment Shape</SectionTitle>

      <HorizontalInput
        name="moment_shape_y"
        label={<TextLabel>Moment y</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("moment_shape_y")}
          options={momentShapeOptions}
        />
      </HorizontalInput>

      <HorizontalInput name="psi_y" label={<LatexLabel tex="\psi_y" />}>
        <InputNumber {...registerNumber?.("psi_y")} />
      </HorizontalInput>

      <HorizontalInput
        name="support_condition_y"
        label={<TextLabel>Support y</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("support_condition_y")}
          options={supportConditionOptions}
        />
      </HorizontalInput>

      <SpacingDivider />

      <HorizontalInput
        name="moment_shape_z"
        label={<TextLabel>Moment z</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("moment_shape_z")}
          options={momentShapeOptions}
        />
      </HorizontalInput>

      <HorizontalInput name="psi_z" label={<LatexLabel tex="\psi_z" />}>
        <InputNumber {...registerNumber?.("psi_z")} />
      </HorizontalInput>

      <HorizontalInput
        name="support_condition_z"
        label={<TextLabel>Support z</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("support_condition_z")}
          options={supportConditionOptions}
        />
      </HorizontalInput>

      <SpacingDivider />

      <HorizontalInput
        name="moment_shape_LT"
        label={<TextLabel>Moment LT</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("moment_shape_LT")}
          options={momentShapeOptions}
        />
      </HorizontalInput>

      <HorizontalInput name="psi_LT" label={<LatexLabel tex="\psi_{LT}" />}>
        <InputNumber {...registerNumber?.("psi_LT")} />
      </HorizontalInput>

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
        name="load_application_LT"
        label={<TextLabel>Load LT</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("load_application_LT")}
          options={loadApplicationLTOptions}
        />
      </HorizontalInput>
    </Section>
  );
};
