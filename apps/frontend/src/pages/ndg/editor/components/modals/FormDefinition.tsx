import { ComponentProps } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { constantCatalog } from "@ndg/ndg-core";
import { Button } from "@components/Button";
import { FormField } from "@components/inputs/shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputText } from "@components/inputs/InputText";
import { InputTextarea } from "@components/inputs/InputTextarea";
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
          <FormulaExpressionsFields />
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

type FormulaNodeInput = Extract<EditorNodeInput, { type: "formula" }>;

const FormulaExpressionsFields = () => {
  const { control, register } = useFormContext<FormulaNodeInput>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "expressions",
  });

  return (
    <div className="col-span-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h5 className="text-sm font-light text-sand-900">Expressions</h5>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => append({ expression: "" })}
        >
          Add row
        </Button>
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[1fr_1fr_auto] gap-4 rounded-sm border border-sand-100 p-3"
        >
          <FormFieldLatex
            name={`expressions.${index}.expression`}
            label="Expression"
          >
            <InputTextarea
              placeholder={"\\frac{A \\cdot f_y}{\\gamma_{M0}}"}
              {...register(`expressions.${index}.expression`)}
            />
          </FormFieldLatex>
          <FormFieldLatex
            name={`expressions.${index}.calculation`}
            label="Calculation"
          >
            <InputTextarea
              placeholder={"\\frac{$A_mm2 \\cdot $fy_MPa}{$gamma_M0}"}
              {...register(`expressions.${index}.calculation`)}
            />
          </FormFieldLatex>
          <Button
            variant="danger"
            size="sm"
            className="self-start"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
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
