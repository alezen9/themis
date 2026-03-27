import { Link } from "@tanstack/react-router";
import { verificationDebuggerEnabled } from "../../features/verifications/ec3/ec3-debugger-env";

export function PageHome() {
  return (
    <div className="p-8">
      <nav className="mb-8 flex gap-4">
        <Link to="/verifications/ec3" className="underline hover:no-underline">
          EC3 Verifications
        </Link>
        <Link to="/editor" className="underline hover:no-underline">
          Editor
        </Link>
        {verificationDebuggerEnabled ? (
          <Link to="/debug/ec3" className="underline hover:no-underline">
            EC3 Debugger
          </Link>
        ) : null}
        <Link to="/about" className="underline hover:no-underline">
          About Us
        </Link>
        <Link to="/design-system" className="underline hover:no-underline">
          Design System
        </Link>
      </nav>
      <h1 className="mb-4 text-2xl font-bold">EC3 Verifications</h1>
      <p className="max-w-2xl text-sm text-gray-600">
        Use the EC3 workbench to configure a steel section, set the relevant
        actions and buckling inputs, and inspect the verification results.
      </p>
    </div>
  );
}
