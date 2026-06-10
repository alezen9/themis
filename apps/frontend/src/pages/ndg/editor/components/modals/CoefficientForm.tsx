import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeHandler, FormProvider, useForm } from "react-hook-form";

import { coefficientCatalog } from "@ndg/ndg-ec3-1-1";
import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";

import { Section, SectionTitle } from "./shared";
import { DisplayUnitField, SymbolKeyPreview } from "./nodeFields";
import { coefficientKeyOptions } from "./options";
import {
  coefficientNodeSchema,
  type CoefficientNode,
} from "../../document/editorNodeSchema";

type Props = {
  formId: string;
  defaultValues: CoefficientNode;
  onSubmit: (values: CoefficientNode) => void;
};

export const CoefficientForm = (props: Props) => {
  const { formId, defaultValues, onSubmit } = props;
  const form = useForm<CoefficientNode>({
    resolver: zodResolver(coefficientNodeSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <CoefficientFields />
      </form>
    </FormProvider>
  );
};

const CoefficientFields = () => {
  const { registerSelect, getValues, reset } =
    useTypedFormContext<CoefficientNode>();

  const onKeyChange = useCallback<ChangeHandler>(
    async event => {
      const key = event.target.value;
      const entry = coefficientCatalog[key];
      reset({
        ...getValues(),
        key,
        ...(entry && { symbol: entry.symbol, meta: entry.meta }),
      });
    },
    [getValues, reset],
  );

  return (
    <Section>
      <SectionTitle>Identity</SectionTitle>
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <FormField
            name="key"
            label="Key"
            description="Unique id used by formulas"
          >
            <InputAutocomplete
              {...registerSelect("key")}
              onChange={onKeyChange}
              options={coefficientKeyOptions}
              required
            />
          </FormField>
        </div>
        <div className="col-span-2">
          <SymbolKeyPreview />
        </div>
        <DisplayUnitField />
      </div>
    </Section>
  );
};
