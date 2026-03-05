# Tension Resistance Check (EC3 §6.2.3)

## What this check does

This check verifies whether the section can carry the applied tensile axial force without exceeding its design tensile resistance.

## When it applies

- It applies when `N_Ed > 0`
- It throws `not-applicable-load-case` when `N_Ed <= 0` because that is not a tension load case (mapped to N/A in UI)

## Terms in plain language

- `N_Ed`: Applied axial design force
- `A`: Cross-section area
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `N_pl_Rd`: Design tensile resistance of the section
- `tension_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                        ┌────────────────────────────────────────────┐
                                        │ Tension resistance utilization check       │
                                        │ type: check                                │
                                        │ id: tension_check                          │
                                        │ expr: |N_Ed| / N_pl_Rd <= 1.0              │
                                        └────────────────────────────────────────────┘
                                                              │
                              ┌───────────────────────────────┴───────────────────────────────┐
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┐
│ Tensile force magnitude                    │                         │ Plastic design tensile resistance          │
│ type: derived                              │                         │ type: formula                              │
│ id: abs_N_Ed                               │                         │ id: N_pl_Rd                                │
│ expr: |N_Ed|                               │                         │ expr: A * fy / gamma_M0                    │
└────────────────────────────────────────────┘                         └────────────────────────────────────────────┘
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
│ Design tensile force                       │                         │                                            │                                            │
│ type: user-input                           │                         │                                            │                                            │
│ id: N_Ed                                   │                         │                                            │                                            │
└────────────────────────────────────────────┘                         │                                            │                                            │
                                             ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                                             │ Cross-section area                         │ │ Steel yield strength                       │ │ Partial safety factor                      │
                                             │ type: user-input                           │ │ type: user-input                           │ │ type: coefficient                          │
                                             │ id: A                                      │ │ id: fy                                     │ │ id: gamma_M0                               │
                                             └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
```
