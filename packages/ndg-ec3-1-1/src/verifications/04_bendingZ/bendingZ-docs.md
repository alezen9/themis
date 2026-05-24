# Bending Resistance About z-z (EC3 6.2.5)

## What this check does

Verifies z-axis bending utilization against design resistance.

## Equation Ledger

| Node key          | EC3 ref      | Expression                                             | Branch          |
| ----------------- | ------------ | ------------------------------------------------------ | --------------- |
| `W_z_res_mm3`     | 6.2.5        | `Wpl_z_mm3` for class `1/2`, `Wel_z_mm3` for class `3` | `section_class` |
| `M_c_z_Rd_Nmm`    | 6.2.5 (6.13) | `W_z_res_mm3 * fy_MPa / gamma_M0`                      | none            |
| `bending_z_check` | 6.2.5 (6.12) | `abs(M_z_Ed) / M_c_z_Rd_Nmm`                           | none            |

## Node Tree

```text
bending_z_check
|- M_z_Ed
`- M_c_z_Rd_Nmm
   |- W_z_res_mm3
   |  |- Wpl_z_mm3 (class 1/2)
   |  `- Wel_z_mm3 (class 3)
   |- fy_MPa
   `- gamma_M0
```
