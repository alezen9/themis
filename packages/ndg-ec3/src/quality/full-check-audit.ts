import { evaluate } from "@ndg/ndg-core";
import { formatUtilization } from "../display";
import { toEc3VerificationFailure } from "../errors";
import { ec3Verifications } from "../verifications";

export const ULTRA_STRICT_ABS_TOL = 1e-10;
export const ULTRA_STRICT_REL_TOL = 1e-8;

export type MatrixBenchmarkScenario = {
  scenarioId: string;
  inputs: Record<string, number | string>;
  expected:
    | {
      outcome: "ok";
      ratio: number;
      intermediates: Record<string, number>;
    }
    | {
      outcome: "not_applicable";
      type: string;
      messageIncludes?: string;
    };
};

export type MatrixBenchmarkFixture = {
  checkId: number;
  verification: string;
  annexCoefficients: Record<string, number>;
  scenarios: MatrixBenchmarkScenario[];
};

export type CalculatorParityCheckExpectation = {
  checkId: number;
  verification: string;
  expected:
    | {
      outcome: "ok";
      ratio: number;
      display: string;
      intermediates?: Record<string, number>;
    }
    | {
      outcome: "not_applicable";
      type: string;
      display: "N/A";
    };
};

export type CalculatorParityCase = {
  id: string;
  annexCoefficients: Record<string, number>;
  engineInputs: Record<string, number | string>;
  checks: CalculatorParityCheckExpectation[];
};

export type StrictMismatch = {
  key: string;
  expected: number;
  actual: number;
  absDiff: number;
  relDiff: number;
  strictLimit: number;
};

export type FullCheckAuditClassification =
  | "exact_pass"
  | "rounding_only_warning"
  | "compute_mismatch"
  | "applicability_mismatch";

export type FullCheckAuditRow = {
  corpus: "matrix" | "calculator-parity";
  checkId: number;
  verification: string;
  scenarioId: string;
  expectedOutcome: "ok" | "not_applicable";
  classification: FullCheckAuditClassification;
  reason: string;
  expectedRatio?: number;
  actualRatio?: number;
  expectedDisplay?: string;
  actualDisplay?: string;
  expectedFailureType?: string;
  actualFailureType?: string;
  ratioMismatch?: StrictMismatch;
  intermediateMismatches: StrictMismatch[];
};

export type FullCheckAuditSummary = {
  totalRows: number;
  expectedOkCount: number;
  expectedNotApplicableCount: number;
  exactPassCount: number;
  roundingOnlyWarningCount: number;
  computeMismatchCount: number;
  applicabilityMismatchCount: number;
};

export type FullCheckAuditCoverage = {
  matrix: {
    fixtureCount: number;
    scenarioCount: number;
  };
  calculatorParity: {
    caseId: string;
    checkCount: number;
  };
};

export type FullCheckAuditMaxima = {
  maxRatioAbsDiff: number;
  maxRatioRelDiff: number;
  maxIntermediateAbsDiff: number;
  maxIntermediateRelDiff: number;
};

export type FullCheckAuditReport = {
  policy: {
    absTolerance: number;
    relTolerance: number;
    roundingOnlyRule: string;
  };
  coverage: FullCheckAuditCoverage;
  summary: FullCheckAuditSummary;
  maxima: FullCheckAuditMaxima;
  rows: FullCheckAuditRow[];
};

export type ClassifyOkComputationInput = {
  ratioMismatch?: StrictMismatch;
  intermediateMismatches: StrictMismatch[];
  expectedDisplay: string;
  actualDisplay: string;
};

export type ClassifyOkComputationResult = {
  classification: Exclude<FullCheckAuditClassification, "applicability_mismatch">;
  reason: string;
};

const strictLimit = (expected: number): number =>
  Math.max(ULTRA_STRICT_ABS_TOL, ULTRA_STRICT_REL_TOL * Math.max(1, Math.abs(expected)));

const compareStrict = (key: string, expected: number, actual: number): StrictMismatch | undefined => {
  const absDiff = Math.abs(actual - expected);
  const relDiff = absDiff / Math.max(1, Math.abs(expected));
  const limit = strictLimit(expected);
  if (absDiff <= limit) return undefined;
  return {
    key,
    expected,
    actual,
    absDiff,
    relDiff,
    strictLimit: limit,
  };
};

const findMax = (
  rows: FullCheckAuditRow[],
  getter: (row: FullCheckAuditRow) => StrictMismatch[],
  field: "absDiff" | "relDiff",
): number => {
  let max = 0;
  for (const row of rows) {
    for (const mismatch of getter(row)) {
      if (mismatch[field] > max) max = mismatch[field];
    }
  }
  return max;
};

