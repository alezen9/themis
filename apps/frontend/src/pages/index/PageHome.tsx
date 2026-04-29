import { Link } from "@tanstack/react-router";
import { verificationDebuggerEnabled } from "../tbd-url/debug/ec3/ec3DebuggerEnv";

export function PageHome() {
  return (
    <div className="p-8">
      <nav className="mb-8 flex gap-4">
        <Link
          to="/eurocode/ec3-1-1/steel-members"
          className="underline hover:no-underline"
        >
          EC3 1
        </Link>
        <Link to="/ndg/editor" className="underline hover:no-underline">
          Editor
        </Link>
        {verificationDebuggerEnabled ? (
          <Link
            to="/tbd-url/debug/ec3"
            className="underline hover:no-underline"
          >
            EC3 Debugger
          </Link>
        ) : null}
      </nav>
      <h1 className="mb-4 text-2xl font-bold">EC3 Verifications</h1>
      <p className="max-w-2xl text-sm text-gray-600">
        Use the EC3 workbench to configure a steel section, set the relevant
        actions and buckling inputs, and inspect the verification results.
      </p>
    </div>
  );
}
