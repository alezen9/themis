import { type ReactNode } from "react";

const NON_BLOCKING_SPACE = "\u00a0";

type InputWrapperProps = {
  children: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  label?: ReactNode;
  required?: boolean;
};

export const InputWrapper = (props: InputWrapperProps) => {
  const { children, description, error, label, required } = props;

  return (
    <div>
      {label && (
        <label>
          {label}
          {required && " *"}
          {children}
        </label>
      )}
      {!label && children}
      {description && <p>{description}</p>}
      <p>{error || NON_BLOCKING_SPACE}</p>
    </div>
  );
};
