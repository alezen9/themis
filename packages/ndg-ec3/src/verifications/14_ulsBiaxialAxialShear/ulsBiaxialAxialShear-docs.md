# Biaxial, Axial, and Shear Interaction (EC3 SS6.2.9 and SS6.2.10)

## What this check does

This check combines the y-axis and z-axis reduced resistances under axial force and shear into a biaxial interaction utilization.

## When it applies

- It applies for finite design actions and section properties
- It uses both reduced y and reduced z interaction branches

## Terms in plain language

- `M_y_Ed`, `M_z_Ed`: Design moments
- `N_Ed`: Design axial force
- `M_NV_y_Rd`, `M_NV_z_Rd`: Reduced moment resistances
- `alpha`: Interaction exponent term
- `biaxial_axial_shear_check`: Final utilization ratio

## Full node tree (ascii)

```text
biaxial_axial_shear_check
|- ratio_y
|  |- abs_M_y_Ed
|  `- M_NV_y_Rd
`- ratio_z
   |- abs_M_z_Ed
   `- M_NV_z_Rd
```
