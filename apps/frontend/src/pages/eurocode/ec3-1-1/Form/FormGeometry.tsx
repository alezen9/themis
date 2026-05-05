import { HorizontalInput } from "@components/inputs/shared";
import {
  InfoTable,
  InfoTableHeaderCell,
  InfoTableLabelCell,
  InfoTableUnitCell,
  InfoTableValueCell,
  LatexLabel,
  Section,
  SectionTitle,
  SpacingDivider,
} from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { useEffect, useState } from "react";
import { DrawingIShape } from "./DrawingIShape";
import { DrawingRhsShape } from "./DrawingRhsShape";
import { DrawingChsShape } from "./DrawingChsShape";
import { customSectionId } from "./options";
import { Latex } from "@components/Latex";
import { computeSectionProperties } from "../domain/geometry/sectionProperties";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { useEc311FormContext } from "./useEc311FormContext";

const mm2Unit = "\mathrm{mm}^2";
const mm3Unit = "\mathrm{mm}^3";
const mm4Unit = "\mathrm{mm}^4";
const mm6Unit = "\mathrm{mm}^6";

export const FormGeometry = () => {
  const { registerNumber, watch } = useEc311FormContext();
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
  const { subscribe, getValues } = useEc311FormContext();
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
      <InfoTable>
        <TableHeader>
          <TableRow className="bg-sand-100">
            <InfoTableHeaderCell>Area</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="A" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.A)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm2Unit} />
            </InfoTableUnitCell>
          </TableRow>
        </TableBody>
      </InfoTable>

      <InfoTable>
        <TableHeader>
          <TableRow className="bg-sand-100">
            <InfoTableHeaderCell>Inertia</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_y" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Iy)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm4Unit} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_z" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Iz)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm4Unit} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_t" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.It)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm4Unit} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_w" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Iw)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm6Unit} />
            </InfoTableUnitCell>
          </TableRow>
        </TableBody>
      </InfoTable>

      <InfoTable>
        <TableHeader>
          <TableRow className="bg-sand-100">
            <InfoTableHeaderCell>Moduli</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{el,y}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Wel_y)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm3Unit} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{el,z}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Wel_z)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm3Unit} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{pl,y}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Wpl_y)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm3Unit} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{pl,z}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {propertyFormatter.format(computedProperties.Wpl_z)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={mm3Unit} />
            </InfoTableUnitCell>
          </TableRow>
        </TableBody>
      </InfoTable>
    </div>
  );
};

const propertyFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});
