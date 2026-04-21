import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { cva } from "class-variance-authority";
import { type ReactNode } from "react";
import {
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { InputWrapperHorizontal } from "./shared";

type OptionValue = number | string;

type RadioOption = {
  label: ReactNode;
  value: OptionValue;
  description?: ReactNode;
  disabled?: boolean;
};

type Props = {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: "inline" | "stacked";
  className?: string;
};

type InputRadioItemProps = RadioOption & { readOnly?: boolean };

const groupClasses = cva("flex gap-2.5", {
  variants: {
    orientation: {
      inline: "w-full justify-between",
      stacked: "flex-col items-stretch",
    },
  },
  defaultVariants: { orientation: "inline" },
});

export const InputRadioItem = (props: InputRadioItemProps) => {
  const { label, value, description, disabled, readOnly } = props;

  return (
    <label
      className={twMerge(
        "flex min-h-10 items-center gap-2.5 rounded-xl px-3 py-2",
        "bg-white shadow-[0_10px_20px_#eee]",
        "transition-[opacity,background-color]",
        "has-[span[data-checked]]:bg-stone-50",
        "has-[span[data-disabled]]:opacity-35",
        "has-[span[data-disabled]]:cursor-default",
        "has-[span[data-readonly]]:opacity-60",
      )}
    >
      <Radio.Root
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        className={twMerge(
          "flex size-5 shrink-0 items-center justify-center rounded-full",
          "border border-stone-300 bg-white",
          "transition-colors",
          "data-checked:border-[#9099ac]",
          "data-disabled:bg-stone-100",
        )}
      >
        <Radio.Indicator
          keepMounted
          className={twMerge(
            "size-2.5 rounded-full bg-[#9099ac]",
            "transition-opacity data-unchecked:opacity-0",
          )}
        />
      </Radio.Root>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-sm font-thin text-gray-700">{label}</span>
        {description && (
          <span className="text-xs font-light text-gray-500">
            {description}
          </span>
        )}
      </span>
    </label>
  );
};

export const InputRadioGroup = (props: Props) => {
  const {
    name,
    label,
    description,
    error,
    options,
    required,
    disabled,
    readOnly,
    orientation = "inline",
    className,
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
      <RadioGroup
        value={value}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        inputRef={ref}
        onBlur={onBlur}
        onValueChange={onChange}
        className={twMerge(groupClasses({ orientation }), className)}
      >
        {options.map((option) => (
          <InputRadioItem key={option.value} {...option} readOnly={readOnly} />
        ))}
      </RadioGroup>
    </InputWrapperHorizontal>
  );
};