export const classifyOkComputation = ({
  ratioMismatch,
  intermediateMismatches,
  expectedDisplay,
  actualDisplay,
}: ClassifyOkComputationInput): ClassifyOkComputationResult => {
  if (!ratioMismatch && intermediateMismatches.length === 0) {
    return { classification: "exact_pass", reason: "strict raw pass for ratio and intermediates" };
  }

  if (ratioMismatch && intermediateMismatches.length === 0 && expectedDisplay === actualDisplay) {
    return {
      classification: "rounding_only_warning",
      reason: "ratio exceeds ultra-strict threshold but display rendering matches exactly",
    };
  }

  return {
    classification: "compute_mismatch",
    reason: "strict raw mismatch in ratio and/or intermediates beyond rounding-only policy",
  };
};

const auditMatrixScenario = (
  fixture: MatrixBenchmarkFixture,
  scenario: MatrixBenchmarkScenario,
): FullCheckAuditRow => {
  const def = ec3Verifications[fixture.checkId - 1];
  const scenarioRef = scenario.scenarioId;

  if (scenario.expected.outcome === "not_applicable") {
    try {
      evaluate(def, {
        inputs: scenario.inputs,
        annex: { id: "benchmark", coefficients: fixture.annexCoefficients },
      });
      return {
        corpus: "matrix",
        checkId: fixture.checkId,
        verification: fixture.verification,
        scenarioId: scenarioRef,
        expectedOutcome: "not_applicable",
        classification: "applicability_mismatch",
        reason: "expected not_applicable but evaluation produced a numeric result",
        expectedFailureType: scenario.expected.type,
        intermediateMismatches: [],
      };
    } catch (error) {
      const failure = toEc3VerificationFailure(error);
      if (failure.type !== scenario.expected.type) {
        return {
          corpus: "matrix",
          checkId: fixture.checkId,
          verification: fixture.verification,
          scenarioId: scenarioRef,
          expectedOutcome: "not_applicable",
          classification: "applicability_mismatch",
          reason: "failure type mismatch",
          expectedFailureType: scenario.expected.type,
          actualFailureType: failure.type,
          intermediateMismatches: [],
        };
      }
      return {
        corpus: "matrix",
        checkId: fixture.checkId,
        verification: fixture.verification,
        scenarioId: scenarioRef,
        expectedOutcome: "not_applicable",
        classification: "exact_pass",
        reason: "typed not_applicable failure matched expected type",
        expectedFailureType: scenario.expected.type,
        actualFailureType: failure.type,
        intermediateMismatches: [],
      };
    }
  }

  try {
    const result = evaluate(def, {
      inputs: scenario.inputs,
      annex: { id: "benchmark", coefficients: fixture.annexCoefficients },
    });
    const ratioMismatch = compareStrict("ratio", scenario.expected.ratio, Number(result.ratio));
    const intermediateMismatches = Object.entries(scenario.expected.intermediates)
      .map(([key, expected]) => compareStrict(key, expected, Number(result.cache[key])))
      .filter((entry): entry is StrictMismatch => Boolean(entry));
    const expectedDisplay = formatUtilization(scenario.expected.ratio);
    const actualDisplay = formatUtilization(Number(result.ratio));
    const classified = classifyOkComputation({
      ratioMismatch,
      intermediateMismatches,
      expectedDisplay,
      actualDisplay,
    });

    return {
      corpus: "matrix",
      checkId: fixture.checkId,
      verification: fixture.verification,
      scenarioId: scenarioRef,
      expectedOutcome: "ok",
      classification: classified.classification,
      reason: classified.reason,
      expectedRatio: scenario.expected.ratio,
      actualRatio: Number(result.ratio),
      expectedDisplay,
      actualDisplay,
      ratioMismatch,
      intermediateMismatches,
    };
  } catch (error) {
    const failure = toEc3VerificationFailure(error);
    return {
      corpus: "matrix",
      checkId: fixture.checkId,
      verification: fixture.verification,
      scenarioId: scenarioRef,
      expectedOutcome: "ok",
      classification: "applicability_mismatch",
      reason: "expected numeric computation but evaluation threw",
      actualFailureType: failure.type,
      intermediateMismatches: [],
    };
  }
};

