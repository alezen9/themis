import { HorizontalInput } from "@components/inputs/shared";
import { SpacingDivider } from "@components/Dividers";
import { LatexLabel, Section, SectionTitle } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { useEc311FormContext } from "./useEc311FormContext";

export const FormActions = () => {
  const { registerNumber, watch } = useEc311FormContext();
  const shape = watch("shape");

  return (
    <Section>
      <SectionTitle>Actions</SectionTitle>

      <HorizontalInput name="N_Ed_kN" label={<LatexLabel tex="N_{Ed}" />}>
        <InputNumber {...registerNumber?.("N_Ed_kN")} suffix="kN" />
      </HorizontalInput>

      <SpacingDivider />

      <HorizontalInput name="V_y_Ed_kN" label={<LatexLabel tex="V_{y,Ed}" />}>
        <InputNumber {...registerNumber?.("V_y_Ed_kN")} suffix="kN" />
      </HorizontalInput>

      <HorizontalInput name="V_z_Ed_kN" label={<LatexLabel tex="V_{z,Ed}" />}>
        <InputNumber {...registerNumber?.("V_z_Ed_kN")} suffix="kN" />
      </HorizontalInput>

      <SpacingDivider />

      <HorizontalInput name="M_y_Ed_kNm" label={<LatexLabel tex="M_{y,Ed}" />}>
        <InputNumber {...registerNumber?.("M_y_Ed_kNm")} suffix="kNm" />
      </HorizontalInput>

      <HorizontalInput name="M_z_Ed_kNm" label={<LatexLabel tex="M_{z,Ed}" />}>
        <InputNumber {...registerNumber?.("M_z_Ed_kNm")} suffix="kNm" />
      </HorizontalInput>

      {shape !== "I" && (
        <HorizontalInput name="T_Ed_kNm" label={<LatexLabel tex="T_{Ed}" />}>
          <InputNumber {...registerNumber?.("T_Ed_kNm")} suffix="kNm" />
        </HorizontalInput>
      )}
    </Section>
  );
};
