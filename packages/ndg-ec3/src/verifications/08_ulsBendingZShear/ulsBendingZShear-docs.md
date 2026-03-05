# Bending z-z with Shear (EC3 6.2.8)

## What this check does

Checks z-axis bending under high shear using reduced resistance.

## Equation Ledger

| Node key | EC3 ref | Expression | Branch |
|---|---|---|---|
| `V_pl_y_Rd` | 6.2.6 (6.18) | `A_v,y * f_y / (sqrt(3) * gamma_M0)` | none |
| `shear_utilization_y` | 6.2.8 | `|V_y,Ed| / V_pl,y,Rd` | none |
| `rho_y_1` | 6.2.8 | `0` | `shear_utilization_y <= 0.5` |
| `rho_y_2` | 6.2.8 | `(2*shear_utilization_y - 1)^2` | `shear_utilization_y > 0.5` |
| `rho_y` | 6.2.8 | branch-selected `rho` | threshold |
| `W_z_eff` | 6.2.8 (6.30 intent) | effective `W_z` under shear | shape (`I/RHS/CHS`) |
| `M_z_V_Rd` | 6.2.8 (6.30) | `W_z_eff * f_y / gamma_M0` | none |
| `bending_z_shear_check` | 6.2.8 (6.29) | `|M_z,Ed| / M_z,V,Rd` | none |

## Node Tree

```text
bending_z_shear_check
|- abs_M_z_Ed
|  `- M_z_Ed
`- M_z_V_Rd
   |- W_z_eff
   |  |- W_z_res (class branch)
   |  `- rho_y
   |     |- shear_utilization_y
   |     |- rho_y_1 (u_y <= 0.5)
   |     `- rho_y_2 (u_y > 0.5)
   |- fy
   `- gamma_M0
```
