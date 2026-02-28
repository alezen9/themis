# EC3 Benchmark Artifacts

This directory contains committed benchmark artifacts for `@ndg/ndg-ec3`.

## Purpose

- Provide reproducible audit evidence for the declared EC3 scope.
- Keep applicability, benchmark fixtures, and derivation notes versioned with engine code.
- Back benchmark/contract tests with deterministic source files.

## Authority

- Primary matrix source: `ec3/phase-a-applicability-matrix.json`.
- Human-readable mirror: `ec3/phase-a-applicability-matrix.md`.
- Scenario fixtures and derivations: `ec3/*-uls-*.json` and `ec3/*-uls-*.md`.
- External calculator parity corpus (non-circular): `ec3-calculator-parity/*`.

## When to Change These Files

Update artifacts only when one of the following changes:

- verification formulas/branching logic,
- declared applicability scope,
- benchmark baseline assumptions/inputs,
- clause/sign-off references.

Do not regenerate benchmarks as part of unrelated refactors.

## Commands

From repository root:

- Generate benchmark pack: `pnpm --filter @ndg/ndg-ec3 benchmark:generate`
- Verify matrix + benchmark suites: `pnpm --filter @ndg/ndg-ec3 benchmark:verify`
