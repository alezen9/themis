import { createFileRoute } from "@tanstack/react-router";
import { useVerifications } from "../hooks/use-verifications";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const results = useVerifications("ec3");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">EC3 Verifications</h1>
      {results.map((result, i) => (
        <div key={i} className="mb-6">
          {result.isPending && <p className="text-gray-500">Loading…</p>}
          {result.isError && (
            <p className="text-red-500">
              Error: {(result.error as Error).message}
            </p>
          )}
          {result.isSuccess && (
            <pre className="bg-gray-100 rounded p-4 text-sm overflow-auto">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
}
