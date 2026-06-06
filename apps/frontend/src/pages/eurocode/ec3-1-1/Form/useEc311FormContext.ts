import { get, useForm, useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema/schema";
import { useCallback } from "react";

type Ec311Form = ReturnType<typeof useForm<Ec3FormValues>>;
type Ec311Register = Ec311Form["register"];
type Ec311FormName = Parameters<Ec311Register>[0];
type Ec311RegisterOptions = Parameters<Ec311Register>[1];

type Ec311FormContext = Ec311Form & {
  registerNumber: (
    name: Ec311FormName,
    options?: Ec311RegisterOptions,
  ) => ReturnType<Ec311Register>;
  registerSelect: (
    name: Ec311FormName,
    options?: Ec311RegisterOptions,
  ) => ReturnType<Ec311Register>;
  registerBoolean: (
    name: Ec311FormName,
    options?: Ec311RegisterOptions,
  ) => ReturnType<Ec311Register>;
};

const setValueAsNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return "";
  const valueAsNumber = Number(value);
  if (Number.isNaN(valueAsNumber)) return "";
  return valueAsNumber;
};

export const useEc311FormContext = (): Ec311FormContext => {
  const { register, getValues, ...rest } = useFormContext<Ec3FormValues>();

  const registerNumber = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, { ...options, setValueAs: setValueAsNumber }),
      defaultValue: get(getValues(), name),
    }),
    [register, getValues],
  );

  const registerSelect = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, options),
      defaultValue: get(getValues(), name),
    }),
    [register, getValues],
  );

  const registerBoolean = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, options),
      defaultChecked: get(getValues(), name),
    }),
    [register, getValues],
  );

  return {
    register,
    getValues,
    registerNumber,
    registerSelect,
    registerBoolean,
    ...rest,
  };
};
