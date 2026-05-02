import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, SpacingDivider } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { useContext } from "react";
import { Ec311CustomRegisterContext } from "./Form";

export const FormGeometry = () => {
  const { registerNumber } = useContext(Ec311CustomRegisterContext);

  return (
    <Section>
      <SectionTitle>Geometry</SectionTitle>

      {/* Shared by I and RHS */}
      <HorizontalInput name="h" label={<LatexLabel tex="h" />}>
        <InputNumber {...registerNumber?.("h")} suffix="mm" />
      </HorizontalInput>

      <HorizontalInput name="b" label={<LatexLabel tex="b" />}>
        <InputNumber {...registerNumber?.("b")} suffix="mm" />
      </HorizontalInput>

      <HorizontalInput name="tw" label={<LatexLabel tex="t_w" />}>
        <InputNumber {...registerNumber?.("tw")} suffix="mm" />
      </HorizontalInput>

      <SpacingDivider />

      {/* I section only */}
      <HorizontalInput name="tf" label={<LatexLabel tex="t_f" />}>
        <InputNumber {...registerNumber?.("tf")} suffix="mm" />
      </HorizontalInput>

      <HorizontalInput name="r" label={<LatexLabel tex="r" />}>
        <InputNumber {...registerNumber?.("r")} suffix="mm" />
      </HorizontalInput>

      <SpacingDivider />

      {/* RHS section only */}
      <HorizontalInput name="ro" label={<LatexLabel tex="r_o" />}>
        <InputNumber {...registerNumber?.("ro")} suffix="mm" />
      </HorizontalInput>

      <HorizontalInput name="ri" label={<LatexLabel tex="r_i" />}>
        <InputNumber {...registerNumber?.("ri")} suffix="mm" />
      </HorizontalInput>

      <SpacingDivider />

      {/* CHS section only */}
      <HorizontalInput name="d" label={<LatexLabel tex="d" />}>
        <InputNumber {...registerNumber?.("d")} suffix="mm" />
      </HorizontalInput>

      <HorizontalInput name="t" label={<LatexLabel tex="t" />}>
        <InputNumber {...registerNumber?.("t")} suffix="mm" />
      </HorizontalInput>
    </Section>
  );
};
