import React, { ComponentProps, useContext } from "react";
import { Section, SectionTitle, TextLabel } from "./shared";
import { HorizontalInput } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { steelGradeOptions } from "./options";
import { Ec311CustomRegisterContext } from "./Form";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { steelGradesMap } from "../data/steelGrades";
import { Latex } from "@components/Latex";

export const FormMaterial = () => {
  const { registerSelect } = useContext(Ec311CustomRegisterContext);
  return (
    <Section>
      <SectionTitle>Material</SectionTitle>
      <HorizontalInput
        name="steel_grade_id"
        label={<TextLabel>Steel grade</TextLabel>}
      >
        <InputAutocomplete
          {...registerSelect?.("steel_grade_id")}
          options={steelGradeOptions}
        />
      </HorizontalInput>
      <AdditionalInfoRow />
    </Section>
  );
};

const AdditionalInfoRow = () => {
  const { watch } = useFormContext<Ec3FormValues>();
  const gradeId = watch("steel_grade_id");

  const grade = steelGradesMap.get(gradeId);

  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-1 items-center">
      <CellContainer>
        <span className="flex items-center justify-center gap-1">
          <Latex tex="fy" className="text-xl leading-1" />
          <span>=</span>
          <span className="tabular-nums text-sm">{grade?.fy} Mpa</span>
        </span>
        {grade?.fy_above_40 && (
          <span className="text-xs text-center text-zinc-400">
            ({grade.fy_above_40} when thickness &le; 40)
          </span>
        )}
      </CellContainer>

      <CellContainer>
        <span className="flex items-center justify-center gap-1">
          <Latex tex="fu" className="text-xl leading-1" />
          <span>=</span>
          <span className="tabular-nums text-sm">{grade?.fu} Mpa</span>
        </span>
        {grade?.fu_above_40 && (
          <span className="text-xs text-center text-zinc-400">
            ({grade.fu_above_40} when thickness &le; 40)
          </span>
        )}
      </CellContainer>
    </div>
  );
};

const CellContainer = (props: ComponentProps<"div">) => (
  <div
    className="border border-zinc-200 py-1 px-2 flex flex-col justify-center rounded-sm text-zinc-600"
    {...props}
  />
);
