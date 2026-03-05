# Beam-Column Interaction Eq. 6.61 Method 1 (EC3 SS6.3.3)

## What this check does

This check evaluates the Method 1 beam-column interaction branch associated with Equation 6.61.

## When it applies

- It applies to compression load cases (`N_Ed < 0`)
- For non-compression (`N_Ed >= 0`) it throws `not-applicable-load-case`

## Terms in plain language

- `N_Ed`, `M_y_Ed`, `M_z_Ed`: Design actions
- `N_b_y_Rd`, `M_b_Rd`, `M_z_Rd`: Reduced member resistances
- `k_yy`, `k_yz`: Interaction factors
- `beam_column_61_m1_check`: Final utilization ratio for Eq. 6.61

## Full node tree (ascii)

```text
beam_column_61_m1_check
|- N_Ed / N_b_y_Rd
|- k_yy * M_y_Ed / M_b_Rd
`- k_yz * M_z_Ed / M_z_Rd
```
