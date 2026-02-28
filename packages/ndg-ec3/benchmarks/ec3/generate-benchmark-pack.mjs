import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { evaluate } from "../../../ndg-core/dist/index.js";
import { ec3Verifications, toEc3VerificationFailure } from "../../dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const benchDir = __dirname;

const shapes = ["I", "RHS", "CHS"];
const classes = [1, 2, 3, 4];

const annexCoefficients = {
  gamma_M0: 1,
  gamma_M1: 1,
  gamma_M2: 1.25,
  eta: 1.2,
  lambda_LT_0: 0.4,
  beta_LT: 0.75,
};

const sectionRefs = {
  1: "6.2.3",
  2: "6.2.4",
  3: "6.2.5",
  4: "6.2.5",
  5: "6.2.6",
  6: "6.2.6",
  7: "6.2.8",
  8: "6.2.8",
  9: "6.2.9.1",
  10: "6.2.9.1",
  11: "6.2.9.1",
  12: "6.2.10",
  13: "6.2.10",
  14: "6.2.10",
  15: "6.3.1.2",
  16: "6.3.1.2",
  17: "6.3.1.4",
  18: "6.3.2.3",
  19: "6.3.3",
  20: "6.3.3",
  21: "6.3.3",
  22: "6.3.3",
};

const baseInputsByShape = {
  I: {
    N_Ed: -200000,
    M_y_Ed: 20000000,
    M_z_Ed: 5000000,
    V_y_Ed: 10000,
    V_z_Ed: 50000,
    A: 2848,
    Wel_y: 200000,
    Wel_z: 50000,
    Wpl_y: 220600,
    Wpl_z: 57700,
    Av_y: 2848,
    Av_z: 1424,
    tw: 5.6,
    hw: 181.2,
    section_shape: "I",
    fy: 355,
    E: 210000,
    G: 81000,
    Iy: 19430000,
    Iz: 1424000,
    It: 69800,
    Iw: 12990000000,
    L: 3000,
    k_y: 1,
    k_z: 1,
    k_LT: 1,
    psi_y: 0.1,
    psi_z: -0.2,
    psi_LT: 1,
    moment_shape_y: "linear",
    support_condition_y: "pinned-pinned",
    moment_shape_z: "linear",
    support_condition_z: "pinned-pinned",
    moment_shape_LT: "uniform",
    support_condition_LT: "pinned-pinned",
    load_application_LT: "centroid",
    alpha_y: 0.21,
    alpha_z: 0.34,
    alpha_LT: 0.34,
  },
  RHS: {
    N_Ed: -200000,
    M_y_Ed: 20000000,
    M_z_Ed: 5000000,
    V_y_Ed: 10000,
    V_z_Ed: 50000,
    A: 2848,
    Wel_y: 200000,
    Wel_z: 50000,
    Wpl_y: 220600,
    Wpl_z: 57700,
    Av_y: 2848,
    Av_z: 1424,
    tw: 5.6,
    hw: 181.2,
    section_shape: "RHS",
    fy: 355,
    E: 210000,
    G: 81000,
    Iy: 19430000,
    Iz: 1424000,
    It: 69800,
    Iw: 12990000000,
    L: 3000,
    k_y: 1,
    k_z: 1,
    k_LT: 1,
    psi_y: 0.1,
    psi_z: -0.2,
    psi_LT: 1,
    moment_shape_y: "linear",
    support_condition_y: "pinned-pinned",
    moment_shape_z: "linear",
    support_condition_z: "pinned-pinned",
    moment_shape_LT: "uniform",
    support_condition_LT: "pinned-pinned",
    load_application_LT: "centroid",
    alpha_y: 0.21,
    alpha_z: 0.34,
    alpha_LT: 0.34,
  },
  CHS: {
    N_Ed: -200000,
    M_y_Ed: 20000000,
    M_z_Ed: 5000000,
    V_y_Ed: 10000,
    V_z_Ed: 50000,
    A: 2848,
    Wel_y: 200000,
    Wel_z: 50000,
    Wpl_y: 220600,
    Wpl_z: 57700,
    Av_y: 2848,
    Av_z: 1424,
    tw: 5.6,
    hw: 181.2,
    section_shape: "CHS",
    fy: 355,
    E: 210000,
    G: 81000,
    Iy: 19430000,
    Iz: 1424000,
    It: 69800,
    Iw: 12990000000,
    L: 3000,
    k_y: 1,
    k_z: 1,
    k_LT: 1,
    psi_y: 0.1,
    psi_z: -0.2,
    psi_LT: 1,
    moment_shape_y: "linear",
    support_condition_y: "pinned-pinned",
    moment_shape_z: "linear",
    support_condition_z: "pinned-pinned",
    moment_shape_LT: "uniform",
    support_condition_LT: "pinned-pinned",
    load_application_LT: "centroid",
    alpha_y: 0.21,
    alpha_z: 0.34,
    alpha_LT: 0.34,
  },
};

const asScenarioId = (shape, sectionClass) => `${shape.toLowerCase()}-c${sectionClass}`;

