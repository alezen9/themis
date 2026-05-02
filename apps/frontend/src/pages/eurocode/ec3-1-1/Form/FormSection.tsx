import { HorizontalInput } from "@components/inputs/shared";
import { Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import {
  circularSectionOptions,
  fabricationTypeOptions,
  flangedSectionOptions,
  hollowSectionOptions,
  sectionClassOptions,
} from "./options";
import { useContext } from "react";
import { Ec311CustomRegisterContext } from "./Form";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import {
  defaultCHSSection,
  defaultISection,
  defaultRHSSection,
} from "./defaultValues";

const optionsMap = {
  I: { options: flangedSectionOptions, defaultValue: defaultISection.id },
  RHS: { options: hollowSectionOptions, defaultValue: defaultRHSSection.id },
  CHS: { options: circularSectionOptions, defaultValue: defaultCHSSection.id },
};

export const FormSection = () => {
  const { register, registerSelect } = useContext(Ec311CustomRegisterContext);
  const { watch } = useFormContext<Ec3FormValues>();
  const shape = watch("shape");

  return (
    <Section>
      <SectionTitle>Section</SectionTitle>
      <HorizontalInput name="sectionId" label={<TextLabel>Profile</TextLabel>}>
        <InputAutocomplete
          key={shape}
          {...registerSelect?.("sectionId")}
          defaultValue={optionsMap[shape].defaultValue}
          options={optionsMap[shape].options}
        />
      </HorizontalInput>
      <HorizontalInput
        name="fabricationType"
        label={<TextLabel>Fabrication</TextLabel>}
      >
        <div className="flex items-center w-full gap-1">
          {fabricationTypeOptions.map((option) => {
            return (
              <InputRadio
                key={option.value}
                {...register?.("fabricationType")}
                value={option.value}
                label={option.label}
              />
            );
          })}
        </div>
      </HorizontalInput>
      <HorizontalInput
        name="section_class"
        label={<TextLabel>Class</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("section_class")}
          options={sectionClassOptions}
        />
      </HorizontalInput>
    </Section>
  );
};
