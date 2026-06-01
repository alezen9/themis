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
import { getSteelGradeOptions } from "./options";
import { composeSteelGradeId, steelGradesMap } from "../data/steelGrades";
import { Latex } from "@components/Latex";
import {
  TableBody,
  TableDataCell,
  TableHeader,
  TableRow,
} from "@components/Table";
import { texUnit } from "./units";
import { useEc311FormContext } from "./useEc311FormContext";
import { getDefaultSteelGrade } from "./defaultValues";

export const FormMaterial = () => {
  const { registerSelect, watch } = useEc311FormContext();
  const shape = watch("shape");
  const fabricationType = watch("fabrication_type");
  const defaultSteelGradeId = composeSteelGradeId(
    getDefaultSteelGrade(shape, fabricationType),
  );

  return (
    <Section>
      <SectionTitle>Material</SectionTitle>
      <HorizontalInput
        name="steel_grade_id"
        label={<TextLabel>Steel grade</TextLabel>}
      >
        <InputAutocomplete
          key={`${shape}-${fabricationType}`}
          {...registerSelect?.("steel_grade_id")}
          defaultValue={defaultSteelGradeId}
          options={getSteelGradeOptions(shape, fabricationType)}
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
          <TableRow>
            <TableDataCell align="left">
              {grade?.standardDescription ?? "-"}
            </TableDataCell>
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
            <InfoTableValueCell>{grade?.fy_MPa ?? "-"}</InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={texUnit.MPa} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell />
            <InfoTableValueCell>
              <span className="mr-4 opacity-50 text-xs inline-flex items-baseline">
                thickness &ge; 40
                <Latex tex={texUnit.mm} className="text-sm" />
              </span>
              {grade?.fy_above_40_MPa ?? grade?.fy_MPa ?? "-"}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={texUnit.MPa} />
            </InfoTableUnitCell>
          </TableRow>

          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="f_u" />
            </InfoTableLabelCell>
            <InfoTableValueCell>{grade?.fu_MPa ?? "-"}</InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={texUnit.MPa} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell />
            <InfoTableValueCell>
              <span className="mr-4 opacity-50 text-xs inline-flex items-baseline">
                thickness &ge; 40
                <Latex tex={texUnit.mm} className="text-sm" />
              </span>
              {grade?.fu_above_40_MPa ?? grade?.fu_MPa ?? "-"}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={texUnit.MPa} />
            </InfoTableUnitCell>
          </TableRow>
        </TableBody>
      </InfoTable>
    </div>
  );
};
