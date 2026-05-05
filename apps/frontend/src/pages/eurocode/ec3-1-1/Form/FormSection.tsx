import { HorizontalInput } from "@components/inputs/shared";
import { Section, SectionTitle, TextLabel } from "./shared";
import { InputSelect } from "@components/inputs/InputSelect";
import {
  circularSectionOptions,
  flangedSectionOptions,
  hollowSectionOptions,
  iFabricationTypeOptions,
  rhsChsFabricationTypeOptions,
  sectionClassOptions,
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
import {
  getChsShapePatchFields,
  getIShapePatchFields,
  getRhsShapePatchFields,
} from "./utils";
import { useEc311FormContext } from "./useEc311FormContext";

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
  const { register, registerSelect, watch, reset, getValues } =
    useEc311FormContext();
  const shape = watch("shape");

  const onSectionChange = useCallback<ChangeHandler>(
    async (e) => {
      const { name, value } = e.target;
      const values = getValues();
      const shape = values.shape;
      const i_geometry = getIShapePatchFields(value);
      const rhs_geometry = getRhsShapePatchFields(value);
      const chs_geometry = getChsShapePatchFields(value);
      const isCustomSection = value === customSectionId;
      reset(
        {
          ...getValues(),
          ...{
            [name]: value,
            ...(!isCustomSection && shape === "I" ? { i_geometry } : {}),
            ...(!isCustomSection && shape === "RHS" ? { rhs_geometry } : {}),
            ...(!isCustomSection && shape === "CHS" ? { chs_geometry } : {}),
          },
        },
        { keepErrors: true },
      );
    },
    [reset, getValues],
  );

  return (
    <Section>
      <SectionTitle>Cross section</SectionTitle>
      <HorizontalInput name="sectionId" label={<TextLabel>Section</TextLabel>}>
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
