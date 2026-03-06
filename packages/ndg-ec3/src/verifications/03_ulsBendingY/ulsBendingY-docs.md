# Bending Resistance About y-y (EC3 6.2.5)

## What this check does

Verifies y-axis bending utilization against design resistance.

## Equation Ledger

| Node key | EC3 ref | Expression | Branch |
|---|---|---|---|
| `W_y_res` | 6.2.5 | `Wpl_y` for class `1/2`, `Wel_y` for class `3` | `section_class` |
| `M_c_y_Rd` | 6.2.5 (6.13) | `W_y_res * fy / gamma_M0` | none |
| `bending_y_check` | 6.2.5 (6.12) | `abs(M_y_Ed) / M_c_y_Rd` | none |

## Node Tree

```text
bending_y_check
|- M_y_Ed
`- M_c_y_Rd
   |- W_y_res
   |  |- Wpl_y (class 1/2)
   |  `- Wel_y (class 3)
   |- fy
   `- gamma_M0
```
