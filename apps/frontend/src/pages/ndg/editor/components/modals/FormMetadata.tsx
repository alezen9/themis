import { useFormContext } from "react-hook-form";

import { FormField } from "@components/inputs/shared";
import { InputText } from "@components/inputs/InputText";

import { Section, SectionTitle } from "./shared";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

const TYPES_WITH_META: EditorNodeInput["type"][] = [
  "check",
  "formula",
  "table",
];

export const FormMetadata = () => {
  const { register, watch } = useFormContext<EditorNodeInput>();
  const type = watch("type");

  if (!TYPES_WITH_META.includes(type)) return null;

  return (
    <Section>
      <SectionTitle>Metadata</SectionTitle>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <FormField name="meta.verificationRef" label="Verification">
          <InputText {...register("meta.verificationRef")} />
        </FormField>
        <FormField name="meta.sectionRef" label="Section">
          <InputText {...register("meta.sectionRef")} />
        </FormField>
        <FormField name="meta.paragraphRef" label="Paragraph">
          <InputText {...register("meta.paragraphRef")} />
        </FormField>
        <FormField name="meta.subParagraphRef" label="Subparagraph">
          <InputText {...register("meta.subParagraphRef")} />
        </FormField>
        <FormField name="meta.formulaRef" label="Formula">
          <InputText {...register("meta.formulaRef")} />
        </FormField>
        <FormField name="meta.tableRef" label="Table">
          <InputText {...register("meta.tableRef")} />
        </FormField>
      </div>
    </Section>
  );
};
