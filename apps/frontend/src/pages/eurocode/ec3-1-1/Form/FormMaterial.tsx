import { useContext } from "react";
import {
  InfoTable,
  InfoTableHeaderCell,
  InfoTableLabelCell,
  InfoTableUnitCell,
  InfoTableValueCell,
  Section,
  SectionTitle,
  TextLabel,
} from "./shared";
import { HorizontalInput } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { steelGradeOptions } from "./options";
import { Ec311CustomRegisterContext } from "./Form";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { steelGradesMap } from "../data/steelGrades";
import { Latex } from "@components/Latex";
import { TableBody, TableHeader, TableRow } from "@components/Table";

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
    <div className="flex flex-col gap-3 text-sand-900">
      <InfoTable>
        <TableHeader>
          <TableRow className="bg-sand-100">
            <InfoTableHeaderCell>Standard</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <InfoTableValueCell align="left">
              {grade?.standard ?? "-"}
            </InfoTableValueCell>
          </TableRow>
        </TableBody>
      </InfoTable>

      <InfoTable>
        <TableHeader>
          <TableRow className="bg-sand-100">
            <InfoTableHeaderCell>Strength</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="f_y" />
            </InfoTableLabelCell>
            <InfoTableValueCell>{grade?.fy ?? "-"}</InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex="MPa" />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell />
            <InfoTableValueCell>
              <span className="mr-2 opacity-75 text-xs">thickness &ge; 40</span>
              {grade?.fy_above_40 ?? grade?.fy ?? "-"}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex="MPa" />
            </InfoTableUnitCell>
          </TableRow>

          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="f_u" />
            </InfoTableLabelCell>
            <InfoTableValueCell>{grade?.fu ?? "-"}</InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex="MPa" />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell />
            <InfoTableValueCell>
              <span className="mr-2 opacity-75 text-xs">thickness &ge; 40</span>
              {grade?.fu_above_40 ?? grade?.fu ?? "-"}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex="MPa" />
            </InfoTableUnitCell>
          </TableRow>
        </TableBody>
      </InfoTable>
    </div>
  );
};
