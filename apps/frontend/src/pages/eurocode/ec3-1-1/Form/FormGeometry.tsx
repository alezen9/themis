import { HorizontalInput } from "@components/inputs/shared";
import { SpacingDivider } from "@components/Dividers";
import {
  InfoTable,
  InfoTableHeaderCell,
  InfoTableLabelCell,
  InfoTableUnitCell,
  InfoTableValueCell,
  LatexLabel,
  Section,
  SectionTitle,
} from "./shared";
import { InputNumber } from "@components/inputs/InputNumber";
import { DrawingIShape } from "./DrawingIShape";
import { DrawingRhsShape } from "./DrawingRhsShape";
import { DrawingChsShape } from "./DrawingChsShape";
import { customSectionId } from "./options";
import { Latex } from "@components/Latex";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { useEc311FormContext } from "./useEc311FormContext";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
} from "@components/Accordion";
import { formatNumber } from "@formatters/number";
import { useEc311DerivedStore } from "../useEc311DerivedStore";

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
      <HorizontalInput name="L_m" label={<LatexLabel tex="L" />}>
        <InputNumber {...registerNumber?.("L_m")} suffix="m" />
      </HorizontalInput>
      {isCustomSection && shape === "I" && (
        <>
          <SpacingDivider />
          <HorizontalInput
            name="i_geometry.h_mm"
            label={<LatexLabel tex="h" />}
          >
            <InputNumber
              {...registerNumber?.("i_geometry.h_mm", {
                deps: ["i_geometry.tf_mm", "i_geometry.r_mm"],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="i_geometry.b_mm"
            label={<LatexLabel tex="b" />}
          >
            <InputNumber
              {...registerNumber?.("i_geometry.b_mm", {
                deps: ["i_geometry.tw_mm", "i_geometry.r_mm"],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="i_geometry.tw_mm"
            label={<LatexLabel tex="t_w" />}
          >
            <InputNumber
              {...registerNumber?.("i_geometry.tw_mm", {
                deps: ["i_geometry.b_mm", "i_geometry.r_mm"],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="i_geometry.tf_mm"
            label={<LatexLabel tex="t_f" />}
          >
            <InputNumber
              {...registerNumber?.("i_geometry.tf_mm", {
                deps: ["i_geometry.h_mm", "i_geometry.r_mm"],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="i_geometry.r_mm"
            label={<LatexLabel tex="r" />}
          >
            <InputNumber
              {...registerNumber?.("i_geometry.r_mm", {
                deps: [
                  "i_geometry.h_mm",
                  "i_geometry.b_mm",
                  "i_geometry.tw_mm",
                  "i_geometry.tf_mm",
                ],
              })}
              suffix="mm"
            />
          </HorizontalInput>
        </>
      )}
      {isCustomSection && shape === "RHS" && (
        <>
          <SpacingDivider />
          <HorizontalInput
            name="rhs_geometry.h_mm"
            label={<LatexLabel tex="h" />}
          >
            <InputNumber
              {...registerNumber?.("rhs_geometry.h_mm", {
                deps: [
                  "rhs_geometry.tw_mm",
                  "rhs_geometry.ri_mm",
                  "rhs_geometry.ro_mm",
                ],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="rhs_geometry.b_mm"
            label={<LatexLabel tex="b" />}
          >
            <InputNumber
              {...registerNumber?.("rhs_geometry.b_mm", {
                deps: [
                  "rhs_geometry.tw_mm",
                  "rhs_geometry.ri_mm",
                  "rhs_geometry.ro_mm",
                ],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="rhs_geometry.tw_mm"
            label={<LatexLabel tex="t_w" />}
          >
            <InputNumber
              {...registerNumber?.("rhs_geometry.tw_mm", {
                deps: [
                  "rhs_geometry.h_mm",
                  "rhs_geometry.b_mm",
                  "rhs_geometry.ri_mm",
                  "rhs_geometry.ro_mm",
                ],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="rhs_geometry.ri_mm"
            label={<LatexLabel tex="r_i" />}
          >
            <InputNumber
              {...registerNumber?.("rhs_geometry.ri_mm", {
                deps: [
                  "rhs_geometry.h_mm",
                  "rhs_geometry.b_mm",
                  "rhs_geometry.tw_mm",
                  "rhs_geometry.ro_mm",
                ],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="rhs_geometry.ro_mm"
            label={<LatexLabel tex="r_o" />}
          >
            <InputNumber
              {...registerNumber?.("rhs_geometry.ro_mm", {
                deps: [
                  "rhs_geometry.h_mm",
                  "rhs_geometry.b_mm",
                  "rhs_geometry.tw_mm",
                  "rhs_geometry.ri_mm",
                ],
              })}
              suffix="mm"
            />
          </HorizontalInput>
        </>
      )}
      {isCustomSection && shape === "CHS" && (
        <>
          <SpacingDivider />
          <HorizontalInput
            name="chs_geometry.d_mm"
            label={<LatexLabel tex="d" />}
          >
            <InputNumber
              {...registerNumber?.("chs_geometry.d_mm", {
                deps: ["chs_geometry.t_mm"],
              })}
              suffix="mm"
            />
          </HorizontalInput>

          <HorizontalInput
            name="chs_geometry.t_mm"
            label={<LatexLabel tex="t" />}
          >
            <InputNumber
              {...registerNumber?.("chs_geometry.t_mm", {
                deps: ["chs_geometry.d_mm"],
              })}
              suffix="mm"
            />
          </HorizontalInput>
        </>
      )}

      <Accordion>
        <AccordionHeader iconPosition="left" className="px-0">
          <span className="text-xs text-sand-800">
            Derived geometric properties
          </span>
        </AccordionHeader>
        <AccordionContent className="px-0">
          <GeometryPropertiesInfo />
        </AccordionContent>
      </Accordion>
    </Section>
  );
};

const GeometryPropertiesInfo = () => {
  const computedProperties = useEc311DerivedStore(state => state.geometry);

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
              {formatNumber(computedProperties.A_mm2)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^2"} />
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
              {formatNumber(computedProperties.Iy_mm4)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^4"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_z" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.Iz_mm4)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^4"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_t" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.It_mm4)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^4"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="I_w" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.Iw_mm6)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^6"} />
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
              {formatNumber(computedProperties.Wel_y_mm3)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^3"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{el,z}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.Wel_z_mm3)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^3"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{pl,y}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.Wpl_y_mm3)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^3"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_{pl,z}" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.Wpl_z_mm3)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^3"} />
            </InfoTableUnitCell>
          </TableRow>
          <TableRow>
            <InfoTableLabelCell>
              <Latex tex="W_t" />
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatNumber(computedProperties.Wt_mm3)}
            </InfoTableValueCell>
            <InfoTableUnitCell>
              <Latex tex={"mm^3"} />
            </InfoTableUnitCell>
          </TableRow>
        </TableBody>
      </InfoTable>
    </div>
  );
};
