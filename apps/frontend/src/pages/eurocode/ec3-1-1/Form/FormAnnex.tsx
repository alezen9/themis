import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import {
  annexOptions,
  bucklingCurvesLTPolicyOptions,
  coefficientFMethodOptions,
  interactionFactorMethodOptions,
} from "./options";
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
      <HorizontalInput name="annex_id" label={<TextLabel>Annex</TextLabel>}>
        <InputSelect {...registerSelect?.("annex_id")} options={annexOptions} />
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

      <HorizontalInput name="beta_LT" label={<LatexLabel tex="\beta_{LT}" />}>
        <InputNumber {...registerNumber?.("beta_LT")} />
      </HorizontalInput>

      <HorizontalInput name="f_method" label={<TextLabel>TBD</TextLabel>}>
        <InputSelect
          {...registerSelect?.("f_method")}
          options={coefficientFMethodOptions}
        />
      </HorizontalInput>

      <HorizontalInput
        name="interaction_factor_method"
        label={<TextLabel>Method</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("interaction_factor_method")}
          options={interactionFactorMethodOptions}
        />
      </HorizontalInput>

      <HorizontalInput
        name="buckling_curves_LT_policy"
        label={<TextLabel>TBD</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("buckling_curves_LT_policy")}
          options={bucklingCurvesLTPolicyOptions}
        />
      </HorizontalInput>
    </Section>
  );
};
