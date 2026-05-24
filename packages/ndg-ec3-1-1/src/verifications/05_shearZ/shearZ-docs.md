# Shear Resistance About z-z (EC3 6.2.6)

## What this check does

Verifies z-axis shear utilization against plastic shear resistance.

## Equation Ledger

| Node key        | EC3 ref      | Expression                                 | Branch |
| --------------- | ------------ | ------------------------------------------ | ------ |
| `V_pl_z_Rd_N`   | 6.2.6 (6.18) | `Av_z_mm2 * fy_MPa / (sqrt(3) * gamma_M0)` | none   |
| `shear_z_check` | 6.2.6 (6.17) | `abs(V_z_Ed) / V_pl_z_Rd_N`                | none   |

## Node Tree

```text
shear_z_check
|- V_z_Ed
`- V_pl_z_Rd_N
   |- Av_z_mm2
   |- fy_MPa
   `- gamma_M0
```
