import {
  Accordion,
  AccordionContent,
  AccordionHeader,
} from "@components/Accordion";
import { FormInputSelect } from "@components/inputs/FormInputSelect";
import { HorizontalInput } from "@components/inputs/shared";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { formatNumber } from "@formatters/number";
import { orderBy, toPairs } from "lodash-es";

import type { Part } from "../domain/classification/types";
import { formatMetadata } from "../domain/classification/utils";
import { useEc311DerivedStore } from "../useEc311DerivedStore";
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
import { useEc311FormContext } from "./useEc311FormContext";
import { twMerge } from "tailwind-merge";

export const FormClassification = () => {
  return (
    <Section>
      <SectionTitle>Classification</SectionTitle>
      <HorizontalInput
        name="section_class"
        label={<TextLabel>Class</TextLabel>}
      >
        <FormInputSelect name="section_class" options={sectionClassOptions} />
      </HorizontalInput>
      <ClassificationInfo />
    </Section>
  );
};

const ClassificationInfo = () => {
  const { watch } = useEc311FormContext();
  const [computedClass, parts] = useEc311DerivedStore(
    state => state.classification,
  );
  const providedClass = watch("section_class");
  const isAutoMode = providedClass === "auto";

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
            <InfoTableLabelCell
              className={twMerge(
                "text-sm font-light",
                isAutoMode && computedClass === 4 && "text-red-500",
              )}
            >
              Computed
            </InfoTableLabelCell>
            <InfoTableValueCell
              className={
                isAutoMode && computedClass === 4 ? "text-red-500" : ""
              }
            >
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
            {parts.map(part => (
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
        {part.trace.map(row => {
          const { label, ratio, limit, note, satisfied } = row;
          const formattedRatio =
            typeof ratio === "number" ? formatNumber(ratio) : undefined;

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
