import { InputRadio } from "@components/inputs/InputRadio";
import { useFormContext } from "react-hook-form";

import { Section, SectionTitle } from "./shared";
import { typeOptions } from "./options";

export const FormType = () => {
  const { register } = useFormContext();

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
