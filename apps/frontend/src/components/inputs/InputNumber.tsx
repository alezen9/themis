import {
  type ComponentPropsWithRef,
  type ReactNode,
  type WheelEvent,
} from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithRef<"input"> & { suffix?: ReactNode };

export const InputNumber = (props: Props) => {
  const { className, name, onWheel, suffix, ref, ...inputProps } = props;

  const handleWheel = (event: WheelEvent<HTMLInputElement>) => {
    onWheel?.(event);
    const isCurrentlyActive = document.activeElement === event.currentTarget;
    if (isCurrentlyActive) event.currentTarget.blur();
  };

  return (
    <div
      className={twMerge(
        "flex items-center gap-1 w-full h-9",
        "has-[input:disabled]:opacity-30 has-[input:disabled]:pointer-events-none",
      )}
    >
      <input
        ref={ref}
        name={name}
        data-testid={name ? `input-${name}` : undefined}
        type="number"
        onWheel={handleWheel}
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
          "text-sm",
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
};
