import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { InputText } from "@components/inputs/InputText";
import { InputTextarea } from "@components/inputs/InputTextarea";

import { Section, SectionTitle } from "./shared";
import { FormFieldLatex, MetadataFields, VariantField } from "./nodeFields";
import {
  checkFormSchema,
  type CheckNode,
} from "../../document/editorNodeSchema";

type Props = {
  formId: string;
  defaultValues: CheckNode;
  onSubmit: (values: CheckNode) => void;
};

export const CheckForm = (props: Props) => {
  const { formId, defaultValues, onSubmit } = props;
  const form = useForm<CheckNode>({
    resolver: zodResolver(checkFormSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <CheckFields />
      </form>
    </FormProvider>
  );
};

const CheckFields = () => {
  const { register, watch } = useTypedFormContext<CheckNode>();
  const isSelect = watch("variant") === "select";

  return (
    <>
      <Section>
        <SectionTitle>Identity</SectionTitle>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <FormField name="name" label="Name" description="Check label">
              <InputText {...register("name")} />
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
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
              <FormFieldLatex
                name="template"
                label="Template"
                description="Keyed LaTeX comparison, e.g. \frac{N_{Ed}}{N_{Rd}} \leq 1"
              >
                <InputTextarea
                  placeholder={"x \\leq 1"}
                  {...register("template")}
                />
              </FormFieldLatex>
            </div>
          </div>
        </Section>
      )}
      <MetadataFields />
    </>
  );
};
