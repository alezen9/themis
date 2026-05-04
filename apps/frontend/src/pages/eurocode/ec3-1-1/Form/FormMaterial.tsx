import { ComponentProps, useContext } from "react";
import { Section, SectionTitle, TextLabel } from "./shared";
import { HorizontalInput } from "@components/inputs/shared";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { steelGradeOptions } from "./options";
import { Ec311CustomRegisterContext } from "./Form";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { steelGradesMap } from "../data/steelGrades";
import { Latex } from "@components/Latex";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@components/Table";

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
    <div className="flex flex-col gap-3 text-sand-900 border border-sand-200 rounded-sm">
      <Table className="overflow-hidden rounded-sm [&_tr]:border-none">
        <TableHeader>
          <TableRow className="bg-sand-100">
            <TableHeaderCell
              colSpan={3}
              className="px-2 py-1 text-xs uppercase tracking-widest text-sand-900"
            >
              Strength
            </TableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <CellLabel>
              <Latex tex="f_y" />
            </CellLabel>
            <CellValue>{grade?.fy ?? "-"}</CellValue>
            <CellUnit>
              <Latex tex="MPa" />
            </CellUnit>
          </TableRow>
          <TableRow>
            <CellLabel />
            <CellValue>
              <span className="mr-2 opacity-50 text-xs">thickness &ge; 40</span>
              {grade?.fy_above_40 ?? "-"}
            </CellValue>
            <CellUnit>
              <Latex tex="MPa" />
            </CellUnit>
          </TableRow>

          <TableRow>
            <CellLabel>
              <Latex tex="f_u" />
            </CellLabel>
            <CellValue>{grade?.fu ?? "-"}</CellValue>
            <CellUnit>
              <Latex tex="MPa" />
            </CellUnit>
          </TableRow>
          <TableRow>
            <CellLabel />
            <CellValue>
              <span className="mr-2 opacity-50 text-xs">thickness &ge; 40</span>
              {grade?.fu_above_40 ?? "-"}
            </CellValue>
            <CellUnit>
              <Latex tex="MPa" />
            </CellUnit>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const CellLabel = (props: ComponentProps<typeof TableHeaderCell>) => (
  <TableHeaderCell
    scope="row"
    className="w-14 font-normal text-xl leading-1"
    {...props}
  />
);

const CellValue = (props: ComponentProps<typeof TableDataCell>) => (
  <TableDataCell align="right" className="min-w-0 tabular-nums" {...props} />
);

const CellUnit = (props: ComponentProps<typeof TableDataCell>) => (
  <TableDataCell className="w-16 text-sm opacity-50" {...props} />
);
