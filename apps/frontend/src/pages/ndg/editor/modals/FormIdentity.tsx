import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { FormField } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputText } from "@components/inputs/InputText";

import { tableKeyOptions, userInputKeyOptions } from "./ec311KeyOptions";
import { valueTypeOptions } from "./options";
import { Section, SectionTitle } from "./shared";
import type { NodeFormValues } from "./schema";

const FORCED_NUMERIC_TYPES: NodeFormValues["type"][] = [
  "check",
  "coefficient",
  "constant",
];

const getKeyOptions = (type: NodeFormValues["type"]) => {
  if (type === "user-input") return userInputKeyOptions;
  if (type === "table") return tableKeyOptions;
  return null;
};

export const FormIdentity = () => {
  const { control, register, watch, setValue } = useFormContext<NodeFormValues>();
  const type = watch("type");
  const isValueTypeForced = FORCED_NUMERIC_TYPES.includes(type);
  const keyOptions = getKeyOptions(type);

  useEffect(() => {
    if (isValueTypeForced) setValue("valueType", { type: "number" });
  }, [isValueTypeForced, setValue]);

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
        {!isValueTypeForced && (
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
