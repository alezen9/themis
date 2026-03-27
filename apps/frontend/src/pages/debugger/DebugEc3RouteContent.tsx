import { Suspense, lazy } from "react";
import { Navigate } from "@tanstack/react-router";
import { verificationDebuggerEnabled } from "../../features/verifications/ec3/ec3DebuggerEnv";

const LazyPageEc3Debugger = verificationDebuggerEnabled
  ? lazy(async () => {
      const module = await import("./PageEc3Debugger");
      return { default: module.PageEc3Debugger };
    })
  : null;

export function DebugEc3RouteContent({
  enabled = verificationDebuggerEnabled,
  session,
}: {
  enabled?: boolean;
  session?: string;
}) {
  if (!enabled || !LazyPageEc3Debugger) {
    return <Navigate replace to="/verifications/ec3" />;
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
