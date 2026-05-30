import { type ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentPropsWithRef<"input">;

export const InputText = (props: Props) => {
  const { className, ref, ...inputProps } = props;

  return (
    <input
      ref={ref}
      className={twMerge(
        "h-9 w-full",
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
};
