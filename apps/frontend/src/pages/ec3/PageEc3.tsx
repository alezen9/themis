import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Ec3Results } from "./Ec3Results";
import { Ec3WorkbenchForm } from "./Ec3WorkbenchForm";
import { encodeEc3DebugSession } from "./ec3-debug-session";
import { verificationDebuggerEnabled } from "./ec3-debugger-env";
import { FRONTEND_MAX_CHECK_ID, useEc3Workbench } from "./use-ec3-workbench";

export function PageEc3() {
  const workbench = useEc3Workbench();
  const debugSession = useMemo(
    () => encodeEc3DebugSession(workbench.sessionState),
    [workbench.sessionState],
  );

  return (
    <div className="max-w-6xl p-8">
      <nav className="mb-6 flex gap-4 text-sm">
        <Link to="/" className="underline hover:no-underline">
          Home
        </Link>
        {verificationDebuggerEnabled ? (
          <Link
            to="/debug/ec3"
            search={{ session: debugSession }}
            className="underline hover:no-underline"
          >
            EC3 Debugger
          </Link>
        ) : null}
      </nav>

      <h1 className="mb-6 text-2xl font-bold">EC3 Verifications</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <Ec3WorkbenchForm workbench={workbench} />

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">
              Results ({workbench.passedCount}/{workbench.totalCount} passed,{" "}
              {workbench.failedCount}/{workbench.totalCount} failed,{" "}
              {workbench.notApplicableCount}/{workbench.totalCount} N/A)
              <span className="ml-2 text-xs text-gray-500">
                checks 01-{String(FRONTEND_MAX_CHECK_ID).padStart(2, "0")}
              </span>
            </h2>

            {verificationDebuggerEnabled ? (
              <Link
                to="/debug/ec3"
                search={{ session: debugSession }}
                className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                Open in debugger
              </Link>
            ) : null}
          </div>

          <Ec3Results results={workbench.results} />
        </div>
      </div>
    </div>
  );
}
