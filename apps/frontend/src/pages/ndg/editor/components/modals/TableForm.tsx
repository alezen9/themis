import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { FormInputAutocomplete } from "@components/inputs/FormInputAutocomplete";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputText } from "@components/inputs/InputText";

import { Section, SectionTitle } from "./shared";
import {
  DisplayUnitColumn,
  FormFieldLatex,
  MetadataFields,
} from "./nodeFields";
import { tableKeyOptions, valueTypeOptions } from "./options";
import {
  tableNodeSchema,
  type TableNode,
} from "../../document/editorNodeSchema";

type Props = {
  formId: string;
  defaultValues: TableNode;
  onSubmit: (values: TableNode) => void;
};

export const TableForm = (props: Props) => {
  const { formId, defaultValues, onSubmit } = props;
  const form = useForm<TableNode>({
    resolver: zodResolver(tableNodeSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <TableFields />
      </form>
    </FormProvider>
  );
};

const TableFields = () => {
  const { register } = useTypedFormContext<TableNode>();

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
              <FormInputAutocomplete name="key" options={tableKeyOptions} required />
            </FormField>
          </div>
          <div className="col-span-2">
            <FormField
              name="valueType"
              label="Value type"
              description="Expected runtime value"
            >
              <div className="flex items-center w-full gap-4">
                {valueTypeOptions.map(option => (
                  <InputRadio
                    key={option.value}
                    {...register("valueType.type")}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </div>
            </FormField>
          </div>
        </div>
      </Section>
      <Section>
        <SectionTitle>Definition</SectionTitle>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <FormField
              name="source"
              label="Source"
              description="Normative table reference e.g. EC3-1-1 Table 6.2"
            >
              <InputText {...register("source")} />
            </FormField>
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
      <MetadataFields />
    </>
  );
};
