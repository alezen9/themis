import { HorizontalInput } from "@components/inputs/shared";
import { LatexLabel, Section, SectionTitle, SpacingDivider } from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { ComponentProps, useContext, useEffect, useState } from "react";
import { Ec311CustomRegisterContext } from "./Form";
import { useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { DrawingIShape } from "./DrawingIShape";
import { DrawingRhsShape } from "./DrawingRhsShape";
import { DrawingChsShape } from "./DrawingChsShape";
import { customSectionId } from "./options";
import { Latex } from "@components/Latex";
import { computeSectionProperties } from "../domain/geometry/sectionProperties";
import {
  Table,
  TableBody,
  TableDataCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "@components/Table";

const mm2Unit = String.raw`\mathrm{mm}^2`;
const mm3Unit = String.raw`\mathrm{mm}^3`;
const mm4Unit = String.raw`\mathrm{mm}^4`;
const mm6Unit = String.raw`\mathrm{mm}^6`;

export const FormGeometry = () => {
  const { registerNumber } = useContext(Ec311CustomRegisterContext);
  const { watch } = useFormContext<Ec3FormValues>();
  const shape = watch("shape");
  const sectionId = watch("section_id");
  const isCustomSection = sectionId === customSectionId;

  return (
    <Section>
      <SectionTitle>Geometry</SectionTitle>

      {shape === "I" && <DrawingIShape />}
      {shape === "RHS" && <DrawingRhsShape />}
      {shape === "CHS" && <DrawingChsShape />}

      <SpacingDivider />
      <SectionPropertiesInfo />
      <SpacingDivider />

      <HorizontalInput name="L" label={<LatexLabel tex="L" />}>
        <InputNumber {...registerNumber?.("L")} suffix="m" />
      </HorizontalInput>

      {isCustomSection && shape === "I" && (
        <>
          <HorizontalInput name="h" label={<LatexLabel tex="h" />}>
            <InputNumber {...registerNumber?.("i_geometry.h")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="b" label={<LatexLabel tex="b" />}>
            <InputNumber {...registerNumber?.("i_geometry.b")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tw" label={<LatexLabel tex="t_w" />}>
            <InputNumber {...registerNumber?.("i_geometry.tw")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tf" label={<LatexLabel tex="t_f" />}>
            <InputNumber {...registerNumber?.("i_geometry.tf")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="r" label={<LatexLabel tex="r" />}>
            <InputNumber {...registerNumber?.("i_geometry.r")} suffix="mm" />
          </HorizontalInput>
        </>
      )}

      {isCustomSection && shape === "RHS" && (
        <>
          <HorizontalInput name="h" label={<LatexLabel tex="h" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.h")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="b" label={<LatexLabel tex="b" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.b")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tw" label={<LatexLabel tex="t_w" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.tw")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="ri" label={<LatexLabel tex="r_i" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.ri")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="ro" label={<LatexLabel tex="r_o" />}>
            <InputNumber {...registerNumber?.("rhs_geometry.ro")} suffix="mm" />
          </HorizontalInput>
        </>
      )}

      {isCustomSection && shape === "CHS" && (
        <>
          <HorizontalInput name="d" label={<LatexLabel tex="d" />}>
            <InputNumber {...registerNumber?.("chs_geometry.d")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="t" label={<LatexLabel tex="t" />}>
            <InputNumber {...registerNumber?.("chs_geometry.t")} suffix="mm" />
          </HorizontalInput>
        </>
      )}
    </Section>
  );
};

const SectionPropertiesInfo = () => {
  const { subscribe, getValues } = useFormContext<Ec3FormValues>();
  const [computedProperties, setComputedProperties] = useState(() =>
    computeSectionProperties(getValues()),
  );

  useEffect(() => {
    const unsubscribe = subscribe({
      name: [
        "i_geometry",
        "rhs_geometry",
        "chs_geometry",
        "shape",
        "section_id",
      ],
      exact: true,
      formState: { values: true },
      callback: ({ values }) => {
        const computed = computeSectionProperties(values);
        setComputedProperties(computed);
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe]);

  return (
    <div className="flex flex-col gap-3 text-sand-900">
      <div className="border border-sand-200 rounded-sm">
        <Table className="overflow-hidden rounded-sm [&_tr]:border-none">
          <TableHeader>
            <TableRow className=" bg-sand-100">
              <TableHeaderCell
                colSpan={3}
                className="px-2 py-1 text-xs uppercase tracking-widest text-sand-900"
              >
                Area
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <CellLabel>
                <Latex tex="A" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.A)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm2Unit} />
              </CellUnit>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="border border-sand-200 rounded-sm">
        <Table className="overflow-hidden rounded-sm [&_tr]:border-none">
          <TableHeader>
            <TableRow className="bg-sand-100">
              <TableHeaderCell
                colSpan={3}
                className="px-2 py-1 text-xs uppercase tracking-widest text-sand-900"
              >
                Inertia
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <CellLabel>
                <Latex tex="I_y" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Iy)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm4Unit} />
              </CellUnit>
            </TableRow>
            <TableRow>
              <CellLabel>
                <Latex tex="I_z" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Iz)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm4Unit} />
              </CellUnit>
            </TableRow>
            <TableRow>
              <CellLabel>
                <Latex tex="I_t" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.It)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm4Unit} />
              </CellUnit>
            </TableRow>
            <TableRow>
              <CellLabel>
                <Latex tex="I_w" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Iw)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm6Unit} />
              </CellUnit>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="border border-sand-200 rounded-sm">
        <Table className="overflow-hidden rounded-sm [&_tr]:border-none">
          <TableHeader>
            <TableRow className="bg-sand-100">
              <TableHeaderCell
                colSpan={3}
                className="px-2 py-1 text-xs uppercase tracking-widest text-sand-900"
              >
                Moduli
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <CellLabel>
                <Latex tex="W_{el,y}" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Wel_y)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm3Unit} />
              </CellUnit>
            </TableRow>
            <TableRow>
              <CellLabel>
                <Latex tex="W_{el,z}" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Wel_z)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm3Unit} />
              </CellUnit>
            </TableRow>
            <TableRow>
              <CellLabel>
                <Latex tex="W_{pl,y}" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Wpl_y)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm3Unit} />
              </CellUnit>
            </TableRow>
            <TableRow>
              <CellLabel>
                <Latex tex="W_{pl,z}" />
              </CellLabel>
              <CellValue>
                {propertyFormatter.format(computedProperties.Wpl_z)}
              </CellValue>
              <CellUnit>
                <Latex tex={mm3Unit} />
              </CellUnit>
            </TableRow>
          </TableBody>
        </Table>
      </div>
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

const propertyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
