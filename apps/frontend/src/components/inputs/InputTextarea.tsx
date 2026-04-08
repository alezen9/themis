import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { InputWrapper } from "./shared";

type Props = Omit<ComponentPropsWithoutRef<"textarea">, "children"> & {
  description?: ReactNode;
  label?: ReactNode;
  error?: ReactNode;
};

export const InputTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const { label, description, error, required, ...textareaProps } = props;

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
        />
      </InputWrapper>
    );
  },
);

InputTextarea.displayName = "InputTextarea";
