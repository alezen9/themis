# Shear Resistance About y-y (EC3 6.2.6)

## What this check does

Verifies y-axis shear utilization against plastic shear resistance.

## Equation Ledger

| Node key        | EC3 ref      | Expression                                 | Branch |
| --------------- | ------------ | ------------------------------------------ | ------ |
| `V_pl_y_Rd_N`   | 6.2.6 (6.18) | `Av_y_mm2 * fy_MPa / (sqrt(3) * gamma_M0)` | none   |
| `shear_y_check` | 6.2.6 (6.17) | `abs(V_y_Ed) / V_pl_y_Rd_N`                | none   |

## Node Tree

```text
shear_y_check
|- V_y_Ed
`- V_pl_y_Rd_N
   |- Av_y_mm2
   |- fy_MPa
   `- gamma_M0
```
