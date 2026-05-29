import { Switch } from "@base-ui/react/switch";
import {
  ChangeEvent,
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
} from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<typeof Switch.Root> & {
  className?: string;
  thumbClassName?: string;
  onChange?: ComponentPropsWithoutRef<"input">["onChange"];
};

export const InputToggle = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, thumbClassName, onChange, name, ...inputProps } = props;

  const onCheckedChange = useCallback<NonNullable<Props["onCheckedChange"]>>(
    checked => {
      const changeEvent = { target: { name, type: "checkbox", checked } };
      onChange?.(changeEvent as ChangeEvent<HTMLInputElement>);
    },
    [onChange, name],
  );

  return (
    <Switch.Root
      name={name}
      inputRef={ref}
      {...inputProps}
      onCheckedChange={onCheckedChange}
      className={twMerge(
        "relative inline-flex h-7 w-14 items-center rounded-full",
        "transition-[background-color,opacity]",
        "data-checked:bg-(--bg-input-selected-color)",
        "data-unchecked:bg-(--bg-input-default-color)",
        "p-1",
        className,
      )}
    >
      <Switch.Thumb
        className={twMerge(
          "h-full w-2/3 rounded-full bg-white",
          "transition-transform duration-200 ease-out",
          "data-checked:translate-x-2/4",
          thumbClassName,
        )}
      />
    </Switch.Root>
  );
});

InputToggle.displayName = "InputToggle";