const auditParityCheck = (
  parityCase: CalculatorParityCase,
  check: CalculatorParityCheckExpectation,
): FullCheckAuditRow => {
  const def = ec3Verifications[check.checkId - 1];
  const scenarioRef = `${parityCase.id}`;

  if (check.expected.outcome === "not_applicable") {
    try {
      evaluate(def, {
        inputs: parityCase.engineInputs,
        annex: { id: "calculator-parity", coefficients: parityCase.annexCoefficients },
      });
      return {
        corpus: "calculator-parity",
        checkId: check.checkId,
        verification: check.verification,
        scenarioId: scenarioRef,
        expectedOutcome: "not_applicable",
        classification: "applicability_mismatch",
        reason: "expected not_applicable but evaluation produced a numeric result",
        expectedFailureType: check.expected.type,
        intermediateMismatches: [],
      };
    } catch (error) {
      const failure = toEc3VerificationFailure(error);
      if (failure.type !== check.expected.type) {
        return {
          corpus: "calculator-parity",
          checkId: check.checkId,
          verification: check.verification,
          scenarioId: scenarioRef,
          expectedOutcome: "not_applicable",
          classification: "applicability_mismatch",
          reason: "failure type mismatch",
          expectedFailureType: check.expected.type,
          actualFailureType: failure.type,
          intermediateMismatches: [],
        };
      }
      return {
        corpus: "calculator-parity",
        checkId: check.checkId,
        verification: check.verification,
        scenarioId: scenarioRef,
        expectedOutcome: "not_applicable",
        classification: "exact_pass",
        reason: "typed not_applicable failure matched expected type",
        expectedFailureType: check.expected.type,
        actualFailureType: failure.type,
        intermediateMismatches: [],
      };
    }
  }

  try {
    const result = evaluate(def, {
      inputs: parityCase.engineInputs,
      annex: { id: "calculator-parity", coefficients: parityCase.annexCoefficients },
    });
    const ratioMismatch = compareStrict("ratio", check.expected.ratio, Number(result.ratio));
    const intermediateMismatches = Object.entries(check.expected.intermediates ?? {})
      .map(([key, expected]) => compareStrict(key, expected, Number(result.cache[key])))
      .filter((entry): entry is StrictMismatch => Boolean(entry));
    const expectedDisplay = check.expected.display;
    const actualDisplay = formatUtilization(Number(result.ratio));
    const classified = classifyOkComputation({
      ratioMismatch,
      intermediateMismatches,
      expectedDisplay,
      actualDisplay,
    });

    return {
      corpus: "calculator-parity",
      checkId: check.checkId,
      verification: check.verification,
      scenarioId: scenarioRef,
      expectedOutcome: "ok",
      classification: classified.classification,
      reason: classified.reason,
      expectedRatio: check.expected.ratio,
      actualRatio: Number(result.ratio),
      expectedDisplay,
      actualDisplay,
      ratioMismatch,
      intermediateMismatches,
    };
  } catch (error) {
    const failure = toEc3VerificationFailure(error);
    return {
      corpus: "calculator-parity",
      checkId: check.checkId,
      verification: check.verification,
      scenarioId: scenarioRef,
      expectedOutcome: "ok",
      classification: "applicability_mismatch",
      reason: "expected numeric computation but evaluation threw",
      actualFailureType: failure.type,
      intermediateMismatches: [],
    };
  }
};

const sortRows = (rows: FullCheckAuditRow[]): FullCheckAuditRow[] =>
  rows.sort((a, b) =>
    a.corpus.localeCompare(b.corpus)
    || a.checkId - b.checkId
    || a.scenarioId.localeCompare(b.scenarioId));

