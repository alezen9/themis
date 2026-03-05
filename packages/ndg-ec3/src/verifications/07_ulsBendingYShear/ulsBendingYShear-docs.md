# Bending y-y with Shear (EC3 6.2.8)

## What this check does

Checks y-axis bending under high shear using reduced resistance.

## Equation Ledger

| Node key | EC3 ref | Expression | Branch |
|---|---|---|---|
| `V_pl_z_Rd` | 6.2.6 (6.18) | `A_v,z * f_y / (sqrt(3) * gamma_M0)` | none |
| `shear_utilization_z` | 6.2.8 | `|V_z,Ed| / V_pl,z,Rd` | none |
| `rho_z_1` | 6.2.8 | `0` | `shear_utilization_z <= 0.5` |
| `rho_z_2` | 6.2.8 | `(2*shear_utilization_z - 1)^2` | `shear_utilization_z > 0.5` |
| `rho_z` | 6.2.8 | branch-selected `rho` | threshold |
| `W_y_eff` | 6.2.8 (6.30 intent) | effective `W_y` under shear | shape (`I/RHS/CHS`) |
| `M_y_V_Rd` | 6.2.8 (6.30) | `W_y_eff * f_y / gamma_M0` | none |
| `bending_y_shear_check` | 6.2.8 (6.29) | `|M_y,Ed| / M_y,V,Rd` | none |

## Node Tree

```text
bending_y_shear_check
|- abs_M_y_Ed
|  `- M_y_Ed
`- M_y_V_Rd
   |- W_y_eff
   |  |- W_y_res (class branch)
   |  `- rho_z
   |     |- shear_utilization_z
   |     |- rho_z_1 (u_z <= 0.5)
   |     `- rho_z_2 (u_z > 0.5)
   |- fy
   `- gamma_M0
```
