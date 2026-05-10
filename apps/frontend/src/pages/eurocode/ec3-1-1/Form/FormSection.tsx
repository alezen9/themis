import { HorizontalInput } from "@components/inputs/shared";
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
import { InputSelect } from "@components/inputs/InputSelect";
import {
  circularSectionOptions,
  flangedSectionOptions,
  hollowSectionOptions,
  iFabricationTypeOptions,
  rhsChsFabricationTypeOptions,
  sectionClassOptions,
  customSectionId,
} from "./options";
import { useCallback, useEffect, useState } from "react";
import { InputRadio } from "@components/inputs/InputRadio";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { ChangeHandler } from "react-hook-form";
import {
  defaultCHSSection,
  defaultISection,
  defaultRHSSection,
} from "./defaultValues";
import { useEc311FormContext } from "./useEc311FormContext";
import { flangedSectionsMap } from "../data/flangedSections";
import { hollowSectionsMap } from "../data/hollowSections";
import { circularSectionsMap } from "../data/circularSections";
import { TableBody, TableHeader, TableRow } from "@components/Table";
import { classifySection } from "../domain/classification/classifySection";
import { orderBy, toPairs } from "lodash-es";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
} from "@components/Accordion";
import { formatMetadata } from "../domain/classification/utils";
import { numberFormatter } from "../../../../utils";

const sectionOptionsMap = {
  I: { options: flangedSectionOptions, defaultValue: defaultISection.id },
  RHS: { options: hollowSectionOptions, defaultValue: defaultRHSSection.id },
  CHS: { options: circularSectionOptions, defaultValue: defaultCHSSection.id },
};

const fabricationTypeOptionsMap = {
  I: { options: iFabricationTypeOptions },
  RHS: { options: rhsChsFabricationTypeOptions },
  CHS: { options: rhsChsFabricationTypeOptions },
};

export const FormSection = () => {
  const { register, registerSelect, watch, reset, getValues } =
    useEc311FormContext();
  const shape = watch("shape");

  const onSectionChange = useCallback<ChangeHandler>(
    async (e) => {
      const { name, value } = e.target;
      const values = getValues();
      const shape = values.shape;
      const i_geometry = flangedSectionsMap.get(value);
      const rhs_geometry = hollowSectionsMap.get(value);
      const chs_geometry = circularSectionsMap.get(value);
      const isCustomSection = value === customSectionId;
      reset(
        {
          ...getValues(),
          ...{
            [name]: value,
            ...(!isCustomSection && shape === "I" ? { i_geometry } : {}),
            ...(!isCustomSection && shape === "RHS" ? { rhs_geometry } : {}),
            ...(!isCustomSection && shape === "CHS" ? { chs_geometry } : {}),
          },
        },
        { keepErrors: true },
      );
    },
    [reset, getValues],
  );

  return (
    <Section>
      <SectionTitle>Cross section</SectionTitle>
      <HorizontalInput name="sectionId" label={<TextLabel>Section</TextLabel>}>
        <InputAutocomplete
          key={shape}
          {...registerSelect?.("section_id")}
          onChange={onSectionChange}
          defaultValue={sectionOptionsMap[shape].defaultValue}
          options={sectionOptionsMap[shape].options}
        />
      </HorizontalInput>
      <HorizontalInput
        name="fabrication_type"
        label={<TextLabel>Fabrication</TextLabel>}
      >
        <div className="flex items-center w-full gap-1">
          {fabricationTypeOptionsMap[shape].options.map((option) => {
            return (
              <InputRadio
                key={`${shape}-${option.value}`}
                {...register?.("fabrication_type")}
                value={option.value}
                label={option.label}
              />
            );
          })}
        </div>
      </HorizontalInput>
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

      <Accordion>
        <AccordionHeader iconPosition="left" className="p-0">
          <span className="text-xs text-sand-800 group-data-panel-open/trigger:hidden">
            Show classification details
          </span>
          <span className="hidden text-xs text-sand-800 group-data-panel-open/trigger:inline">
            Hide classification details
          </span>
        </AccordionHeader>
        <AccordionContent className="px-0 mt-2">
          <div className="flex flex-col gap-4">
            {parts.map((part, idx) => {
              const key = `${part.label}-${idx}`;
              const sortedMetadata = orderBy(toPairs(part.metadata), [0]);

              return (
                <InfoTable key={key}>
                  <TableHeader>
                    <TableRow className="bg-sand-100">
                      <InfoTableHeaderCell>{part.label}</InfoTableHeaderCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedMetadata.map(([metaKey, metaValue]) => {
                      return (
                        <TableRow key={key + metaKey}>
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
                      const ratio =
                        typeof row.ratio === "number"
                          ? numberFormatter.format(row.ratio)
                          : undefined;

                      return (
                        <TableRow key={row.label}>
                          <InfoTableValueCell colSpan={2} align="left">
                            <span className="inline-flex items-center gap-2">
                              <span>{row.label}</span>
                              {row.limit && ratio && (
                                <span className="inline-flex items-center gap-1">
                                  <span>{ratio}</span>
                                  <span>&le;</span>
                                  <span>{row.limit}</span>
                                </span>
                              )}
                            </span>
                          </InfoTableValueCell>
                          {row.note && (
                            <InfoTableValueCell align="left">
                              <span className="mr-2">&rarr;</span>
                              <span>{row.note}</span>
                            </InfoTableValueCell>
                          )}
                          {!row.note && (
                            <InfoTableValueCell align="left">
                              <span className="mr-2">&rarr;</span>
                              <span>
                                {row.satisfied ? "Satisfied" : "Not satisfied"}
                              </span>
                            </InfoTableValueCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </InfoTable>
              );
            })}
          </div>
        </AccordionContent>
      </Accordion>
    </div>
  );
};

const formatSectionClass = (sectionClass: string | number) => {
  if (sectionClass === "auto") return "Auto";
  return `Class ${sectionClass}`;
};
