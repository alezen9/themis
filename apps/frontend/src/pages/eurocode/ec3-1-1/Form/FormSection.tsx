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
import { useCallback, useContext } from "react";
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
import {
  getChsShapePatchFields,
  getIShapePatchFields,
  getRhsShapePatchFields,
} from "./utils";

const optionsMap = {
  I: { options: flangedSectionOptions, defaultValue: defaultISection.id },
  RHS: { options: hollowSectionOptions, defaultValue: defaultRHSSection.id },
  CHS: { options: circularSectionOptions, defaultValue: defaultCHSSection.id },
};

export const FormSection = () => {
  const { register, registerSelect } = useContext(Ec311CustomRegisterContext);

  return (
    <Section>
      <SectionTitle>Section</SectionTitle>
      <HorizontalInput name="sectionId" label={<TextLabel>Profile</TextLabel>}>
        <InputAutocompleteSectionId />
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

const InputAutocompleteSectionId = () => {
  const { registerSelect } = useContext(Ec311CustomRegisterContext);
  const { watch, reset, getValues } = useFormContext<Ec3FormValues>();
  const shape = watch("shape");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange, ...rest } = registerSelect?.("sectionId") ?? {};

  const onSectionChange = useCallback<NonNullable<typeof onChange>>(
    async (e) => {
      const { name, value } = e.target;
      const iSectionFields = getIShapePatchFields(value);
      const rhsSectionFields = getRhsShapePatchFields(value);
      const chsSectionFields = getChsShapePatchFields(value);
      reset(
        {
          ...getValues(),
          ...{
            [name]: value,
            ...iSectionFields,
            ...rhsSectionFields,
            ...chsSectionFields,
          },
        },
        { keepErrors: true },
      );
    },
    [reset, getValues],
  );

  return (
    <InputAutocomplete
      key={shape}
      {...rest}
      onChange={onSectionChange}
      defaultValue={optionsMap[shape].defaultValue}
      options={optionsMap[shape].options}
    />
  );
};