const getCellOutcome = (checkId, shape, sectionClass) => {
  if (sectionClass === 4) {
    return {
      outcome: "not_applicable",
      failureType: "NOT_APPLICABLE_SECTION_CLASS",
      clauseRef: sectionRefs[checkId],
    };
  }
  if (checkId >= 17 && shape !== "I") {
    return {
      outcome: "not_applicable",
      failureType: "NOT_APPLICABLE_SECTION_SHAPE",
      clauseRef: sectionRefs[checkId],
    };
  }
  return {
    outcome: "compute",
    clauseRef: sectionRefs[checkId],
  };
};

const toSortedNumericCache = (cache) => {
  const pairs = Object.entries(cache)
    .filter(([, value]) => typeof value === "number" && Number.isFinite(value))
    .sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(pairs);
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value) >= 1e6 || (Math.abs(value) > 0 && Math.abs(value) < 1e-3)) {
    return value.toExponential(6);
  }
  return Number(value.toFixed(9)).toString();
};

const fixtureFiles = fs.readdirSync(benchDir)
  .filter((name) => /^\d{2}-uls-.*\.json$/.test(name))
  .sort();

const checkInfo = fixtureFiles.map((name) => {
  const fullPath = path.join(benchDir, name);
  const fixture = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  return {
    fileName: name,
    checkId: fixture.checkId,
    verification: fixture.verification,
  };
});

const matrixChecks = checkInfo.map((item) => ({
  checkId: item.checkId,
  verification: item.verification,
  sectionRef: sectionRefs[item.checkId],
}));

const matrixCells = [];
for (const item of checkInfo) {
  for (const shape of shapes) {
    for (const sectionClass of classes) {
      const rule = getCellOutcome(item.checkId, shape, sectionClass);
      matrixCells.push({
        checkId: item.checkId,
        verification: item.verification,
        shape,
        sectionClass,
        outcome: rule.outcome,
        failureType: rule.failureType,
        clauseRef: rule.clauseRef,
      });
    }
  }
}

matrixCells.sort((a, b) =>
  a.checkId - b.checkId
  || shapes.indexOf(a.shape) - shapes.indexOf(b.shape)
  || a.sectionClass - b.sectionClass);

const matrixJson = {
  generatedAt: new Date().toISOString(),
  normativeBaseline: "resources/ec3-part1-1.pdf",
  shapes,
  classes,
  checks: matrixChecks,
  cells: matrixCells,
};

const matrixHash = crypto
  .createHash("sha256")
  .update(JSON.stringify(matrixJson))
  .digest("hex");

fs.writeFileSync(
  path.join(benchDir, "phase-a-applicability-matrix.json"),
  `${JSON.stringify(matrixJson, null, 2)}\n`,
);

const tableHeader = "| Check | Verification | I-1 | I-2 | I-3 | I-4 | RHS-1 | RHS-2 | RHS-3 | RHS-4 | CHS-1 | CHS-2 | CHS-3 | CHS-4 |";
const tableDivider = "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|";
const matrixRows = matrixChecks.map((item) => {
  const values = [];
  for (const shape of shapes) {
    for (const sectionClass of classes) {
      const cell = matrixCells.find((c) =>
        c.checkId === item.checkId
        && c.shape === shape
        && c.sectionClass === sectionClass);
      values.push(cell.outcome === "compute" ? "C" : "N");
    }
  }
  return `| ${String(item.checkId).padStart(2, "0")} | ${item.verification} | ${values.join(" | ")} |`;
});

const matrixMd = `# EC3 Phase A Applicability Matrix

Date: ${new Date().toISOString().slice(0, 10)}  
Normative baseline: \`resources/ec3-part1-1.pdf\`  
Scope: deterministic \`compute\` vs \`not_applicable\` for checks \`01..22\`.

MatrixSourceHash: \`${matrixHash}\`

## Failure type mapping

- \`NOT_APPLICABLE_SECTION_CLASS\`: class \`4\` cells (all checks).
- \`NOT_APPLICABLE_SECTION_SHAPE\`: non-\`I\` cells for checks \`17..22\`.

## Matrix (check × shape × class)

Legend: \`C\` = \`compute\`, \`N\` = \`not_applicable\`.

${tableHeader}
${tableDivider}
${matrixRows.join("\n")}

## Clause anchors for not-applicable shape rows

- Check \`17\`: EN 1993-1-1 §6.3.1.4 path currently implemented for open \`I/H\` sections.
- Check \`18\`: EN 1993-1-1 §6.3.2.3 \`M_cr\` path currently implemented with SN003b \`I/H\` assumptions.
- Checks \`19..22\`: EN 1993-1-1 §6.3.3 Annex A/B implementation currently uses \`I/H\` interaction paths.

## Sign-off

- Matrix author: Codex
- Status: Phase A applicability baseline established (264 cells).
`;

fs.writeFileSync(path.join(benchDir, "phase-a-applicability-matrix.md"), matrixMd);

