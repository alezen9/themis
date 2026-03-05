# Shear Resistance About z-z (EC3 §6.2.6)

## What this check does

This check verifies whether the section can carry the applied shear force about the z-z axis without exceeding its plastic shear resistance.

## When it applies

- It applies for finite shear force values
- Both positive and negative shear signs are valid, the check uses `|V_z_Ed|`

## Terms in plain language

- `V_z_Ed`: Applied design shear force about z-z
- `Av_z`: Shear area about z-z
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `V_pl_z_Rd`: Plastic shear resistance about z-z
- `shear_z_check`: Final utilization ratio

## Full node tree (ascii)

```text
                      ┌────────────────────────────────────────────┐
                      │ Shear resistance check about z-z           │
                      │ type: check                                │
                      │ id: shear_z_check                          │
                      │ expr: |V_z_Ed| / V_pl_z_Rd <= 1.0          │
                      └────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
┌────────────────────────────────────────────┐    ┌────────────────────────────────────────────┐
│ Shear force magnitude about z-z            │    │ Plastic shear resistance about z-z         │
│ type: derived                              │    │ type: formula                              │
│ id: abs_V_z_Ed                             │    │ id: V_pl_z_Rd                              │
│ expr: |V_z_Ed|                             │    │ expr: Av_z * fy / (sqrt(3) * gamma_M0)     │
└────────────────────────────────────────────┘    └────────────────────────────────────────────┘
                    │                                               │
┌────────────────────────────────────────────┐    ┌────────────────────────────────────────────┐
│ Design shear force about z-z               │    │ Children: Av_z, fy, gamma_M0              │
│ type: user-input                           │    └────────────────────────────────────────────┘
│ id: V_z_Ed                                 │
└────────────────────────────────────────────┘
```
