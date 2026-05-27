import { type ReactNode } from "react";
import { get, useFormState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export type Option<T = unknown> = {
  label: string;
  item?: ReactNode;
  value: string | number;
  ctx?: T;
};

export type OptionGroup<T = unknown> = { label: string; options: Option<T>[] };

const NON_BLOCKING_SPACE = "\u00a0";

type FieldProps = {
  children: ReactNode;
  name: string;
  label: ReactNode;
  orientation?: "vertical" | "horizontal";
  description?: ReactNode;
};

export const FormField = (props: FieldProps) => {
  const { orientation = "vertical", ...rest } = props;

  if (orientation === "horizontal") return <HorizontalInput {...rest} />;
  return <VerticallInput {...rest} />;
};

export const HorizontalInput = (props: FieldProps) => {
  const { children, label, name } = props;
  const { errors } = useFormState({ name });
  const error = get(errors, name)?.message;

  return (
    <label
      data-error={error ? "" : undefined}
      data-testid={`field-${name}`}
      className={twMerge(
        "[--bg-color:var(--bg-input-default-color)]",
        error && "[--bg-color:var(--bg-input-error-color)]",
        !error && "focus-within:[--bg-color:var(--bg-input-focus-color)]",
        "grid grid-cols-[1fr_2fr] grid-rows-[auto_auto] items-center gap-y-1",
      )}
    >
      <span className="text-sm font-light text-sand-900">{label}</span>
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

const VerticallInput = (props: FieldProps) => {
  const { children, label, name, description } = props;
  const { errors } = useFormState({ name });
  const error = get(errors, name)?.message;

  return (
    <label
      data-error={error ? "" : undefined}
      data-testid={`field-${name}`}
      className={twMerge(
        "[--bg-color:var(--bg-input-default-color)]",
        error && "[--bg-color:var(--bg-input-error-color)]",
        !error && "focus-within:[--bg-color:var(--bg-input-focus-color)]",
        "flex flex-col gap-1.5",
      )}
    >
      <span className="text-sm font-light text-sand-900">{label}</span>
      {description && (
        <span className="text-xs text-gray-400 font-light">{description}</span>
      )}
      {children}
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
