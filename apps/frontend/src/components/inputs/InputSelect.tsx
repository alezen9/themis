import { Select } from "@base-ui/react/select";
import { IconChevron } from "@components/Icons";
import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useCallback,
  type ComponentPropsWithoutRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { Option } from "./shared";

type Props = ComponentPropsWithoutRef<"input"> & { options: Option[] };

type OnValueChange = ComponentProps<
  typeof Select.Root<Option["value"]>
>["onValueChange"];
type OnBlur = ComponentProps<typeof Select.Trigger>["onBlur"];

export const InputSelect = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    name,
    options,
    required,
    disabled,
    readOnly,
    placeholder,
    className,
    onBlur,
    onChange,
    defaultValue,
    value,
  } = props;

  const onValueChange = useCallback<NonNullable<OnValueChange>>(
    (value) => {
      const changeEvent = { target: { name, value } };
      onChange?.(changeEvent as ChangeEvent<HTMLInputElement>);
    },
    [onChange, name],
  );

  return (
    <Select.Root<Option["value"]>
      items={options}
      defaultValue={defaultValue as Option["value"]}
      value={value as Option["value"]}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      inputRef={ref}
      name={name}
      onValueChange={onValueChange}
    >
      <Select.Trigger
        name={name}
        onBlur={onBlur as OnBlur}
        className={twMerge(
          "flex max-w-100 w-full grow gap-1 items-center h-9",
          "data-disabled:opacity-30  data-disabled:pointer-events-none",
          "focus:outline-none",
        )}
      >
        <Select.Value
          placeholder={placeholder}
          className={twMerge(
            "flex h-full min-w-0 flex-1 items-center justify-center rounded-l-sm",
            "bg-(--bg-color)",
            "text-gray-600",
            "px-3 py-2",
            "font-light leading-0",
            "data-placeholder:text-gray-400",
            "transition-colors",
            "text-sm",
            className,
          )}
        />
        <Select.Icon
          className={twMerge(
            "h-full w-15 rounded-r-sm flex items-center justify-center",
            "bg-(--bg-color)",
            "text-gray-500",
            "transition-colors",
            "data-popup-open:[&_svg]:rotate-z-180",
          )}
        >
          <IconChevron className="size-4 stroke-1 overflow-visible rotate-z-0 transition-transform" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner
          alignItemWithTrigger={false}
          className="z-50 outline-none"
        >
          <Select.Popup
            className={twMerge(
              "min-w-(--anchor-width) max-h-64 overflow-auto overscroll-none my-1",
              "rounded-sm p-1",
              "bg-(--bg-input-default-color)",
              "shadow-xl shadow-sand-600/25",
            )}
          >
            <Select.List className="w-full flex flex-col gap-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={twMerge(
                    "cursor-pointer rounded-sm border border-transparent",
                    "px-3 py-2 text-sm font-light text-center",
                    "data-selected:bg-(--bg-input-selected-color)",
                    "data-selected:text-white",
                    "data-highlighted:not-data-selected:bg-(--bg-input-focus-color)",
                    "transition-colors",
                    "text-sm",
                  )}
                >
                  {option.item ?? option.label}
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
});

InputSelect.displayName = "InputSelect";
