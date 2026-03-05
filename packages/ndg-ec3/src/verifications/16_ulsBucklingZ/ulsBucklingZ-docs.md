# Flexural Buckling About z-z (EC3 SS6.3.1)

## What this check does

This check verifies compression resistance against flexural buckling about the z-z axis.

## When it applies

- It applies to compression load cases (`N_Ed < 0`)
- For non-compression (`N_Ed >= 0`) it throws `not-applicable-load-case`

## Terms in plain language

- `N_Ed`: Design axial force
- `N_b_z_Rd`: Buckling resistance about z-z
- `lambda_bar_z`: Non-dimensional slenderness
- `chi_z`: Reduction factor
- `buckling_z_check`: Final utilization ratio

## Full node tree (ascii)

```text
buckling_z_check
|- abs_N_Ed
|  `- N_Ed
`- N_b_z_Rd
   |- chi_z
   `- N_pl_Rk, gamma_M1
```
