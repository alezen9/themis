import { createContext, ReactNode, useCallback, useEffect } from "react";
import { FormProvider, get, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ec3FormValues, schema } from "./schema";
import { defaultValues } from "./defaultValues";
import { FormShape } from "./FormShape";
import { LineDivider } from "./shared";
import { FormSection } from "./FormSection";
import { FormGeometry } from "./FormGeometry";
import FormMaterial from "./FormMaterial";
import { FormActions } from "./FormActions";
import { FormBuckling } from "./FormBuckling";
import { FormStability } from "./FormStability";
import { FormMoment } from "./FormMoment";
import { FormAnnex } from "./FormAnnex";

export const Form = () => {
  const form = useForm<Ec3FormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
    shouldUnregister: false,
  });
  const { register } = form;

  const registerNumber = useCallback<Ec311RegisterNumber>(
    (name) => register(name, { setValueAs: setValueAsNumber }),
    [register],
  );

  const registerSelect = useCallback<Ec311RegisterSelect>(
    (name) => ({ ...register(name), defaultValue: get(defaultValues, name) }),
    [register],
  );

  return (
    <FormProvider {...form}>
      <Observer>
        <Ec311CustomRegisterContext
          value={{ register, registerNumber, registerSelect }}
        >
          <div className="w-96 flex flex-col gap-8 h-full border-r border-slate-300 pr-6">
            <FormShape />
            <LineDivider />
            <FormSection />
            <LineDivider />
            <FormGeometry />
            <LineDivider />
            <FormMaterial />
            <LineDivider />
            <FormActions />
            <LineDivider />
            <FormBuckling />
            <LineDivider />
            <FormStability />
            <LineDivider />
            <FormMoment />
            <LineDivider />
            <FormAnnex />
          </div>
        </Ec311CustomRegisterContext>
      </Observer>
    </FormProvider>
  );
};

const Observer = ({ children }: { children: ReactNode }) => {
  const { subscribe } = useFormContext<Ec3FormValues>();

  const onChange = useCallback<Parameters<typeof subscribe>[0]["callback"]>(
    ({ values }) => {
      console.log(values);
    },
    [],
  );

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: onChange,
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe, onChange]);

  return children;
};

type Ec311Register = ReturnType<typeof useForm<Ec3FormValues>>["register"];
type Ec311RegisterNumber = (
  name: Parameters<Ec311Register>[0],
) => ReturnType<Ec311Register>;
type Ec311RegisterSelect = (
  name: Parameters<Ec311Register>[0],
) => ReturnType<Ec311Register> & { defaultValue: string | number | undefined };

export const Ec311CustomRegisterContext = createContext<{
  register?: Ec311Register;
  registerNumber?: Ec311RegisterNumber;
  registerSelect?: Ec311RegisterSelect;
}>({});

const setValueAsNumber = (value: unknown) => {
  if (!value) return;
  try {
    const valueAsNumber = Number(value);
    if (isNaN(valueAsNumber)) return;
    return valueAsNumber;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return;
  }
};
