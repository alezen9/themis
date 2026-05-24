# Bending Resistance About y-y (EC3 6.2.5)

## What this check does

Verifies y-axis bending utilization against design resistance.

## Equation Ledger

| Node key          | EC3 ref      | Expression                                             | Branch          |
| ----------------- | ------------ | ------------------------------------------------------ | --------------- |
| `W_y_res_mm3`     | 6.2.5        | `Wpl_y_mm3` for class `1/2`, `Wel_y_mm3` for class `3` | `section_class` |
| `M_c_y_Rd_Nmm`    | 6.2.5 (6.13) | `W_y_res_mm3 * fy_MPa / gamma_M0`                      | none            |
| `bending_y_check` | 6.2.5 (6.12) | `abs(M_y_Ed) / M_c_y_Rd_Nmm`                           | none            |

## Node Tree

```text
bending_y_check
|- M_y_Ed
`- M_c_y_Rd_Nmm
   |- W_y_res_mm3
   |  |- Wpl_y_mm3 (class 1/2)
   |  `- Wel_y_mm3 (class 3)
   |- fy_MPa
   `- gamma_M0
```
