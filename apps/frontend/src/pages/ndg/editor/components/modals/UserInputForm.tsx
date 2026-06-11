import { ChangeEventHandler, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { getBaseUnit } from "@ndg/ndg-core";
import { userInputCatalog } from "@ndg/ndg-ec3-1-1";
import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { FormInputAutocomplete } from "@components/inputs/FormInputAutocomplete";

import { Section, SectionTitle } from "./shared";
import { DisplayUnitField, SymbolKeyPreview } from "./nodeFields";
import { userInputKeyOptions } from "./options";
import {
  userInputNodeSchema,
  type UserInputNode,
} from "../../document/editorNodeSchema";

type Props = {
  formId: string;
  defaultValues: UserInputNode;
  onSubmit: (values: UserInputNode) => void;
};

export const UserInputForm = (props: Props) => {
  const { formId, defaultValues, onSubmit } = props;
  const form = useForm<UserInputNode>({
    resolver: zodResolver(userInputNodeSchema),
    mode: "onChange",
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <UserInputFields />
      </form>
    </FormProvider>
  );
};

const UserInputFields = () => {
  const { setValue } = useTypedFormContext<UserInputNode>();

  const onKeyChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      setValue("displayUnit", getBaseUnit(event.target.value)?.key);
      const entry = userInputCatalog[event.target.value];
      if (!entry) return;
      setValue("symbol", entry.symbol);
      setValue("valueType", { type: entry.valueType });
    },
    [setValue],
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
            <FormInputAutocomplete
              name="key"
              onChange={onKeyChange}
              options={userInputKeyOptions}
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
