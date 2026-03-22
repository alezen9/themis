# Bending z-z with Axial Force (EC3 6.2.9)

## What this check does

Checks combined z-axis bending and axial force.
Class 1/2 uses reduced moment resistance.
Class 3 uses stress criterion.

## Equation Ledger

| Node key                | EC3 ref        | Expression                                        | Branch              |
| ----------------------- | -------------- | ------------------------------------------------- | ------------------- | ----------- | --------- |
| `N_pl_Rd`               | 6.2.4 (6.10)   | `A * f_y / gamma_M0`                              | none                |
| `n`                     | 6.2.9.1        | `                                                 | N_Ed                | / N_pl,Rd`  | none      |
| `a_f`                   | 6.2.9.1        | `min(a_f, 0.5)`                                   | shape (`I/RHS/CHS`) |
| `k_z`                   | 6.2.9.1 (6.38) | `1` if `n <= a_f`, else `1 - ((n-a_f)/(1-a_f))^2` | threshold           |
| `M_N_z_Rd`              | 6.2.9.1 (6.38) | `M_pl,z,Rd * k_z`                                 | none                |
| `utilization_class12`   | 6.2.9.1        | `                                                 | M_z,Ed              | / M_N,z,Rd` | class 1/2 |
| `utilization_class3`    | 6.2.9.2 (6.42) | `sigma_x,Ed / (f_y/gamma_M0)`                     | class 3             |
| `bending_z_axial_check` | 6.2.9          | selected utilization                              | class branch        |

## Node Tree

```text
bending_z_axial_check
|- utilization_class12 (class 1/2)
|  |- abs_M_z_Ed
|  `- M_N_z_Rd
|     |- M_pl_z_Rd
|     `- k_z
`- utilization_class3 (class 3)
   |- sigma_x_class3
   `- sigma_limit
```
