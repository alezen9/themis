import { useCallback } from "react";
import { get, useForm, useFormContext } from "react-hook-form";

type Ec311Register = ReturnType<typeof useForm>["register"];
type Ec311FormName = Parameters<Ec311Register>[0];
type Ec311RegisterOptions = Parameters<Ec311Register>[1];

const setValueAsNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return "";
  const valueAsNumber = Number(value);
  if (Number.isNaN(valueAsNumber)) return "";
  return valueAsNumber;
};

export const useCreateEditNodeFormContext = () => {
  const { register, formState, ...rest } = useFormContext();

  const registerNumber = useCallback(
    (name: string, options?: Ec311RegisterOptions) => ({
      ...register(name, { ...options, setValueAs: setValueAsNumber }),
      defaultValue: get(formState.defaultValues, name),
    }),
    [register, formState],
  );

  const registerSelect = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, options),
      defaultValue: get(formState.defaultValues, name),
    }),
    [register, formState],
  );

  const registerBoolean = useCallback(
    (name: Ec311FormName, options?: Ec311RegisterOptions) => ({
      ...register(name, options),
      defaultChecked: get(formState.defaultValues, name),
    }),
    [register, formState],
  );

  return {
    register,
    registerNumber,
    registerSelect,
    registerBoolean,
    formState,
    ...rest,
  };
};
