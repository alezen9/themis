import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { FormField } from "@components/inputs/shared";
import { InputText } from "@components/inputs/InputText";
import { Latex } from "@components/Latex";

import { Section, SectionTitle } from "./shared";

export const FormDefinition = () => {
  const { register } = useFormContext();

  return (
    <Section>
      <SectionTitle>Definition</SectionTitle>
      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        <div className="col-span-4">
          <FormFieldLatex
            name="verificationExpression"
            label="Verification"
            description="LaTeX condition rendered in the check node"
          >
            <InputText {...register("verificationExpression")} />
          </FormFieldLatex>
        </div>
        <div className="col-span-2">
          <FormFieldLatex
            name="expression"
            label="Expression"
            description="LaTeX formula shown as symbol = expression"
          >
            <InputText {...register("expression")} />
          </FormFieldLatex>
        </div>
        <FormFieldLatex name="symbol" label="Symbol" description="Expression symbol">
          <InputText {...register("symbol")} />
        </FormFieldLatex>
        <FormFieldLatex name="unit" label="Unit" description="Display unit">
          <InputText {...register("unit")} />
        </FormFieldLatex>
      </div>
    </Section>
  );
};

const FormFieldLatex = (props: ComponentProps<typeof FormField>) => {
  const { name, children, ...rest } = props;
  const { watch } = useFormContext();
  const value = watch(name);

  return (
    <div className="flex flex-col gap-2">
      <FormField name={name} {...rest}>
        {children}
      </FormField>
      <Latex
        tex={value?.trim() || "Preview"}
        className={twMerge(
          "border px-1 h-16 rounded-sm border-sand-300 flex items-center text-2xl text-sand-900",
          !value?.trim() && "text-lg",
        )}
      />
    </div>
  );
};
