import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<"input"> & { suffix?: ReactNode };

export const InputNumber = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className, suffix, ...inputProps } = props;
  return (
    <div
      className={twMerge(
        "flex items-center gap-1 max-w-100 w-full h-9",
        "has-[input:disabled]:opacity-30 has-[input:disabled]:pointer-events-none",
      )}
    >
      <input
        ref={ref}
        type="number"
        className={twMerge(
          "w-full h-full text-center",
          suffix ? "rounded-l-sm" : "rounded-sm",
          "bg-(--bg-color)",
          "text-gray-600",
          "px-3 py-2",
          "font-light leading-0",
          "-webkit-appearance-none",
          "focus:outline-none",
          "transition-colors",
          "tabular-nums",
          className,
        )}
        {...inputProps}
      />
      {suffix && (
        <span
          className={twMerge(
            "h-full w-20 rounded-r-sm flex justify-center items-end py-2",
            "text-gray-500 text-xs font-light",
            "bg-(--bg-color)",
          )}
        >
          {suffix}
        </span>
      )}
    </div>
  );
});

InputNumber.displayName = "InputNumber";
