# Bending y-y with Axial Force (EC3 6.2.9)

## What this check does

Checks combined y-axis bending and axial force.
Class 1/2 uses reduced moment resistance.
Class 3 uses stress criterion.

## Equation Ledger

| Node key | EC3 ref | Expression | Branch |
|---|---|---|---|
| `N_pl_Rd` | 6.2.4 (6.10) | `A * f_y / gamma_M0` | none |
| `n` | 6.2.9.1 | `|N_Ed| / N_pl,Rd` | none |
| `a_w` | 6.2.9.1 | `min(a_w, 0.5)` | shape (`I/RHS/CHS`) |
| `k_y` | 6.2.9.1 (6.36) | `1` if `n <= 0.5 a_w`, else `min(1, (1-n)/(1-0.5a_w))` | threshold |
| `M_N_y_Rd` | 6.2.9.1 (6.36) | `M_pl,y,Rd * k_y` | none |
| `utilization_class12` | 6.2.9.1 | `|M_y,Ed| / M_N,y,Rd` | class 1/2 |
| `utilization_class3` | 6.2.9.2 (6.42) | `sigma_x,Ed / (f_y/gamma_M0)` | class 3 |
| `bending_y_axial_check` | 6.2.9 | selected utilization | class branch |

## Node Tree

```text
bending_y_axial_check
|- utilization_class12 (class 1/2)
|  |- abs_M_y_Ed
|  `- M_N_y_Rd
|     |- M_pl_y_Rd
|     `- k_y
`- utilization_class3 (class 3)
   |- sigma_x_class3
   `- sigma_limit
```
