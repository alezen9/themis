import { type ReactNode } from "react";
import { get, useFormState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export type Option<T = unknown> = {
  label: string;
  item?: ReactNode;
  value: string | number;
  ctx?: T;
};

const NON_BLOCKING_SPACE = "\u00a0";

type HorizontalInputProps = {
  children: ReactNode;
  name: string;
  label: ReactNode;
};

export const HorizontalInput = (props: HorizontalInputProps) => {
  const { children, label, name } = props;
  const { errors } = useFormState({ name });
  const error = get(errors, name)?.message;

  return (
    <label
      className={twMerge(
        "[--bg-color:var(--bg-input-default-color)]",
        error && "[--bg-color:var(--bg-input-error-color)]",
        !error && "focus-within:[--bg-color:var(--bg-input-focus-color)]",
        "grid grid-cols-[1fr_2.25fr] grid-rows-[auto_auto] items-center gap-y-1",
      )}
    >
      <span className="text-sm font-thin text-gray-700">{label}</span>
      {children}
      <span className="h-0">{NON_BLOCKING_SPACE}</span>
      <span
        className={twMerge(
          "text-xs font-light text-red-500",
          "h-0 opacity-0",
          error && "h-lh opacity-100",
          "transition-[height] duration-200",
          "tabular-nums",
        )}
      >
        {error || NON_BLOCKING_SPACE}
      </span>
    </label>
  );
};
