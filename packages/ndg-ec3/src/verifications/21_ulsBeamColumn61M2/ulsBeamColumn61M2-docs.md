# Beam-Column Interaction Eq. 6.61 Method 2 (EC3 SS6.3.3)

## What this check does

This check evaluates the Method 2 beam-column interaction branch associated with Equation 6.61.

## When it applies

- It applies to compression load cases (`N_Ed < 0`)
- For non-compression (`N_Ed >= 0`) it throws `not-applicable-load-case`

## Terms in plain language

- `N_Ed`, `M_y_Ed`, `M_z_Ed`: Design actions
- `N_b_y_Rd`, `M_b_Rd`, `M_z_Rd`: Reduced member resistances
- `k_yy_m2`, `k_yz_m2`: Method 2 interaction factors
- `beam_column_61_m2_check`: Final utilization ratio for Eq. 6.61 (Method 2)

## Full node tree (ascii)

```text
beam_column_61_m2_check
|- N_Ed / N_b_y_Rd
|- k_yy_m2 * M_y_Ed / M_b_Rd
`- k_yz_m2 * M_z_Ed / M_z_Rd
```
