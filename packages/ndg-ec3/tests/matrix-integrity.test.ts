import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

type MatrixCell = {
  checkId: number;
  shape: "I" | "RHS" | "CHS";
  sectionClass: 1 | 2 | 3 | 4;
  outcome: "compute" | "not_applicable";
  failureType?: string;
};

type MatrixFixture = {
  checks: { checkId: number; verification: string }[];
  cells: MatrixCell[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const benchDir = path.resolve(__dirname, "../benchmarks/ec3");
const matrixJsonPath = path.join(benchDir, "phase-a-applicability-matrix.json");
const matrixMdPath = path.join(benchDir, "phase-a-applicability-matrix.md");

const shapes: MatrixCell["shape"][] = ["I", "RHS", "CHS"];
const sectionClasses: MatrixCell["sectionClass"][] = [1, 2, 3, 4];
const nonIOutOfScopeChecks = new Set([17, 18, 19, 20, 21, 22]);

const asCellKey = (checkId: number, shape: string, sectionClass: number) =>
  `${checkId}:${shape}:${sectionClass}`;

describe("phase-a matrix integrity", () => {
  const matrix = JSON.parse(fs.readFileSync(matrixJsonPath, "utf8")) as MatrixFixture;
  const md = fs.readFileSync(matrixMdPath, "utf8");
  const cellKeys = new Set(matrix.cells.map((cell) => asCellKey(cell.checkId, cell.shape, cell.sectionClass)));

  it("contains exactly 22 checks and 264 unique cells", () => {
    expect(matrix.checks).toHaveLength(22);
    expect(matrix.cells).toHaveLength(264);
    expect(cellKeys.size).toBe(264);
  });

  it("contains every check × shape × class combination exactly once", () => {
    for (const check of matrix.checks) {
      for (const shape of shapes) {
        for (const sectionClass of sectionClasses) {
          const key = asCellKey(check.checkId, shape, sectionClass);
          expect(cellKeys.has(key), `missing matrix cell ${key}`).toBe(true);
        }
      }
    }
  });

  it("enforces class-4 not_applicable cells for all checks", () => {
    for (const check of matrix.checks) {
      for (const shape of shapes) {
        const cell = matrix.cells.find((candidate) =>
          candidate.checkId === check.checkId
          && candidate.shape === shape
          && candidate.sectionClass === 4);
        expect(cell?.outcome).toBe("not_applicable");
        expect(cell?.failureType).toBe("NOT_APPLICABLE_SECTION_CLASS");
      }
    }
  });

  it("enforces non-I not_applicable cells for checks 17..22 (class 1/2/3)", () => {
    for (const checkId of nonIOutOfScopeChecks) {
      for (const shape of ["RHS", "CHS"] as const) {
        for (const sectionClass of [1, 2, 3] as const) {
          const cell = matrix.cells.find((candidate) =>
            candidate.checkId === checkId
            && candidate.shape === shape
            && candidate.sectionClass === sectionClass);
          expect(cell?.outcome).toBe("not_applicable");
          expect(cell?.failureType).toBe("NOT_APPLICABLE_SECTION_SHAPE");
        }
      }
    }
  });

  it("keeps markdown synchronized with matrix JSON hash", () => {
    const expectedHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(matrix))
      .digest("hex");
    const match = md.match(/MatrixSourceHash:\s*`([a-f0-9]+)`/i);
    expect(match?.[1]).toBe(expectedHash);
  });
});
