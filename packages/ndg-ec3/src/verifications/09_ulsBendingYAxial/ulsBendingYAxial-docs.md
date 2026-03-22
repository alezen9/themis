# Bending y-y with Axial Force (EC3 6.2.9)

## What this check does

Checks combined y-axis bending and axial force.
Class 1/2 uses reduced moment resistance.
Class 3 uses stress criterion.

## Equation Ledger

| Node key                | EC3 ref        | Expression                    | Branch                |
| ----------------------- | -------------- | ----------------------------- | --------------------- | ----------- | --------- |
| `N_pl_Rd`               | 6.2.4 (6.10)   | `A * f_y / gamma_M0`          | none                  |
| `n`                     | 6.2.9.1        | `                             | N_Ed                  | / N_pl,Rd`  | none      |
| `a_w_i`                 | 6.2.9.1        | `min((A - 2b t_f) / A, 0.5)`  | `section_shape = I`   |
| `a_w_rhs`               | 6.2.9.1        | `min((A - 2b t) / A, 0.5)`    | `section_shape = RHS` |
| `a_w_chs`               | 6.2.9.1        | `0.5`                         | `section_shape = CHS` |
| `a_w`                   | 6.2.9.1        | branch-selected `a_w`         | shape selector        |
| `k_y_1`                 | 6.2.9.1 (6.36) | `1`                           | `n <= 0.5 a_w`        |
| `k_y_2`                 | 6.2.9.1 (6.36) | `min(1, (1-n)/(1-0.5a_w))`    | `n > 0.5 a_w`         |
| `k_y`                   | 6.2.9.1 (6.36) | branch-selected `k_y`         | threshold selector    |
| `M_N_y_Rd`              | 6.2.9.1 (6.36) | `M_pl,y,Rd * k_y`             | none                  |
| `utilization_class12`   | 6.2.9.1        | `                             | M_y,Ed                | / M_N,y,Rd` | class 1/2 |
| `sigma_N`               | 6.2.9.2        | `                             | N_Ed                  | / A`        | class 3   |
| `sigma_M_y`             | 6.2.9.2        | `                             | M_y,Ed                | / W_el,y`   | class 3   |
| `sigma_x_class3`        | 6.2.9.2        | `sigma_N + sigma_M_y`         | class 3               |
| `utilization_class3`    | 6.2.9.2 (6.42) | `sigma_x,Ed / (f_y/gamma_M0)` | class 3               |
| `bending_y_axial_check` | 6.2.9          | selected utilization          | class branch          |

## Node Tree

```text
bending_y_axial_check
|- utilization_class12 (class 1/2)
|  |- M_y_Ed
|  `- M_N_y_Rd
|     |- M_pl_y_Rd
|     |  |- Wpl_y
|     |  |- fy
|     |  `- gamma_M0
|     `- k_y
|        |- k_y_1 (n <= 0.5 a_w)
|        `- k_y_2 (n > 0.5 a_w)
|           |- n
|           |  |- N_Ed
|           |  `- N_pl_Rd
|           `- a_w
|              |- a_w_i (shape I)
|              |- a_w_rhs (shape RHS)
|              `- a_w_chs (shape CHS)
`- utilization_class3 (class 3)
   |- sigma_x_class3
   |  |- sigma_N
   |  |  |- N_Ed
   |  |  `- A
   |  `- sigma_M_y
   |     |- M_y_Ed
   |     `- Wel_y
   `- sigma_limit
```
