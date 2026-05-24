import { zodResolver } from "@hookform/resolvers/zod";
import { Header, SubHeader } from "@components/Header";
import { debounce } from "lodash-es";
import { ReactNode, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { classifySection } from "./domain/classification/classifySection";
import { computeGeometryProperties } from "./domain/geometry/computeGeometryProperties";
import { defaultValues } from "./Form/defaultValues";
import { Form } from "./Form/Form";
import { Ec3FormValues, schema } from "./Form/schema/schema";
import { actionsSchema } from "./Form/schema/actionsSchema";
import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./Form/schema/geometrySchema";
import { materialSchema } from "./Form/schema/materialSchema";
import { shapeAndCrossSectionSchema } from "./Form/schema/shapeAndCrossSectionSchema";
import { useEc311FormContext } from "./Form/useEc311FormContext";
import { useEc311DerivedStore } from "./useEc311DerivedStore";
import { twMerge } from "tailwind-merge";
import { Verifications } from "./Verifications/Verifications";
import verify, { type Ec3VerifyPayload } from "@ndg/ndg-ec3";
import { steelGradesMap } from "./data/steelGrades";

type PageEc3_1_1Props = {
  onValuesChange?: (values: Ec3FormValues) => void;
  onValidValuesChange?: (values: Ec3FormValues) => void;
};

export const PageEc3_1_1 = (props: PageEc3_1_1Props) => {
  const { onValuesChange, onValidValuesChange } = props;

  const form = useForm<Ec3FormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  return (
    <FormProvider {...form}>
      <Observer
        onValuesChange={onValuesChange}
        onValidValuesChange={onValidValuesChange}
      >
        <main
          className={twMerge(
            "flex flex-col gap-8",
            "[--header-height:--spacing(17)]",
          )}
        >
          <header className="w-auto h-(--header-height)">
            <Header>Steel members</Header>
            <SubHeader>
              EC3-1-1 · Member checks according to EN 1993-1-1
            </SubHeader>
          </header>

          <div className="flex items-start">
            <div className="min-w-106">
              <Form />
            </div>
            <div className="sticky top-[calc(var(--header-height)+var(--spacing)*12)] max-h-[calc(100dvh-var(--header-height)-var(--spacing)*27)] w-full h-full overflow-hidden">
              <Verifications />
            </div>
          </div>
        </main>
      </Observer>
    </FormProvider>
  );
};

type ObserverProps = {
  children: ReactNode;
  onValuesChange?: (values: Ec3FormValues) => void;
  onValidValuesChange?: (values: Ec3FormValues) => void;
};

const Observer = (props: ObserverProps) => {
  const { children, onValuesChange, onValidValuesChange } = props;
  const { subscribe, getValues } = useEc311FormContext();
  const setGeometry = useEc311DerivedStore((state) => state.setGeometry);
  const setClassification = useEc311DerivedStore(
    (state) => state.setClassification,
  );
  const setVerifications = useEc311DerivedStore(
    (state) => state.setVerifications,
  );

  const runPipeline = useMemo(
    () => (values: Ec311ObservedValues) => {
      onValuesChange?.(values);

      const geometryResult = gateDerivedGeometry(values);
      if (!geometryResult.success) return;

      const geometry = computeGeometryProperties(values);
      setGeometry(geometry);

      const classificationResult = gateClassification(values);
      if (!classificationResult.success) return;

      const classification = classifySection(values);
      setClassification(classification);

      const verifyResult = gateVerify(values);
      if (!verifyResult.success) return;

      onValidValuesChange?.(verifyResult.data);
      const verifyPayload = createEc3VerifyPayload({
        values: verifyResult.data,
        geometry,
        classification,
      });
      const verifications = verify(verifyPayload);
      setVerifications(verifications);
      console.log(verifications);
    },
    [
      onValuesChange,
      onValidValuesChange,
      setGeometry,
      setClassification,
      setVerifications,
    ],
  );

  const onChange = useMemo(
    () =>
      debounce<Parameters<typeof subscribe>[0]["callback"]>(({ values }) => {
        runPipeline(values);
      }, 50),
    [runPipeline],
  );

  useEffect(() => {
    runPipeline(getValues());

    const unsubscribe = subscribe({
      formState: { values: true },
      callback: onChange,
    });

    return () => {
      unsubscribe();
      onChange.cancel();
    };
  }, [subscribe, getValues, onChange, runPipeline]);

  return children;
};

type Ec311SubscribeCallback = Parameters<
  ReturnType<typeof useEc311FormContext>["subscribe"]
>[0]["callback"];
type Ec311ObservedValues = Parameters<Ec311SubscribeCallback>[0]["values"];
type ActiveGeometry =
  | Ec3FormValues["i_geometry"]
  | Ec3FormValues["rhs_geometry"]
  | Ec3FormValues["chs_geometry"];
type ActiveGeometrySchema =
  | typeof iGeometrySchema
  | typeof rhsGeometrySchema
  | typeof chsGeometrySchema;

type CreateEc3VerifyPayloadInput = {
  values: Ec3FormValues;
  geometry: ReturnType<typeof computeGeometryProperties>;
  classification: ReturnType<typeof classifySection>;
};

const createEc3VerifyPayload = (
  input: CreateEc3VerifyPayloadInput,
): Ec3VerifyPayload => {
  const { values, geometry, classification } = input;
  const steelGrade = steelGradesMap.get(values.steel_grade_id);
  if (!steelGrade)
    throw new Error(`Unknown steel grade: ${values.steel_grade_id}`);

  let thickness_mm = Math.max(values.i_geometry.tf_mm, values.i_geometry.tw_mm);
  if (values.shape === "RHS") thickness_mm = values.rhs_geometry.tw_mm;
  if (values.shape === "CHS") thickness_mm = values.chs_geometry.t_mm;

  let fy_MPa = steelGrade.fy_above_40_MPa ?? steelGrade.fy_MPa;
  if (thickness_mm <= 40) fy_MPa = steelGrade.fy_MPa;

  let section_class = classification[0];
  if (values.section_class !== "auto") section_class = values.section_class;

  return { ...values, ...geometry, fy_MPa, section_class };
};

const gateDerivedGeometry = (values: Ec311ObservedValues) => {
  const { shape, i_geometry, rhs_geometry, chs_geometry } = values;

  let geometry: ActiveGeometry = i_geometry;
  if (shape === "RHS") geometry = rhs_geometry;
  if (shape === "CHS") geometry = chs_geometry;

  let geometrySchema: ActiveGeometrySchema = iGeometrySchema;
  if (shape === "RHS") geometrySchema = rhsGeometrySchema;
  if (shape === "CHS") geometrySchema = chsGeometrySchema;

  return geometrySchema.safeParse(geometry);
};

const gateClassification = (values: Ec311ObservedValues) => {
  const {
    shape,
    section_id,
    fabrication_type,
    steel_grade_id,
    i_geometry,
    rhs_geometry,
    chs_geometry,
    N_Ed_kN,
    M_y_Ed_kNm,
    M_z_Ed_kNm,
  } = values;

  let geometry: ActiveGeometry = i_geometry;
  if (shape === "RHS") geometry = rhs_geometry;
  if (shape === "CHS") geometry = chs_geometry;

  let geometrySchema: ActiveGeometrySchema = iGeometrySchema;
  if (shape === "RHS") geometrySchema = rhsGeometrySchema;
  if (shape === "CHS") geometrySchema = chsGeometrySchema;

  const classificationInput = {
    shape,
    section_id,
    fabrication_type,
    steel_grade_id,
    N_Ed_kN,
    M_y_Ed_kNm,
    M_z_Ed_kNm,
    ...geometry,
  };

  return shapeAndCrossSectionSchema
    .and(materialSchema)
    .and(
      actionsSchema.pick({ N_Ed_kN: true, M_y_Ed_kNm: true, M_z_Ed_kNm: true }),
    )
    .and(geometrySchema)
    .safeParse(classificationInput);
};

const gateVerify = (values: Ec311ObservedValues) => schema.safeParse(values);
