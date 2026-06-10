import { ComponentProps } from "react";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

import { InputAutocomplete } from "./InputAutocomplete";

type FormInputAutocompleteProps = Omit<
  ComponentProps<typeof InputAutocomplete>,
  "value" | "defaultValue" | "ref" | "name"
> & {
  name: FieldPath<FieldValues>;
  rules?: UseControllerProps<FieldValues>["rules"];
};

export const FormInputAutocomplete = (props: FormInputAutocompleteProps) => {
  const { name, onChange, rules, ...rest } = props;
  const { field } = useController({ name, rules });

  return (
    <InputAutocomplete
      {...field}
      {...rest}
      onChange={event => {
        field.onChange(event);
        onChange?.(event);
      }}
    />
  );
};
