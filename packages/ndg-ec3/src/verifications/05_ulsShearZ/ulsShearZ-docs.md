# Shear Resistance About z-z (EC3 6.2.6)

## What this check does

Verifies z-axis shear utilization against plastic shear resistance.

## Equation Ledger

| Node key        | EC3 ref      | Expression                         | Branch |
| --------------- | ------------ | ---------------------------------- | ------ |
| `V_pl_z_Rd`     | 6.2.6 (6.18) | `Av_z * fy / (sqrt(3) * gamma_M0)` | none   |
| `shear_z_check` | 6.2.6 (6.17) | `abs(V_z_Ed) / V_pl_z_Rd`          | none   |

## Node Tree

```text
shear_z_check
|- V_z_Ed
`- V_pl_z_Rd
   |- Av_z
   |- fy
   `- gamma_M0
```
