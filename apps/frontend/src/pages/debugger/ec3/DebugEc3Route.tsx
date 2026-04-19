import { getRouteApi } from "@tanstack/react-router";
import { DebugEc3RouteContent } from "./DebugEc3RouteContent";

const debugEc3RouteApi = getRouteApi("/debug/ec3");

export function DebugEc3Route() {
  const { session } = debugEc3RouteApi.useSearch();
  return <DebugEc3RouteContent session={session} />;
}
