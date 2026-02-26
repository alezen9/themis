import type { VerificationRow } from "./use-ec3-evaluate";

interface Ec3ResultsProps {
  results: VerificationRow[];
}

export function Ec3Results({ results }: Ec3ResultsProps) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b text-left">
          <th className="py-1 pr-4">#</th>
          <th className="py-1 pr-4">Check</th>
          <th className="py-1 pr-4">Ratio</th>
          <th className="py-1 pr-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, i) => (
          <tr key={i} className="border-b">
            <td className="py-1 pr-4 tabular-nums">{i + 1}</td>
            <td className="py-1 pr-4">{r.name}</td>
            <td className="py-1 pr-4 tabular-nums">
              {r.error ? "ERR" : r.ratio.toFixed(2)}
            </td>
            <td className="py-1 pr-4">
              {r.error ? (
                <span className="text-red-600" title={r.error}>
                  Error
                </span>
              ) : r.passed ? (
                <span className="text-green-700">OK</span>
              ) : (
                <span className="text-red-600">FAIL</span>
              )}
            </td>
            <td className="py-1">
              <details className="inline">
                <summary className="cursor-pointer text-gray-500 text-xs">
                  cache
                </summary>
                <pre className="text-xs mt-1 bg-gray-50 p-2 rounded max-h-48 overflow-auto">
                  {JSON.stringify(r.cache, null, 2)}
                </pre>
              </details>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
