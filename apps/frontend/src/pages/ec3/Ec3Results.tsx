import { useState } from "react";
import { hasData, hasError, isNotApplicable } from "./use-ec3-evaluate";
import type { VerificationRow } from "./use-ec3-evaluate";
import { Ec3Report } from "./Ec3Report";

type Ec3ResultsProps = {
  results: VerificationRow[];
};

export const Ec3Results = ({ results }: Ec3ResultsProps) => {
  const [reportMode, setReportMode] = useState<"none" | "summary" | "verbose">(
    "none",
  );

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() =>
            setReportMode(reportMode === "summary" ? "none" : "summary")
          }
          className={`text-xs px-2 py-1 border rounded ${reportMode === "summary" ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
        >
          Summary report
        </button>
        <button
          onClick={() =>
            setReportMode(reportMode === "verbose" ? "none" : "verbose")
          }
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
            {results.map((row) => (
              <tr key={row.checkId} className="border-b">
                <td className="py-1 pr-4 tabular-nums">{row.checkId}</td>
                <td className="py-1 pr-4">{row.name}</td>
                <td className="py-1 pr-4 tabular-nums">
                  {isNotApplicable(row)
                    ? "N/A"
                    : hasError(row)
                      ? "ERR"
                      : hasData(row)
                        ? row.payload.data.ratio.toFixed(3)
                        : "ERR"}
                </td>
                <td className="py-1 pr-4">
                  {isNotApplicable(row) ? (
                    <span
                      className="text-gray-600"
                      title={row.payload.error?.message}
                    >
                      N/A
                    </span>
                  ) : hasError(row) ? (
                    <span
                      className="text-red-600"
                      title={row.payload.error.message}
                    >
                      Error
                    </span>
                  ) : hasData(row) && row.payload.data.passed ? (
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
};
