import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { FormField } from "@components/inputs/shared";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputText } from "@components/inputs/InputText";

import { valueTypeOptions } from "./options";
import { Section, SectionTitle } from "./shared";

const FORCED_NUMERIC_TYPES = ["check", "coefficient", "constant"];

export const FormIdentity = () => {
  const { register, watch, setValue } = useFormContext();
  const type = watch("type");
  const isValueTypeForced = FORCED_NUMERIC_TYPES.includes(type);

  useEffect(() => {
    if (isValueTypeForced) setValue("valueType", { type: "number" });
  }, [isValueTypeForced, setValue]);

  return (
    <Section>
      <SectionTitle>Identity</SectionTitle>
      <div className="grid grid-cols-2 grid-rows-1 gap-4">
        <FormField name="key" label="Key" description="Unique id used by formulas">
          <InputText {...register("key")} />
        </FormField>
        {!isValueTypeForced && (
          <FormField name="valueType" label="Value type" description="Expected runtime value">
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
