import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";

import { getUnitOptions } from "@ndg/ndg-core";
import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { FormInputSelect } from "@components/inputs/FormInputSelect";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputText } from "@components/inputs/InputText";
import { Latex } from "@components/Latex";

import { Section, SectionTitle } from "./shared";
import { EditableNodeType, typeOptions } from "./options";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { latexPreview, renderKeyPlaceholders } from "../nodes/latexPreview";

type NodeTypeSelectorProps = {
  value: EditableNodeType;
  onChange: (type: EditableNodeType) => void;
};

export const NodeTypeSelector = (props: NodeTypeSelectorProps) => {
  const { value, onChange } = props;

  return (
    <Section>
      <SectionTitle>Type</SectionTitle>
      <div className="flex items-center w-full gap-4">
        {typeOptions.map(option => (
          <InputRadio
            key={option.value}
            name="node-type"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            value={option.value}
            label={option.label}
          />
        ))}
      </div>
    </Section>
  );
};

const PreviewPlain = (props: { tex: string }) => (
  <Latex
    displayMode
    tex={props.tex}
    className="px-1 min-h-16 h-full items-center text-2xl text-sand-900"
  />
);

const PreviewBox = (props: { tex: string }) => (
  <Latex
    displayMode
    tex={props.tex || "Preview"}
    className="border px-1 min-h-16 flex-1 rounded-sm border-sand-300 text-sand-900 text-lg"
  />
);

export const VariantField = () => {
  const { register } = useTypedFormContext();

  return (
    <FormField
      name="variant"
      label="Variant"
      description="Compute a value, or select one of the children"
    >
      <div className="flex items-center gap-6 h-9">
        <InputRadio {...register("variant")} value="compute" label="Compute" />
        <InputRadio {...register("variant")} value="select" label="Select" />
      </div>
    </FormField>
  );
};

export const SymbolKeyPreview = () => {
  const { watch } = useTypedFormContext();
  const tex = latexPreview({ symbol: watch("symbol"), key: watch("key") });

  return <PreviewPlain tex={tex} />;
};

const DisplayUnitControl = (props: {
  options: ReturnType<typeof getUnitOptions>;
}) => (
  <FormField
    name="displayUnit"
    label="Display unit"
    description="Unit the value is shown in"
  >
    <FormInputSelect name="displayUnit" options={props.options} />
  </FormField>
);

const unitPreview = (
  options: ReturnType<typeof getUnitOptions>,
  displayUnit: unknown,
) => {
  const tex = options.find(option => option.value === displayUnit)?.ctx.tex;
  return tex ? `(${tex})` : "";
};

export const DisplayUnitField = () => {
  const { watch } = useTypedFormContext();
  const options = getUnitOptions(watch("key") ?? "");
  if (!options.length) return null;

  return (
    <>
      <div className="col-span-2">
        <DisplayUnitControl options={options} />
      </div>
      <div className="col-span-2">
        <PreviewPlain tex={unitPreview(options, watch("displayUnit"))} />
      </div>
    </>
  );
};

export const DisplayUnitColumn = () => {
  const { watch } = useTypedFormContext();
  const options = getUnitOptions(watch("key") ?? "");
  if (!options.length) return null;

  return (
    <div className="flex flex-col gap-2 h-full">
      <DisplayUnitControl options={options} />
      <PreviewBox tex={unitPreview(options, watch("displayUnit"))} />
    </div>
  );
};

export const MetadataFields = () => {
  const { register, watch } = useTypedFormContext();
  if (watch("variant") === "select") return null;

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

export const FormFieldLatex = (props: ComponentProps<typeof FormField>) => {
  const { name, children, ...rest } = props;
  const { watch } = useFormContext();
  const symbolByKey = useNdgEditorStore(s => s._symbolByKey);
  const value = watch(name);
  const trimmed = typeof value === "string" ? value.trim() : "";

  return (
    <div className="flex flex-col gap-2 h-full">
      <FormField name={name} {...rest}>
        {children}
      </FormField>
      <PreviewBox
        tex={trimmed ? renderKeyPlaceholders(trimmed, symbolByKey) : ""}
      />
    </div>
  );
};
