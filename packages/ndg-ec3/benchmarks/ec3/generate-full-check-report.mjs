import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildFullCheckAuditReport,
  renderFullCheckAuditMarkdown,
} from "../../dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const benchDir = __dirname;
const parityPath = path.resolve(benchDir, "../ec3-calculator-parity/case-01-eurocodeapplied-ipe200.json");
const reportJsonPath = path.resolve(benchDir, "full-check-ultra-strict-report.json");
const reportMdPath = path.resolve(benchDir, "full-check-ultra-strict-report.md");

const matrixFiles = fs.readdirSync(benchDir)
  .filter((name) => /^\d{2}-uls-.*\.json$/.test(name))
  .sort();

const matrixFixtures = matrixFiles.map((name) =>
  JSON.parse(fs.readFileSync(path.resolve(benchDir, name), "utf8")));
const parityCase = JSON.parse(fs.readFileSync(parityPath, "utf8"));

const report = buildFullCheckAuditReport({
  matrixFixtures,
  parityCase,
});

fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(reportMdPath, renderFullCheckAuditMarkdown(report));

console.log(`wrote ${path.relative(process.cwd(), reportJsonPath)}`);
console.log(`wrote ${path.relative(process.cwd(), reportMdPath)}`);
