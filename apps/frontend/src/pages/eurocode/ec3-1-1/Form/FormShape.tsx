import { Section, SectionTitle } from "./shared";
import { useCallback } from "react";
import { shapeOptions } from "./options";
import { InputRadio } from "@components/inputs/InputRadio";
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
import { ChangeHandler } from "react-hook-form";

export const FormShape = () => {
  const { register, reset, getValues } = useEc311FormContext();

  const onShapeChange = useCallback<ChangeHandler>(
    async (e) => {
      const { name, value } = e.target;
      let section_id = defaultISection.id;
      if (value === "RHS") section_id = defaultRHSSection.id;
      if (value === "CHS") section_id = defaultCHSSection.id;
      const i_geometry = getIShapePatchFields(section_id);
      const rhs_geometry = getRhsShapePatchFields(section_id);
      const chs_geometry = getChsShapePatchFields(section_id);
      reset(
        {
          ...getValues(),
          ...{
            [name]: value,
            section_id,
            ...(value === "I" && { i_geometry }),
            ...(value === "RHS" && { rhs_geometry }),
            ...(value === "CHS" && { chs_geometry }),
            fabrication_type: value === "I" ? "rolled" : "cold-formed",
          },
        },
        { keepErrors: true },
      );
    },
    [reset, getValues],
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
