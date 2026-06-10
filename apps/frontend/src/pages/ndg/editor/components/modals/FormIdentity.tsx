import { useCallback } from "react";
import type { ChangeHandler } from "react-hook-form";
import { constantCatalog } from "@ndg/ndg-core";
import { coefficientCatalog, userInputCatalog } from "@ndg/ndg-ec3-1-1";
import { FormField, type Option } from "@components/inputs/shared";
import { useNdgEditorNodeFormContext } from "./useNdgEditorNodeFormContext";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputSelect } from "@components/inputs/InputSelect";
import { InputText } from "@components/inputs/InputText";
import { Latex } from "@components/Latex";
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

const keyOptionsByType: Partial<Record<EditorNodeInput["type"], Option[]>> = {
  "user-input": userInputKeyOptions,
  table: tableKeyOptions,
  coefficient: coefficientKeyOptions,
};

const SymbolUnitPreview = () => {
  const { watch } = useNdgEditorNodeFormContext();
  const symbol = watch("symbol");
  const key = watch("key");
  const tex = latexPreview({ symbol, key });
  if (!tex) return null;

  return (
    <Latex displayMode tex={tex} className="px-1 text-3xl text-sand-900" />
  );
};

const VariantField = () => {
  const { register } = useNdgEditorNodeFormContext();
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
  const { register, registerSelect, watch, setValue, reset, getValues } =
    useNdgEditorNodeFormContext();
  const type = watch("type");
  const key = watch("key") ?? "";

  const keyOptions = keyOptionsByType[type] ?? null;
  const showPreview =
    type === "user-input" || type === "coefficient" || type === "constant";
  const constantPreset = constantCatalog[key] ? key : "custom";
  const isCustomConstant = type === "constant" && !constantCatalog[key];

  const onKeyChange = useCallback<ChangeHandler>(
    async event => {
      const values = getValues();
      const key = event.target.value;
      if (values.type === "user-input") {
        const entry = userInputCatalog[key];
        reset({
          ...values,
          key,
          ...(entry && {
            symbol: entry.symbol,
            valueType: { type: entry.valueType },
          }),
        });
        return;
      }
      if (values.type === "coefficient") {
        const entry = coefficientCatalog[key];
        reset({
          ...values,
          key,
          ...(entry && { symbol: entry.symbol, meta: entry.meta }),
        });
        return;
      }
      if (values.type === "table") reset({ ...values, key });
    },
    [getValues, reset],
  );

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
                    setValue("value", undefined);
                  }}
                />
                {isCustomConstant && (
                  <InputText placeholder="custom_key" {...register("key")} />
                )}
              </div>
            ) : keyOptions ? (
              <InputAutocomplete
                key={type}
                {...registerSelect("key")}
                onChange={onKeyChange}
                options={keyOptions}
                required
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
