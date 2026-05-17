import { zodResolver } from "@hookform/resolvers/zod";
import { Header, SubHeader } from "@components/Header";
import { debounce } from "lodash-es";
import { ReactNode, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { defaultValues } from "./Form/defaultValues";
import { Form } from "./Form/Form";
import { Ec3FormValues, schema } from "./Form/schema/schema";
import { useEc311FormContext } from "./Form/useEc311FormContext";

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

type ObserverProps = {
  children: ReactNode;
  onValuesChange?: (values: Ec3FormValues) => void;
  onValidValuesChange?: (values: Ec3FormValues) => void;
};

const Observer = (props: ObserverProps) => {
  const { children, onValuesChange, onValidValuesChange } = props;
  const { subscribe } = useEc311FormContext();

  const onChange = useMemo(
    () =>
      debounce<Parameters<typeof subscribe>[0]["callback"]>(({ values }) => {
        onValuesChange?.(values);
        const result = schema.safeParse(values);
        if (!result.success) return;

        onValidValuesChange?.(result.data);
        // console.log(result.data);
      }, 50),
    [onValuesChange, onValidValuesChange],
  );

  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: onChange,
    });

    return () => {
      unsubscribe();
      onChange.cancel();
    };
  }, [subscribe, onChange]);

  return children;
};
