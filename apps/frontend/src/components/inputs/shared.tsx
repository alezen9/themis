import { type ReactNode } from "react";
import { get, useFormState } from "react-hook-form";
import { twMerge } from "tailwind-merge";

const NON_BLOCKING_SPACE = "\u00a0";

type InputWrapperProps = {
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  label: ReactNode;
  required?: boolean;
};

export const InputWrapper = (props: InputWrapperProps) => {
  const { children, description, error, label, required } = props;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="flex flex-col gap-1 text-sm font-light text-gray-700">
          <span>
            {label}
            {required && " *"}
          </span>
          {children}
        </label>
      )}
      {!label && children}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <p className="text-xs text-red-600">{error || NON_BLOCKING_SPACE}</p>
    </div>
  );
};

export const InputWrapperHorizontal = (props: InputWrapperProps) => {
  const { children, error, label, required } = props;

  return (
    <div className="flex flex-col gap-2">
      <label className="grid grid-cols-[auto_1fr] items-baseline">
        <span className="text-sm font-thin text-gray-700">
          {label}
          {required && " *"}
        </span>
        <span className="justify-self-end">{children}</span>
        <span>{NON_BLOCKING_SPACE}</span>
        <p className="text-xs font-light text-red-500 ml-1 justify-self-end">
          {error || NON_BLOCKING_SPACE}
        </p>
      </label>
    </div>
  );
};

export const InputWrapperHorizontalGroup = (props: InputWrapperProps) => {
  const { children, error, label, required } = props;

  return (
    <div className="flex flex-col gap-2">
      <fieldset className="grid grid-cols-[auto_1fr] items-baseline">
        <legend className="text-sm font-thin text-gray-700">
          {label}
          {required && " *"}
        </legend>
        <div className="justify-self-end">{children}</div>
        <span>{NON_BLOCKING_SPACE}</span>
        <p className="text-xs font-light text-red-500 ml-1 justify-self-end">
          {error || NON_BLOCKING_SPACE}
        </p>
      </fieldset>
    </div>
  );
};

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
        "grid grid-cols-[1fr_2fr] grid-rows-[auto_auto] items-center gap-y-1",
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
