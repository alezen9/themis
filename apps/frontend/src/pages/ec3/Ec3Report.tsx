import katex from "katex";
import "katex/dist/katex.min.css";
import type { VerificationRow } from "./use-ec3-evaluate";
import type { TraceEntry } from "@ndg/ndg-ec3";

type Ec3ReportProps = {
  results: VerificationRow[];
  mode: "summary" | "verbose";
};

// -- Helpers --

const formatValue = (value: number | string) => {
  if (typeof value === "string") return value;
  return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
};

const pct = (ratio: number) => `${(ratio * 100).toFixed(1)}%`;

const buildTraceMap = (trace: TraceEntry[]) => {
  const map = new Map<string, TraceEntry>();
  for (const entry of trace) map.set(entry.key, entry);
  return map;
};

const Formula = ({ tex, display = false }: { tex: string; display?: boolean }) => {
  try {
    const html = katex.renderToString(tex, { throwOnError: false, displayMode: display });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <code className="text-xs text-red-500">{tex}</code>;
  }
};

const SectionRef = ({ meta }: { meta?: Record<string, unknown> }) => {
  if (!meta) return null;
  const parts: string[] = [];
  if (meta.sectionRef) parts.push(`EC3 \u00A7${meta.sectionRef}`);
  if (meta.verificationRef) parts.push(meta.verificationRef as string);
  if (parts.length === 0) return null;
  return <span className="text-gray-400 text-xs">[{parts.join(" ")}]</span>;
};

// -- Verbose layout --

