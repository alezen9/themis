import { Section, SectionTitle } from "../shared";
import { InputRadio } from "@components/inputs/InputRadio";
import { typeOptions } from "./options";
import { useCreateEditNodeFormContext } from "./useCreateEditNodeFormContext";

export const FormType = () => {
  const { register, formState } = useCreateEditNodeFormContext();
  console.log(formState.defaultValues);

  return (
    <Section>
      <SectionTitle>Type</SectionTitle>
      <div className="flex items-center w-full gap-4">
        {typeOptions.map(option => {
          return (
            <InputRadio
              key={option.value}
              {...register?.("type")}
              value={option.value}
              label={option.label}
            />
          );
        })}
      </div>
    </Section>
  );
};