export const buildFullCheckAuditReport = ({
  matrixFixtures,
  parityCase,
}: {
  matrixFixtures: MatrixBenchmarkFixture[];
  parityCase: CalculatorParityCase;
}): FullCheckAuditReport => {
  const matrixRows = matrixFixtures.flatMap((fixture) => fixture.scenarios.map((scenario) => auditMatrixScenario(fixture, scenario)));
  const parityRows = parityCase.checks.map((check) => auditParityCheck(parityCase, check));
  const rows = sortRows([...matrixRows, ...parityRows]);

  const summary: FullCheckAuditSummary = {
    totalRows: rows.length,
    expectedOkCount: rows.filter((row) => row.expectedOutcome === "ok").length,
    expectedNotApplicableCount: rows.filter((row) => row.expectedOutcome === "not_applicable").length,
    exactPassCount: rows.filter((row) => row.classification === "exact_pass").length,
    roundingOnlyWarningCount: rows.filter((row) => row.classification === "rounding_only_warning").length,
    computeMismatchCount: rows.filter((row) => row.classification === "compute_mismatch").length,
    applicabilityMismatchCount: rows.filter((row) => row.classification === "applicability_mismatch").length,
  };

  return {
    policy: {
      absTolerance: ULTRA_STRICT_ABS_TOL,
      relTolerance: ULTRA_STRICT_REL_TOL,
      roundingOnlyRule: "allowed only when ratio fails strict tolerance, all intermediates pass strict tolerance, and display is identical",
    },
    coverage: {
      matrix: {
        fixtureCount: matrixFixtures.length,
        scenarioCount: matrixRows.length,
      },
      calculatorParity: {
        caseId: parityCase.id,
        checkCount: parityRows.length,
      },
    },
    summary,
    maxima: {
      maxRatioAbsDiff: findMax(rows, (row) => row.ratioMismatch ? [row.ratioMismatch] : [], "absDiff"),
      maxRatioRelDiff: findMax(rows, (row) => row.ratioMismatch ? [row.ratioMismatch] : [], "relDiff"),
      maxIntermediateAbsDiff: findMax(rows, (row) => row.intermediateMismatches, "absDiff"),
      maxIntermediateRelDiff: findMax(rows, (row) => row.intermediateMismatches, "relDiff"),
    },
    rows,
  };
};

const renderRowTable = (rows: FullCheckAuditRow[]): string => {
  if (rows.length === 0) return "_none_";
  const header = "| Corpus | Check | Scenario | Classification | Reason | Ratio Δabs | Ratio Δrel | Expected Display | Actual Display |";
  const divider = "|---|---:|---|---|---|---:|---:|---|---|";
  const lines = rows.map((row) => {
    const ratioAbs = row.ratioMismatch ? row.ratioMismatch.absDiff.toExponential(6) : "0";
    const ratioRel = row.ratioMismatch ? row.ratioMismatch.relDiff.toExponential(6) : "0";
    return `| ${row.corpus} | ${row.checkId} | ${row.scenarioId} | ${row.classification} | ${row.reason} | ${ratioAbs} | ${ratioRel} | ${row.expectedDisplay ?? ""} | ${row.actualDisplay ?? ""} |`;
  });
  return [header, divider, ...lines].join("\n");
};

export const renderFullCheckAuditMarkdown = (report: FullCheckAuditReport): string => {
  const warnings = report.rows.filter((row) => row.classification === "rounding_only_warning");
  const hardFailures = report.rows.filter((row) =>
    row.classification === "compute_mismatch" || row.classification === "applicability_mismatch");

  const parts = [
    "# Full Check Ultra-Strict Audit Report",
    "",
    "## Policy",
    `- Absolute tolerance: \`${report.policy.absTolerance}\``,
    `- Relative tolerance: \`${report.policy.relTolerance}\``,
    `- Rounding-only rule: ${report.policy.roundingOnlyRule}`,
    "",
    "## Coverage",
    `- Matrix fixtures: ${report.coverage.matrix.fixtureCount}`,
    `- Matrix scenarios: ${report.coverage.matrix.scenarioCount}`,
    `- Calculator parity case: ${report.coverage.calculatorParity.caseId}`,
    `- Calculator parity checks: ${report.coverage.calculatorParity.checkCount}`,
    `- Total audited rows: ${report.summary.totalRows}`,
    "",
    "## Summary",
    `- Expected compute rows: ${report.summary.expectedOkCount}`,
    `- Expected not_applicable rows: ${report.summary.expectedNotApplicableCount}`,
    `- exact_pass: ${report.summary.exactPassCount}`,
    `- rounding_only_warning: ${report.summary.roundingOnlyWarningCount}`,
    `- compute_mismatch: ${report.summary.computeMismatchCount}`,
    `- applicability_mismatch: ${report.summary.applicabilityMismatchCount}`,
    "",
    "## Max Deltas (strict mismatches only)",
    `- Max ratio abs diff: ${report.maxima.maxRatioAbsDiff.toExponential(6)}`,
    `- Max ratio rel diff: ${report.maxima.maxRatioRelDiff.toExponential(6)}`,
    `- Max intermediate abs diff: ${report.maxima.maxIntermediateAbsDiff.toExponential(6)}`,
    `- Max intermediate rel diff: ${report.maxima.maxIntermediateRelDiff.toExponential(6)}`,
    "",
    "## Rounding-Only Warnings",
    renderRowTable(warnings),
    "",
    "## Hard Failures",
    renderRowTable(hardFailures),
    "",
  ];

  return `${parts.join("\n")}\n`;
};
