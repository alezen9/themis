import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, SpacingDivider } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { useEc311FormContext } from "./useEc311FormContext";

export const FormActions = () => {
  const { registerNumber } = useEc311FormContext();

  return (
    <Section>
      <SectionTitle>Actions</SectionTitle>

      <HorizontalInput name="N_Ed" label={<LatexLabel tex="N_{Ed}" />}>
        <InputNumber {...registerNumber?.("N_Ed")} suffix="kN" />
      </HorizontalInput>

      <SpacingDivider />

      <HorizontalInput name="V_y_Ed" label={<LatexLabel tex="V_{y,Ed}" />}>
        <InputNumber {...registerNumber?.("V_y_Ed")} suffix="kN" />
      </HorizontalInput>

      <HorizontalInput name="V_z_Ed" label={<LatexLabel tex="V_{z,Ed}" />}>
        <InputNumber {...registerNumber?.("V_z_Ed")} suffix="kN" />
      </HorizontalInput>

      <SpacingDivider />

      <HorizontalInput name="M_y_Ed" label={<LatexLabel tex="M_{y,Ed}" />}>
        <InputNumber {...registerNumber?.("M_y_Ed")} suffix="kNm" />
      </HorizontalInput>

      <HorizontalInput name="M_z_Ed" label={<LatexLabel tex="M_{z,Ed}" />}>
        <InputNumber {...registerNumber?.("M_z_Ed")} suffix="kNm" />
      </HorizontalInput>
    </Section>
  );
};
