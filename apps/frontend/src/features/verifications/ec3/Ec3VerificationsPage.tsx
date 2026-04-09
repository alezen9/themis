import { Link } from "@tanstack/react-router";
import { Ec3VerificationForm } from "./components/ec3VerificationForm/Ec3VerificationForm";
import { verificationDebuggerEnabled } from "./ec3DebuggerEnv";

export function Ec3VerificationsPage() {
  return (
    <div className="max-w-3xl p-8">
      <nav className="mb-6 flex gap-4 text-sm">
        <Link to="/" className="underline hover:no-underline">
          Home
        </Link>
        {verificationDebuggerEnabled && (
          <Link to="/debug/ec3" className="underline hover:no-underline">
            EC3 Debugger
          </Link>
        )}
      </nav>

      <h1 className="mb-6 text-2xl font-bold">EC3 Verifications</h1>
      {verificationDebuggerEnabled && (
        <div className="mb-6">
          <Link
            to="/debug/ec3"
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            Open in debugger
          </Link>
        </div>
      )}
      <Ec3VerificationForm />
    </div>
  );
}
