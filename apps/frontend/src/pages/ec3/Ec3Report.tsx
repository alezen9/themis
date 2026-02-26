import type { VerificationRow } from "./use-ec3-evaluate";
import type { TraceEntry } from "@ndg/ndg-ec3";

interface Ec3ReportProps {
  results: VerificationRow[];
  mode: "summary" | "verbose";
}

function formatValue(value: number | string, unit?: string): string {
  if (typeof value === "string") return value;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)} x10\u2076`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(2)} x10\u00B3`;
  return value.toFixed(4);
}

function StatusBadge({ passed, ratio, error }: { passed: boolean; ratio: number; error?: string }) {
  if (error) {
    return <span className="inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-800">ERROR</span>;
  }
  return passed ? (
    <span className="inline-block px-2 py-0.5 text-xs rounded bg-green-100 text-green-800">
      OK ({ratio.toFixed(3)})
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-800">
      FAIL ({ratio.toFixed(3)})
    </span>
  );
}

function SectionRef({ meta }: { meta?: Record<string, unknown> }) {
  if (!meta) return null;
  const parts: string[] = [];
  if (meta.sectionRef) parts.push(`\u00A7${meta.sectionRef}`);
  if (meta.formulaRef) parts.push(meta.formulaRef as string);
  if (meta.verificationRef) parts.push(meta.verificationRef as string);
  if (parts.length === 0) return null;
  return <span className="text-gray-400 text-xs ml-1">[{parts.join(" ")}]</span>;
}

function TraceRow({ entry }: { entry: TraceEntry }) {
  const isComputed = entry.type === "formula" || entry.type === "derived" || entry.type === "check";
  return (
    <tr className="border-b border-gray-100">
      <td className="py-1 pr-3 text-xs text-gray-400">{entry.type}</td>
      <td className="py-1 pr-3 font-mono text-xs">
        {entry.symbol || entry.key}
        <SectionRef meta={entry.meta as Record<string, unknown> | undefined} />
      </td>
      <td className="py-1 pr-3 text-xs text-gray-600">{entry.description}</td>
      <td className="py-1 pr-3 font-mono text-xs tabular-nums">
        {formatValue(entry.value, entry.unit)}
        {entry.unit && <span className="text-gray-400 ml-1">{entry.unit}</span>}
      </td>
      {isComputed && entry.expression && (
        <td className="py-1 text-xs text-gray-400 font-mono">{entry.expression}</td>
      )}
    </tr>
  );
}

function VerboseVerification({ result }: { result: VerificationRow }) {
  const checkEntry = result.trace.find((t) => t.type === "check");
  return (
    <div className="mb-6 border rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{result.name}</h3>
        <StatusBadge passed={result.passed} ratio={result.ratio} error={result.error} />
      </div>

      {result.error ? (
        <p className="text-sm text-red-600">{result.error}</p>
      ) : (
        <>
          {checkEntry?.expression && (
            <p className="text-xs text-gray-500 mb-2 font-mono">
              {checkEntry.expression}
            </p>
          )}

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left text-xs text-gray-500">
                <th className="py-1 pr-3">Type</th>
                <th className="py-1 pr-3">Symbol</th>
                <th className="py-1 pr-3">Description</th>
                <th className="py-1 pr-3">Value</th>
                <th className="py-1">Expression</th>
              </tr>
            </thead>
            <tbody>
              {result.trace.map((entry) => (
                <TraceRow key={entry.nodeId} entry={entry} />
              ))}
            </tbody>
          </table>

          {checkEntry?.evaluatorInputs && (
            <div className="mt-2 text-xs text-gray-400">
              <span className="font-semibold">Check inputs: </span>
              {Object.entries(checkEntry.evaluatorInputs).map(([k, v]) => (
                <span key={k} className="mr-3">
                  {k}={typeof v === "number" ? v.toFixed(4) : v}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryVerification({ result, index }: { result: VerificationRow; index: number }) {
  const checkEntry = result.trace.find((t) => t.type === "check");
  // Show key intermediate values (formulas only)
  const formulas = result.trace.filter((t) => t.type === "formula");

  return (
    <div className="mb-3 border rounded p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">
          <span className="text-gray-400 mr-2">#{index + 1}</span>
          <span className="font-medium">{result.name}</span>
          {checkEntry && <SectionRef meta={checkEntry.meta as Record<string, unknown> | undefined} />}
        </span>
        <StatusBadge passed={result.passed} ratio={result.ratio} error={result.error} />
      </div>

      {!result.error && formulas.length > 0 && (
        <div className="mt-1 text-xs text-gray-500 font-mono flex flex-wrap gap-x-4">
          {formulas.map((f) => (
            <span key={f.nodeId}>
              {f.symbol || f.key} = {formatValue(f.value, f.unit)}
              {f.unit && <span className="text-gray-300 ml-0.5">{f.unit}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Ec3Report({ results, mode }: Ec3ReportProps) {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed && !r.error).length;
  const errors = results.filter((r) => r.error).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 p-3 border rounded bg-gray-50">
        <h2 className="font-bold text-lg mb-1">
          EC3 Verification Report
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({mode})
          </span>
        </h2>
        <div className="text-sm flex gap-4">
          <span className="text-green-700">{passed} passed</span>
          {failed > 0 && <span className="text-red-600">{failed} failed</span>}
          {errors > 0 && <span className="text-red-600">{errors} errors</span>}
          <span className="text-gray-400">{results.length} total</span>
        </div>
      </div>

      {/* Verifications */}
      {mode === "verbose"
        ? results.map((r) => (
            <VerboseVerification key={r.name} result={r} />
          ))
        : results.map((r, i) => (
            <SummaryVerification key={r.name} result={r} index={i} />
          ))}
    </div>
  );
}
