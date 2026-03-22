# Bending y-y + Axial + Shear (EC3 6.2.10)

## What this check does

Checks y-axis bending with simultaneous axial force and shear.
Class 1/2 uses reduced moment chain.
Class 3 uses stress criterion.

## Equation Ledger

| Node key                      | EC3 ref              | Expression                            | Branch              |
| ----------------------------- | -------------------- | ------------------------------------- | ------------------- | ------------ | --------- |
| `rho_z`, `rho_y`              | 6.2.10               | shear reduction from `                | V                   | /V_pl`       | threshold |
| `a_w`                         | 6.2.9.1              | capped axial parameter                | shape (`I/RHS/CHS`) |
| `k_y`                         | 6.2.9.1 (6.36)       | y-branch axial factor                 | threshold           |
| `Wpl_y_eff`                   | 6.2.10 (6.45 intent) | effective plastic modulus under shear | shape (`I/RHS/CHS`) |
| `M_y_V_Rd`                    | 6.2.10 (6.45)        | `Wpl_y_eff * f_y / gamma_M0`          | none                |
| `M_NV_y_Rd`                   | 6.2.9.1 (6.36)       | `M_y,V,Rd * k_y`                      | none                |
| `utilization_class12`         | 6.2.10               | `                                     | M_y,Ed              | / M_NV,y,Rd` | class 1/2 |
| `utilization_class3`          | 6.2.10 + 6.2.9.2     | `sigma_v,Ed / (f_y/gamma_M0)`         | class 3             |
| `bending_y_axial_shear_check` | 6.2.10               | selected utilization                  | class branch        |

## Node Tree

```text
bending_y_axial_shear_check
|- utilization_class12 (class 1/2)
|  `- abs_M_y_Ed / M_NV_y_Rd
`- utilization_class3 (class 3)
   `- sigma_v_class3 / sigma_limit
```
