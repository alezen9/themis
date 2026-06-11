import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { getBaseUnit } from "@ndg/ndg-core";
import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { InputText } from "@components/inputs/InputText";
import { InputTextarea } from "@components/inputs/InputTextarea";

import { Section, SectionTitle } from "./shared";
import {
  DisplayUnitColumn,
  FormFieldLatex,
  MetadataFields,
  VariantField,
} from "./nodeFields";
import {
  formulaFormSchema,
  type FormulaNode,
} from "../../document/editorNodeSchema";

type Props = {
  formId: string;
  defaultValues: FormulaNode;
  onSubmit: (values: FormulaNode) => void;
};

export const FormulaForm = (props: Props) => {
  const { formId, defaultValues, onSubmit } = props;
  const form = useForm<FormulaNode>({
    resolver: zodResolver(formulaFormSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FormulaFields />
      </form>
    </FormProvider>
  );
};

const FormulaFields = () => {
  const { register, setValue, watch } = useTypedFormContext<FormulaNode>();
  const isSelect = watch("variant") === "select";

  return (
    <>
      <Section>
        <SectionTitle>Identity</SectionTitle>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <FormField
              name="key"
              label="Key"
              description="Unique id used by formulas"
            >
              <InputText
                {...register("key", {
                  onChange: event =>
                    setValue(
                      "displayUnit",
                      getBaseUnit(event.target.value)?.key,
                    ),
                })}
              />
            </FormField>
          </div>
          <div className="col-span-2">
            <VariantField />
          </div>
        </div>
      </Section>
      {!isSelect && (
        <Section>
          <SectionTitle>Definition</SectionTitle>
          <div className="grid grid-cols-4 grid-rows-1 gap-4">
            <div className="col-span-4">
              <FormFieldLatex
                name="template"
                label="Template"
                description="Keyed LaTeX, e.g. \frac{\key{A_mm2} \cdot \key{fy_MPa}}{\key{gamma_M0}}"
              >
                <InputTextarea
                  placeholder={
                    "\\frac{\\key{A_mm2} \\cdot \\key{fy_MPa}}{\\key{gamma_M0}}"
                  }
                  {...register("template")}
                />
              </FormFieldLatex>
            </div>
            <FormFieldLatex
              name="symbol"
              label="Symbol"
              description="Expression symbol"
            >
              <InputText placeholder={"\\gamma_{M0}"} {...register("symbol")} />
            </FormFieldLatex>
            <DisplayUnitColumn />
          </div>
        </Section>
      )}
      <MetadataFields />
    </>
  );
};
