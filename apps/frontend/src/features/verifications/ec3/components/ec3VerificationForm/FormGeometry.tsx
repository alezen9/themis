import { useEffect, useMemo, useRef } from "react";
import {
  useFormContext,
  useWatch,
  type UseFormSetValue,
} from "react-hook-form";
import { InputNumber } from "../../../../../components/inputs/InputNumber";
import { InputSelect } from "../../../../../components/inputs/InputSelect";
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
import { getError } from "./shared";

type ShapeKey = (typeof SHAPE_OPTIONS)[number];
type CatalogSection = FlangedSection | HollowSection | CircularSection;
type ShapeFieldsProps = {
  isCustomSection: boolean;
  isActiveShape: boolean;
};

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
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        label="Height (h)"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "h") : undefined}
        {...register("h", { valueAsNumber: true })}
      />
      <InputNumber
        label="Base (b)"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "b") : undefined}
        {...register("b", { valueAsNumber: true })}
      />
      <InputNumber
        label="Wall Thickness (tw)"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "tw") : undefined}
        {...register("tw", { valueAsNumber: true })}
      />
      <InputNumber
        label="Flange Thickness (tf)"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "tf") : undefined}
        {...register("tf", { valueAsNumber: true })}
      />
      <InputNumber
        label="Radius (r)"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "r") : undefined}
        {...register("r", { valueAsNumber: true })}
      />
    </>
  );
};

const RhsShapeFields = (props: ShapeFieldsProps) => {
  const { isCustomSection, isActiveShape } = props;
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        label="h"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "h") : undefined}
        {...register("h", { valueAsNumber: true })}
      />
      <InputNumber
        label="b"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "b") : undefined}
        {...register("b", { valueAsNumber: true })}
      />
      <InputNumber
        label="t"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "tw") : undefined}
        {...register("tw", { valueAsNumber: true })}
      />
      <InputNumber
        label="ro"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "ro") : undefined}
        {...register("ro", { valueAsNumber: true })}
      />
      <InputNumber
        label="ri"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "ri") : undefined}
        {...register("ri", { valueAsNumber: true })}
      />
    </>
  );
};

const ChsShapeFields = (props: ShapeFieldsProps) => {
  const { isCustomSection, isActiveShape } = props;
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        label="d"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "d") : undefined}
        {...register("d", { valueAsNumber: true })}
      />
      <InputNumber
        label="t"
        suffix="mm"
        readOnly={!isCustomSection || !isActiveShape}
        disabled={!isActiveShape}
        error={isActiveShape ? getError(errors, "t") : undefined}
        {...register("t", { valueAsNumber: true })}
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
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Section</legend>
      <div className="flex flex-col">
        <InputSelect
          label="Shape"
          name="shape"
          options={SHAPE_OPTIONS.map((option) => ({
            label: option,
            value: option,
          }))}
        />

        <InputSelect
          label="Section"
          name="sectionId"
          options={sectionOptions}
        />

        <InputSelect
          label="Fabrication"
          name="fabricationType"
          disabled={!isCustomSection}
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
          label="Class"
          name="section_class"
          options={SECTION_CLASS_OPTIONS.map((option) => ({
            label: String(option),
            value: option,
          }))}
        />
      </div>
    </fieldset>
  );
};
