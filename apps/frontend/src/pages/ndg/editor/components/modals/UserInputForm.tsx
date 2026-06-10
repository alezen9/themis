import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeHandler, FormProvider, useForm } from "react-hook-form";

import { userInputCatalog } from "@ndg/ndg-ec3-1-1";
import { FormField } from "@components/inputs/shared";
import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { InputAutocomplete } from "@components/inputs/InputAutocomplete";

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
  const { registerSelect, getValues, reset } =
    useTypedFormContext<UserInputNode>();

  const onKeyChange = useCallback<ChangeHandler>(
    async event => {
      const key = event.target.value;
      const entry = userInputCatalog[key];
      reset({
        ...getValues(),
        key,
        ...(entry && {
          symbol: entry.symbol,
          valueType: { type: entry.valueType },
        }),
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
