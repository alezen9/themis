# Compression Resistance Check (EC3 §6.2.4)

## What this check does

This check verifies whether the section can carry the applied compressive axial force without exceeding its design compression resistance.

## When it applies

- It applies when `N_Ed < 0`
- It throws `not-applicable-load-case` when `N_Ed >= 0` because that is not a compression load case (mapped to N/A in UI)

## Terms in plain language

- `N_Ed`: Applied axial design force
- `A`: Cross-section area
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `N_c_Rd`: Design compression resistance of the section
- `compression_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                        ┌────────────────────────────────────────────┐
                                        │ Compression resistance utilization check   │
                                        │ type: check                                │
                                        │ id: compression_check                      │
                                        │ expr: |N_Ed| / N_c_Rd <= 1.0              │
                                        └────────────────────────────────────────────┘
                                                              │
                              ┌───────────────────────────────┴───────────────────────────────┐
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┐
│ Design compression force                   │                         │ Plastic design compression resistance      │
│ type: user-input                           │                         │ type: formula                              │
│ id: N_Ed                                   │                         │ id: N_c_Rd                                 │
└────────────────────────────────────────────┘                         │ expr: A * fy / gamma_M0                    │
                                                                       └────────────────────────────────────────────┘
                                                                                           │
                                                  ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
                                                  │                                         │                                         │
                               ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                               │ Cross-section area                         │ │ Steel yield strength                       │ │ Partial safety factor                      │
                               │ type: user-input                           │ │ type: user-input                           │ │ type: coefficient                          │
                               │ id: A                                      │ │ id: fy                                     │ │ id: gamma_M0                               │
                               └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
```
