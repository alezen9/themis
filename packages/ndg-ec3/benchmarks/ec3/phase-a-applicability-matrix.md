# EC3 Phase A Applicability Matrix

Date: 2026-02-28  
Normative baseline: `resources/ec3-part1-1.pdf`  
Scope: deterministic `compute` vs `not_applicable` for checks `01..22`.

MatrixSourceHash: `26d61c4ff30e02407e8b8b6d825f2786bfe15b1b3e1fd367b5ff2c4309269245`

## Failure type mapping

- `NOT_APPLICABLE_SECTION_CLASS`: class `4` cells (all checks).
- `NOT_APPLICABLE_SECTION_SHAPE`: non-`I` cells for checks `17..22`.

## Matrix (check × shape × class)

Legend: `C` = `compute`, `N` = `not_applicable`.

| Check | Verification | I-1 | I-2 | I-3 | I-4 | RHS-1 | RHS-2 | RHS-3 | RHS-4 | CHS-1 | CHS-2 | CHS-3 | CHS-4 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 | ulsTension | C | C | C | N | C | C | C | N | C | C | C | N |
| 02 | ulsCompression | C | C | C | N | C | C | C | N | C | C | C | N |
| 03 | ulsBendingY | C | C | C | N | C | C | C | N | C | C | C | N |
| 04 | ulsBendingZ | C | C | C | N | C | C | C | N | C | C | C | N |
| 05 | ulsShearZ | C | C | C | N | C | C | C | N | C | C | C | N |
| 06 | ulsShearY | C | C | C | N | C | C | C | N | C | C | C | N |
| 07 | ulsBendingYShear | C | C | C | N | C | C | C | N | C | C | C | N |
| 08 | ulsBendingZShear | C | C | C | N | C | C | C | N | C | C | C | N |
| 09 | ulsBendingYAxial | C | C | C | N | C | C | C | N | C | C | C | N |
| 10 | ulsBendingZAxial | C | C | C | N | C | C | C | N | C | C | C | N |
| 11 | ulsBiaxialAxial | C | C | C | N | C | C | C | N | C | C | C | N |
| 12 | ulsBendingYAxialShear | C | C | C | N | C | C | C | N | C | C | C | N |
| 13 | ulsBendingZAxialShear | C | C | C | N | C | C | C | N | C | C | C | N |
| 14 | ulsBiaxialAxialShear | C | C | C | N | C | C | C | N | C | C | C | N |
| 15 | ulsBucklingY | C | C | C | N | C | C | C | N | C | C | C | N |
| 16 | ulsBucklingZ | C | C | C | N | C | C | C | N | C | C | C | N |
| 17 | ulsTorsionalBuckling | C | C | C | N | N | N | N | N | N | N | N | N |
| 18 | ulsLtb | C | C | C | N | N | N | N | N | N | N | N | N |
| 19 | ulsBeamColumn61M1 | C | C | C | N | N | N | N | N | N | N | N | N |
| 20 | ulsBeamColumn62M1 | C | C | C | N | N | N | N | N | N | N | N | N |
| 21 | ulsBeamColumn61M2 | C | C | C | N | N | N | N | N | N | N | N | N |
| 22 | ulsBeamColumn62M2 | C | C | C | N | N | N | N | N | N | N | N | N |

## Clause anchors for not-applicable shape rows

- Check `17`: EN 1993-1-1 §6.3.1.4 path currently implemented for open `I/H` sections.
- Check `18`: EN 1993-1-1 §6.3.2.3 `M_cr` path currently implemented with SN003b `I/H` assumptions.
- Checks `19..22`: EN 1993-1-1 §6.3.3 Annex A/B implementation currently uses `I/H` interaction paths.

## Sign-off

- Matrix author: Codex
- Status: Phase A applicability baseline established (264 cells).
