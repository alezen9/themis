import { Combobox } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { type ReactNode, useMemo, useState } from "react";
import {
  type FieldValues,
  useController,
  useFormContext,
} from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { InputWrapperHorizontal } from "./shared";
import { IconMagnifier } from "@components/Icons";

type Option = { label: string; value: string | number };
const ITEM_HEIGHT = 42;

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
            "bg-white flex w-75 items-center",
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
              "h-10 min-w-0 flex-1 rounded-l-sm",
              "bg-zinc-100",
              "px-3 py-2",
              "font-thin text-lg leading-0",
              "focus:outline-none",
              className,
            )}
          />
          <Combobox.Trigger
            aria-label="Open options"
            className={twMerge(
              "h-10 w-15 rounded-r-sm flex items-center justify-center",
              "bg-zinc-100",
            )}
          >
            <IconMagnifier className="size-3 text-gray-400 overflow-visible" />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner className="z-50 outline-none">
            <Combobox.Popup
              ref={setPopupElement}
              className={twMerge(
                "min-w-(--anchor-width) max-h-64 overflow-auto overscroll-none my-1",
                "rounded-sm bg-zinc-100 p-1",
                "shadow-lg",
              )}
            >
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

  if (!filteredOptions.length) {
    return (
      <Combobox.Empty className="px-3 py-2 text-sm text-gray-700 font-extralight">
        No matches found
      </Combobox.Empty>
    );
  }

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
              "data-highlighted:not-[data-selected]:border-gray-500",
              "data-selected:bg-gray-600",
              "data-selected:text-white",
              "transition-[border]",
            )}
          >
            {option.label}
          </Combobox.Item>
        );
      })}
    </Combobox.List>
  );
};
