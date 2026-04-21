import { Switch } from "@base-ui/react/switch";
import { type ReactNode } from "react";
import {
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { InputWrapperHorizontal } from "./shared";

type StoredValue = boolean | number | string;

type Props = {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  checkedValue?: StoredValue;
  uncheckedValue?: StoredValue;
};

export const InputToggle = (props: Props) => {
  const {
    name,
    label,
    description,
    error,
    required,
    disabled,
    readOnly,
    className,
    checkedValue = true,
    uncheckedValue = false,
  } = props;
  const { control } = useFormContext<FieldValues>();
  const controller = useController({ name, control });
  const { field, fieldState } = controller;
  const { onBlur, onChange, ref, value } = field;
  const resolvedError = "error" in props ? error : fieldState.error?.message;

  return (
    <InputWrapperHorizontal
      label={label}
      description={description}
      error={resolvedError}
      required={required}
    >
      <Switch.Root
        checked={value === checkedValue}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        inputRef={ref}
        onBlur={onBlur}
        onCheckedChange={(checked) => {
          onChange(checked ? checkedValue : uncheckedValue);
        }}
        className={twMerge(
          "relative inline-flex h-7 w-12 items-center rounded-full p-1",
          "bg-white shadow-[0_10px_20px_#eee]",
          "transition-[background-color,opacity]",
          "data-checked:bg-[#9099ac]",
          "data-unchecked:bg-[#f4f4f4]",
          "data-disabled:opacity-35",
          "data-readonly:opacity-60",
          className,
        )}
      >
        <Switch.Thumb
          className={twMerge(
            "block size-5 rounded-full bg-white",
            "shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
            "transition-transform duration-200 ease-out",
            "data-checked:translate-x-5",
          )}
        />
      </Switch.Root>
    </InputWrapperHorizontal>
  );
};