const VerboseVerification = ({ result }: { result: VerificationRow }) => {
  const checkEntry = result.trace.find((t) => t.type === "check");
  const traceMap = buildTraceMap(result.trace);
  const checkMeta = checkEntry?.meta as Record<string, unknown> | undefined;

  // Separate inputs (user-input, coefficient, constant) from calculated (formula, derived)
  const inputs = result.trace.filter(
    (t) => t.type === "user-input" || t.type === "coefficient" || t.type === "constant",
  );
  const calculated = result.trace.filter(
    (t) => t.type === "formula" || t.type === "derived",
  );

  // Only show inputs that the check node actually depends on (direct or indirect)
  const checkInputKeys = new Set<string>();
  if (checkEntry?.evaluatorInputs) {
    const queue = Object.keys(checkEntry.evaluatorInputs);
    while (queue.length > 0) {
      const key = queue.pop()!;
      if (checkInputKeys.has(key)) continue;
      checkInputKeys.add(key);
      const entry = traceMap.get(key);
      if (entry?.evaluatorInputs) {
        queue.push(...Object.keys(entry.evaluatorInputs));
      }
    }
  }
  const relevantInputs = inputs.filter((t) => checkInputKeys.has(t.key));

  const headerBg = result.error
    ? "bg-red-50 border-red-200"
    : result.passed
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";

  const headerText = result.error
    ? "text-red-800"
    : result.passed
      ? "text-green-800"
      : "text-red-800";

  return (
    <div className="mb-6 border rounded-lg overflow-hidden">
      {/* Header: verdict + percentage + name + ref */}
      <div className={`px-4 py-2 flex items-center justify-between ${headerBg} border-b`}>
        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm ${headerText}`}>
            {result.error ? "ERROR" : result.passed ? "PASS" : "FAIL"}
          </span>
          {!result.error && (
            <span className={`text-sm font-mono tabular-nums ${headerText}`}>
              {pct(result.ratio)}
            </span>
          )}
          <span className="font-medium text-sm text-gray-800">{result.name}</span>
          <SectionRef meta={checkMeta} />
        </div>
      </div>

      {result.error ? (
        <div className="px-4 py-3 text-sm text-red-600">{result.error}</div>
      ) : (
        <div className="px-4 py-3 space-y-4">
          {/* Rule */}
          {checkEntry?.verificationExpression && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Rule</p>
              <div className="bg-gray-50 rounded px-3 py-2 text-center">
                <Formula tex={checkEntry.verificationExpression} display />
              </div>
            </div>
          )}

          {/* Given (inputs) */}
          {relevantInputs.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Given</p>
              <div className="bg-gray-50 rounded px-3 py-1.5">
                {relevantInputs.map((entry) => (
                  <div key={entry.key} className="flex items-baseline gap-2 py-0.5">
                    <span className="min-w-[100px] text-sm">
                      {entry.symbol ? <Formula tex={entry.symbol} /> : <code className="text-xs">{entry.key}</code>}
                    </span>
                    <span className="text-xs text-gray-400 flex-1">{entry.description}</span>
                    <span className="font-mono text-xs tabular-nums">
                      {formatValue(entry.value)}
                      {entry.unit && <span className="text-gray-400 ml-1">{entry.unit}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculated (formulas + derived) */}
          {calculated.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Calculated</p>
              <div className="bg-gray-50 rounded px-3 py-1.5">
                {calculated.map((entry) => {
                  const meta = entry.meta as Record<string, unknown> | undefined;
                  return (
                    <div key={entry.key} className="py-1 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-baseline gap-2">
                        <span className="min-w-[100px] text-sm">
                          {entry.symbol ? <Formula tex={entry.symbol} /> : <code className="text-xs">{entry.key}</code>}
                        </span>
                        <span className="text-xs text-gray-400 flex-1">{entry.description}</span>
                        <span className="font-mono text-xs tabular-nums font-medium">
                          {formatValue(entry.value)}
                          {entry.unit && <span className="text-gray-400 ml-1">{entry.unit}</span>}
                        </span>
                        {typeof meta?.formulaRef === "string" && (
                          <span className="text-gray-300 text-xs">{meta.formulaRef}</span>
                        )}
                      </div>
                      {entry.expression && (
                        <div className="ml-[100px] mt-0.5">
                          <Formula tex={`= ${entry.expression}`} />
                          {entry.evaluatorInputs && Object.keys(entry.evaluatorInputs).length > 0 && (
                            <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
                              {Object.entries(entry.evaluatorInputs).map(([k, v]) => {
                                const sub = traceMap.get(k);
                                return (
                                  <span key={k} className="text-xs text-gray-400 font-mono">
                                    {sub?.symbol ? <Formula tex={sub.symbol} /> : k} = {typeof v === "number" ? formatValue(v) : v}
                                    {sub?.unit && <span className="ml-0.5">{sub.unit}</span>}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Result</p>
            <div className="bg-gray-50 rounded px-3 py-2">
              <p className="font-mono text-sm">
                <span className="text-gray-500">ratio</span>
                {" = "}
                <span className="font-medium">{result.ratio.toFixed(4)}</span>
                {" "}
                <span className={result.passed ? "text-green-700" : "text-red-600"}>
                  {result.passed ? "\u2264" : ">"} 1.0
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Utilization: {pct(result.ratio)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -- Summary layout --

const SummaryVerification = ({ result, index }: { result: VerificationRow; index: number }) => {
  const checkEntry = result.trace.find((t) => t.type === "check");
  const formulas = result.trace.filter((t) => t.type === "formula");

  return (
    <div className="mb-3 border rounded p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">
          <span className="text-gray-400 mr-2">#{index + 1}</span>
          <span className="font-medium">{result.name}</span>
          {checkEntry && (
            <span className="ml-2">
              <SectionRef meta={checkEntry.meta as Record<string, unknown> | undefined} />
            </span>
          )}
        </span>
        <span className={`text-xs font-mono tabular-nums px-2 py-0.5 rounded ${
          result.error
            ? "bg-red-100 text-red-800"
            : result.passed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
        }`}>
          {result.error ? "ERROR" : `${result.passed ? "PASS" : "FAIL"} ${pct(result.ratio)}`}
        </span>
      </div>

      {!result.error && formulas.length > 0 && (
        <div className="mt-1 text-xs text-gray-500 font-mono flex flex-wrap gap-x-4">
          {formulas.map((f) => (
            <span key={f.nodeId}>
              {f.symbol ? <Formula tex={f.symbol} /> : f.key} = {formatValue(f.value)}
              {f.unit && <span className="text-gray-300 ml-0.5">{f.unit}</span>}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// -- Main report --

export const Ec3Report = ({ results, mode }: Ec3ReportProps) => {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed && !r.error).length;
  const errors = results.filter((r) => r.error).length;

  return (
    <div>
      <div className="mb-4 p-3 border rounded bg-gray-50">
        <h2 className="font-bold text-lg mb-1">
          EC3 Verification Report
          <span className="text-sm font-normal text-gray-500 ml-2">({mode})</span>
        </h2>
        <div className="text-sm flex gap-4">
          <span className="text-green-700">{passed} passed</span>
          {failed > 0 && <span className="text-red-600">{failed} failed</span>}
          {errors > 0 && <span className="text-red-600">{errors} errors</span>}
          <span className="text-gray-400">{results.length} total</span>
        </div>
      </div>

      {mode === "verbose"
        ? results.map((r) => <VerboseVerification key={r.name} result={r} />)
        : results.map((r, i) => <SummaryVerification key={r.name} result={r} index={i} />)}
    </div>
  );
};
