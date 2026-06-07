import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { constantCatalog } from "@ndg/ndg-core";
import { FormField } from "@components/inputs/shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputText } from "@components/inputs/InputText";
import { Latex } from "@components/Latex";

import { Section, SectionTitle } from "./shared";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

export const FormDefinition = () => {
  const { register, watch } = useFormContext<EditorNodeInput>();
  const type = watch("type");
  const key = watch("key") ?? "";
  const constantPreset = constantCatalog[key] ? key : "custom";
  const isCustomConstant = type === "constant" && constantPreset === "custom";

  if (type === "user-input") return null;
  if (type === "coefficient") return null;
  if (type === "constant" && !isCustomConstant) return null;

  return (
    <Section>
      <SectionTitle>Definition</SectionTitle>
      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        {type === "check" && (
          <div className="col-span-4">
            <FormFieldLatex
              name="verificationExpression"
              label="Verification"
              description="LaTeX condition rendered in the check node"
            >
              <InputText
                placeholder={"\\frac{N_{Ed}}{N_{pl,Rd}} \\leq 1"}
                {...register("verificationExpression")}
              />
            </FormFieldLatex>
          </div>
        )}
        {type === "formula" && (
          <div className="col-span-2">
            <FormFieldLatex
              name="expression"
              label="Expression"
              description="LaTeX formula shown as symbol = expression"
            >
              <InputText
                placeholder={"\\frac{A \\cdot f_y}{\\gamma_{M0}}"}
                {...register("expression")}
              />
            </FormFieldLatex>
          </div>
        )}
        {type === "table" && (
          <div className="col-span-2">
            <FormField
              name="source"
              label="Source"
              description="Normative table reference e.g. EC3-1-1 Table 6.2"
            >
              <InputText {...register("source")} />
            </FormField>
          </div>
        )}
        {type !== "check" && (
          <FormFieldLatex
            name="symbol"
            label="Symbol"
            description="Expression symbol"
          >
            <InputText placeholder={"\\gamma_{M0}"} {...register("symbol")} />
          </FormFieldLatex>
        )}
        {type !== "check" && (
          <FormFieldLatex name="unit" label="Unit" description="Display unit">
            <InputText placeholder={"mm^2"} {...register("unit")} />
          </FormFieldLatex>
        )}
        {isCustomConstant && (
          <div className="col-span-2">
            <FormField
              name="value"
              label="Value"
              description="Fixed numeric value"
            >
              <InputNumber {...register("value", { valueAsNumber: true })} />
            </FormField>
          </div>
        )}
      </div>
    </Section>
  );
};

const FormFieldLatex = (props: ComponentProps<typeof FormField>) => {
  const { name, children, ...rest } = props;
  const { watch } = useFormContext();
  const value = watch(name);

  return (
    <div className="flex flex-col gap-2 h-full">
      <FormField name={name} {...rest}>
        {children}
      </FormField>
      <Latex
        tex={value?.trim() || "Preview"}
        className={twMerge(
          "border px-1 min-h-16 flex-1 rounded-sm border-sand-300 flex items-center justify-center-safe text-2xl text-sand-900",
          !value?.trim() && "text-lg",
        )}
      />
    </div>
  );
};
