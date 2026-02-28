# Full Check Ultra-Strict Audit Report

## Policy
- Absolute tolerance: `1e-10`
- Relative tolerance: `1e-8`
- Rounding-only rule: allowed only when ratio fails strict tolerance, all intermediates pass strict tolerance, and display is identical

## Coverage
- Matrix fixtures: 22
- Matrix scenarios: 264
- Calculator parity case: case-01-eurocodeapplied-ipe200
- Calculator parity checks: 22
- Total audited rows: 286

## Summary
- Expected compute rows: 184
- Expected not_applicable rows: 102
- exact_pass: 286
- rounding_only_warning: 0
- compute_mismatch: 0
- applicability_mismatch: 0

## Max Deltas (strict mismatches only)
- Max ratio abs diff: 0.000000e+0
- Max ratio rel diff: 0.000000e+0
- Max intermediate abs diff: 0.000000e+0
- Max intermediate rel diff: 0.000000e+0

## Rounding-Only Warnings
_none_

## Hard Failures
_none_

