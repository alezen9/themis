import { Section, SectionTitle } from "./shared";
import { useCallback } from "react";
import { shapeOptions } from "./options";
import { InputRadio } from "@components/inputs/InputRadio";
import {
  defaultValues,
  defaultCHSSection,
  defaultISection,
  defaultRHSSection,
  getDefaultSteelGrade,
} from "./defaultValues";
import { useEc311FormContext } from "./useEc311FormContext";
import { ChangeHandler } from "react-hook-form";
import { composeSteelGradeId } from "../data/steelGrades";

export const FormShape = () => {
  const { register, reset, getValues, trigger } = useEc311FormContext();

  const onShapeChange = useCallback<ChangeHandler>(
    async (e) => {
      const { value } = e.target;
      const values = getValues();

      if (value === "I")
        reset({
          ...values,
          shape: "I",
          section_id: defaultISection.id,
          fabrication_type: "rolled",
          steel_grade_id: composeSteelGradeId(
            getDefaultSteelGrade("I", "rolled"),
          ),
          i_geometry: defaultValues.i_geometry,
          rhs_geometry: defaultValues.rhs_geometry,
          chs_geometry: defaultValues.chs_geometry,
        });

      if (value === "RHS")
        reset({
          ...values,
          shape: "RHS",
          section_id: defaultRHSSection.id,
          fabrication_type: "cold-formed",
          steel_grade_id: composeSteelGradeId(
            getDefaultSteelGrade("RHS", "cold-formed"),
          ),
          i_geometry: defaultValues.i_geometry,
          rhs_geometry: defaultValues.rhs_geometry,
          chs_geometry: defaultValues.chs_geometry,
        });

      if (value === "CHS")
        reset({
          ...values,
          shape: "CHS",
          section_id: defaultCHSSection.id,
          fabrication_type: "cold-formed",
          steel_grade_id: composeSteelGradeId(
            getDefaultSteelGrade("CHS", "cold-formed"),
          ),
          i_geometry: defaultValues.i_geometry,
          rhs_geometry: defaultValues.rhs_geometry,
          chs_geometry: defaultValues.chs_geometry,
        });

      await trigger();
    },
    [reset, getValues, trigger],
  );

  return (
    <Section>
      <SectionTitle>Shape</SectionTitle>
      <div className="flex items-center w-full gap-1">
        {shapeOptions.map((option) => {
          return (
            <InputRadio
              key={option.value}
              {...register?.("shape")}
              onChange={onShapeChange}
              value={option.value}
              label={option.label}
            />
          );
        })}
      </div>
    </Section>
  );
};
