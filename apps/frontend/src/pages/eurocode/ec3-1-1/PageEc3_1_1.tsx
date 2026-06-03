import { zodResolver } from "@hookform/resolvers/zod";
import { Header, SubHeader } from "@components/Header";
import { debounce } from "lodash-es";
import { ReactNode, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { classifySection } from "./domain/classification/classifySection";
import { computeGeometryProperties } from "./domain/geometry/computeGeometryProperties";
import { defaultValues } from "./Form/defaultValues";
import { Form } from "./Form/Form";
import {
  Ec3FormValues,
  Ec3ValidFormValues,
  schema,
} from "./Form/schema/schema";
import { actionsSchema } from "./Form/schema/actionsSchema";
import {
  chsGeometrySchema,
  iGeometrySchema,
  rhsGeometrySchema,
} from "./Form/schema/geometrySchema";
import { materialSchema } from "./Form/schema/materialSchema";
import { annexCoefficientsSchema } from "./Form/schema/nationalAnnexSchema";
import { shapeDependentSchema } from "./Form/schema/shapeDependentSchema";
import { useEc311FormContext } from "./Form/useEc311FormContext";
import { useEc311DerivedStore } from "./useEc311DerivedStore";
import { twMerge } from "tailwind-merge";
import { Verifications } from "./Verifications/Verifications";
import verify, { type Ec311Inputs } from "@ndg/ndg-ec3-1-1";
import { steelGradesMap } from "./data/steelGrades";
import { getBucklingCurves } from "./domain/buckling/buckling";

type PageEc3_1_1Props = {
  onValuesChange?: (values: Ec3FormValues) => void;
  onValidValuesChange?: (values: Ec3ValidFormValues) => void;
};

export const PageEc3_1_1 = (props: PageEc3_1_1Props) => {
  const { onValuesChange, onValidValuesChange } = props;

  const form = useForm<Ec3FormValues, unknown, Ec3ValidFormValues>({
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
  onValidValuesChange?: (values: Ec3ValidFormValues) => void;
};

const Observer = (props: ObserverProps) => {
  const { children, onValuesChange, onValidValuesChange } = props;
  const { subscribe, getValues } = useEc311FormContext();
  const setGeometry = useEc311DerivedStore(state => state.setGeometry);
  const setClassification = useEc311DerivedStore(
    state => state.setClassification,
  );
  const setVerifications = useEc311DerivedStore(
    state => state.setVerifications,
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
      const verifyInputs = createVerifyInputs(
        verifyResult.data,
        geometry,
        classification,
      );
      if (!verifyInputs) return;
      const verifications = verify(verifyInputs);
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

const createVerifyInputs = (
  inputs: Ec3ValidFormValues,
  geometry: ReturnType<typeof computeGeometryProperties>,
  classification: ReturnType<typeof classifySection>,
): Ec311Inputs | undefined => {
  let section_class = classification[0];
  if (inputs.section_class !== "auto") section_class = inputs.section_class;
  if (section_class === 4) return; // class 4 not supported yet

  const steelGrade = steelGradesMap.get(inputs.steel_grade_id);
  if (!steelGrade)
    throw new Error(`Unknown steel grade: ${inputs.steel_grade_id}`);

  let thickness_mm = Math.max(inputs.i_geometry.tf_mm, inputs.i_geometry.tw_mm);
  if (inputs.shape === "RHS") thickness_mm = inputs.rhs_geometry.tw_mm;
  if (inputs.shape === "CHS") thickness_mm = inputs.chs_geometry.t_mm;

  let fy_MPa = steelGrade.fy_above_40_MPa ?? steelGrade.fy_MPa;
  if (thickness_mm <= 40) fy_MPa = steelGrade.fy_MPa;

  let fu_MPa = steelGrade.fu_above_40_MPa ?? steelGrade.fu_MPa;
  if (thickness_mm <= 40) fu_MPa = steelGrade.fu_MPa;

  const bucklingCurves = getBucklingCurves(inputs);

  return {
    N_Ed_N: inputs.N_Ed_kN * 1_000,
    V_y_Ed_N: inputs.V_y_Ed_kN * 1_000,
    V_z_Ed_N: inputs.V_z_Ed_kN * 1_000,
    M_y_Ed_Nmm: inputs.M_y_Ed_kNm * 1_000_000,
    M_z_Ed_Nmm: inputs.M_z_Ed_kNm * 1_000_000,
    T_Ed_Nmm: (inputs.T_Ed_kNm ?? 0) * 1_000_000,
    L_mm: inputs.L_m * 1_000,
    shape: inputs.shape,
    fabrication_type: inputs.fabrication_type,
    i_geometry: inputs.i_geometry,
    rhs_geometry: inputs.rhs_geometry,
    chs_geometry: inputs.chs_geometry,
    gamma_M0: inputs.gamma_M0,
    gamma_M1: inputs.gamma_M1,
    eta: inputs.eta,
    lambda_LT_0: inputs.lambda_LT_0,
    beta_LT: inputs.beta_LT,
    interaction_factor_method: inputs.interaction_factor_method,
    buckling_curves_LT_policy: inputs.buckling_curves_LT_policy,
    include_torsional_modes: inputs.include_torsional_modes,
    k_y: inputs.k_y,
    k_z: inputs.k_z,

    f_method: inputs.f_method,
    M_y_Ed_shape: inputs.M_y_Ed_shape,
    psi_y: inputs.psi_y,
    support_condition_y: inputs.support_condition_y,
    M_z_Ed_shape: inputs.M_z_Ed_shape,
    psi_z: inputs.psi_z,
    support_condition_z: inputs.support_condition_z,
    k_T: inputs.k_T,
    k_LT: inputs.k_LT,
    M_y_Ed_shape_LT: inputs.M_y_Ed_shape_LT,
    psi_y_LT: inputs.psi_y_LT,
    support_condition_LT: inputs.support_condition_LT,
    load_LT: inputs.load_LT,

    section_class,
    fy_MPa,
    fu_MPa,

    A_mm2: geometry.A_mm2,
    Iy_mm4: geometry.Iy_mm4,
    Iz_mm4: geometry.Iz_mm4,
    Wpl_y_mm3: geometry.Wpl_y_mm3,
    Wpl_z_mm3: geometry.Wpl_z_mm3,
    Wel_y_mm3: geometry.Wel_y_mm3,
    Wel_z_mm3: geometry.Wel_z_mm3,
    Av_y_mm2: geometry.Av_y_mm2,
    Av_z_mm2: geometry.Av_z_mm2,
    S_y_mm3: geometry.S_y_mm3,
    S_z_mm3: geometry.S_z_mm3,
    It_mm4: geometry.It_mm4,
    Iw_mm6: geometry.Iw_mm6,
    centroid_y_mm: geometry.centroid.y_mm,
    centroid_z_mm: geometry.centroid.z_mm,

    buckling_curve_y: bucklingCurves.y,
    buckling_curve_z: bucklingCurves.z,
    buckling_curve_LT: bucklingCurves.lt,
  } satisfies Ec311Inputs;
};

const gateDerivedGeometry = (values: Ec311ObservedValues) => {
  const { shape, eta, i_geometry, rhs_geometry, chs_geometry } = values;

  let geometry: ActiveGeometry = i_geometry;
  if (shape === "RHS") geometry = rhs_geometry;
  if (shape === "CHS") geometry = chs_geometry;

  let geometrySchema: ActiveGeometrySchema = iGeometrySchema;
  if (shape === "RHS") geometrySchema = rhsGeometrySchema;
  if (shape === "CHS") geometrySchema = chsGeometrySchema;

  const geometryValid = geometrySchema.safeParse(geometry).success;
  const etaValid = annexCoefficientsSchema.shape.eta.safeParse(eta).success;
  return { success: geometryValid && etaValid };
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
    T_Ed_kNm,
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
    T_Ed_kNm,
    ...geometry,
  };

  return shapeDependentSchema
    .and(materialSchema)
    .and(
      actionsSchema.pick({ N_Ed_kN: true, M_y_Ed_kNm: true, M_z_Ed_kNm: true }),
    )
    .and(geometrySchema)
    .safeParse(classificationInput);
};

const gateVerify = (values: Ec311ObservedValues) => schema.safeParse(values);
