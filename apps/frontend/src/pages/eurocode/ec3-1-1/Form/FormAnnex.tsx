import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import {
  annexOptions,
  betaLTOptions,
  bucklingCurvesLTPolicyOptions,
  coefficientFMethodOptions,
  interactionFactorMethodOptions,
  lambdaLT0Options,
} from "./options";
import { InputNumber } from "@components/inputs/InputNumber";
import { useEc311FormContext } from "./useEc311FormContext";
import { ChangeHandler } from "react-hook-form";
import { eurocodeAnnex, italianAnnex } from "@ndg/ndg-ec3-1-1";

export const FormAnnex = () => {
  const { registerNumber, registerSelect, watch, reset, getValues, trigger } =
    useEc311FormContext();
  const bucklingCase = watch("buckling_curves_LT_policy");
  const isBucklingCaseDefault = bucklingCase === "default-rolled-welded";

  const onAnnexChange: ChangeHandler = async e => {
    const annex = [eurocodeAnnex, italianAnnex].find(
      a => a.id === e.target.value,
    );
    if (!annex) return;
    const { gamma_M2: _gamma_M2, ...coefficients } = annex.coefficients;
    reset({ ...getValues(), ...coefficients, annex_id: annex.id });
    await trigger();
  };

  return (
    <Section>
      <SectionTitle>National Annex</SectionTitle>
      <HorizontalInput name="annex_id" label={<TextLabel>Annex</TextLabel>}>
        <InputSelect
          {...registerSelect?.("annex_id")}
          onChange={onAnnexChange}
          options={annexOptions}
        />
      </HorizontalInput>

      <HorizontalInput name="gamma_M0" label={<LatexLabel tex="\gamma_{M0}" />}>
        <InputNumber {...registerNumber?.("gamma_M0")} />
      </HorizontalInput>

      <HorizontalInput name="gamma_M1" label={<LatexLabel tex="\gamma_{M1}" />}>
        <InputNumber {...registerNumber?.("gamma_M1")} />
      </HorizontalInput>

      <HorizontalInput name="eta" label={<LatexLabel tex="\eta" />}>
        <InputNumber {...registerNumber?.("eta")} />
      </HorizontalInput>

      <HorizontalInput
        name="lambda_LT_0"
        label={<LatexLabel tex="\lambda_{LT,0}" />}
      >
        <InputSelect
          {...registerSelect?.("lambda_LT_0")}
          options={lambdaLT0Options}
        />
      </HorizontalInput>

      <HorizontalInput name="beta_LT" label={<LatexLabel tex="\beta_{LT}" />}>
        <InputSelect {...registerSelect?.("beta_LT")} options={betaLTOptions} />
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
