import { InputRadio } from "@components/inputs/InputRadio";

import { Section, SectionTitle } from "./shared";
import { defaultNodeFormValues } from "./defaultValues";
import { typeOptions } from "./options";
import { useNdgEditorNodeFormContext } from "./useNdgEditorNodeFormContext";

export const FormType = () => {
  const { reset, trigger, watch } = useNdgEditorNodeFormContext();
  const type = watch("type");

  return (
    <Section>
      <SectionTitle>Type</SectionTitle>
      <div className="flex items-center w-full gap-4">
        {typeOptions.map(option => (
          <InputRadio
            key={option.value}
            name="type"
            checked={type === option.value}
            onChange={async () => {
              reset(defaultNodeFormValues[option.value]);
              await trigger();
            }}
            value={option.value}
            label={option.label}
          />
        ))}
      </div>
    </Section>
  );
};
