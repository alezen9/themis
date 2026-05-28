import { InputRadio } from "@components/inputs/InputRadio";

import { Section, SectionTitle } from "./shared";
import { typeOptions } from "./options";
import { useCreateEditNodeFormContext } from "./useCreateEditNodeFormContext";

export const FormType = () => {
  const { register } = useCreateEditNodeFormContext();

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
