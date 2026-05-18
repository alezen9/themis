import {
  Accordion,
  AccordionContent,
  AccordionHeader,
} from "@components/Accordion";
import { InputSelect } from "@components/inputs/InputSelect";
import { HorizontalInput } from "@components/inputs/shared";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { orderBy, toPairs } from "lodash-es";
import { useEffect, useState } from "react";

import { numberFormatter } from "../../../../utils";
import { classifySection } from "../domain/classification/classifySection";
import type { Part } from "../domain/classification/types";
import { formatMetadata } from "../domain/classification/utils";
import { sectionClassOptions } from "./options";
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
import { actionsSchema } from "./schema/actionsSchema";
import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./schema/geometrySchema";
import { materialSchema } from "./schema/materialSchema";
import { useEc311FormContext } from "./useEc311FormContext";

const classificationActionsSchema = actionsSchema.pick({
  N_Ed_kN: true,
  M_y_Ed_kNm: true,
  M_z_Ed_kNm: true,
});

export const FormClassification = () => {
  const { registerSelect } = useEc311FormContext();

  return (
    <Section>
      <SectionTitle>Classification</SectionTitle>
      <HorizontalInput
        name="section_class"
        label={<TextLabel>Class</TextLabel>}
      >
        <InputSelect
          {...registerSelect?.("section_class")}
          options={sectionClassOptions}
        />
      </HorizontalInput>
      <ClassificationInfo />
    </Section>
  );
};

const ClassificationInfo = () => {
  const { subscribe, watch, getValues } = useEc311FormContext();
  const [[computedClass, parts], setComputedClass] = useState(() =>
    classifySection(getValues()),
  );
  const providedClass = watch("section_class");
  const isAutoMode = providedClass === "auto";

  useEffect(() => {
    const unsubscribe = subscribe({
      name: [
        "shape",
        "section_id",
        "steel_grade_id",
        "section_class",
        "i_geometry",
        "rhs_geometry",
        "chs_geometry",
        "N_Ed_kN",
        "M_y_Ed_kNm",
        "M_z_Ed_kNm",
      ],
      formState: { values: true },
      callback: ({ values }) => {
        const materialResult = materialSchema.safeParse({
          steel_grade_id: values.steel_grade_id,
        });
        const actionsResult = classificationActionsSchema.safeParse({
          N_Ed_kN: values.N_Ed_kN,
          M_y_Ed_kNm: values.M_y_Ed_kNm,
          M_z_Ed_kNm: values.M_z_Ed_kNm,
        });
        const geometryResult =
          values.shape === "I"
            ? iGeometrySchema.safeParse(values.i_geometry)
            : values.shape === "RHS"
              ? rhsGeometrySchema.safeParse(values.rhs_geometry)
              : chsGeometrySchema.safeParse(values.chs_geometry);
        if (
          !materialResult.success ||
          !actionsResult.success ||
          !geometryResult.success
        )
          return;
        setComputedClass(classifySection(values));
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
            <InfoTableHeaderCell>Classification</InfoTableHeaderCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <InfoTableLabelCell className="text-sm font-light">
              Provided
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatSectionClass(providedClass)}
            </InfoTableValueCell>
            <InfoTableUnitCell />
          </TableRow>

          <TableRow className={isAutoMode ? "" : "opacity-50"}>
            <InfoTableLabelCell className="text-sm font-light">
              Computed
            </InfoTableLabelCell>
            <InfoTableValueCell>
              {formatSectionClass(computedClass)}
            </InfoTableValueCell>
            <InfoTableUnitCell />
          </TableRow>
        </TableBody>
      </InfoTable>

      <Accordion duration="500ms">
        <AccordionHeader iconPosition="left" className="p-0">
          <span className="text-xs text-sand-800">Classification details</span>
        </AccordionHeader>
        <AccordionContent className="px-0">
          <div className="flex flex-col gap-4 pt-2">
            {parts.map((part) => (
              <PartInfoTable key={part.label} part={part} />
            ))}
          </div>
        </AccordionContent>
      </Accordion>
    </div>
  );
};

type PartInfoTableProps = { part: Part };

const PartInfoTable = (props: PartInfoTableProps) => {
  const { part } = props;
  const sortedMetadata = orderBy(toPairs(part.metadata), [0]);

  return (
    <InfoTable>
      <TableHeader>
        <TableRow className="bg-sand-100">
          <InfoTableHeaderCell>{part.label}</InfoTableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedMetadata.map(([metaKey, metaValue]) => {
          return (
            <TableRow key={metaKey}>
              <InfoTableValueCell colSpan={3} align="left">
                {formatMetadata(
                  metaKey as keyof typeof part.metadata,
                  metaValue,
                )}
              </InfoTableValueCell>
            </TableRow>
          );
        })}
        {part.trace.map((row) => {
          const { label, ratio, limit, note, satisfied } = row;
          const formattedRatio =
            typeof ratio === "number"
              ? numberFormatter.format(ratio)
              : undefined;

          return (
            <TableRow key={label}>
              <InfoTableValueCell align="left" className="text-nowrap">
                <span className="inline-flex items-center gap-2">
                  <span>{label}</span>
                  {limit && formattedRatio && (
                    <span className="inline-flex items-center gap-1">
                      <span>{formattedRatio}</span>
                      <span>&le;</span>
                      <span>{limit}</span>
                    </span>
                  )}
                </span>
              </InfoTableValueCell>
              {note && (
                <InfoTableValueCell align="left" className="text-nowrap w-32">
                  <span className="mr-2">&rarr;</span>
                  <span>{note}</span>
                </InfoTableValueCell>
              )}
              {!note && (
                <InfoTableValueCell align="left" className="text-nowrap w-32">
                  <span className="mr-2">&rarr;</span>
                  <span>{satisfied ? "Satisfied" : "Not satisfied"}</span>
                </InfoTableValueCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </InfoTable>
  );
};

const formatSectionClass = (sectionClass: string | number) => {
  if (sectionClass === "auto") return "Auto";
  return `Class ${sectionClass}`;
};
