import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<"input">;

export const InputText = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, ...inputProps } = props;

  return (
    <input
      ref={ref}
      className={twMerge(
        "h-9 w-full max-w-100",
        "rounded-sm",
        "bg-(--bg-input-default-color)",
        "px-3 py-2",
        "text-sm leading-0 font-light text-gray-600",
        "transition-colors",
        "focus:outline-none",
        "disabled:opacity-30",

        className,
      )}
      {...inputProps}
    />
  );
});

InputText.displayName = "InputText";
