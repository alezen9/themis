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
  suffix?: ReactNode;
};

export const InputNumber = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    label,
    description,
    error,
    suffix,
    required,
    className,
    ...inputProps
  } = props;

  return (
    <InputWrapper
      label={label}
      description={description}
      error={error}
      required={required}
    >
      <div className={suffix ? "flex items-center gap-2" : ""}>
        <input
          {...inputProps}
          ref={ref}
          type="number"
          required={required}
          className={twMerge(
            "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100",
            className,
          )}
        />
        {suffix && <span className="text-sm text-gray-600">{suffix}</span>}
      </div>
    </InputWrapper>
  );
});

InputNumber.displayName = "InputNumber";
