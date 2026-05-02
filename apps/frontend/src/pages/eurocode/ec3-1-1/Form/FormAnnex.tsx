import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import { annexOptions } from "./options";
import { InputNumber } from "@components/inputs/InputNumber";
import { Ec311CustomRegisterContext } from "./Form";
import { useContext } from "react";

export const FormAnnex = () => {
  const { registerNumber, registerSelect } = useContext(
    Ec311CustomRegisterContext,
  );

  return (
    <Section>
      <SectionTitle>National Annex</SectionTitle>
      <HorizontalInput name="annexId" label={<TextLabel>Annex</TextLabel>}>
        <InputSelect {...registerSelect?.("annexId")} options={annexOptions} />
      </HorizontalInput>

      <HorizontalInput name="gamma_M0" label={<LatexLabel tex="\gamma_{M0}" />}>
        <InputNumber {...registerNumber?.("gamma_M0")} />
      </HorizontalInput>

      <HorizontalInput name="gamma_M1" label={<LatexLabel tex="\gamma_{M1}" />}>
        <InputNumber {...registerNumber?.("gamma_M1")} />
      </HorizontalInput>

      <HorizontalInput
        name="lambda_LT_0"
        label={<LatexLabel tex="\lambda_{LT,0}" />}
      >
        <InputNumber {...registerNumber?.("lambda_LT_0")} />
      </HorizontalInput>

      <HorizontalInput name="beta_LT" label={<LatexLabel tex="\beta_{LT}" />}>
        <InputNumber {...registerNumber?.("beta_LT")} />
      </HorizontalInput>
    </Section>
  );
};
