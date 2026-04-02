import { type ComponentProps, type ReactNode, useId } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

type Props = Omit<ComponentProps<"input">, "children" | "type"> & {
  label?: ReactNode;
  error?: ReactNode;
};

type InputFieldProps = {
  label?: ReactNode;
  error?: ReactNode;
  errorId?: string;
  required?: boolean;
  children: ReactNode;
};

const inputVariants = cva(
  "w-full rounded-xl border bg-white px-3 py-2 text-sm tabular-nums text-slate-950 outline-none transition-colors placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
  {
    variants: {
      invalid: {
        false: "border-slate-300 focus:border-sky-500",
        true: "border-rose-300 focus:border-rose-500",
      },
    },
    defaultVariants: { invalid: false },
  },
);

const InputField = (props: InputFieldProps) => {
  const { label, error, errorId, required, children } = props;

  return (
    <div className="space-y-2">
      <label className="grid gap-2 text-sm font-medium text-slate-950">
        {label && (
          <span className="inline-flex items-center gap-1">
            <span>{label}</span>
            {required && <span className="text-rose-600">*</span>}
          </span>
        )}
        {children}
      </label>
      {error && (
        <p id={errorId} className="text-sm text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
};

export const NumberInput = (props: Props) => {
  const {
    label,
    error,
    required,
    className,
    id,
    "aria-describedby": ariaDescribedBy,
    ...inputProps
  } = props;
  const errorId = useId();
  const describedBy = error
    ? ariaDescribedBy
      ? `${ariaDescribedBy} ${errorId}`
      : errorId
    : ariaDescribedBy;

  return (
    <InputField
      label={label}
      error={error}
      errorId={error ? errorId : undefined}
      required={required}
    >
      <input
        {...inputProps}
        id={id}
        type="number"
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={twMerge(inputVariants({ invalid: !!error }), className)}
      />
    </InputField>
  );
};
