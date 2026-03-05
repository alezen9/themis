# Shear Resistance About y-y (EC3 §6.2.6)

## What this check does

This check verifies whether the section can carry the applied shear force about the y-y axis without exceeding its plastic shear resistance.

## When it applies

- It applies for finite shear force values
- Both positive and negative shear signs are valid, the check uses `|V_y_Ed|`

## Terms in plain language

- `V_y_Ed`: Applied design shear force about y-y
- `Av_y`: Shear area about y-y
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `V_pl_y_Rd`: Plastic shear resistance about y-y
- `shear_y_check`: Final utilization ratio

## Full node tree (ascii)

```text
                      ┌────────────────────────────────────────────┐
                      │ Shear resistance check about y-y           │
                      │ type: check                                │
                      │ id: shear_y_check                          │
                      │ expr: |V_y_Ed| / V_pl_y_Rd <= 1.0          │
                      └────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
┌────────────────────────────────────────────┐    ┌────────────────────────────────────────────┐
│ Shear force magnitude about y-y            │    │ Plastic shear resistance about y-y         │
│ type: derived                              │    │ type: formula                              │
│ id: abs_V_y_Ed                             │    │ id: V_pl_y_Rd                              │
│ expr: |V_y_Ed|                             │    │ expr: Av_y * fy / (sqrt(3) * gamma_M0)     │
└────────────────────────────────────────────┘    └────────────────────────────────────────────┘
                    │                                               │
┌────────────────────────────────────────────┐    ┌────────────────────────────────────────────┐
│ Design shear force about y-y               │    │ Children: Av_y, fy, gamma_M0              │
│ type: user-input                           │    └────────────────────────────────────────────┘
│ id: V_y_Ed                                 │
└────────────────────────────────────────────┘
```
