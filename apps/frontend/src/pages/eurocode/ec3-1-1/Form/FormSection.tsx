import { HorizontalInput } from "@components/inputs/shared";
import { Section, SectionTitle, TextLabel } from "./shared";
import {
  circularSectionOptions,
  flangedSectionOptions,
  hollowSectionOptions,
  iFabricationTypeOptions,
  rhsChsFabricationTypeOptions,
  customSectionId,
} from "./options";
import { useCallback } from "react";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { ChangeHandler } from "react-hook-form";
import {
  defaultCHSSection,
  defaultISection,
  defaultRHSSection,
} from "./defaultValues";
import { useEc311FormContext } from "./useEc311FormContext";
import { flangedSectionsMap } from "../data/flangedSections";
import { hollowSectionsMap } from "../data/hollowSections";
import { circularSectionsMap } from "../data/circularSections";

const sectionOptionsMap = {
  I: { options: flangedSectionOptions, defaultValue: defaultISection.id },
  RHS: { options: hollowSectionOptions, defaultValue: defaultRHSSection.id },
  CHS: { options: circularSectionOptions, defaultValue: defaultCHSSection.id },
};

const fabricationTypeOptionsMap = {
  I: { options: iFabricationTypeOptions },
  RHS: { options: rhsChsFabricationTypeOptions },
  CHS: { options: rhsChsFabricationTypeOptions },
};

export const FormSection = () => {
  const { register, registerSelect, watch, reset, getValues, trigger } =
    useEc311FormContext();
  const shape = watch("shape");

  const onSectionChange = useCallback<ChangeHandler>(
    async (e) => {
      const { name, value } = e.target;
      const values = getValues();
      const shape = values.shape;
      const i_geometry = flangedSectionsMap.get(value);
      const rhs_geometry = hollowSectionsMap.get(value);
      const chs_geometry = circularSectionsMap.get(value);
      const isCustomSection = value === customSectionId;
      reset({
        ...getValues(),
        ...{
          [name]: value,
          ...(!isCustomSection && shape === "I" ? { i_geometry } : {}),
          ...(!isCustomSection && shape === "RHS" ? { rhs_geometry } : {}),
          ...(!isCustomSection && shape === "CHS" ? { chs_geometry } : {}),
        },
      });
      await trigger();
    },
    [reset, getValues, trigger],
  );

  return (
    <Section>
      <SectionTitle>Cross section</SectionTitle>
      <HorizontalInput name="section_id" label={<TextLabel>Section</TextLabel>}>
        <InputAutocomplete
          key={shape}
          {...registerSelect?.("section_id")}
          onChange={onSectionChange}
          defaultValue={sectionOptionsMap[shape].defaultValue}
          options={sectionOptionsMap[shape].options}
        />
      </HorizontalInput>
      <HorizontalInput
        name="fabrication_type"
        label={<TextLabel>Fabrication</TextLabel>}
      >
        <div className="flex items-center w-full gap-1">
          {fabricationTypeOptionsMap[shape].options.map((option) => {
            return (
              <InputRadio
                key={`${shape}-${option.value}`}
                {...register?.("fabrication_type")}
                value={option.value}
                label={option.label}
              />
            );
          })}
        </div>
      </HorizontalInput>
    </Section>
  );
};
