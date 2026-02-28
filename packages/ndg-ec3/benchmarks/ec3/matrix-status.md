# EC3 Signed Matrix (264-Cell Closure)

Date: 2026-02-28  
Normative baseline: `resources/ec3-part1-1.pdf`  
Scope claim: `I/RHS/CHS`, classes `1/2/3`; class `4` explicit `not_applicable`; non-`I` checks `17..22` explicit `not_applicable`.

Commit: `5378b69`

## Evidence Columns

- `Matrix Cells Covered`: all 12 shape/class cells for the check are present in benchmark scenarios.
- `Compute Cell Derivations`: markdown contains per-scenario derivation sections for all compute cells.
- `N/A Failure Proof`: `not_applicable` cells carry expected typed failures and pass conformance tests.
- `Benchmark Conformance`: scenario outcomes and intermediates match expected values/tolerances.
- `Independent Derivation`: derivation artifacts are paired and validated per scenario.

## Check Closure Rows

| Check | Verification | Matrix Cells Covered | Compute Cell Derivations | N/A Failure Proof | Benchmark Conformance | Independent Derivation | Status |
|---|---|---|---|---|---|---|---|
| 01 | ulsTension | 12/12 | done | done | done | done | closed |
| 02 | ulsCompression | 12/12 | done | done | done | done | closed |
| 03 | ulsBendingY | 12/12 | done | done | done | done | closed |
| 04 | ulsBendingZ | 12/12 | done | done | done | done | closed |
| 05 | ulsShearZ | 12/12 | done | done | done | done | closed |
| 06 | ulsShearY | 12/12 | done | done | done | done | closed |
| 07 | ulsBendingYShear | 12/12 | done | done | done | done | closed |
| 08 | ulsBendingZShear | 12/12 | done | done | done | done | closed |
| 09 | ulsBendingYAxial | 12/12 | done | done | done | done | closed |
| 10 | ulsBendingZAxial | 12/12 | done | done | done | done | closed |
| 11 | ulsBiaxialAxial | 12/12 | done | done | done | done | closed |
| 12 | ulsBendingYAxialShear | 12/12 | done | done | done | done | closed |
| 13 | ulsBendingZAxialShear | 12/12 | done | done | done | done | closed |
| 14 | ulsBiaxialAxialShear | 12/12 | done | done | done | done | closed |
| 15 | ulsBucklingY | 12/12 | done | done | done | done | closed |
| 16 | ulsBucklingZ | 12/12 | done | done | done | done | closed |
| 17 | ulsTorsionalBuckling | 12/12 | done | done | done | done | closed |
| 18 | ulsLtb | 12/12 | done | done | done | done | closed |
| 19 | ulsBeamColumn61M1 | 12/12 | done | done | done | done | closed |
| 20 | ulsBeamColumn62M1 | 12/12 | done | done | done | done | closed |
| 21 | ulsBeamColumn61M2 | 12/12 | done | done | done | done | closed |
| 22 | ulsBeamColumn62M2 | 12/12 | done | done | done | done | closed |

## Evidence Links

- Matrix authority:
  - `packages/ndg-ec3/benchmarks/ec3/phase-a-applicability-matrix.json`
  - `packages/ndg-ec3/benchmarks/ec3/phase-a-applicability-matrix.md`
- Benchmark fixtures (scenario arrays): `packages/ndg-ec3/benchmarks/ec3/??-uls-*.json`
- Derivation packs (per scenario): `packages/ndg-ec3/benchmarks/ec3/??-uls-*.md`
- Matrix integrity: `packages/ndg-ec3/tests/matrix-integrity.test.ts`
- Applicability contract: `packages/ndg-ec3/tests/applicability-contract.test.ts`
- Benchmark conformance: `packages/ndg-ec3/tests/benchmark-conformance.test.ts`
- Independent derivation conformance: `packages/ndg-ec3/tests/independent-derivation-conformance.test.ts`
- Traceability contract: `packages/ndg-ec3/tests/traceability-contract.test.ts`
- Evaluator purity: `packages/ndg-ec3/tests/no-black-box-evaluator.test.ts`
- Operation atomization: `packages/ndg-ec3/tests/operation-atomization-contract.test.ts`

## Final Statement

All 264 matrix cells are explicitly represented in benchmark scenarios and validated by contract tests for the declared scope.  
No open rows remain.
