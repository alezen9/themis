import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { constantCatalog } from "@ndg/ndg-core";
import { displayUnitOptions, unitLabel } from "@ndg/ndg-ec3-1-1";
import { FormField } from "@components/inputs/shared";
import { useNdgEditorNodeFormContext } from "./useNdgEditorNodeFormContext";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputText } from "@components/inputs/InputText";
import { InputTextarea } from "@components/inputs/InputTextarea";
import { Latex } from "@components/Latex";

import { Section, SectionTitle } from "./shared";
import { useNdgEditorStore } from "../../controller/useNdgEditorStore";
import { renderKeyPlaceholders } from "../nodes/latexPreview";

export const FormDefinition = () => {
  const { register, registerSelect, registerNumber, watch } =
    useNdgEditorNodeFormContext();
  const type = watch("type");
  const variant = watch("variant");
  const key = watch("key") ?? "";
  const constantPreset = constantCatalog[key] ? key : "custom";
  const isCustomConstant = type === "constant" && constantPreset === "custom";
  const isComputed = type === "check" || type === "formula";
  const isSelect = isComputed && variant === "select";

  const unitOptions = displayUnitOptions(key);
  const derivedUnit = unitLabel(key);

  const showTemplate = isComputed && !isSelect;
  const showSource = type === "table";
  const showSymbol = type === "formula" || type === "table" || isCustomConstant;
  const showValue = isCustomConstant;
  const showUnit = !isSelect && unitOptions.length > 0;

  if (!showTemplate && !showSource && !showSymbol && !showValue && !showUnit)
    return null;

  return (
    <Section>
      <SectionTitle>Definition</SectionTitle>
      <div className="grid grid-cols-4 grid-rows-1 gap-4">
        {showTemplate && (
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
        )}
        {showSource && (
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
        {showSymbol && (
          <FormFieldLatex
            name="symbol"
            label="Symbol"
            description="Expression symbol"
          >
            <InputText placeholder={"\\gamma_{M0}"} {...register("symbol")} />
          </FormFieldLatex>
        )}
        {showUnit && (
          <div className="col-span-2">
            <FormField
              name="displayUnit"
              label="Display unit"
              description="Compute unit derives from the key"
            >
              <div className="flex items-center gap-3">
                <InputSelect
                  key={key}
                  {...registerSelect("displayUnit")}
                  options={unitOptions.map(unit => ({
                    value: unit.key,
                    label: unit.key,
                  }))}
                />
                {derivedUnit && (
                  <Latex tex={`(${derivedUnit})`} className="text-sand-600" />
                )}
              </div>
            </FormField>
          </div>
        )}
        {showValue && (
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
      </div>
    </Section>
  );
};

const FormFieldLatex = (props: ComponentProps<typeof FormField>) => {
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
      <Latex
        tex={trimmed ? renderKeyPlaceholders(trimmed, symbolByKey) : "Preview"}
        className={twMerge(
          "border px-1 min-h-16 flex-1 rounded-sm border-sand-300 text-2xl text-sand-900",
          !trimmed && "text-lg",
        )}
      />
    </div>
  );
};
