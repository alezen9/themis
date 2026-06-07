import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithRef<"textarea">;

export const InputTextarea = (props: Props) => {
  const { className, ref, ...textareaProps } = props;

  return (
    <textarea
      ref={ref}
      className={twMerge(
        "min-h-24 w-full resize-y rounded-sm",
        "bg-(--bg-color,var(--bg-input-default-color))",
        "px-3 py-2",
        "text-sm font-light text-gray-600",
        "transition-colors",
        "focus:[--bg-color:var(--bg-input-focus-color)] focus:outline-none",
        className,
      )}
      {...textareaProps}
    />
  );
};
