# Torsional Buckling in Compression (EC3 SS6.3.1)

## What this check does

This check verifies compression resistance against torsional or flexural-torsional buckling.

## When it applies

- It applies to compression load cases (`N_Ed < 0`)
- For non-compression (`N_Ed >= 0`) it throws `not-applicable-load-case`

## Terms in plain language

- `N_Ed`: Design axial force
- `N_cr_T`: Elastic critical torsional load
- `lambda_bar_T`: Non-dimensional torsional slenderness
- `chi_T`: Torsional buckling reduction factor
- `torsional_buckling_check`: Final utilization ratio

## Full node tree (ascii)

```text
torsional_buckling_check
|- abs_N_Ed
|  `- N_Ed
`- N_b_T_Rd
   |- chi_T
   `- N_pl_Rk, gamma_M1
```
