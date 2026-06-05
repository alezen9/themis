import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { FormField } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputText } from "@components/inputs/InputText";
import { Latex } from "@components/Latex";

import {
  valueTypeOptions,
  tableKeyOptions,
  userInputKeyOptions,
} from "./options";
import { Section, SectionTitle } from "./shared";
import type { EditorNodeInput } from "../../document/editorNodeSchema";
import { userInputCatalog } from "../../document/userInputCatalog";

const FORCED_NUMERIC_TYPES: EditorNodeInput["type"][] = [
  "check",
  "coefficient",
  "constant",
];

const UserInputPreview = () => {
  const { watch } = useFormContext<EditorNodeInput>();
  const symbol = watch("symbol");
  const unit = watch("unit");
  const tex = symbol ? (unit ? `${symbol} \\quad (${unit})` : symbol) : "";

  return (
    <Latex
      displayMode
      tex={tex}
      className={twMerge(
        "px-1 h-auto flex items-center justify-center-safe text-3xl text-sand-900",
        !tex && "text-lg",
      )}
    />
  );
};

const getKeyOptions = (type: EditorNodeInput["type"]) => {
  if (type === "user-input") return userInputKeyOptions;
  if (type === "table") return tableKeyOptions;
  return null;
};

export const FormIdentity = () => {
  const { control, register, watch, setValue, subscribe } =
    useFormContext<EditorNodeInput>();
  const type = watch("type");
  const isValueTypeForced = FORCED_NUMERIC_TYPES.includes(type);
  const keyOptions = getKeyOptions(type);

  useEffect(() => {
    const unsubscribe = subscribe({
      name: ["type", "key"],
      formState: { values: true },
      callback: ({ values: { key = "", type } }) => {
        if (FORCED_NUMERIC_TYPES.includes(type)) {
          setValue("valueType", { type: "number" });
          if (type === "check") setValue("key", "utilisation");
          return;
        }
        if (type === "user-input") {
          const entry = userInputCatalog[key];
          if (!entry) return;
          setValue("symbol", entry.symbol);
          setValue("unit", entry.unit);
          setValue("valueType", { type: entry.valueType });
        }
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
        <FormField name="name" label="Name" description="Check label">
          <InputText {...register("name")} />
        </FormField>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>Identity</SectionTitle>
      <div className="grid grid-cols-2 grid-rows-1 gap-4">
        <FormField
          name="key"
          label="Key"
          description="Unique id used by formulas"
        >
          {keyOptions && (
            <Controller
              name="key"
              control={control}
              render={({ field }) => (
                <InputAutocomplete
                  name={field.name}
                  options={keyOptions}
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
          )}
          {!keyOptions && <InputText {...register("key")} />}
        </FormField>
        {type === "user-input" && <UserInputPreview />}
        {!isValueTypeForced && type !== "user-input" && (
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
        )}
      </div>
    </Section>
  );
};
