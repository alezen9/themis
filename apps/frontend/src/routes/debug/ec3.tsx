import { createFileRoute } from "@tanstack/react-router";
import { DebugEc3Route } from "../../pages/debugger/DebugEc3Route";

type DebugEc3Search = { session?: string };

export const Route = createFileRoute("/debug/ec3")({
  validateSearch: (search: Record<string, unknown>): DebugEc3Search => ({
    session: typeof search.session === "string" ? search.session : undefined,
  }),
  component: DebugEc3Route,
});
