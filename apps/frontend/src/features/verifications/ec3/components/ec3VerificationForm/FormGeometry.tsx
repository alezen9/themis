import { useEffect, useMemo, useRef } from "react";
import {
  useFormContext,
  useWatch,
  type UseFormSetValue,
} from "react-hook-form";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";
import { InputNumber } from "@components/inputs/InputNumber";
import { InputRadioGroup } from "@components/inputs/InputRadioGroup";
import { InputSelect } from "@components/inputs/InputSelect";
import {
  circularSections,
  type CircularSection,
} from "../../data/circularSections";
import {
  flangedSections,
  type FlangedSection,
} from "../../data/flangedSections";
import { hollowSections, type HollowSection } from "../../data/hollowSections";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  FABRICATION_TYPE_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SHAPE_OPTIONS,
} from "../../options";
import { CUSTOM_SECTION_ID } from "./config";
import {
  Ec3FormSection,
  Ec3FormSectionContent,
  Ec3FormSectionTitle,
} from "./Ec3FormLayout";
import { Ec3FieldLabel, getError } from "./shared";

type ShapeKey = (typeof SHAPE_OPTIONS)[number];
type CatalogSection = FlangedSection | HollowSection | CircularSection;
type ShapeFieldsProps = { isCustomSection: boolean; isActiveShape: boolean };

const getSectionsByShape = (shape: ShapeKey): readonly CatalogSection[] => {
  if (shape === "I") return flangedSections;
  if (shape === "CHS") return circularSections;
  return hollowSections;
};

const setGeometryValues = (
  section: CatalogSection,
  setValue: UseFormSetValue<Ec3FormValues>,
) => {
  if (section.shape === "I") {
    setValue("h", section.h, { shouldValidate: true });
    setValue("b", section.b, { shouldValidate: true });
    setValue("tw", section.tw, { shouldValidate: true });
    setValue("tf", section.tf, { shouldValidate: true });
    setValue("r", section.r, { shouldValidate: true });
    return;
  }

  if (section.shape === "RHS") {
    setValue("h", section.h, { shouldValidate: true });
    setValue("b", section.b, { shouldValidate: true });
    setValue("tw", section.tw, { shouldValidate: true });
    setValue("ro", section.ro, { shouldValidate: true });
    setValue("ri", section.ri, { shouldValidate: true });
    return;
  }

  setValue("d", section.d, { shouldValidate: true });
  setValue("t", section.t, { shouldValidate: true });
};

const syncCatalogSection = (
  section: CatalogSection,
  setValue: UseFormSetValue<Ec3FormValues>,
) => {
  setValue("fabricationType", "rolled", { shouldValidate: true });
  setGeometryValues(section, setValue);
};

const IShapeFields = (props: ShapeFieldsProps) => {
  const { isCustomSection, isActiveShape } = props;
  const {
    formState: { errors },
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        name="h"
        label={<Ec3FieldLabel text="Height" tex="h" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "h") : undefined}
      />
      <InputNumber
        name="b"
        label={<Ec3FieldLabel text="Width" tex="b" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "b") : undefined}
      />
      <InputNumber
        name="tw"
        label={<Ec3FieldLabel text="Web Thickness" tex="t_w" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "tw") : undefined}
      />
      <InputNumber
        name="tf"
        label={<Ec3FieldLabel text="Flange Thickness" tex="t_f" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "tf") : undefined}
      />
      <InputNumber
        name="r"
        label={<Ec3FieldLabel text="Root Radius" tex="r" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "r") : undefined}
      />
    </>
  );
};

const RhsShapeFields = (props: ShapeFieldsProps) => {
  const { isCustomSection, isActiveShape } = props;
  const {
    formState: { errors },
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        name="h"
        label={<Ec3FieldLabel text="Height" tex="h" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "h") : undefined}
      />
      <InputNumber
        name="b"
        label={<Ec3FieldLabel text="Width" tex="b" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "b") : undefined}
      />
      <InputNumber
        name="tw"
        label={<Ec3FieldLabel text="Wall Thickness" tex="t" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "tw") : undefined}
      />
      <InputNumber
        name="ro"
        label={<Ec3FieldLabel text="Outer Radius" tex="r_o" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "ro") : undefined}
      />
      <InputNumber
        name="ri"
        label={<Ec3FieldLabel text="Inner Radius" tex="r_i" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "ri") : undefined}
      />
    </>
  );
};

const ChsShapeFields = (props: ShapeFieldsProps) => {
  const { isCustomSection, isActiveShape } = props;
  const {
    formState: { errors },
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        name="d"
        label={<Ec3FieldLabel text="Diameter" tex="d" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "d") : undefined}
      />
      <InputNumber
        name="t"
        label={<Ec3FieldLabel text="Thickness" tex="t" />}
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "t") : undefined}
      />
    </>
  );
};

export const FormGeometry = () => {
  const { control, setValue } = useFormContext<Ec3FormValues>();
  const shape = useWatch({ control, name: "shape" }) ?? SHAPE_OPTIONS[0];
  const sectionId =
    useWatch({ control, name: "sectionId" }) ?? CUSTOM_SECTION_ID;
  const previousShape = useRef(shape);
  const sections = getSectionsByShape(shape);
  const sectionOptions = useMemo(
    () => [
      { label: "Custom", value: CUSTOM_SECTION_ID },
      ...sections.map((section) => ({ label: section.id, value: section.id })),
    ],
    [sections],
  );
  const isCustomSection = sectionId === CUSTOM_SECTION_ID;

  useEffect(() => {
    const shapeChanged = previousShape.current !== shape;
    previousShape.current = shape;

    const firstSection = sections[0];
    if (!shapeChanged || !isCustomSection || !firstSection) return;

    setGeometryValues(firstSection, setValue);
  }, [isCustomSection, sections, setValue, shape]);

  useEffect(() => {
    if (isCustomSection || sectionId === "") return;

    const currentSection = sections.find((section) => section.id === sectionId);
    if (!currentSection) {
      const firstSection = sections[0];
      if (!firstSection) return;

      setValue("sectionId", firstSection.id, { shouldValidate: true });
      syncCatalogSection(firstSection, setValue);
      return;
    }

    syncCatalogSection(currentSection, setValue);
  }, [isCustomSection, sectionId, sections, setValue]);

  return (
    <Ec3FormSection>
      <Ec3FormSectionTitle>Section</Ec3FormSectionTitle>
      <Ec3FormSectionContent>
        <InputRadioGroup
          label="Shape"
          name="shape"
          orientation="inline"
          options={SHAPE_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputAutocomplete
          label="Section"
          name="sectionId"
          options={sectionOptions}
        />

        <InputRadioGroup
          label="Fabrication"
          name="fabricationType"
          disabled={!isCustomSection}
          orientation="inline"
          options={FABRICATION_TYPE_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <IShapeFields
          isCustomSection={isCustomSection}
          isActiveShape={shape === "I"}
        />
        <RhsShapeFields
          isCustomSection={isCustomSection}
          isActiveShape={shape === "RHS"}
        />
        <ChsShapeFields
          isCustomSection={isCustomSection}
          isActiveShape={shape === "CHS"}
        />

        <InputSelect
          label="Section Class"
          name="section_class"
          options={SECTION_CLASS_OPTIONS.map((option) => ({
            label: String(option),
            value: option,
          }))}
        />
      </Ec3FormSectionContent>
    </Ec3FormSection>
  );
};
