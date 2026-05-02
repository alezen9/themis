import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputSelect } from "@components/inputs/InputSelect";
import { Ec311CustomRegisterContext } from "./Form";
import { useContext } from "react";
import {
  bucklingCurvesLTPolicyOptions,
  coefficientFMethodOptions,
  interactionFactorMethodOptions,
} from "./options";

export const FormStability = () => {
  const { registerNumber, registerSelect } = useContext(
    Ec311CustomRegisterContext,
  );

  return (
    <Section>
      <SectionTitle>Stability</SectionTitle>

      <ul>
        <li>Torsional deformations, toggle</li>
      </ul>

      <HorizontalInput name="k_LT" label={<LatexLabel tex="k_{LT}" />}>
        <InputNumber {...registerNumber?.("k_LT")} />
      </HorizontalInput>

      <HorizontalInput name="k_T" label={<LatexLabel tex="k_T" />}>
        <InputNumber {...registerNumber?.("k_T")} />
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
        name="coefficient_f_method"
        label={<LatexLabel tex="f" />}
      >
        <InputSelect
          {...registerSelect?.("coefficient_f_method")}
          options={coefficientFMethodOptions}
        />
      </HorizontalInput>

      <HorizontalInput
        name="buckling_curves_LT_policy"
        label={<TextLabel>LT curve policy</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("buckling_curves_LT_policy")}
          options={bucklingCurvesLTPolicyOptions}
        />
      </HorizontalInput>
    </Section>
  );
};
