import { Switch } from "@base-ui/react/switch";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<typeof Switch.Root> & {
  className?: string;
};

export const InputToggle = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, ...inputProps } = props;

  return (
    <Switch.Root
      inputRef={ref}
      {...inputProps}
      className={twMerge(
        "relative inline-flex h-7 w-16 items-center rounded-full",
        "transition-[background-color,opacity]",
        "data-checked:bg-(--bg-input-selected-color)",
        "data-unchecked:bg-(--bg-input-default-color)",
        "p-1",
        className,
      )}
    >
      <Switch.Thumb
        className={twMerge(
          "block h-full w-9 aspect-square rounded-full bg-white",
          "transition-transform duration-200 ease-out",
          "data-checked:translate-x-5",
        )}
      />
    </Switch.Root>
  );
});

InputToggle.displayName = "InputToggle";
