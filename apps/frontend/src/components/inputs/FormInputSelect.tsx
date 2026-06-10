import { ComponentProps } from "react";
import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

import { InputSelect } from "./InputSelect";

type FormInputSelectProps = Omit<
  ComponentProps<typeof InputSelect>,
  "value" | "defaultValue" | "ref" | "name"
> & {
  name: FieldPath<FieldValues>;
  rules?: UseControllerProps<FieldValues>["rules"];
};

export const FormInputSelect = (props: FormInputSelectProps) => {
  const { name, onChange, rules, ...rest } = props;
  const { field } = useController({ name, rules });

  return (
    <InputSelect
      {...field}
      {...rest}
      onChange={event => {
        field.onChange(event);
        onChange?.(event);
      }}
    />
  );
};
