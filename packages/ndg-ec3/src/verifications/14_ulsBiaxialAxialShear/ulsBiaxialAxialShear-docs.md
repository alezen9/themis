# Biaxial Bending + Axial + Shear (EC3 6.2.8/6.2.9/6.2.10)

## What this check does

Checks biaxial interaction with simultaneous axial force and shear.
The y and z reduced resistances are built first, then combined with exponents.

## Equation Ledger

| Node key                             | EC3 ref               | Expression                     | Branch              |
| ------------------------------------ | --------------------- | ------------------------------ | ------------------- | ------------------- | --------- | --------------- | ---- |
| `rho_z`, `rho_y`                     | 6.2.10                | shear reductions from `        | V                   | /V_pl`              | threshold |
| `a_w`, `a_f`                         | 6.2.9.1               | capped branch parameters       | shape (`I/RHS/CHS`) |
| `k_y`, `k_z`                         | 6.2.9.1 (6.36)/(6.38) | axial factors for y/z branches | threshold           |
| `Wpl_y_eff`, `M_y_V_Rd`, `M_NV_y_Rd` | 6.2.10 + 6.2.9.1      | y reduced chain                | shape/threshold     |
| `Wpl_z_eff`, `M_z_V_Rd`, `M_NV_z_Rd` | 6.2.8 + 6.2.9.1       | z reduced chain                | class/threshold     |
| `alpha_biax`, `beta_biax`            | 6.2.9                 | interaction exponents          | shape (`I/RHS/CHS`) |
| `biaxial_axial_shear_check`          | 6.2.10 (6.41)         | `(                             | M_y                 | /M_NV,y )^alpha + ( | M_z       | /M_NV,z )^beta` | none |

## Node Tree

```text
biaxial_axial_shear_check
|- abs_M_y_Ed
|- M_NV_y_Rd
|  |- M_y_V_Rd
|  |  `- Wpl_y_eff (shape branch)
|  `- k_y
|- alpha_biax
|- abs_M_z_Ed
|- M_NV_z_Rd
|  |- M_z_V_Rd
|  |  `- Wpl_z_eff
|  `- k_z
`- beta_biax
```
