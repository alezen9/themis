import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { InputRadio } from "@components/inputs/InputRadio";

import { Section, SectionTitle } from "./shared";
import { typeOptions } from "./options";
import type { NodeFormValues } from "./schema";

export const FormType = () => {
  const { register, watch, clearErrors } = useFormContext<NodeFormValues>();
  const type = watch("type");

  useEffect(() => {
    clearErrors();
  }, [type, clearErrors]);

  return (
    <Section>
      <SectionTitle>Type</SectionTitle>
      <div className="flex items-center w-full gap-4">
        {typeOptions.map(option => (
          <InputRadio
            key={option.value}
            {...register("type")}
            value={option.value}
            label={option.label}
          />
        ))}
      </div>
    </Section>
  );
};
