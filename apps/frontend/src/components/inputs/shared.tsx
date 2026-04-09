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
    <div className="space-y-1">
      {label && (
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-900">
          <span>
            {label}
            {required && " *"}
          </span>
          {children}
        </label>
      )}
      {!label && children}
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <p className="text-xs text-red-600">
        {error || NON_BLOCKING_SPACE}
      </p>
    </div>
  );
};
