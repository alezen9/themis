import { useTypedFormContext } from "@components/inputs/useTypedFormContext";
import { Ec311FormValues } from "./schema/schema";

export const useEc311FormContext = () => useTypedFormContext<Ec311FormValues>();
