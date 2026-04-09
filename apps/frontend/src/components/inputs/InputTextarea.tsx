import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import { InputWrapper } from "./shared";

type Props = Omit<ComponentPropsWithoutRef<"textarea">, "children"> & {
  description?: ReactNode;
  label?: ReactNode;
  error?: ReactNode;
};

export const InputTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const {
      label,
      description,
      error,
      required,
      className,
      ...textareaProps
    } = props;

    return (
      <InputWrapper
        label={label}
        description={description}
        error={error}
        required={required}
      >
        <textarea
          {...textareaProps}
          ref={ref}
          required={required}
          className={twMerge(
            "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-gray-500 disabled:cursor-not-allowed disabled:bg-gray-100",
            className,
          )}
        />
      </InputWrapper>
    );
  },
);

InputTextarea.displayName = "InputTextarea";
