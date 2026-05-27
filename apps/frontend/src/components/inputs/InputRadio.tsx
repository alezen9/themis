import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<"input"> & {
  value: string;
  label: ReactNode;
};

export const InputRadio = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, label, ...inputProps } = props;

  return (
    <label
      className={twMerge(
        "flex items-center gap-2.5 w-full h-9 rounded-sm text-sm",
        "has-[input:disabled]:opacity-30 has-[input:disabled]:pointer-events-none",
        "px-3 py-2",
        "font-light leading-0",
        "bg-(--bg-input-default-color)",
        "text-gray-600",
        "focus:outline-none",
        "transition-colors",
        "whitespace-nowrap",
        className,
      )}
    >
      <input
        ref={ref}
        type="radio"
        className="accent-(--bg-input-selected-color)"
        {...inputProps}
      />
      {label}
    </label>
  );
});

InputRadio.displayName = "InputRadio";
