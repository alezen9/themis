import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { constantCatalog } from "@ndg/ndg-core";
import { getDisplayUnitOptionsByKey } from "@ndg/ndg-ec3-1-1";
import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputText } from "@components/inputs/InputText";

import { Section, SectionTitle } from "./shared";
import {
  DisplayUnitField,
  FormFieldLatex,
  SymbolKeyPreview,
} from "./nodeFields";
import { constantKeyOptions } from "./options";
import {
  constantNodeSchema,
  type ConstantNode,
} from "../../document/editorNodeSchema";

type Props = {
  formId: string;
  defaultValues: ConstantNode;
  onSubmit: (values: ConstantNode) => void;
};

export const ConstantForm = (props: Props) => {
  const { formId, defaultValues, onSubmit } = props;
  const form = useForm<ConstantNode>({
    resolver: zodResolver(constantNodeSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <ConstantFields />
      </form>
    </FormProvider>
  );
};

const ConstantFields = () => {
  const { register, registerNumber, setValue, watch } =
    useTypedFormContext<ConstantNode>();
  const key = watch("key") ?? "";
  const isCustom = !constantCatalog[key];
  const preset = constantCatalog[key] ? key : "custom";
  const showDefinition = isCustom || getDisplayUnitOptionsByKey(key).length > 0;

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
              <div className="flex flex-col gap-2">
                <InputSelect
                  name="constant-preset"
                  options={constantKeyOptions}
                  value={preset}
                  onChange={event => {
                    const entry = constantCatalog[event.target.value];
                    setValue("key", entry ? event.target.value : "", {
                      shouldValidate: true,
                    });
                    setValue("symbol", entry?.symbol);
                    setValue("value", undefined);
                  }}
                />
                {isCustom && (
                  <InputText placeholder="custom_key" {...register("key")} />
                )}
              </div>
            </FormField>
          </div>
          <div className="col-span-2">
            <SymbolKeyPreview />
          </div>
        </div>
      </Section>
      {showDefinition && (
        <Section>
          <SectionTitle>Definition</SectionTitle>
          <div className="grid grid-cols-4 gap-4">
            {isCustom && (
              <FormFieldLatex
                name="symbol"
                label="Symbol"
                description="Expression symbol"
              >
                <InputText
                  placeholder={"\\gamma_{M0}"}
                  {...register("symbol")}
                />
              </FormFieldLatex>
            )}
            {isCustom && (
              <div className="col-span-2">
                <FormField
                  name="value"
                  label="Value"
                  description="Fixed numeric value"
                >
                  <InputNumber {...registerNumber("value")} />
                </FormField>
              </div>
            )}
            <DisplayUnitField />
          </div>
        </Section>
      )}
    </>
  );
};
