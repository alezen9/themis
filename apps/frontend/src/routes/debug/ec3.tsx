import { Suspense, lazy } from "react";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { verificationDebuggerEnabled } from "../../pages/ec3/ec3-debugger-env";

const LazyPageEc3Debugger = verificationDebuggerEnabled
  ? lazy(async () => {
      const module = await import("../../pages/debugger/PageEc3Debugger");
      return { default: module.PageEc3Debugger };
    })
  : null;

type DebugEc3Search = { session?: string };

export const Route = createFileRoute("/debug/ec3")({
  validateSearch: (search: Record<string, unknown>): DebugEc3Search => ({
    session: typeof search.session === "string" ? search.session : undefined,
  }),
  component: DebugEc3Route,
});

export function DebugEc3RouteContent({
  enabled = verificationDebuggerEnabled,
  session,
}: {
  enabled?: boolean;
  session?: string;
}) {
  if (!enabled || !LazyPageEc3Debugger) {
    return <Navigate replace to="/ec3" />;
  }

  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-gray-500">Loading EC3 debugger…</div>
      }
    >
      <LazyPageEc3Debugger initialSessionToken={session} />
    </Suspense>
  );
}

function DebugEc3Route() {
  const { session } = Route.useSearch();
  return <DebugEc3RouteContent session={session} />;
}
