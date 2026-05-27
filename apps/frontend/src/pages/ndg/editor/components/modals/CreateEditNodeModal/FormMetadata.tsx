import { Section, SectionTitle } from "../shared";
import { useFormContext } from "react-hook-form";
import { FormField } from "@components/inputs/shared";
import { InputText } from "@components/inputs/InputText";

export const FormMetadata = () => {
  const { register } = useFormContext();

  return (
    <Section>
      <SectionTitle>Metadata</SectionTitle>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <FormField name="verification" label="Verification">
          <InputText {...register("verification")} />
        </FormField>
        <FormField name="section" label="Section">
          <InputText {...register("section")} />
        </FormField>
        <FormField name="paragraph" label="Paragraph">
          <InputText {...register("paragraph")} />
        </FormField>
        <FormField name="subparagraph" label="Subparagraph">
          <InputText {...register("subparagraph")} />
        </FormField>
        <FormField name="formula" label="Formula">
          <InputText {...register("formula")} />
        </FormField>
        <FormField name="table" label="Table">
          <InputText {...register("table")} />
        </FormField>
      </div>
    </Section>
  );
};
