import { Combobox } from "@base-ui/react/combobox";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  ChangeEvent,
  ComponentProps,
  ComponentPropsWithRef,
  useCallback,
  useMemo,
  useRef,
  useState,
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

type Props = ComponentPropsWithRef<"input"> & {
  options: Option[] | OptionGroup[];
};

const optionRowHeight = 44;
const groupRowHeight = 36;
const rowGap = 4;

type OnValueChange = ComponentProps<
  typeof Combobox.Root<Option>
>["onValueChange"];
type IsItemEqualToValue = NonNullable<
  ComponentProps<typeof Combobox.Root<Option>>["isItemEqualToValue"]
>;

const isOptionEqualToValue: IsItemEqualToValue = (option, value) =>
  option.value === value.value;

export const InputAutocomplete = (props: Props) => {
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
    ref,
  } = props;

  const [stableDefault] = useState(defaultValue);

  const flatOptions = useMemo(
    () =>
      options.flatMap(option =>
        "options" in option ? option.options : option,
      ),
    [options],
  );
  const optionsMap = useMemo(
    () => new Map<typeof value, Option>(flatOptions.map(o => [o.value, o])),
    [flatOptions],
  );

  const onValueChange = useCallback<NonNullable<OnValueChange>>(
    option => {
      const changeEvent = { target: { name, value: option?.value ?? "" } };
      onChange?.(changeEvent as ChangeEvent<HTMLInputElement>);
    },
    [onChange, name],
  );

  return (
    <Combobox.Root<Option>
      items={flatOptions}
      defaultValue={optionsMap.get(stableDefault)}
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
      isItemEqualToValue={isOptionEqualToValue}
    >
      <Combobox.InputGroup
        className={twMerge(
          "group/input relative flex w-full grow gap-1 items-center h-9",
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
};

const VirtualizedPopup = (props: { options: Option[] | OptionGroup[] }) => {
  const { options } = props;
  const filteredOptions = Combobox.useFilteredItems<Option>();
  const popupRows = useMemo(
    () => getVirtualRows(options, filteredOptions),
    [filteredOptions, options],
  );
  const popupRef = useRef<HTMLDivElement | null>(null);

  // TanStack Virtual is currently flagged by React Compiler as an incompatible library.
  // This component is intentionally isolated, and the virtualizer instance is used locally only.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: popupRows.length,
    getScrollElement: () => popupRef.current,
    estimateSize: index => getRowHeight(popupRows[index]),
    gap: rowGap,
    overscan: 3,
  });
  const virtualItems = rowVirtualizer.getVirtualItems();

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
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map(virtualItem => {
            const row = popupRows[virtualItem.index];
            if (!row) return null;

            if (row.type === "group") {
              return (
                <div
                  key={row.key}
                  data-index={virtualItem.index}
                  style={{
                    height: `${groupRowHeight}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className={twMerge(
                    "absolute top-0 left-0 w-full",
                    "px-3 text-center text-xs",
                    "flex items-center justify-center",
                    "font-semibold uppercase tracking-wide text-sand-900 opacity-50",
                    "before:absolute before:top-1/2 before:left-0 before:z-1",
                    "before:h-px before:w-full before:bg-sand-700/25 before:content-['']",
                  )}
                >
                  <span className="relative z-2 bg-(--bg-input-default-color) px-4">
                    {row.groupLabel}
                  </span>
                </div>
              );
            }

            return (
              <Combobox.Item
                key={row.option.value}
                index={row.optionIndex}
                data-index={virtualItem.index}
                data-testid={`option-${row.option.value}`}
                ref={rowVirtualizer.measureElement}
                value={row.option}
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
                {row.option.item ?? row.option.label}
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

  groupedOptions.forEach(group => {
    const groupOptions = group.options.filter(option =>
      filteredOptionIndexes.has(option.value),
    );

    if (!groupOptions.length) return;

    rows.push({
      key: `group-${group.label}`,
      groupLabel: group.label,
      type: "group",
    });

    groupOptions.forEach(option => {
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

const getRowHeight = (row?: VirtualRow) =>
  row?.type === "group" ? groupRowHeight : optionRowHeight;
