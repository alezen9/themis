import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, TextLabel } from "./shared";
import { FormInputSelect } from "@components/inputs/FormInputSelect";
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
  const { registerNumber, watch, reset, getValues, trigger } =
    useEc311FormContext();
  const shape = watch("shape");
  const bucklingCase = watch("buckling_curves_LT_policy");
  const isBucklingCaseDefault = bucklingCase === "default-rolled-welded";
  const isIShape = shape === "I";
  const isChsShape = shape === "CHS";

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
        <FormInputSelect
          name="annex_id"
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

      {!isChsShape && (
        <HorizontalInput name="eta" label={<LatexLabel tex="\eta" />}>
          <InputNumber {...registerNumber?.("eta")} />
        </HorizontalInput>
      )}

      {isIShape && (
        <HorizontalInput
          name="lambda_LT_0"
          label={<LatexLabel tex="\lambda_{LT,0}" />}
        >
          <FormInputSelect name="lambda_LT_0" options={lambdaLT0Options} />
        </HorizontalInput>
      )}

      {isIShape && (
        <HorizontalInput name="beta_LT" label={<LatexLabel tex="\beta_{LT}" />}>
          <FormInputSelect name="beta_LT" options={betaLTOptions} />
        </HorizontalInput>
      )}

      {isIShape && (
        <HorizontalInput
          name="buckling_curves_LT_policy"
          label={<TextLabel>Buckling curves</TextLabel>}
        >
          <FormInputSelect
            name="buckling_curves_LT_policy"
            rules={{ deps: ["f_method"] }}
            options={bucklingCurvesLTPolicyOptions}
          />
        </HorizontalInput>
      )}

      {isIShape && isBucklingCaseDefault && (
        <HorizontalInput
          name="f_method"
          label={<LatexLabel tex="f" className="font-thin" />}
        >
          <FormInputSelect name="f_method" options={coefficientFMethodOptions} />
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
        <FormInputSelect
          name="interaction_factor_method"
          options={interactionFactorMethodOptions}
        />
      </HorizontalInput>
    </Section>
  );
};
