import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { InputWrapper } from "./shared";

type Props = Omit<ComponentPropsWithoutRef<"input">, "children" | "type"> & {
  description?: ReactNode;
  label?: ReactNode;
  error?: ReactNode;
};

export const InputText = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, description, error, required, ...inputProps } = props;

  return (
    <InputWrapper
      label={label}
      description={description}
      error={error}
      required={required}
    >
      <input
        {...inputProps}
        ref={ref}
        type="text"
        required={required}
      />
    </InputWrapper>
  );
});

InputText.displayName = "InputText";
