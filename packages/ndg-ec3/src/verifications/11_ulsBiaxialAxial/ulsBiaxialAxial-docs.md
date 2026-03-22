# Biaxial Bending with Axial Force (EC3 6.2.9)

## What this check does

Checks biaxial bending and axial force interaction.
Class 1/2 uses Eq. (6.41)-style interaction.
Class 3 uses stress criterion.

## Equation Ledger

| Node key                  | EC3 ref               | Expression                    | Branch              |
| ------------------------- | --------------------- | ----------------------------- | ------------------- | ----------------- | ---- | ------------- | --------- |
| `n`                       | 6.2.9.1               | `                             | N_Ed                | / N_pl,Rd`        | none |
| `a_w`, `a_f`              | 6.2.9.1               | capped branch parameters      | shape (`I/RHS/CHS`) |
| `k_y`, `k_z`              | 6.2.9.1 (6.36)/(6.38) | y/z axial factors             | threshold           |
| `M_N_y_Rd`, `M_N_z_Rd`    | 6.2.9.1               | reduced y/z resistances       | none                |
| `alpha_biax`, `beta_biax` | 6.2.9                 | interaction exponents         | shape (`I/RHS/CHS`) |
| `utilization_class12`     | 6.2.9 (6.41)          | `(                            | M_y                 | /M_Ny )^alpha + ( | M_z  | /M_Nz )^beta` | class 1/2 |
| `utilization_class3`      | 6.2.9.2 (6.42)        | `sigma_x,Ed / (f_y/gamma_M0)` | class 3             |
| `biaxial_axial_check`     | 6.2.9                 | selected utilization          | class branch        |

## Node Tree

```text
biaxial_axial_check
|- utilization_class12 (class 1/2)
|  |- utilization_y + alpha_biax
|  `- utilization_z + beta_biax
`- utilization_class3 (class 3)
   |- sigma_x_class3
   `- sigma_limit
```
