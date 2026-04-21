import {
  type ComponentPropsWithoutRef,
  type ChangeEvent,
  type ReactNode,
} from "react";
import {
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { InputWrapperHorizontal } from "./shared";

type Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "defaultValue" | "name" | "onBlur" | "onChange" | "type" | "value"
> & {
  name: string;
  description?: ReactNode;
  label?: ReactNode;
  error?: ReactNode;
  suffix?: ReactNode;
};

export const InputNumber = (props: Props) => {
  const {
    name,
    label,
    description,
    error,
    suffix,
    required,
    className,
    ...inputProps
  } = props;
  const { control } = useFormContext<FieldValues>();
  const controller = useController({ name, control });
  const { field, fieldState } = controller;
  const { onBlur, onChange, ref, value } = field;
  const resolvedError =
    "error" in props ? error : fieldState.error?.message;
  const inputValue =
    typeof value === "number" ? (Number.isNaN(value) ? "" : value) : (value ?? "");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === "") {
      onChange(Number.NaN);
      return;
    }

    onChange(event.currentTarget.valueAsNumber);
  };

  return (
    <InputWrapperHorizontal
      label={label}
      description={description}
      error={resolvedError}
      required={required}
    >
      <div
        className={twMerge(
          "flex items-center gap-1.5 p-1.5 rounded-xl max-w-50",
          "bg-white shadow-[0_10px_20px_#eee]",
          "has-[input:disabled]:opacity-30 has-[input:disabled]:bg-gray-200",
          "has-[input:read-only]:opacity-30 has-[input:read-only]:bg-gray-200",
          "has-[input:read-only]:pointer-events-none has-[input:disabled]:pointer-events-none",
          "has-[input:read-only]:select-none has-[input:disabled]_*:select-none",
        )}
      >
        <input
          ref={ref}
          type="number"
          name={field.name}
          required={required}
          value={inputValue}
          onChange={handleChange}
          onBlur={onBlur}
          aria-invalid={fieldState.invalid}
          className={twMerge(
            "w-full h-8 rounded-lg text-center",
            "bg-linear-to-b/oklch from-[#f7f7f7] to-[#fefefe]",
            "py-2",
            "font-thin text-lg leading-0",
            "-webkit-appearance-none",
            "focus:outline-gray-300 focus:outline-1",
            className,
          )}
          {...inputProps}
        />
        {suffix && (
          <span
            className={twMerge(
              "h-8 w-20 rounded-lg flex justify-center items-end py-2",
              "text-gray-400 text-xs font-light",
              "bg-linear-to-b/oklch from-[#f7f7f7] to-[#fefefe]",
            )}
          >
            {suffix}
          </span>
        )}
      </div>
    </InputWrapperHorizontal>
  );
};
