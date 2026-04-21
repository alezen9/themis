import { Select } from "@base-ui/react/select";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import {
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { InputWrapperHorizontal } from "./shared";

type Option = { label: string; value: string | number };

type Props = {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
};

export const InputSelect = (props: Props) => {
  const {
    name,
    label,
    description,
    options,
    required,
    disabled,
    readOnly,
    placeholder,
    className,
  } = props;
  const { control } = useFormContext<FieldValues>();
  const controller = useController({ name, control });
  const { field, fieldState } = controller;
  const { onBlur, onChange, ref, value } = field;
  const selectedValue = value === "" || value == null ? null : value;

  return (
    <InputWrapperHorizontal
      label={label}
      description={description}
      error={fieldState.error?.message}
      required={required}
    >
      <Select.Root<Option>
        items={options}
        value={selectedValue}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        inputRef={ref}
        onValueChange={(nextValue) => {
          onChange(nextValue ?? "");
        }}
      >
        <Select.Trigger
          onBlur={onBlur}
          aria-invalid={fieldState.invalid}
          className={twMerge(
            "bg-white flex w-75 items-center gap-1.5 p-1.5 rounded-xl",
            "data-popup-open:rounded-b-none",
            "shadow-[0_10px_20px_#eee]",
            "data-disabled:opacity-30 data-disabled:bg-gray-200 data-disabled:pointer-events-none",
            "data-readonly:opacity-60",
          )}
        >
          <Select.Value
            placeholder={placeholder}
            className={twMerge(
              "flex h-8 min-w-0 flex-1 items-center rounded-lg",
              "bg-linear-to-b/oklch from-[#f7f7f7] to-[#fefefe]",
              "px-3 py-2",
              "font-thin text-lg leading-0 text-left",
              "data-placeholder:text-gray-400",
              className,
            )}
          />
          <span
            className={twMerge(
              "h-8 w-15 rounded-lg flex items-center justify-center",
              "bg-linear-to-b/oklch from-[#f7f7f7] to-[#fefefe]",
            )}
          >
            <ChevronIcon className="size-3 text-gray-400 overflow-visible" />
          </span>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            alignItemWithTrigger={false}
            className="z-50 outline-none"
          >
            <Select.Popup
              className={twMerge(
                "min-w-(--anchor-width) max-h-64 overflow-auto overscroll-none",
                "rounded-b-xl bg-white p-1",
                "shadow-[0_10px_20px_#eee]",
              )}
            >
              <Select.List className="w-full">
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={twMerge(
                      "cursor-pointer rounded-lg border border-transparent",
                      "px-3 py-2 text-sm font-thin",
                      "data-highlighted:border-gray-300",
                      "data-selected:bg-gray-100",
                    )}
                  >
                    {option.label}
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </InputWrapperHorizontal>
  );
};

const ChevronIcon = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
};
