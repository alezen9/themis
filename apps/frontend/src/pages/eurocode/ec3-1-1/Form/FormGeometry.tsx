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
import { computeGeometryProperties } from "../domain/geometry/computeGeometryProperties";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { useEc311FormContext } from "./useEc311FormContext";

const mm2Unit = String.raw`\mathrm{mm}^2`;
const mm3Unit = String.raw`\mathrm{mm}^3`;
const mm4Unit = String.raw`\mathrm{mm}^4`;
const mm6Unit = String.raw`\mathrm{mm}^6`;

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
      <GeometryPropertiesInfo />
      <SpacingDivider />

      <HorizontalInput name="L_m" label={<LatexLabel tex="L" />}>
        <InputNumber {...registerNumber?.("L_m")} suffix="m" />
      </HorizontalInput>

      {isCustomSection && shape === "I" && (
        <>
          <HorizontalInput name="h_mm" label={<LatexLabel tex="h" />}>
            <InputNumber {...registerNumber?.("i_geometry.h_mm")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="b_mm" label={<LatexLabel tex="b" />}>
            <InputNumber {...registerNumber?.("i_geometry.b_mm")} suffix="mm" />
          </HorizontalInput>

          <HorizontalInput name="tw_mm" label={<LatexLabel tex="t_w" />}>
            <InputNumber
              {...registerNumber?.("i_geometry.tw_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="tf_mm" label={<LatexLabel tex="t_f" />}>
            <InputNumber
              {...registerNumber?.("i_geometry.tf_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="r_mm" label={<LatexLabel tex="r" />}>
            <InputNumber {...registerNumber?.("i_geometry.r_mm")} suffix="mm" />
          </HorizontalInput>
        </>
      )}

      {isCustomSection && shape === "RHS" && (
        <>
          <HorizontalInput name="h_mm" label={<LatexLabel tex="h" />}>
            <InputNumber
              {...registerNumber?.("rhs_geometry.h_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="b_mm" label={<LatexLabel tex="b" />}>
            <InputNumber
              {...registerNumber?.("rhs_geometry.b_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="tw_mm" label={<LatexLabel tex="t_w" />}>
            <InputNumber
              {...registerNumber?.("rhs_geometry.tw_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="ri_mm" label={<LatexLabel tex="r_i" />}>
            <InputNumber
              {...registerNumber?.("rhs_geometry.ri_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="ro_mm" label={<LatexLabel tex="r_o" />}>
            <InputNumber
              {...registerNumber?.("rhs_geometry.ro_mm")}
              suffix="mm"
            />
          </HorizontalInput>
        </>
      )}

      {isCustomSection && shape === "CHS" && (
        <>
          <HorizontalInput name="d_mm" label={<LatexLabel tex="d" />}>
            <InputNumber
              {...registerNumber?.("chs_geometry.d_mm")}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput name="t_mm" label={<LatexLabel tex="t" />}>
            <InputNumber
              {...registerNumber?.("chs_geometry.t_mm")}
              suffix="mm"
            />
          </HorizontalInput>
        </>
      )}
    </Section>
  );
};

const GeometryPropertiesInfo = () => {
  const { subscribe, getValues } = useEc311FormContext();
  const [computedProperties, setComputedProperties] = useState(() =>
    computeGeometryProperties(getValues()),
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
        const computed = computeGeometryProperties(values);
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
              {propertyFormatter.format(computedProperties.A_mm2)}
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
              {propertyFormatter.format(computedProperties.Iy_mm4)}
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
              {propertyFormatter.format(computedProperties.Iz_mm4)}
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
              {propertyFormatter.format(computedProperties.It_mm4)}
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
              {propertyFormatter.format(computedProperties.Iw_mm6)}
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
              {propertyFormatter.format(computedProperties.Wel_y_mm3)}
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
              {propertyFormatter.format(computedProperties.Wel_z_mm3)}
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
              {propertyFormatter.format(computedProperties.Wpl_y_mm3)}
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
              {propertyFormatter.format(computedProperties.Wpl_z_mm3)}
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
