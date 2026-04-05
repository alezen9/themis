import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { InputError, InputLabel } from "./shared";

type Props = Omit<ComponentPropsWithoutRef<"input">, "children" | "type"> & {
  label?: ReactNode;
  error?: ReactNode;
  suffix?: ReactNode;
};

const fieldVariants = cva(
  "flex w-full items-end gap-2 rounded-[4px] border bg-white px-3 py-2.5 transition-colors",
  {
    variants: {
      invalid: {
        false: "border-slate-200 focus-within:border-slate-300",
        true: "border-rose-300 focus-within:border-rose-400",
      },
      disabled: { false: "", true: "border-slate-200 bg-slate-50" },
    },
    defaultVariants: { invalid: false, disabled: false },
  },
);

export const InputNumber = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { label, error, suffix, required, className, id, ...inputProps } =
    props;
  const disabled = Boolean(inputProps.disabled);

  return (
    <label className="grid gap-2 text-sm font-medium text-slate-950">
      <InputLabel required={required} invalid={!!error}>
        {label}
      </InputLabel>
      <div className={fieldVariants({ invalid: !!error, disabled })}>
        <input
          {...inputProps}
          ref={ref}
          id={id}
          type="number"
          required={required}
          aria-invalid={!!error}
          className={twMerge(
            "w-full min-w-0 border-0 bg-transparent p-0 text-right text-[2.75rem] font-semibold leading-none tracking-[-0.08em] text-slate-950 outline-none transition-colors placeholder:text-slate-300 disabled:cursor-not-allowed disabled:text-slate-400 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            className,
          )}
        />
        {suffix && (
          <span
            className={twMerge(
              "shrink-0 pb-0.5 text-[1.75rem] font-light leading-none tracking-[-0.03em] text-slate-400",
              disabled && "text-slate-300",
            )}
          >
            {suffix}
          </span>
        )}
      </div>
      <InputError>{error}</InputError>
    </label>
  );
});

InputNumber.displayName = "InputNumber";
