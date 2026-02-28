import katex from "katex";
import "katex/dist/katex.min.css";
import { hasData, hasError, isNotApplicable } from "./use-ec3-evaluate";
import type { VerificationRow } from "./use-ec3-evaluate";
import type { TraceEntry } from "@ndg/ndg-ec3";

type Ec3ReportProps = {
  results: VerificationRow[];
  mode: "summary" | "verbose";
};

// -- Helpers --

const UNIT_MAP: Record<string, { unit: string; scale: number }> = {
  "N":    { unit: "kN",  scale: 1e-3 },
  "N\u00B7mm": { unit: "kNm", scale: 1e-6 },
  "mm\u00B2":  { unit: "cm\u00B2", scale: 1e-2 },
  "mm\u00B3":  { unit: "cm\u00B3", scale: 1e-3 },
  "mm\u2074":  { unit: "cm\u2074", scale: 1e-4 },
  "mm\u2076":  { unit: "cm\u2076", scale: 1e-6 },
};

const convertUnit = (value: number, unit?: string): { value: number; unit?: string } => {
  if (!unit) return { value, unit };
  const mapping = UNIT_MAP[unit];
  if (!mapping) return { value, unit };
  return { value: value * mapping.scale, unit: mapping.unit };
};

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

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-gray-500 mb-1.5 pl-2 border-l-2 border-gray-300">{children}</p>
);

