# Torsional Buckling in Compression (EC3 SS6.3.1)

## What this check does

This check verifies compression resistance against torsional or flexural-torsional buckling.

## When it applies

- It applies to compression load cases (`N_Ed < 0`)
- Closed hollow sections (`RHS`, `CHS`) return `not-applicable-load-case`
- For non-compression (`N_Ed >= 0`) it throws `not-applicable-load-case`

## Terms in plain language

- `N_Ed`: Design axial force
- `N_cr_governing`: Selected critical force for torsional/torsional-flexural buckling
- `lambda_bar_TF`: Non-dimensional torsional/torsional-flexural slenderness
- `chi_TF`: Torsional/torsional-flexural buckling reduction factor
- `torsional_buckling_check`: Final utilization ratio

## Full node tree (ascii)

```text
torsional_buckling_check
|- abs_N_Ed
|  `- N_Ed
`- N_b_TF_Rd
   |- chi_TF
   `- A, fy, gamma_M1
```
