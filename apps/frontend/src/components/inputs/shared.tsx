import { type ComponentProps } from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const labelVariants = cva("inline-flex items-center gap-1", {
  variants: { invalid: { true: "text-red-600", false: "" } },
  defaultVariants: { invalid: false },
});

type InputLabelProps = ComponentProps<"span"> & {
  required?: boolean;
  invalid?: boolean;
};

export const InputLabel = (props: InputLabelProps) => {
  const { required, children, className, invalid, ...rest } = props;

  if (!children) return null;

  return (
    <span className={twMerge(labelVariants({ invalid, className }))} {...rest}>
      {children}
      {required && <span>*</span>}
    </span>
  );
};

export const InputError = (props: ComponentProps<"span">) => {
  const { className, children, ...rest } = props;
  const content = children || "\u00a0";

  return (
    <span
      className={twMerge(
        "min-h-4 text-xs font-light text-red-600",
        !children && "invisible",
        className,
      )}
      {...rest}
    >
      {content}
    </span>
  );
};
