import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { computeAdditionalProperties } from "../../domain/computeAdditionalProperties";
import { formSchema, type Ec3FormValues } from "../../domain/formSchema";
import { createDefaultEc3WorkbenchSessionState } from "../../hooks/useEc3Workbench";
import { FormActions } from "./FormActions";
import { FormBuckling } from "./FormBuckling";
import { FormGeometry } from "./FormGeometry";
import { FormMaterial } from "./FormMaterial";
import { FormMomentShape } from "./FormMomentShape";
import { FormNationalAnnex } from "./FormNationalAnnex";
import { FormStability } from "./FormStability";
import verify from "@ndg/ndg-ec3";

type Props = { className?: string };

const DEFAULT_SESSION = createDefaultEc3WorkbenchSessionState();

const DEFAULT_VALUES: Ec3FormValues = {
  shape: "I",
  sectionId: DEFAULT_SESSION.selectedSectionId,
  fabricationType: DEFAULT_SESSION.customFabricationType,
  h: DEFAULT_SESSION.customISectionGeometry.h,
  b: DEFAULT_SESSION.customISectionGeometry.b,
  tw: DEFAULT_SESSION.customISectionGeometry.tw,
  tf: DEFAULT_SESSION.customISectionGeometry.tf,
  r: DEFAULT_SESSION.customISectionGeometry.r,
  gradeId: DEFAULT_SESSION.gradeId,
  annexId: DEFAULT_SESSION.selectedAnnexId as Ec3FormValues["annexId"],
  gamma_M0: DEFAULT_SESSION.annex.gamma_M0,
  gamma_M1: DEFAULT_SESSION.annex.gamma_M1,
  lambda_LT_0: DEFAULT_SESSION.annex.lambda_LT_0,
  beta_LT: DEFAULT_SESSION.annex.beta_LT,
  N_Ed: DEFAULT_SESSION.editableInputs.N_Ed,
  M_y_Ed: DEFAULT_SESSION.editableInputs.M_y_Ed,
  M_z_Ed: DEFAULT_SESSION.editableInputs.M_z_Ed,
  V_y_Ed: DEFAULT_SESSION.editableInputs.V_y_Ed,
  V_z_Ed: DEFAULT_SESSION.editableInputs.V_z_Ed,
  section_class: DEFAULT_SESSION.editableInputs.section_class,
  L: DEFAULT_SESSION.editableInputs.L,
  k_y: DEFAULT_SESSION.editableInputs.k_y,
  k_z: DEFAULT_SESSION.editableInputs.k_z,
  interaction_factor_method:
    DEFAULT_SESSION.editableInputs.interaction_factor_method,
  moment_shape_y: "linear",
  psi_y: DEFAULT_SESSION.editableInputs.psi_y,
  moment_shape_z: "linear",
  psi_z: DEFAULT_SESSION.editableInputs.psi_z,
  torsional_deformations: "yes",
  k_LT: DEFAULT_SESSION.editableInputs.k_LT,
  k_T: DEFAULT_SESSION.editableInputs.k_T,
  coefficient_f_method: DEFAULT_SESSION.editableInputs.coefficient_f_method,
  buckling_curves_LT_policy:
    DEFAULT_SESSION.editableInputs.buckling_curves_LT_policy,
  moment_shape_LT: "uniform",
};

export const Ec3VerificationForm = (props: Props) => {
  const { className } = props;
  const form = useForm<Ec3FormValues>({
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });
  const values = useWatch({ control: form.control });
  const computed = useMemo(() => {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) return null;

    try {
      const computedData = computeAdditionalProperties(parsed.data);
      return { ...parsed.data, ...computedData };
    } catch {
      return null;
    }
  }, [values]);

  useEffect(() => {
    if (!computed) return;
    const res = verify(computed);
    console.log(res);
  }, [computed]);

  return (
    <FormProvider {...form}>
      <form className={className || "space-y-4"}>
        <FormGeometry />
        <FormMaterial />
        <FormActions />
        <FormBuckling />
        <FormStability />
        <FormMomentShape />
        <FormNationalAnnex />
      </form>
    </FormProvider>
  );
};
