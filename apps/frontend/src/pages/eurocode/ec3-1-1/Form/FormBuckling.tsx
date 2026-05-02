import { InputNumber } from "@components/inputs/InputNumber";
import { LatexLabel, Section, SectionTitle } from "./shared";
import { HorizontalInput } from "@components/inputs/shared";
import { Ec311CustomRegisterContext } from "./Form";
import { useContext } from "react";

export const FormBuckling = () => {
  const { registerNumber } = useContext(Ec311CustomRegisterContext);

  return (
    <Section>
      <SectionTitle>Buckling Lengths</SectionTitle>

      <HorizontalInput name="L" label={<LatexLabel tex="L" />}>
        <InputNumber {...registerNumber?.("L")} suffix="mm" />
      </HorizontalInput>

      <HorizontalInput name="k_y" label={<LatexLabel tex="k_y" />}>
        <InputNumber {...registerNumber?.("k_y")} />
      </HorizontalInput>

      <HorizontalInput name="k_z" label={<LatexLabel tex="k_z" />}>
        <InputNumber {...registerNumber?.("k_z")} />
      </HorizontalInput>
    </Section>
  );
};
