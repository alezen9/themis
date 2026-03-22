import { useEffect, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { hasData, hasError, isNotApplicable } from "./use-ec3-evaluate";
import type { VerificationRow } from "./use-ec3-evaluate";

type Ec3ReportProps = {
  results: VerificationRow[];
  mode: "summary" | "verbose";
};

type TraceEntry = NonNullable<
  NonNullable<VerificationRow["payload"]["data"]>["trace"]
>[number];

// -- Helpers --

const UNIT_MAP: Record<string, { unit: string; scale: number }> = {
  N: { unit: "\\mathrm{kN}", scale: 1e-3 },
  "\\mathrm{N}": { unit: "\\mathrm{kN}", scale: 1e-3 },
  "N\u00B7mm": { unit: "\\mathrm{kN\\cdot m}", scale: 1e-6 },
  "\\mathrm{N\\cdot mm}": { unit: "\\mathrm{kN\\cdot m}", scale: 1e-6 },
  "mm\u00B2": { unit: "\\mathrm{cm^{2}}", scale: 1e-2 },
  "\\mathrm{mm^{2}}": { unit: "\\mathrm{cm^{2}}", scale: 1e-2 },
  "mm\u00B3": { unit: "\\mathrm{cm^{3}}", scale: 1e-3 },
  "\\mathrm{mm^{3}}": { unit: "\\mathrm{cm^{3}}", scale: 1e-3 },
  "mm\u2074": { unit: "\\mathrm{cm^{4}}", scale: 1e-4 },
  "\\mathrm{mm^{4}}": { unit: "\\mathrm{cm^{4}}", scale: 1e-4 },
  "mm\u2076": { unit: "\\mathrm{cm^{6}}", scale: 1e-6 },
  "\\mathrm{mm^{6}}": { unit: "\\mathrm{cm^{6}}", scale: 1e-6 },
};

const convertUnit = (
  value: number,
  unit?: string,
): { value: number; unit?: string } => {
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

const Formula = ({
  tex,
  display = false,
}: {
  tex: string;
  display?: boolean;
}) => {
  try {
    const html = katex.renderToString(tex, {
      throwOnError: false,
      displayMode: display,
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <code className="text-xs text-red-500">{tex}</code>;
  }
};

const Unit = ({ unit }: { unit: string }) => (
  <span className="text-gray-400 ml-1">
    <Formula tex={unit} />
  </span>
);

const SectionRef = ({ meta }: { meta?: Record<string, unknown> }) => {
  if (!meta) return null;
  const parts: string[] = [];
  if (meta.sectionRef) parts.push(`EC3 \u00A7${meta.sectionRef}`);
  if (meta.verificationRef) parts.push(meta.verificationRef as string);
  if (parts.length === 0) return null;
  return <span className="text-gray-400 text-xs">[{parts.join(" ")}]</span>;
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs text-gray-500 mb-1.5 pl-2 border-l-2 border-gray-300">
    {children}
  </p>
);

type VerificationTone = "neutral" | "success" | "error";

const VERIFICATION_TONE_STYLES: Record<
  VerificationTone,
  { background: string; border: string; pill: string; text: string }
> = {
  neutral: {
    background: "bg-gray-50",
    border: "border-gray-200",
    pill: "border-gray-200 bg-gray-100 text-gray-700",
    text: "text-gray-700",
  },
  success: {
    background: "bg-green-50",
    border: "border-green-200",
    pill: "border-green-200 bg-green-100 text-green-800",
    text: "text-green-800",
  },
  error: {
    background: "bg-red-50",
    border: "border-red-200",
    pill: "border-red-200 bg-red-100 text-red-800",
    text: "text-red-800",
  },
};

const getVerificationStatus = (result: VerificationRow) => {
  if (isNotApplicable(result)) {
    return {
      label: "N/A",
      badge: "N/A",
      tone: "neutral" as const,
      ratioText: null,
    };
  }

  if (hasError(result)) {
    return {
      label: "ERROR",
      badge: "ERROR",
      tone: "error" as const,
      ratioText: null,
    };
  }

  if (hasData(result) && result.payload.data.passed) {
    const ratioText = pct(result.payload.data.ratio);
    return {
      label: "PASS",
      badge: `PASS ${ratioText}`,
      tone: "success" as const,
      ratioText,
    };
  }

  if (hasData(result)) {
    const ratioText = pct(result.payload.data.ratio);
    return {
      label: "FAIL",
      badge: `FAIL ${ratioText}`,
      tone: "error" as const,
      ratioText,
    };
  }

  return {
    label: "ERROR",
    badge: "ERROR",
    tone: "error" as const,
    ratioText: null,
  };
};

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
    return (
      <div className="px-4 py-3 text-sm text-gray-600">
        N/A{message ? ` - ${message}` : ""}
      </div>
    );
  }
  return (
    <div className="px-4 py-3 text-sm text-red-700">
      <div className="rounded border border-red-200 bg-red-50 px-3 py-2 space-y-1">
        <p className="font-mono text-xs">{type ?? "evaluation-error"}</p>
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

const VerboseVerification = ({
  result,
  index,
  isOpen,
  onToggle,
}: {
  result: VerificationRow;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const data = result.payload.data;
  const failure = result.payload.error;
  const trace = data?.trace ?? [];
  const checkEntry = trace.find((t) => t.type === "check");
  const traceMap = buildTraceMap(trace);
  const checkMeta = checkEntry?.meta as Record<string, unknown> | undefined;
  const status = getVerificationStatus(result);
  const tone = VERIFICATION_TONE_STYLES[status.tone];

  // Separate inputs (user-input, coefficient, constant) from calculated (formula, derived)
  const inputs = trace.filter(
    (t) =>
      t.type === "user-input" ||
      t.type === "coefficient" ||
      t.type === "constant",
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
  const expandedContent = hasError(result) ? (
    <div className="border-t border-black/5 bg-white">
      <ErrorBlock
        type={failure?.type}
        message={failure?.message}
        details={failure?.details}
        notApplicable={isNotApplicable(result)}
      />
    </div>
  ) : (
    <div className="space-y-4 border-t border-black/5 bg-white px-4 py-3">
      {/* Verification rule */}
      {checkEntry?.verificationExpression && (
        <div>
          <SectionHeading>Verification rule</SectionHeading>
          <div className="bg-gray-50 rounded px-3 py-2 text-center">
            <Formula tex={checkEntry.verificationExpression} display />
            {typeof checkMeta?.formulaRef === "string" && (
              <p className="text-xs text-gray-400 mt-1">
                {checkMeta.formulaRef}
              </p>
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
              const { value: dv, unit: du } = convertUnit(
                entry.value as number,
                entry.unit,
              );
              return (
                <div
                  key={entry.key}
                  className="grid grid-cols-[minmax(90px,auto)_1fr_auto] gap-x-4 py-0.5 items-baseline"
                >
                  <span className="text-sm">
                    {entry.symbol ? (
                      <Formula tex={entry.symbol} />
                    ) : (
                      <code className="text-xs">{entry.key}</code>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">
                    {entry.description}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-right">
                    {formatValue(dv)}
                    {du && <Unit unit={du} />}
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
              const selectedChild =
                entry.type === "derived" &&
                !entry.expression &&
                entry.children.length === 1
                  ? traceMap.get(entry.children[0])
                  : undefined;
              const displayExpression = entry.expression;
              const { value: dv, unit: du } = convertUnit(
                entry.value as number,
                entry.unit,
              );
              return (
                <div
                  key={entry.key}
                  className="py-1.5 border-b border-gray-100 last:border-b-0"
                >
                  <div className="grid grid-cols-[minmax(90px,auto)_1fr_auto_auto] gap-x-4 items-baseline">
                    <span className="text-sm">
                      {entry.symbol ? (
                        <Formula tex={entry.symbol} />
                      ) : (
                        <code className="text-xs">{entry.key}</code>
                      )}
                    </span>
                    <span className="text-xs text-gray-400">
                      {entry.description}
                    </span>
                    <span className="font-mono text-xs tabular-nums font-medium text-right">
                      {formatValue(dv)}
                      {du && <Unit unit={du} />}
                    </span>
                    {typeof meta?.formulaRef === "string" && (
                      <span className="text-gray-300 text-xs">
                        {meta.formulaRef}
                      </span>
                    )}
                  </div>
                  {(displayExpression || selectedChild) && (
                    <div className="ml-[94px] mt-1 space-y-0.5">
                      {selectedChild && (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <span>=&gt;</span>
                          {selectedChild.symbol ? (
                            <Formula tex={selectedChild.symbol} />
                          ) : (
                            <code className="text-xs">{selectedChild.key}</code>
                          )}
                        </div>
                      )}
                      {displayExpression && (
                        <div className="text-sm">
                          <Formula tex={`= ${displayExpression}`} />
                        </div>
                      )}
                      {entry.evaluatorInputs &&
                        Object.keys(entry.evaluatorInputs).length > 0 && (
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0">
                            <span className="text-xs text-gray-300 italic">
                              where
                            </span>
                            {Object.entries(entry.evaluatorInputs).map(
                              ([k, v]) => {
                                const sub = traceMap.get(k);
                                const { value: sdv, unit: sdu } = convertUnit(
                                  typeof v === "number" ? v : 0,
                                  sub?.unit,
                                );
                                return (
                                  <span
                                    key={k}
                                    className="text-xs text-gray-400 font-mono"
                                  >
                                    {sub?.symbol ? (
                                      <Formula tex={sub.symbol} />
                                    ) : (
                                      <code className="text-xs">{k}</code>
                                    )}
                                    {"\u00A0=\u00A0"}
                                    {typeof v === "number"
                                      ? formatValue(sdv)
                                      : v}
                                    {typeof v === "number" && sdu && (
                                      <Unit unit={sdu} />
                                    )}
                                  </span>
                                );
                              },
                            )}
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
          {checkEntry?.evaluatorInputs &&
            Object.keys(checkEntry.evaluatorInputs).length > 0 && (
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
                        {sub?.symbol ? (
                          <Formula tex={sub.symbol} />
                        ) : (
                          <code className="text-xs">{k}</code>
                        )}
                      </span>
                      {" = "}
                      <span className="font-medium">
                        {typeof v === "number" ? formatValue(sdv) : v}
                      </span>
                      {typeof v === "number" && sdu && <Unit unit={sdu} />}
                    </span>
                  );
                })}
              </div>
            )}
          <p className="font-mono text-sm">
            <span className="text-gray-500">ratio</span>
            {" = "}
            <span className="font-medium">{data?.ratio.toFixed(4)}</span>{" "}
            <span className={data?.passed ? "text-green-700" : "text-red-600"}>
              {data?.passed ? "\u2264" : ">"} 1.0
            </span>
            {"  "}
            <span
              className={`font-semibold ${data?.passed ? "text-green-700" : "text-red-600"}`}
            >
              {data?.passed ? "\u2713 PASS" : "\u2717 FAIL"}
            </span>
            <span className="text-gray-400 ml-2">
              {data ? `(${pct(data.ratio)})` : ""}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`mb-4 overflow-hidden rounded-lg border ${tone.border} bg-white`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:brightness-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${tone.background}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white/80 text-sm font-semibold tabular-nums ${tone.border} ${tone.text}`}
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-sm text-gray-800">
                {result.name}
              </span>
              <SectionRef meta={checkMeta} />
              <span className="text-xs text-gray-400">
                EC3 #{result.checkId}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {isOpen ? "Hide check details" : "Show check details"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pl-3">
          {status.ratioText && (
            <span className={`text-sm font-mono tabular-nums ${tone.text}`}>
              {status.ratioText}
            </span>
          )}
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${tone.pill}`}
          >
            {status.label}
          </span>
          <span
            className={`text-sm font-semibold ${tone.text}`}
            aria-hidden="true"
          >
            {isOpen ? "-" : "+"}
          </span>
        </div>
      </button>

      {isOpen ? expandedContent : null}
    </div>
  );
};

// -- Summary layout --

const SummaryVerification = ({
  result,
  index,
  isOpen,
  onToggle,
}: {
  result: VerificationRow;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
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
      (t.type === "user-input" ||
        t.type === "coefficient" ||
        t.type === "constant"),
  );
  const relevantCalculated = trace.filter(
    (t) =>
      checkInputKeys.has(t.key) &&
      (t.type === "formula" || t.type === "derived"),
  );
  const formulaResults = relevantCalculated.filter((t) => t.type === "formula");
  const derivedResults = relevantCalculated.filter((t) => t.type === "derived");
  const status = getVerificationStatus(result);
  const tone = VERIFICATION_TONE_STYLES[status.tone];

  const displayedInputs = relevantInputs.slice(0, 6);
  const displayedFormulas = formulaResults.slice(0, 8);
  const displayedDerived = derivedResults.slice(0, 6);
  const expandedContent = hasError(result) ? (
    <div className="border-t border-black/5 bg-white">
      <ErrorBlock
        type={failure?.type}
        message={failure?.message}
        details={failure?.details}
        notApplicable={isNotApplicable(result)}
      />
    </div>
  ) : (
    <div className="space-y-2 border-t border-black/5 bg-white px-3 py-3">
      {checkEntry?.verificationExpression && (
        <div className="bg-gray-50 rounded px-2 py-1.5">
          <p className="text-[11px] text-gray-400 mb-1">Verification rule</p>
          <div className="text-sm text-center">
            <Formula tex={checkEntry.verificationExpression} display />
          </div>
        </div>
      )}

      {checkEntry?.evaluatorInputs &&
        Object.keys(checkEntry.evaluatorInputs).length > 0 && (
          <div className="bg-gray-50 rounded px-2 py-1.5">
            <p className="text-[11px] text-gray-400 mb-1">Check terms</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
              {Object.entries(checkEntry.evaluatorInputs).map(([k, v]) => {
                const entry = traceMap.get(k);
                const numericValue = typeof v === "number" ? v : 0;
                const { value: dv, unit: du } = convertUnit(
                  numericValue,
                  entry?.unit,
                );
                return (
                  <span key={k} className="text-gray-600">
                    {entry?.symbol ? (
                      <Formula tex={entry.symbol} />
                    ) : (
                      <code className="text-xs">{k}</code>
                    )}
                    {" = "}
                    {typeof v === "number" ? formatValue(dv) : v}
                    {typeof v === "number" && du && <Unit unit={du} />}
                  </span>
                );
              })}
            </div>
          </div>
        )}

      {(displayedFormulas.length > 0 ||
        displayedDerived.length > 0 ||
        displayedInputs.length > 0) && (
        <div className="bg-gray-50 rounded px-2 py-1.5 space-y-1.5">
          {displayedInputs.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Key inputs</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                {displayedInputs.map((entry) => {
                  const { value: dv, unit: du } = convertUnit(
                    entry.value as number,
                    entry.unit,
                  );
                  return (
                    <span key={entry.nodeId} className="text-gray-600">
                      {entry.symbol ? (
                        <Formula tex={entry.symbol} />
                      ) : (
                        <code className="text-xs">{entry.key}</code>
                      )}
                      {" = "}
                      {formatValue(dv)}
                      {du && <Unit unit={du} />}
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
              <p className="text-[11px] text-gray-400 mb-0.5">
                Formula results
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                {displayedFormulas.map((entry) => {
                  const { value: dv, unit: du } = convertUnit(
                    entry.value as number,
                    entry.unit,
                  );
                  return (
                    <span key={entry.nodeId} className="text-gray-600">
                      {entry.symbol ? (
                        <Formula tex={entry.symbol} />
                      ) : (
                        <code className="text-xs">{entry.key}</code>
                      )}
                      {" = "}
                      {formatValue(dv)}
                      {du && <Unit unit={du} />}
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
              <p className="text-[11px] text-gray-400 mb-0.5">
                Derived/support values
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono">
                {displayedDerived.map((entry) => {
                  const { value: dv, unit: du } = convertUnit(
                    entry.value as number,
                    entry.unit,
                  );
                  return (
                    <span key={entry.nodeId} className="text-gray-600">
                      {entry.symbol ? (
                        <Formula tex={entry.symbol} />
                      ) : (
                        <code className="text-xs">{entry.key}</code>
                      )}
                      {" = "}
                      {formatValue(dv)}
                      {du && <Unit unit={du} />}
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
  );

  return (
    <div
      className={`mb-3 overflow-hidden rounded border ${tone.border} bg-white`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between gap-4 px-3 py-3 text-left transition hover:brightness-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${tone.background}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-white/80 text-xs font-semibold tabular-nums ${tone.border} ${tone.text}`}
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-medium">{result.name}</span>
              {checkEntry && (
                <SectionRef
                  meta={checkEntry.meta as Record<string, unknown> | undefined}
                />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {isOpen ? "Hide summary details" : "Show summary details"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pl-3">
          {status.ratioText && (
            <span className={`text-sm font-mono tabular-nums ${tone.text}`}>
              {status.ratioText}
            </span>
          )}
          <span
            className={`rounded border px-2 py-0.5 text-xs font-mono tabular-nums ${tone.pill}`}
          >
            {status.badge}
          </span>
          <span
            className={`text-sm font-semibold ${tone.text}`}
            aria-hidden="true"
          >
            {isOpen ? "-" : "+"}
          </span>
        </div>
      </button>

      {isOpen ? expandedContent : null}
    </div>
  );
};

// -- Main report --

export const Ec3Report = ({ results, mode }: Ec3ReportProps) => {
  const [expandedChecks, setExpandedChecks] = useState<Set<number>>(
    () => new Set(),
  );
  const passed = results.filter(
    (r) => hasData(r) && r.payload.data.passed,
  ).length;
  const notApplicable = results.filter((r) => isNotApplicable(r)).length;
  const failed = results.filter(
    (r) => hasData(r) && !r.payload.data.passed,
  ).length;
  const errors = results.filter(
    (r) => hasError(r) && !isNotApplicable(r),
  ).length;
  const hasExpandedChecks = expandedChecks.size > 0;

  useEffect(() => {
    setExpandedChecks(new Set());
  }, [results, mode]);

  const toggleCheck = (checkId: number) => {
    setExpandedChecks((current) => {
      const next = new Set(current);
      if (next.has(checkId)) {
        next.delete(checkId);
      } else {
        next.add(checkId);
      }
      return next;
    });
  };

  const collapseAll = () => {
    setExpandedChecks(new Set());
  };

  return (
    <div>
      <div className="mb-4 p-3 border rounded bg-gray-50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg mb-1">
              EC3 Verification Report
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({mode})
              </span>
            </h2>
            <div className="text-sm flex gap-4">
              <span className="text-green-700">{passed} passed</span>
              {failed > 0 && (
                <span className="text-red-600">{failed} failed</span>
              )}
              {errors > 0 && (
                <span className="text-red-600">{errors} errors</span>
              )}
              {notApplicable > 0 && (
                <span className="text-gray-600">{notApplicable} n/a</span>
              )}
              <span className="text-gray-400">{results.length} total</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Checks are numbered and collapsed by default. Click a check header
              to expand its details.
            </p>
          </div>
          <button
            type="button"
            onClick={collapseAll}
            disabled={!hasExpandedChecks}
            className="shrink-0 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Collapse all
          </button>
        </div>
      </div>

      {mode === "verbose"
        ? results.map((row, index) => (
            <VerboseVerification
              key={row.checkId}
              result={row}
              index={index}
              isOpen={expandedChecks.has(row.checkId)}
              onToggle={() => toggleCheck(row.checkId)}
            />
          ))
        : results.map((r, i) => (
            <SummaryVerification
              key={r.checkId}
              result={r}
              index={i}
              isOpen={expandedChecks.has(r.checkId)}
              onToggle={() => toggleCheck(r.checkId)}
            />
          ))}
    </div>
  );
};
