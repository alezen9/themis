# Compression Resistance Check (EC3 §6.2.4)

## What this check does

This check verifies whether the section can carry the applied compressive axial force without exceeding its design compression resistance.

## When it applies

- It_mm4 applies when `N_Ed < 0`
- It_mm4 throws `not-applicable-load-case` when `N_Ed >= 0` because that is not a compression load case (mapped to N/A_mm2 in UI)

## Terms in plain language

- `N_Ed`: Applied axial design force
- `A_mm2`: Cross-section area
- `fy_MPa`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `N_c_Rd_N`: Design compression resistance of the section
- `compression_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                        ┌────────────────────────────────────────────┐
                                        │ Compression resistance utilization check   │
                                        │ type: check                                │
                                        │ id: compression_check                      │
                                        │ expr: |N_Ed| / N_c_Rd_N <= 1.0              │
                                        └────────────────────────────────────────────┘
                                                              │
                              ┌───────────────────────────────┴───────────────────────────────┐
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┐
│ Design compression force                   │                         │ Plastic design compression resistance      │
│ type: user-input                           │                         │ type: formula                              │
│ id: N_Ed                                   │                         │ id: N_c_Rd_N                                 │
└────────────────────────────────────────────┘                         │ expr: A_mm2 * fy_MPa / gamma_M0                    │
                                                                       └────────────────────────────────────────────┘
                                                                                           │
                                                  ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
                                                  │                                         │                                         │
                               ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                               │ Cross-section area                         │ │ Steel yield strength                       │ │ Partial safety factor                      │
                               │ type: user-input                           │ │ type: user-input                           │ │ type: coefficient                          │
                               │ id: A_mm2                                      │ │ id: fy_MPa                                     │ │ id: gamma_M0                               │
                               └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
```
