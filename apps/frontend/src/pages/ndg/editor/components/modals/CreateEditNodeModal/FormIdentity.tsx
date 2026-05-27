import { Section, SectionTitle } from "../shared";
import { InputRadio } from "@components/inputs/InputRadio";

import { ChangeHandler, useFormContext } from "react-hook-form";
import { valueTypeOptions } from "./options";
import { FormField } from "@components/inputs/shared";
import { InputText } from "@components/inputs/InputText";

export const FormIdentity = () => {
  const { register, reset, getValues, trigger } = useFormContext();

  return (
    <Section>
      <SectionTitle>Identity</SectionTitle>
      <div className="grid grid-cols-2 grid-rows-1 gap-4">
        <FormField
          name="key"
          label="Key"
          description="Unique id used by formulas"
        >
          <InputText {...register("key")} />
        </FormField>
        <FormField
          name="valueType"
          label="Value type"
          description="Expected runtime value"
        >
          <div className="flex items-center w-full gap-4">
            {valueTypeOptions.map(option => {
              return (
                <InputRadio
                  key={option.value}
                  {...register?.("valueType")}
                  value={option.value}
                  label={option.label}
                />
              );
            })}
          </div>
        </FormField>
      </div>
    </Section>
  );
};
