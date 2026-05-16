import { Section, SectionTitle } from "./shared";
import { useCallback } from "react";
import { shapeOptions } from "./options";
import { InputRadio } from "@components/inputs/InputRadio";
import {
  defaultCHSSection,
  defaultISection,
  defaultRHSSection,
} from "./defaultValues";
import { useEc311FormContext } from "./useEc311FormContext";
import { ChangeHandler } from "react-hook-form";

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
          i_geometry: {
            h_mm: defaultISection.h_mm,
            b_mm: defaultISection.b_mm,
            tw_mm: defaultISection.tw_mm,
            tf_mm: defaultISection.tf_mm,
            r_mm: defaultISection.r_mm,
          },
        });

      if (value === "RHS")
        reset({
          ...values,
          shape: "RHS",
          section_id: defaultRHSSection.id,
          fabrication_type: "cold-formed",
          rhs_geometry: {
            h_mm: defaultRHSSection.h_mm,
            b_mm: defaultRHSSection.b_mm,
            tw_mm: defaultRHSSection.tw_mm,
            ri_mm: defaultRHSSection.ri_mm,
            ro_mm: defaultRHSSection.ro_mm,
          },
        });

      if (value === "CHS")
        reset({
          ...values,
          shape: "CHS",
          section_id: defaultCHSSection.id,
          fabrication_type: "cold-formed",
          chs_geometry: {
            d_mm: defaultCHSSection.d_mm,
            t_mm: defaultCHSSection.t_mm,
          },
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
