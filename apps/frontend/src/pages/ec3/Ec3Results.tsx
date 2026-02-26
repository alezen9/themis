import { useState } from "react";
import type { VerificationRow } from "./use-ec3-evaluate";
import { Ec3Report } from "./Ec3Report";

interface Ec3ResultsProps {
  results: VerificationRow[];
}

export function Ec3Results({ results }: Ec3ResultsProps) {
  const [reportMode, setReportMode] = useState<"none" | "summary" | "verbose">("none");

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setReportMode(reportMode === "summary" ? "none" : "summary")}
          className={`text-xs px-2 py-1 border rounded ${reportMode === "summary" ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
        >
          Summary report
        </button>
        <button
          onClick={() => setReportMode(reportMode === "verbose" ? "none" : "verbose")}
          className={`text-xs px-2 py-1 border rounded ${reportMode === "verbose" ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
        >
          Verbose report
        </button>
      </div>

      {reportMode !== "none" ? (
        <Ec3Report results={results} mode={reportMode} />
      ) : (
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
                  {r.error ? "ERR" : r.ratio.toFixed(3)}
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
