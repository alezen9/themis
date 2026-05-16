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
import { useEc311FormContext } from "./useEc311FormContext";

export const FormAnnex = () => {
  const { registerNumber, registerSelect, watch } = useEc311FormContext();
  const bucklingCase = watch("buckling_curves_LT_policy");
  const isBucklingCaseDefault = bucklingCase === "default-rolled-welded";

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

      <HorizontalInput
        name="buckling_curves_LT_policy"
        label={<TextLabel>Buckling curves</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("buckling_curves_LT_policy", {
            deps: ["f_method"],
          })}
          options={bucklingCurvesLTPolicyOptions}
        />
      </HorizontalInput>

      {isBucklingCaseDefault && (
        <HorizontalInput
          name="f_method"
          label={<LatexLabel tex="f" className="font-thin" />}
        >
          <InputSelect
            {...registerSelect?.("f_method")}
            options={coefficientFMethodOptions}
          />
        </HorizontalInput>
      )}

      <HorizontalInput
        name="interaction_factor_method"
        label={
          <LatexLabel
            tex="k_{ij} \; method"
            className="text-[1.25rem] font-thin"
          />
        }
      >
        <InputSelect
          {...registerSelect?.("interaction_factor_method")}
          options={interactionFactorMethodOptions}
        />
      </HorizontalInput>
    </Section>
  );
};
