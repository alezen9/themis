import { useDeferredValue, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { computeAdditionalProperties } from "../../domain/computeAdditionalProperties";
import { formSchema, type Ec3FormValues } from "../../domain/formSchema";
import { FormActions } from "./FormActions";
import { FormBuckling } from "./FormBuckling";
import { DEFAULT_EC3_FORM_VALUES } from "./config";
import { FormGeometry } from "./FormGeometry";
import { FormMaterial } from "./FormMaterial";
import { FormMomentShape } from "./FormMomentShape";
import { FormNationalAnnex } from "./FormNationalAnnex";
import { FormStability } from "./FormStability";
import verify from "@ndg/ndg-ec3";

type Props = { className?: string };

const Ec3VerificationObserver = () => {
  const { control } = useFormContext<Ec3FormValues>();
  const values = useWatch({ control });
  const deferredValues = useDeferredValue(values);
  const computed = useMemo(() => {
    const parsed = formSchema.safeParse(deferredValues);
    if (!parsed.success) return null;

    try {
      const computedData = computeAdditionalProperties(parsed.data);
      return { ...parsed.data, ...computedData };
    } catch {
      return null;
    }
  }, [deferredValues]);

  useEffect(() => {
    if (!computed) return;
    const res = verify(computed);
    console.log(res);
  }, [computed]);

  return null;
};

export const Ec3VerificationForm = (props: Props) => {
  const { className } = props;
  const form = useForm<Ec3FormValues>({
    defaultValues: DEFAULT_EC3_FORM_VALUES,
    mode: "onChange",
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  return (
    <FormProvider {...form}>
      <Ec3VerificationObserver />
      <form className={className || "flex flex-col gap-6 bg-zinc-50"}>
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
