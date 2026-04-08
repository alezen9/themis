import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { InputWrapper } from "./shared";

type Props = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  children: ReactNode;
  description?: ReactNode;
  label?: ReactNode;
  error?: ReactNode;
};

export const InputSelect = forwardRef<HTMLSelectElement, Props>((props, ref) => {
  const { children, label, description, error, required, ...selectProps } = props;

  return (
    <InputWrapper
      label={label}
      description={description}
      error={error}
      required={required}
    >
      <select
        {...selectProps}
        ref={ref}
        required={required}
      >
        {children}
      </select>
    </InputWrapper>
  );
});

InputSelect.displayName = "InputSelect";
