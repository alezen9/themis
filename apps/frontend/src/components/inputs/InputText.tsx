import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import { InputWrapper } from "./shared";

type Props = Omit<ComponentPropsWithoutRef<"input">, "children" | "type"> & {
  description?: ReactNode;
  label?: ReactNode;
  error?: ReactNode;
};

export const InputText = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, description, error, required, className, ...inputProps } = props;

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
        className={twMerge(
          "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100",
          className,
        )}
      />
    </InputWrapper>
  );
});

InputText.displayName = "InputText";