const ErrorBlock = ({
  type,
  message,
  details,
  notApplicable,
}: {
  type?: string;
  message?: string;
  details?: Record<string, unknown>;
  notApplicable: boolean;
}) => {
  if (notApplicable) {
    return <div className="px-4 py-3 text-sm text-gray-600">N/A{message ? ` - ${message}` : ""}</div>;
  }
  return (
    <div className="px-4 py-3 text-sm text-red-700">
      <div className="rounded border border-red-200 bg-red-50 px-3 py-2 space-y-1">
        <p className="font-mono text-xs">{type ?? "EVALUATION_ERROR"}</p>
        <p>{message ?? "Unexpected evaluation error."}</p>
        {details && Object.keys(details).length > 0 && (
          <pre className="text-[11px] text-red-800/90 whitespace-pre-wrap break-words">
            {JSON.stringify(details, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// -- Verbose layout --

const VerboseVerification = ({ result }: { result: VerificationRow }) => {
  const data = result.payload.data;
  const failure = result.payload.error;
  const trace = data?.trace ?? [];
  const checkEntry = trace.find((t) => t.type === "check");
  const traceMap = buildTraceMap(trace);
  const checkMeta = checkEntry?.meta as Record<string, unknown> | undefined;

  // Separate inputs (user-input, coefficient, constant) from calculated (formula, derived)
  const inputs = trace.filter(
    (t) => t.type === "user-input" || t.type === "coefficient" || t.type === "constant",
  );
  const calculated = trace.filter(
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

  const headerBg = isNotApplicable(result)
    ? "bg-gray-50 border-gray-200"
    : hasError(result)
    ? "bg-red-50 border-red-200"
    : hasData(result) && result.payload.data.passed
      ? "bg-green-50 border-green-200"
      : "bg-red-50 border-red-200";

  const headerText = isNotApplicable(result)
    ? "text-gray-700"
    : hasError(result)
    ? "text-red-800"
    : hasData(result) && result.payload.data.passed
      ? "text-green-800"
      : "text-red-800";

  return (
    <div className="mb-6 border rounded-lg overflow-hidden">
      {/* Header: verdict + percentage + name + ref */}
      <div className={`px-4 py-2 flex items-center justify-between ${headerBg} border-b`}>
        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm ${headerText}`}>
            {isNotApplicable(result)
              ? "N/A"
              : hasError(result)
              ? "ERROR"
              : hasData(result) && result.payload.data.passed
              ? "PASS"
              : "FAIL"}
          </span>
          {hasData(result) && !isNotApplicable(result) && (
            <span className={`text-sm font-mono tabular-nums ${headerText}`}>
              {pct(result.payload.data.ratio)}
            </span>
          )}
          <span className="font-medium text-sm text-gray-800">{result.name}</span>
          <SectionRef meta={checkMeta} />
        </div>
      </div>

      {hasError(result) ? (
        <ErrorBlock
          type={failure?.type}
          message={failure?.message}
          details={failure?.details}
          notApplicable={isNotApplicable(result)}
        />
      ) : (
        <div className="px-4 py-3 space-y-4">
          {/* Verification rule */}
          {checkEntry?.verificationExpression && (
            <div>
              <SectionHeading>Verification rule</SectionHeading>
              <div className="bg-gray-50 rounded px-3 py-2 text-center">
                <Formula tex={checkEntry.verificationExpression} display />
                {typeof checkMeta?.formulaRef === "string" && (
                  <p className="text-xs text-gray-400 mt-1">{checkMeta.formulaRef}</p>
                )}
              </div>
            </div>
          )}

          {/* Parameters */}
          {relevantInputs.length > 0 && (
            <div>
              <SectionHeading>Parameters</SectionHeading>
              <div className="bg-gray-50 rounded px-3 py-1.5">
                <div className="grid grid-cols-[minmax(90px,auto)_1fr_auto] gap-x-4 py-0.5 border-b border-gray-200 mb-1">
                  <span className="text-xs text-gray-400">Symbol</span>
                  <span className="text-xs text-gray-400">Description</span>
                  <span className="text-xs text-gray-400 text-right">Value</span>
                </div>
                {relevantInputs.map((entry) => {
                  const { value: dv, unit: du } = convertUnit(entry.value as number, entry.unit);
                  return (
                    <div key={entry.key} className="grid grid-cols-[minmax(90px,auto)_1fr_auto] gap-x-4 py-0.5 items-baseline">
                      <span className="text-sm">
                        {entry.symbol ? <Formula tex={entry.symbol} /> : <code className="text-xs">{entry.key}</code>}
                      </span>
                      <span className="text-xs text-gray-400">{entry.description}</span>
                      <span className="font-mono text-xs tabular-nums text-right">
                        {formatValue(dv)}
                        {du && <span className="text-gray-400 ml-1">{du}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calculations */}
          {calculated.length > 0 && (
            <div>
              <SectionHeading>Calculations</SectionHeading>
              <div className="bg-gray-50 rounded px-3 py-1.5">
                {calculated.map((entry) => {
                  const meta = entry.meta as Record<string, unknown> | undefined;
                  const { value: dv, unit: du } = convertUnit(entry.value as number, entry.unit);
                  return (
                    <div key={entry.key} className="py-1.5 border-b border-gray-100 last:border-b-0">
                      <div className="grid grid-cols-[minmax(90px,auto)_1fr_auto_auto] gap-x-4 items-baseline">
                        <span className="text-sm">
                          {entry.symbol ? <Formula tex={entry.symbol} /> : <code className="text-xs">{entry.key}</code>}
                        </span>
                        <span className="text-xs text-gray-400">{entry.description}</span>
                        <span className="font-mono text-xs tabular-nums font-medium text-right">
                          {formatValue(dv)}
                          {du && <span className="text-gray-400 ml-1">{du}</span>}
                        </span>
                        {typeof meta?.formulaRef === "string" && (
                          <span className="text-gray-300 text-xs">{meta.formulaRef}</span>
                        )}
                      </div>
                      {entry.expression && (
                        <div className="ml-[94px] mt-1 space-y-0.5">
                          <div className="text-sm">
                            <Formula tex={`= ${entry.expression}`} />
                          </div>
                          {entry.evaluatorInputs && Object.keys(entry.evaluatorInputs).length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
                              <span className="text-xs text-gray-300 italic">where</span>
                              {Object.entries(entry.evaluatorInputs).map(([k, v]) => {
                                const sub = traceMap.get(k);
                                const { value: sdv, unit: sdu } = convertUnit(
                                  typeof v === "number" ? v : 0,
                                  sub?.unit,
                                );
                                return (
                                  <span key={k} className="text-xs text-gray-400 font-mono">
                                    {sub?.symbol ? <Formula tex={sub.symbol} /> : k}
                                    {"\u00A0=\u00A0"}
                                    {typeof v === "number" ? formatValue(sdv) : v}
                                    {typeof v === "number" && sdu && <span className="ml-0.5">{sdu}</span>}
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

          {/* Utilization ratio */}
          <div>
            <SectionHeading>Utilization ratio</SectionHeading>
            <div className="bg-gray-50 rounded px-3 py-2 space-y-1.5">
              {checkEntry?.evaluatorInputs && Object.keys(checkEntry.evaluatorInputs).length > 0 && (
                <div className="flex flex-wrap gap-x-6 gap-y-0.5 pb-1.5 border-b border-gray-200">
                  {Object.entries(checkEntry.evaluatorInputs).map(([k, v]) => {
                    const sub = traceMap.get(k);
                    const { value: sdv, unit: sdu } = convertUnit(
                      typeof v === "number" ? v : 0,
                      sub?.unit,
                    );
                    return (
                      <span key={k} className="text-xs font-mono tabular-nums">
                        <span className="text-gray-500">
                          {sub?.symbol ? <Formula tex={sub.symbol} /> : k}
                        </span>
                        {" = "}
                        <span className="font-medium">
                          {typeof v === "number" ? formatValue(sdv) : v}
                        </span>
                        {typeof v === "number" && sdu && (
                          <span className="text-gray-400 ml-0.5">{sdu}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
              <p className="font-mono text-sm">
                <span className="text-gray-500">ratio</span>
                {" = "}
                <span className="font-medium">{data?.ratio.toFixed(4)}</span>
                {" "}
                <span className={data?.passed ? "text-green-700" : "text-red-600"}>
                  {data?.passed ? "\u2264" : ">"} 1.0
                </span>
                {"  "}
                <span className={`font-semibold ${data?.passed ? "text-green-700" : "text-red-600"}`}>
                  {data?.passed ? "\u2713 PASS" : "\u2717 FAIL"}
                </span>
                <span className="text-gray-400 ml-2">{data ? `(${pct(data.ratio)})` : ""}</span>
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
  const data = result.payload.data;
  const failure = result.payload.error;
  const trace = data?.trace ?? [];
  const checkEntry = trace.find((t) => t.type === "check");
  const traceMap = buildTraceMap(trace);

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

  const relevantInputs = trace.filter(
    (t) =>
      checkInputKeys.has(t.key) &&
      (t.type === "user-input" || t.type === "coefficient" || t.type === "constant"),
  );
  const relevantCalculated = trace.filter(
    (t) => checkInputKeys.has(t.key) && (t.type === "formula" || t.type === "derived"),
  );
  const formulaResults = relevantCalculated.filter((t) => t.type === "formula");
  const derivedResults = relevantCalculated.filter((t) => t.type === "derived");

  const displayedInputs = relevantInputs.slice(0, 6);
  const displayedFormulas = formulaResults.slice(0, 8);
  const displayedDerived = derivedResults.slice(0, 6);

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
          isNotApplicable(result)
            ? "bg-gray-100 text-gray-700"
            : hasError(result)
            ? "bg-red-100 text-red-800"
            : hasData(result) && result.payload.data.passed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
        }`}>
          {isNotApplicable(result)
            ? "N/A"
            : hasError(result)
              ? "ERROR"
              : hasData(result)
              ? `${result.payload.data.passed ? "PASS" : "FAIL"} ${pct(result.payload.data.ratio)}`
              : "ERROR"}
        </span>
      </div>

      {hasError(result) ? (
        <div className="mt-2">
          <ErrorBlock
            type={failure?.type}
            message={failure?.message}
            details={failure?.details}
            notApplicable={isNotApplicable(result)}
          />
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {checkEntry?.verificationExpression && (
            <div className="bg-gray-50 rounded px-2 py-1.5">
              <p className="text-[11px] text-gray-400 mb-1">Verification rule</p>
              <div className="text-sm text-center">
                <Formula tex={checkEntry.verificationExpression} display />
              </div>
            </div>
          )}

          {checkEntry?.evaluatorInputs && Object.keys(checkEntry.evaluatorInputs).length > 0 && (
            <div className="bg-gray-50 rounded px-2 py-1.5">
              <p className="text-[11px] text-gray-400 mb-1">Check terms</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                {Object.entries(checkEntry.evaluatorInputs).map(([k, v]) => {
                  const entry = traceMap.get(k);
                  const numericValue = typeof v === "number" ? v : 0;
                  const { value: dv, unit: du } = convertUnit(numericValue, entry?.unit);
                  return (
                    <span key={k} className="text-gray-600">
                      {entry?.symbol ? <Formula tex={entry.symbol} /> : k}
                      {" = "}
                      {typeof v === "number" ? formatValue(dv) : v}
                      {typeof v === "number" && du && <span className="text-gray-400 ml-0.5">{du}</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {(displayedFormulas.length > 0 || displayedDerived.length > 0 || displayedInputs.length > 0) && (
            <div className="bg-gray-50 rounded px-2 py-1.5 space-y-1.5">
              {displayedInputs.length > 0 && (
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">Key inputs</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                    {displayedInputs.map((entry) => {
                      const { value: dv, unit: du } = convertUnit(entry.value as number, entry.unit);
                      return (
                        <span key={entry.nodeId} className="text-gray-600">
                          {entry.symbol ? <Formula tex={entry.symbol} /> : entry.key}
                          {" = "}
                          {formatValue(dv)}
                          {du && <span className="text-gray-400 ml-0.5">{du}</span>}
                        </span>
                      );
                    })}
                    {relevantInputs.length > displayedInputs.length && (
                      <span className="text-gray-400">
                        +{relevantInputs.length - displayedInputs.length} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {displayedFormulas.length > 0 && (
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">Formula results</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                    {displayedFormulas.map((entry) => {
                      const { value: dv, unit: du } = convertUnit(entry.value as number, entry.unit);
                      return (
                        <span key={entry.nodeId} className="text-gray-600">
                          {entry.symbol ? <Formula tex={entry.symbol} /> : entry.key}
                          {" = "}
                          {formatValue(dv)}
                          {du && <span className="text-gray-400 ml-0.5">{du}</span>}
                        </span>
                      );
                    })}
                    {formulaResults.length > displayedFormulas.length && (
                      <span className="text-gray-400">
                        +{formulaResults.length - displayedFormulas.length} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {displayedDerived.length > 0 && (
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5">Derived/support values</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                    {displayedDerived.map((entry) => {
                      const { value: dv, unit: du } = convertUnit(entry.value as number, entry.unit);
                      return (
                        <span key={entry.nodeId} className="text-gray-600">
                          {entry.symbol ? <Formula tex={entry.symbol} /> : entry.key}
                          {" = "}
                          {formatValue(dv)}
                          {du && <span className="text-gray-400 ml-0.5">{du}</span>}
                        </span>
                      );
                    })}
                    {derivedResults.length > displayedDerived.length && (
                      <span className="text-gray-400">
                        +{derivedResults.length - displayedDerived.length} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// -- Main report --

export const Ec3Report = ({ results, mode }: Ec3ReportProps) => {
  const passed = results.filter((r) => hasData(r) && r.payload.data.passed).length;
  const notApplicable = results.filter((r) => isNotApplicable(r)).length;
  const failed = results.filter((r) => hasData(r) && !r.payload.data.passed).length;
  const errors = results.filter((r) => hasError(r) && !isNotApplicable(r)).length;

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
          {notApplicable > 0 && <span className="text-gray-600">{notApplicable} n/a</span>}
          <span className="text-gray-400">{results.length} total</span>
        </div>
      </div>

      {mode === "verbose"
        ? results.map((r) => <VerboseVerification key={r.name} result={r} />)
        : results.map((r, i) => <SummaryVerification key={r.name} result={r} index={i} />)}
    </div>
  );
};
