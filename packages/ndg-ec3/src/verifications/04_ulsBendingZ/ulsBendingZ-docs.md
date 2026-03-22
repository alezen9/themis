# Bending Resistance About z-z (EC3 6.2.5)

## What this check does

Verifies z-axis bending utilization against design resistance.

## Equation Ledger

| Node key          | EC3 ref      | Expression                                     | Branch          |
| ----------------- | ------------ | ---------------------------------------------- | --------------- |
| `W_z_res`         | 6.2.5        | `Wpl_z` for class `1/2`, `Wel_z` for class `3` | `section_class` |
| `M_c_z_Rd`        | 6.2.5 (6.13) | `W_z_res * fy / gamma_M0`                      | none            |
| `bending_z_check` | 6.2.5 (6.12) | `abs(M_z_Ed) / M_c_z_Rd`                       | none            |

## Node Tree

```text
bending_z_check
|- M_z_Ed
`- M_c_z_Rd
   |- W_z_res
   |  |- Wpl_z (class 1/2)
   |  `- Wel_z (class 3)
   |- fy
   `- gamma_M0
```
