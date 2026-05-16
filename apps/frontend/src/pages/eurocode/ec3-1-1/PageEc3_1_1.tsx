import { zodResolver } from "@hookform/resolvers/zod";
import { Header, SubHeader } from "@components/Header";
import { ReactNode, useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { defaultValues } from "./Form/defaultValues";
import { Form } from "./Form/Form";
import { Ec3FormValues, schema } from "./Form/schema/schema";
import { useEc311FormContext } from "./Form/useEc311FormContext";

export const PageEc3_1_1 = () => {
  const form = useForm<Ec3FormValues>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(schema),
    shouldUnregister: false,
  });

  return (
    <FormProvider {...form}>
      <Observer>
        <main className="flex flex-col gap-8">
          <header>
            <Header>Steel members</Header>
            <SubHeader>
              EC3-1-1 · Member checks according to EN 1993-1-1
            </SubHeader>
          </header>

          <div className="flex items-start gap-10">
            <Form />
            <div className="min-w-0 flex-1 justify-center w-full flex">
              <span className="text-3xl text-sand-800">Verifications here</span>
            </div>
          </div>
        </main>
      </Observer>
    </FormProvider>
  );
};

const Observer = ({ children }: { children: ReactNode }) => {
  const { subscribe } = useEc311FormContext();

  const onChange = useCallback<Parameters<typeof subscribe>[0]["callback"]>(
    ({ values }) => {
      const result = schema.safeParse(values);
      if (!result.success) return;

      console.log(result.data);
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
