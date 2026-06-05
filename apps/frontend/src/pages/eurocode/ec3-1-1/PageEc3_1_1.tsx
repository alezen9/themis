import { zodResolver } from "@hookform/resolvers/zod";
import { Header, SubHeader } from "@components/Header";
import { FormProvider, useForm } from "react-hook-form";
import { defaultValues } from "./Form/defaultValues";
import { Form } from "./Form/Form";
import {
  Ec3FormValues,
  Ec3ValidFormValues,
  schema,
} from "./Form/schema/schema";
import { twMerge } from "tailwind-merge";
import { Verifications } from "./Verifications/Verifications";
import { Observer } from "./Observer";

type Props = {
  onValuesChange?: (values: Ec3FormValues) => void;
  onValidValuesChange?: (values: Ec3ValidFormValues) => void;
};

export const PageEc3_1_1 = (props: Props) => {
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
            <div className="min-w-109">
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
