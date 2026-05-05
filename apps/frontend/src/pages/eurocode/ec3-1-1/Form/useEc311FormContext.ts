import { get, useForm, useFormContext } from "react-hook-form";
import { Ec3FormValues } from "./schema";
import { useCallback } from "react";
import { defaultValues } from "./defaultValues";

type Ec311Register = ReturnType<typeof useForm<Ec3FormValues>>["register"];
type Ec311FormName = Parameters<Ec311Register>[0];

const setValueAsNumber = (value: unknown) => {
  if (!value) return;
  try {
    const valueAsNumber = Number(value);
    if (isNaN(valueAsNumber)) return;
    return valueAsNumber;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return;
  }
};

export const useEc311FormContext = () => {
  const { register, ...rest } = useFormContext<Ec3FormValues>();

  const registerNumber = useCallback(
    (name: Ec311FormName) => register(name, { setValueAs: setValueAsNumber }),
    [register],
  );

  const registerSelect = useCallback(
    (name: Ec311FormName) => ({
      ...register(name),
      defaultValue: get(defaultValues, name),
    }),
    [register],
  );

  const registerBoolean = useCallback(
    (name: Ec311FormName) => ({
      ...register(name),
      defaultChecked: get(defaultValues, name),
    }),
    [register],
  );

  return { register, registerNumber, registerSelect, registerBoolean, ...rest };
};
