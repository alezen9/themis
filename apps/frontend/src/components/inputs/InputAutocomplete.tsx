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
import { Option, OptionGroup } from "./shared";

type GroupVirtualRow = { groupLabel: string; key: string; type: "group" };
type OptionVirtualRow = {
  key: string | number;
  option: Option;
  optionIndex: number;
  type: "option";
};
type VirtualRow = GroupVirtualRow | OptionVirtualRow;

type Props = ComponentPropsWithoutRef<"input"> & {
  options: Option[] | OptionGroup[];
};

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

    const flatOptions = useMemo(
      () =>
        options.flatMap((option) =>
          "options" in option ? option.options : option,
        ),
      [options],
    );
    const optionsMap = useMemo(
      () => new Map<typeof value, Option>(flatOptions.map((o) => [o.value, o])),
      [flatOptions],
    );

    const onValueChange = useCallback<NonNullable<OnValueChange>>(
      (option) => {
        const changeEvent = { target: { name, value: option?.value ?? "" } };
        onChange?.(changeEvent as ChangeEvent<HTMLInputElement>);
      },
      [onChange, name],
    );

    return (
      <Combobox.Root<Option>
        items={flatOptions}
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
            "group/input relative flex max-w-100 w-full grow gap-1 items-center h-9",
            "has-[data-disabled]:opacity-30 has-[data-disabled]:pointer-events-none",
          )}
        >
          <Combobox.Value>
            {(option: Option | null) => (
              <>
                {option?.item && (
                  <span
                    className={twMerge(
                      "pointer-events-none absolute inset-y-0 left-0 right-16",
                      "flex min-w-0 items-center justify-center overflow-hidden rounded-l-sm",
                      "bg-(--bg-color) px-3 py-2 text-sm font-light text-gray-600",
                      "group-focus-within/input:hidden",
                    )}
                  >
                    {option.item}
                  </span>
                )}
                <Combobox.Input
                  data-testid={name ? `input-${name}` : undefined}
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
                    option?.item && "text-transparent focus:text-gray-600",
                  )}
                />
              </>
            )}
          </Combobox.Value>
          <Combobox.Trigger
            data-testid={name ? `input-${name}-trigger` : undefined}
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
            <VirtualizedPopup options={options} />
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    );
  },
);

InputAutocomplete.displayName = "InputAutocomplete";

const VirtualizedPopup = (props: { options: Option[] | OptionGroup[] }) => {
  const { options } = props;
  const popupRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = Combobox.useFilteredItems<Option>();
  const popupRows = useMemo(
    () => getVirtualRows(options, filteredOptions),
    [filteredOptions, options],
  );

  // TanStack Virtual is currently flagged by React Compiler as an incompatible library.
  // This component is intentionally isolated, and the virtualizer instance is used locally only.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: popupRows.length,
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
            const row = popupRows[virtualItem.index];
            if (!row) return null;

            if (row.type === "group") {
              return (
                <div
                  key={row.key}
                  ref={rowVirtualizer.measureElement}
                  style={{ transform: `translateY(${virtualItem.start}px)` }}
                  className={twMerge(
                    "absolute top-0 left-0 w-full",
                    "px-3 pt-2 pb-1 text-center text-[0.65rem]",
                    "font-semibold uppercase tracking-widest text-gray-500",
                  )}
                >
                  {row.groupLabel}
                </div>
              );
            }

            const option = row.option;

            return (
              <Combobox.Item
                key={option.value}
                index={row.optionIndex}
                data-index={row.optionIndex}
                data-testid={`option-${option.value}`}
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

const getVirtualRows = (
  options: Option[] | OptionGroup[],
  filteredOptions: Option[],
) => {
  const groupedOptions = options.filter(
    (option): option is OptionGroup => "options" in option,
  );

  if (!groupedOptions.length) {
    return filteredOptions.map<VirtualRow>((option, optionIndex) => ({
      key: option.value,
      option,
      optionIndex,
      type: "option",
    }));
  }

  const rows: VirtualRow[] = [];
  const filteredOptionIndexes = new Map(
    filteredOptions.map((option, optionIndex) => [option.value, optionIndex]),
  );

  groupedOptions.forEach((group) => {
    const groupOptions = group.options.filter((option) =>
      filteredOptionIndexes.has(option.value),
    );

    if (!groupOptions.length) return;

    rows.push({
      key: `group-${group.label}`,
      groupLabel: group.label,
      type: "group",
    });

    groupOptions.forEach((option) => {
      rows.push({
        key: option.value,
        option,
        optionIndex: filteredOptionIndexes.get(option.value) ?? 0,
        type: "option",
      });
    });
  });

  return rows;
};
