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
import { steelGradesMap } from "../data/steelGrades";
import { Latex } from "@components/Latex";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { useEc311FormContext } from "./useEc311FormContext";

export const FormMaterial = () => {
  const { registerSelect } = useEc311FormContext();
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
  const { watch } = useEc311FormContext();
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
