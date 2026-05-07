import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithoutRef<"textarea">;

export const InputTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const { className, ...textareaProps } = props;

    return (
      <textarea
        ref={ref}
        className={twMerge(
          "[--bg-color:var(--bg-input-default-color)]",
          "min-h-24 w-full resize-y rounded-sm",
          "bg-(--bg-color)",
          "px-3 py-2",
          "text-sm font-light text-gray-600",
          "transition-colors",
          "focus:[--bg-color:var(--bg-input-focus-color)] focus:outline-none",
          className,
        )}
        {...textareaProps}
      />
    );
  },
);

InputTextarea.displayName = "InputTextarea";
