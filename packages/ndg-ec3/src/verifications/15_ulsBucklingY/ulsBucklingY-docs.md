# Flexural Buckling About y-y (EC3 SS6.3.1)

## What this check does

This check verifies compression resistance against flexural buckling about the y-y axis.

## When it applies

- It applies to compression load cases (`N_Ed < 0`)
- For non-compression (`N_Ed >= 0`) it throws `not-applicable-load-case`

## Terms in plain language

- `N_Ed`: Design axial force
- `N_b_y_Rd`: Buckling resistance about y-y
- `lambda_bar_y`: Non-dimensional slenderness
- `chi_y`: Reduction factor
- `buckling_y_check`: Final utilization ratio

## Full node tree (ascii)

```text
buckling_y_check
|- abs_N_Ed
|  `- N_Ed
`- N_b_y_Rd
   |- chi_y
   `- N_pl_Rk, gamma_M1
```
