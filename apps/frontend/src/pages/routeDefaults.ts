import type { RegisteredRouter, ToPathOption } from "@tanstack/react-router";

const defaultLandingRoute = "/eurocode/ec3-1-1/steel-members" as const;

export const DEFAULT_LANDING_ROUTE = defaultLandingRoute satisfies ToPathOption<
  RegisteredRouter,
  string,
  typeof defaultLandingRoute
>;
