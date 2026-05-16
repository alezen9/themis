import { z } from "zod";

export const REQUIRED_NUMBER_MESSAGE = "Value is required";
export const REQUIRED_STRING_MESSAGE = "Value is required";
export const POSITIVE_NUMBER_MESSAGE = "Value has to be positive";
export const NON_NEGATIVE_NUMBER_MESSAGE = "Value cannot be negative";
export const MIN_MINUS_ONE_MESSAGE = "Value has to be greater than -1";
export const MAX_ONE_MESSAGE = "Value has to be smaller than 1";
export const MAX_VALUE_MESSAGE = "Value too large, safety cap";

export const inactiveFieldSchema = z.unknown().optional();
