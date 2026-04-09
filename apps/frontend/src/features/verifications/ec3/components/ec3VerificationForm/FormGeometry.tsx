import { useEffect, useRef } from "react";
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
import { flangedSections, type FlangedSection } from "../../data/flangedSections";
import { hollowSections, type HollowSection } from "../../data/hollowSections";
import type { Ec3FormValues } from "../../domain/formSchema";
import {
  FABRICATION_TYPE_OPTIONS,
  SECTION_CLASS_OPTIONS,
  SHAPE_OPTIONS,
} from "../../options";
import { CUSTOM_SECTION_ID } from "../../hooks/useEc3Workbench";
import { getError } from "./shared";

type ShapeKey = (typeof SHAPE_OPTIONS)[number];
type CatalogSection = FlangedSection | HollowSection | CircularSection;
type ShapeFieldsProps = {
  isCustomSection: boolean;
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

const IShapeFields = ({ isCustomSection }: ShapeFieldsProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        label="h"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "h")}
        {...register("h", { valueAsNumber: true })}
      />
      <InputNumber
        label="b"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "b")}
        {...register("b", { valueAsNumber: true })}
      />
      <InputNumber
        label="tw"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "tw")}
        {...register("tw", { valueAsNumber: true })}
      />
      <InputNumber
        label="tf"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "tf")}
        {...register("tf", { valueAsNumber: true })}
      />
      <InputNumber
        label="r"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "r")}
        {...register("r", { valueAsNumber: true })}
      />
    </>
  );
};

const RhsShapeFields = ({ isCustomSection }: ShapeFieldsProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        label="h"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "h")}
        {...register("h", { valueAsNumber: true })}
      />
      <InputNumber
        label="b"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "b")}
        {...register("b", { valueAsNumber: true })}
      />
      <InputNumber
        label="t"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "tw")}
        {...register("tw", { valueAsNumber: true })}
      />
      <InputNumber
        label="ro"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "ro")}
        {...register("ro", { valueAsNumber: true })}
      />
      <InputNumber
        label="ri"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "ri")}
        {...register("ri", { valueAsNumber: true })}
      />
    </>
  );
};

const ChsShapeFields = ({ isCustomSection }: ShapeFieldsProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<Ec3FormValues>();

  return (
    <>
      <InputNumber
        label="d"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "d")}
        {...register("d", { valueAsNumber: true })}
      />
      <InputNumber
        label="t"
        suffix="mm"
        step="any"
        readOnly={!isCustomSection}
        error={getError(errors, "t")}
        {...register("t", { valueAsNumber: true })}
      />
    </>
  );
};

export const FormGeometry = () => {
  const {
    control,
    formState: { errors },
    register,
    setValue,
  } = useFormContext<Ec3FormValues>();
  const shape = useWatch({ control, name: "shape" }) ?? SHAPE_OPTIONS[0];
  const sectionId = useWatch({ control, name: "sectionId" }) ?? CUSTOM_SECTION_ID;
  const previousShape = useRef(shape);
  const sections = getSectionsByShape(shape);
  const isCustomSection = sectionId === CUSTOM_SECTION_ID;

  useEffect(() => {
    const shapeChanged = previousShape.current !== shape;
    previousShape.current = shape;

    const firstSection = sections[0];
    if (!shapeChanged || !isCustomSection || !firstSection) return;

    setGeometryValues(firstSection, setValue);
  }, [isCustomSection, sections, setValue, shape]);

  useEffect(() => {
    if (isCustomSection) return;

    const currentSection =
      sections.find((section) => section.id === sectionId) ?? sections[0];
    if (!currentSection) return;

    if (currentSection.id !== sectionId) {
      setValue("sectionId", currentSection.id, { shouldValidate: true });
    }

    syncCatalogSection(currentSection, setValue);
  }, [isCustomSection, sectionId, sections, setValue]);

  return (
    <fieldset className="border p-3">
      <legend className="px-1 text-xs font-semibold">Section</legend>
      <div className="space-y-3">
        <InputSelect
          label="Shape"
          error={getError(errors, "shape")}
          {...register("shape")}
        >
          {SHAPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </InputSelect>

        <InputSelect
          label="Section"
          error={getError(errors, "sectionId")}
          {...register("sectionId")}
        >
          <option value={CUSTOM_SECTION_ID}>Custom</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.id}
            </option>
          ))}
        </InputSelect>

        {isCustomSection && (
          <InputSelect
            label="Fabrication"
            error={getError(errors, "fabricationType")}
            {...register("fabricationType")}
          >
            {FABRICATION_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </InputSelect>
        )}

        {!isCustomSection && <input hidden {...register("fabricationType")} />}

        {shape === "I" && <IShapeFields isCustomSection={isCustomSection} />}
        {shape === "RHS" && <RhsShapeFields isCustomSection={isCustomSection} />}
        {shape === "CHS" && <ChsShapeFields isCustomSection={isCustomSection} />}

        <InputSelect
          label="Class"
          error={getError(errors, "section_class")}
          {...register("section_class", {
            setValueAs: (value) =>
              value === "auto" ? "auto" : Number(value),
          })}
        >
          {SECTION_CLASS_OPTIONS.map((option) => (
            <option key={String(option)} value={String(option)}>
              {option}
            </option>
          ))}
        </InputSelect>
      </div>
    </fieldset>
  );
};
