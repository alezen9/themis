import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { constantCatalog } from "@ndg/ndg-core";
import { coefficientCatalog, userInputCatalog } from "@ndg/ndg-ec3-1-1";
import { FormField } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputText } from "@components/inputs/InputText";
import { Latex } from "@components/Latex";
import { defaultNodeFormValues } from "./defaultValues";
import {
  coefficientKeyOptions,
  constantKeyOptions,
  tableKeyOptions,
  userInputKeyOptions,
  valueTypeOptions,
} from "./options";
import { Section, SectionTitle } from "./shared";
import { latexPreview } from "../nodes/latexPreview";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

const SymbolUnitPreview = () => {
  const { watch } = useFormContext<EditorNodeInput>();
  const symbol = watch("symbol");
  const unit = watch("unit");
  const tex = latexPreview({ symbol, unit });
  if (!tex) return null;

  return (
    <Latex
      displayMode
      tex={tex}
      className="px-1 h-auto flex items-center justify-center-safe text-3xl text-sand-900"
    />
  );
};

const VariantField = () => {
  const { register } = useFormContext<EditorNodeInput>();
  return (
    <FormField
      name="variant"
      label="Variant"
      description="Compute a value, or select one of the children"
    >
      <div className="flex items-center gap-6 py-2">
        <InputRadio {...register("variant")} value="compute" label="Compute" />
        <InputRadio {...register("variant")} value="select" label="Select" />
      </div>
    </FormField>
  );
};

export const FormIdentity = () => {
  const { control, register, watch, setValue, subscribe } =
    useFormContext<EditorNodeInput>();
  const type = watch("type");
  const key = watch("key") ?? "";

  const keyOptions =
    type === "user-input"
      ? userInputKeyOptions
      : type === "table"
        ? tableKeyOptions
        : type === "coefficient"
          ? coefficientKeyOptions
          : null;
  const showPreview =
    type === "user-input" || type === "coefficient" || type === "constant";
  const constantPreset = constantCatalog[key] ? key : "custom";
  const isCustomConstant = type === "constant" && constantPreset === "custom";
  const nonClearableKeyFallback =
    type === "user-input" || type === "coefficient" || type === "table"
      ? defaultNodeFormValues[type].key
      : "";

  useEffect(() => {
    const unsubscribe = subscribe({
      name: ["type", "key"],
      formState: { values: true },
      callback: ({ values: { key = "", type }, name }) => {
        if (!name) return;
        if (type === "user-input") {
          const entry = userInputCatalog[key];
          if (!entry) return;
          setValue("symbol", entry.symbol);
          setValue("unit", entry.unit);
          setValue("valueType", { type: entry.valueType });
          return;
        }
        if (type === "coefficient") {
          setValue("valueType", { type: "number" });
          const entry = coefficientCatalog[key];
          if (!entry) return;
          setValue("symbol", entry.symbol);
          setValue("unit", entry.unit);
          setValue("meta", entry.meta);
          return;
        }
        if (type === "table") return;
        setValue("valueType", { type: "number" });
      },
    });
    return () => {
      unsubscribe();
    };
  }, [subscribe, setValue]);

  if (type === "check") {
    return (
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
    );
  }

  return (
    <Section>
      <SectionTitle>Identity</SectionTitle>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <FormField
            name="key"
            label="Key"
            description="Unique id used by formulas"
          >
            {type === "constant" ? (
              <div className="flex flex-col gap-2">
                <InputSelect
                  name="constant-preset"
                  options={constantKeyOptions}
                  value={constantPreset}
                  onChange={event => {
                    const entry = constantCatalog[event.target.value];
                    setValue("key", entry ? event.target.value : "", {
                      shouldValidate: true,
                    });
                    setValue("symbol", entry?.symbol);
                    setValue("unit", entry?.unit);
                    setValue("value", undefined);
                  }}
                />
                {isCustomConstant && (
                  <InputText placeholder="custom_key" {...register("key")} />
                )}
              </div>
            ) : keyOptions ? (
              <Controller
                name="key"
                control={control}
                render={({ field }) => (
                  <InputAutocomplete
                    name={field.name}
                    options={keyOptions}
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={event => {
                      field.onChange(
                        event.target.value || nonClearableKeyFallback,
                      );
                    }}
                    required
                  />
                )}
              />
            ) : (
              <InputText {...register("key")} />
            )}
          </FormField>
        </div>
        {type === "formula" && (
          <div className="col-span-2">
            <VariantField />
          </div>
        )}
        {showPreview && (
          <div className="col-span-2">
            <SymbolUnitPreview />
          </div>
        )}
        {type === "table" && (
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
        )}
      </div>
    </Section>
  );
};
