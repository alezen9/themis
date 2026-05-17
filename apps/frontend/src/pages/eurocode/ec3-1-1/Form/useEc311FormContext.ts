import { get, useForm, useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema/schema";
import { useCallback } from "react";
import { defaultValues } from "./defaultValues";

type Ec311Register = ReturnType<typeof useForm<Ec3FormValues>>["register"];
type Ec311FormName = Parameters<Ec311Register>[0];
type Ec311RegisterOptions = Parameters<Ec311Register>[1];

const setValueAsNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return "";
  const valueAsNumber = Number(value);
  if (Number.isNaN(valueAsNumber)) return "";
  return valueAsNumber;
};

export const useEc311FormContext = () => {
  const { register, ...rest } = useFormContext<Ec3FormValues>();

  const registerNumber = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, { ...options, setValueAs: setValueAsNumber }),
      defaultValue: get(defaultValues, name),
    }),
    [register],
  );

  const registerSelect = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, options),
      defaultValue: get(defaultValues, name),
    }),
    [register],
  );

  const registerBoolean = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, options),
      defaultChecked: get(defaultValues, name),
    }),
    [register],
  );

  return { register, registerNumber, registerSelect, registerBoolean, ...rest };
};
