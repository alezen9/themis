import { useCallback } from "react";
import { useFormContext, type ChangeHandler } from "react-hook-form";

import { InputRadio } from "@components/inputs/InputRadio";

import { Section, SectionTitle } from "./shared";
import { typeOptions } from "./options";
import type { EditorNodeInput } from "../../document/editorNodeSchema";

export const FormType = () => {
  const { register, reset, getValues, trigger } =
    useFormContext<EditorNodeInput>();

  const onTypeChange = useCallback<ChangeHandler>(
    async e => {
      const { value: nextType } = e.target;
      const values = getValues();
      reset({
        ...values,
        type: nextType,
        key: "",
        symbol: undefined,
        unit: undefined,
        value: undefined,
        meta: undefined,
        expression: undefined,
      } as EditorNodeInput);
      await trigger();
    },
    [reset, getValues, trigger],
  );

  return (
    <Section>
      <SectionTitle>Type</SectionTitle>
      <div className="flex items-center w-full gap-4">
        {typeOptions.map(option => (
          <InputRadio
            key={option.value}
            {...register("type")}
            onChange={onTypeChange}
            value={option.value}
            label={option.label}
          />
        ))}
      </div>
    </Section>
  );
};
