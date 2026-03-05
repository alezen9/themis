# Bending z-z + Axial + Shear (EC3 6.2.10)

## What this check does

Checks z-axis bending with simultaneous axial force and shear.
Class 1/2 uses reduced moment chain.
Class 3 uses stress criterion.

## Equation Ledger

| Node key | EC3 ref | Expression | Branch |
|---|---|---|---|
| `rho_y` | 6.2.10 | shear reduction from `|V_y|/V_pl,y` | threshold |
| `a_f` | 6.2.9.1 | capped axial parameter | shape (`I/RHS/CHS`) |
| `k_z` | 6.2.9.1 (6.38) | z-branch axial factor | threshold |
| `Wpl_z_eff` | 6.2.8 (6.30) | reduced plastic modulus about z | none |
| `M_z_V_Rd` | 6.2.8 (6.30) | `Wpl_z_eff * f_y / gamma_M0` | none |
| `M_NV_z_Rd` | 6.2.9.1 (6.38) | `M_z,V,Rd * k_z` | none |
| `utilization_class12` | 6.2.10 | `|M_z,Ed| / M_NV,z,Rd` | class 1/2 |
| `utilization_class3` | 6.2.10 + 6.2.9.2 | `sigma_v,Ed / (f_y/gamma_M0)` | class 3 |
| `bending_z_axial_shear_check` | 6.2.10 | selected utilization | class branch |

## Node Tree

```text
bending_z_axial_shear_check
|- utilization_class12 (class 1/2)
|  `- abs_M_z_Ed / M_NV_z_Rd
`- utilization_class3 (class 3)
   `- sigma_v_class3 / sigma_limit
```