for (const item of checkInfo) {
  const checkId = item.checkId;
  const verification = item.verification;
  const definition = ec3Verifications[checkId - 1];
  const scenarios = [];
  const scenarioDocs = [];

  for (const shape of shapes) {
    for (const sectionClass of classes) {
      const scenarioId = asScenarioId(shape, sectionClass);
      const inputs = {
        ...baseInputsByShape[shape],
        section_class: sectionClass,
      };

      const matrixCell = matrixCells.find((c) =>
        c.checkId === checkId
        && c.shape === shape
        && c.sectionClass === sectionClass);

      const annex = { id: "benchmark", coefficients: annexCoefficients };
      if (matrixCell.outcome === "compute") {
        const result = evaluate(definition, { inputs, annex });
        const intermediates = toSortedNumericCache(result.cache);
        scenarios.push({
          scenarioId,
          inputs,
          expected: {
            outcome: "ok",
            ratio: result.ratio,
            intermediates,
          },
        });

        const traceLines = result.trace
          .filter((entry) => typeof entry.value === "number" && Number.isFinite(entry.value))
          .map((entry, index) => `${index + 1}. \`${entry.key}\` (${entry.type}) = ${formatNumber(entry.value)}`);

        scenarioDocs.push({
          scenarioId,
          shape,
          sectionClass,
          outcome: "ok",
          ratio: result.ratio,
          traceLines,
          intermediates,
          failureType: null,
          failureMessage: null,
        });
      } else {
        try {
          evaluate(definition, { inputs, annex });
          throw new Error(`Expected not_applicable for ${verification}/${scenarioId}`);
        } catch (error) {
          const failure = toEc3VerificationFailure(error);
          scenarios.push({
            scenarioId,
            inputs,
            expected: {
              outcome: "not_applicable",
              type: failure.type,
              messageIncludes: failure.message ?? "",
            },
          });
          scenarioDocs.push({
            scenarioId,
            shape,
            sectionClass,
            outcome: "not_applicable",
            ratio: null,
            traceLines: [],
            intermediates: {},
            failureType: failure.type,
            failureMessage: failure.message ?? "",
          });
        }
      }
    }
  }

  const jsonOut = {
    checkId,
    verification,
    annexCoefficients,
    scenarios,
  };

  fs.writeFileSync(
    path.join(benchDir, item.fileName),
    `${JSON.stringify(jsonOut, null, 2)}\n`,
  );

  const checkNode = definition.nodes.find((node) => node.type === "check");
  const formulaRefs = [...new Set(definition.nodes
    .map((node) => node.meta?.formulaRef)
    .filter((value) => Boolean(value)))];
  const sectionRefs = [...new Set(definition.nodes
    .map((node) => node.meta?.sectionRef)
    .filter((value) => Boolean(value)))];
  const verificationRefs = [...new Set(definition.nodes
    .map((node) => node.meta?.verificationRef)
    .filter((value) => Boolean(value)))];

  const summaryRows = scenarioDocs.map((scenario) => {
    const expected = scenario.outcome === "ok"
      ? `ok (${formatNumber(scenario.ratio)})`
      : `not_applicable (${scenario.failureType})`;
    return `| ${scenario.scenarioId} | ${scenario.shape} | ${scenario.sectionClass} | ${expected} |`;
  });

  const scenarioSections = scenarioDocs.map((scenario) => {
    if (scenario.outcome === "ok") {
      return `### ${scenario.scenarioId}

- Branch decision: shape=\`${scenario.shape}\`, class=\`${scenario.sectionClass}\` -> \`compute\`
- Clause: \`${sectionRefs[checkId]}\`
- Expected ratio: \`${formatNumber(scenario.ratio)}\`

#### Derivation Steps (evaluation trace)

${scenario.traceLines.join("\n")}

#### Expected Intermediates

\`\`\`json
${JSON.stringify(scenario.intermediates, null, 2)}
\`\`\`
`;
    }

    return `### ${scenario.scenarioId}

- Branch decision: shape=\`${scenario.shape}\`, class=\`${scenario.sectionClass}\` -> \`not_applicable\`
- Clause: \`${sectionRefs[checkId]}\`
- Expected failure type: \`${scenario.failureType}\`
- Expected message snippet: \`${scenario.failureMessage.replaceAll("`", "'")}\`
`;
  });

  const mdOut = `# Check ${checkId} - ${verification}

- Verification expression: \`${checkNode?.verificationExpression ?? "n/a"}\`
- Section refs: ${sectionRefs.map((value) => `\`${value}\``).join(", ") || "n/a"}
- Formula refs: ${formulaRefs.map((value) => `\`${value}\``).join(", ") || "n/a"}
- Verification refs: ${verificationRefs.map((value) => `\`${value}\``).join(", ") || "n/a"}
- Scenarios: \`${scenarioDocs.length}\` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
${summaryRows.join("\n")}

## Per-Cell Derivations

${scenarioSections.join("\n")}
`;

  fs.writeFileSync(
    path.join(benchDir, item.fileName.replace(/\.json$/, ".md")),
    mdOut,
  );
}

console.log("Generated phase-a matrix + 22 scenario fixtures + 22 derivation docs.");
