import { Combobox } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import {
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { InputWrapperHorizontal } from "./shared";

type Option = { label: string; value: string | number };
const ITEM_HEIGHT = 38; // 32px height + 6px padding

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

export const InputAutocomplete = (props: Props) => {
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
  const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);
  const { control } = useFormContext<FieldValues>();
  const controller = useController({ name, control });
  const { field, fieldState } = controller;
  const { onChange, onBlur, value, ref } = field;
  const optionsMap = useMemo(() => {
    const m = new Map<string | number, Option>();
    for (const option of options) m.set(option.value, option);
    return m;
  }, [options]);

  return (
    <InputWrapperHorizontal
      label={label}
      description={description}
      error={fieldState.error?.message}
      required={required}
    >
      <Combobox.Root<Option>
        items={options}
        filter={(option, query) => {
          const l = option.label.toLocaleLowerCase();
          const q = query.toLocaleLowerCase();
          return l.includes(q);
        }}
        value={optionsMap.get(value)}
        onValueChange={(option) => {
          onChange(option?.value ?? "");
        }}
        onInputValueChange={(inputValue) => {
          if (inputValue === "") onChange("");
        }}
        autoHighlight
        highlightItemOnHover
        virtualized
        itemToStringValue={(option) => String(option.value)}
        isItemEqualToValue={(item, selectedValue) => {
          return item.value === selectedValue.value;
        }}
        disabled={disabled}
        readOnly={readOnly}
      >
        <Combobox.InputGroup
          className={twMerge(
            "bg-white flex w-75 items-center gap-1.5 p-1.5 rounded-xl",
            "data-popup-open:rounded-b-none",
            "shadow-[0_10px_20px_#eee]",
            "has-[input:disabled]:opacity-30 has-[input:disabled]:bg-gray-200 has-[input:disabled]:pointer-events-none",
          )}
        >
          <Combobox.Input
            ref={ref}
            onBlur={onBlur}
            required={required}
            placeholder={placeholder}
            autoComplete="off"
            aria-invalid={fieldState.invalid}
            className={twMerge(
              "h-8 min-w-0 flex-1 rounded-lg",
              "bg-linear-to-b/oklch from-[#f7f7f7] to-[#fefefe]",
              "px-3 py-2",
              "font-thin text-lg leading-0",
              "focus:outline-gray-300 focus:outline-1",
              className,
            )}
          />
          <Combobox.Trigger
            aria-label="Open options"
            className={twMerge(
              "h-8 w-15 rounded-lg flex items-center justify-center",
              "bg-linear-to-b/oklch from-[#f7f7f7] to-[#fefefe]",
            )}
          >
            <MagnifierIcon className="size-3 text-gray-400 overflow-visible" />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner className="z-50 outline-none">
            <Combobox.Popup
              ref={setPopupElement}
              className={twMerge(
                "min-w-(--anchor-width) max-h-64 overflow-auto overscroll-none",
                "rounded-b-xl bg-white p-1",
                "shadow-[0_10px_20px_#eee]",
              )}
            >
              <Combobox.Empty className="px-3 py-2 text-sm font-light text-gray-500">
                No matches found
              </Combobox.Empty>
              <VirtualizedOptions popupElement={popupElement} />
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </InputWrapperHorizontal>
  );
};

type VirtualizedOptionsProps = { popupElement: HTMLDivElement | null };

const VirtualizedOptions = (props: VirtualizedOptionsProps) => {
  const { popupElement } = props;
  const filteredOptions = Combobox.useFilteredItems<Option>();
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => popupElement,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 6,
  });

  return (
    <Combobox.List
      className="relative w-full"
      style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const option = filteredOptions[virtualItem.index];
        if (!option) return null;

        return (
          <Combobox.Item
            key={option.value}
            index={virtualItem.index}
            value={option}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
            className={twMerge(
              "cursor-pointer rounded-lg border border-transparent",
              "px-3 py-2 text-sm font-thin",
              "data-highlighted:border-gray-300",
              "data-selected:bg-gray-100",
            )}
          >
            {option.label}
          </Combobox.Item>
        );
      })}
    </Combobox.List>
  );
};

const MagnifierIcon = (props: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="m31.707 30.282-9.717-9.776c1.811-2.169 2.902-4.96 2.902-8.007 0-6.904-5.596-12.5-12.5-12.5s-12.5 5.596-12.5 12.5 5.596 12.5 12.5 12.5c3.136 0 6.002-1.158 8.197-3.067l9.703 9.764c.39.39 1.024.39 1.415 0s.39-1.023 0-1.415zm-19.314-7.266c-5.808 0-10.517-4.709-10.517-10.517S6.584 1.982 12.393 1.982c5.808 0 10.516 4.708 10.516 10.517S18.2 23.016 12.392 23.016z" />
    </svg>
  );
};
