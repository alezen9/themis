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
  getDefaultSteelGrade,
} from "./defaultValues";
import { useEc311FormContext } from "./useEc311FormContext";
import { FlangedSection, flangedSectionsMap } from "../data/flangedSections";
import { HollowSection, hollowSectionsMap } from "../data/hollowSections";
import { CircularSection, circularSectionsMap } from "../data/circularSections";
import { composeSteelGradeId } from "../data/steelGrades";

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

const toIGeometry = (section?: FlangedSection) => {
  if (!section) return;
  const { h_mm, b_mm, tw_mm, tf_mm, r_mm } = section;
  return { h_mm, b_mm, tw_mm, tf_mm, r_mm };
};

const toRhsGeometry = (section?: HollowSection) => {
  if (!section) return;
  const { h_mm, b_mm, tw_mm, ri_mm, ro_mm } = section;
  return { h_mm, b_mm, tw_mm, ri_mm, ro_mm };
};

const toChsGeometry = (section?: CircularSection) => {
  if (!section) return;
  const { d_mm, t_mm } = section;
  return { d_mm, t_mm };
};

export const FormSection = () => {
  const { register, registerSelect, watch, reset, getValues, trigger } =
    useEc311FormContext();
  const shape = watch("shape");

  const onSectionChange = useCallback<ChangeHandler>(
    async e => {
      const { name, value } = e.target;
      const values = getValues();
      const shape = values.shape;
      const isEmptySectionId = value === "";
      const isCustomSectionId = value === customSectionId;
      const shouldUpdateGeometry = !isEmptySectionId && !isCustomSectionId;

      const i_geometry = toIGeometry(flangedSectionsMap.get(value));
      const rhs_geometry = toRhsGeometry(hollowSectionsMap.get(value));
      const chs_geometry = toChsGeometry(circularSectionsMap.get(value));
      reset({
        ...values,
        ...{
          [name]: value,
          ...(!isEmptySectionId && {
            steel_grade_id: composeSteelGradeId(
              getDefaultSteelGrade(shape, values.fabrication_type),
            ),
          }),
          ...(shouldUpdateGeometry && {
            ...(shape === "I" && { i_geometry }),
            ...(shape === "RHS" && { rhs_geometry }),
            ...(shape === "CHS" && { chs_geometry }),
          }),
        },
      });
      await trigger();
    },
    [reset, getValues, trigger],
  );

  const onFabricationTypeChange = useCallback<ChangeHandler>(
    async e => {
      const { name, value } = e.target;
      const values = getValues();

      reset({
        ...values,
        [name]: value,
        steel_grade_id: composeSteelGradeId(
          getDefaultSteelGrade(values.shape, value),
        ),
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
          {fabricationTypeOptionsMap[shape].options.map(option => {
            return (
              <InputRadio
                key={`${shape}-${option.value}`}
                {...register?.("fabrication_type")}
                onChange={onFabricationTypeChange}
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
