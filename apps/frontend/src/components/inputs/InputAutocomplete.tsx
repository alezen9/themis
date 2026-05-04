import { Combobox } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChangeEvent,
  ComponentProps,
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";
import { IconMagnifier } from "@components/Icons";
import { Option } from "./shared";

type Props = ComponentPropsWithoutRef<"input"> & { options: Option[] };

type OnValueChange = ComponentProps<
  typeof Combobox.Root<Option>
>["onValueChange"];

export const InputAutocomplete = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
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

    const optionsMap = useMemo(
      () => new Map<typeof value, Option>(options.map((o) => [o.value, o])),
      [options],
    );

    const onValueChange = useCallback<NonNullable<OnValueChange>>(
      (option) => {
        const changeEvent = { target: { name, value: option?.value } };
        onChange?.(changeEvent as ChangeEvent<HTMLInputElement>);
      },
      [onChange, name],
    );

    return (
      <Combobox.Root<Option>
        items={options}
        defaultValue={optionsMap.get(defaultValue)}
        value={optionsMap.get(value)}
        autoHighlight
        highlightItemOnHover
        virtualized
        modal={false}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        inputRef={ref}
        onValueChange={onValueChange}
      >
        <Combobox.InputGroup
          className={twMerge(
            "flex max-w-100 w-full grow gap-1 items-center h-9",
            "has-[data-disabled]:opacity-30 has-[data-disabled]:pointer-events-none",
          )}
        >
          <Combobox.Input
            onBlur={onBlur}
            placeholder={placeholder}
            className={twMerge(
              "flex h-full w-full min-w-0 flex-1 items-center text-center rounded-l-sm",
              "bg-(--bg-color)",
              "text-gray-600",
              "px-3 py-2",
              "font-light leading-0",
              "data-placeholder:text-gray-400",
              "focus:outline-none",
              "transition-colors",
              "text-sm",
              className,
            )}
          />
          <Combobox.Trigger
            className={twMerge(
              "h-full w-15 rounded-r-sm flex items-center justify-center",
              "bg-(--bg-color)",
              "text-gray-500",
              "transition-colors",
            )}
          >
            <Combobox.Icon>
              <IconMagnifier className="size-3 stroke-1 overflow-visible" />
            </Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner className="z-50 outline-none">
            <VirtualizedPopup />
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    );
  },
);

InputAutocomplete.displayName = "InputAutocomplete";

const VirtualizedPopup = () => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = Combobox.useFilteredItems<Option>();

  // TanStack Virtual is currently flagged by React Compiler as an incompatible library.
  // This component is intentionally isolated, and the virtualizer instance is used locally only.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => popupRef.current,
    estimateSize: () => 44,
    gap: 4,
    overscan: 3,
  });

  return (
    <Combobox.Popup
      ref={popupRef}
      className={twMerge(
        "min-w-(--anchor-width) max-h-64 overflow-auto overscroll-none my-1",
        "rounded-sm p-1",
        "bg-(--bg-input-default-color)",
        "shadow-xl shadow-sand-600/25",
      )}
    >
      {!filteredOptions.length && (
        <Combobox.Empty className="px-3 py-2 text-sm text-gray-700 font-extralight">
          No matches found
        </Combobox.Empty>
      )}
      {!!filteredOptions.length && (
        <Combobox.List
          className="relative w-full flex flex-col gap-1"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const option = filteredOptions[virtualItem.index];
            if (!option) return null;

            return (
              <Combobox.Item
                key={option.value}
                index={virtualItem.index}
                data-index={virtualItem.index}
                ref={rowVirtualizer.measureElement}
                value={option}
                style={{ transform: `translateY(${virtualItem.start}px)` }}
                className={twMerge(
                  "absolute top-0 left-0 w-full",
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
              </Combobox.Item>
            );
          })}
        </Combobox.List>
      )}
    </Combobox.Popup>
  );
};
