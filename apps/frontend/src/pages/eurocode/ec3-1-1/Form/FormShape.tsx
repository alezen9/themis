import { Section, SectionTitle } from "./shared";
import { useCallback, useContext } from "react";
import { Ec311CustomRegisterContext } from "./Form";
import { shapeOptions } from "./options";
import { InputRadio } from "@components/inputs/InputRadio";
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

export const FormShape = () => {
  const { register } = useContext(Ec311CustomRegisterContext);
  const { reset, getValues } = useFormContext<Ec3FormValues>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onChange, ...rest } = register?.("shape") ?? {};

  const onShapeChange = useCallback<NonNullable<typeof onChange>>(
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
              {...rest}
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
