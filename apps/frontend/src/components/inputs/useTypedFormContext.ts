import { useCallback } from "react";
import {
  type FieldValues,
  type Path,
  type RegisterOptions,
  get,
  useFormContext,
} from "react-hook-form";

export const setValueAsNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return "";
  const valueAsNumber = Number(value);
  if (Number.isNaN(valueAsNumber)) return "";
  return valueAsNumber;
};

export const useTypedFormContext = <T extends FieldValues = FieldValues>() => {
  const context = useFormContext<T>();
  const { register, getValues } = context;

  const registerNumber = useCallback(
    (name: Path<T>, options?: RegisterOptions<T, Path<T>>) => ({
      ...register(name, { ...options, setValueAs: setValueAsNumber }),
      defaultValue: get(getValues(), name),
    }),
    [register, getValues],
  );

  const registerBoolean = useCallback(
    (name: Path<T>, options?: RegisterOptions<T, Path<T>>) => ({
      ...register(name, options),
      defaultChecked: get(getValues(), name),
    }),
    [register, getValues],
  );

  return { ...context, registerNumber, registerBoolean };
};
