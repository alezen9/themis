# Bending Resistance About z-z (EC3 §6.2.5)

## What this check does

This check verifies whether the section can carry the applied bending moment about the z-z axis without exceeding the design resistance moment.

## When it applies

- It applies for finite bending moments about z-z
- It supports `section_class` in `{1,2,3}` and throws `invalid-input-domain` outside this range

## Terms in plain language

- `M_z_Ed`: Applied design bending moment about z-z
- `Wpl_z`: Plastic section modulus about z-z
- `Wel_z`: Elastic section modulus about z-z
- `section_class`: Cross-section class used to select elastic or plastic resistance path
- `W_z_res`: Class-dependent resistance modulus (`Wpl_z` for class 1/2, `Wel_z` for class 3)
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `M_c_z_Rd`: Design resistance moment about z-z
- `bending_z_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                        ┌────────────────────────────────────────────┐
                                        │ Bending resistance check about z-z         │
                                        │ type: check                                │
                                        │ id: bending_z_check                        │
                                        │ expr: |M_z_Ed| / M_c_z_Rd <= 1.0           │
                                        └────────────────────────────────────────────┘
                                                              │
                              ┌───────────────────────────────┴───────────────────────────────┐
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┐
│ Bending moment magnitude about z-z         │                         │ Design resistance moment about z-z         │
│ type: derived                              │                         │ type: formula                              │
│ id: abs_M_z_Ed                             │                         │ id: M_c_z_Rd                               │
│ expr: |M_z_Ed|                             │                         │ expr: W_z_res * fy / gamma_M0              │
└────────────────────────────────────────────┘                         └────────────────────────────────────────────┘
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
│ Design bending moment about z-z            │                         │                                            │                                            │
│ type: user-input                           │                         │                                            │                                            │
│ id: M_z_Ed                                 │                         │                                            │                                            │
└────────────────────────────────────────────┘                         │                                            │                                            │
                                             ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                                             │ Class-dependent resistance modulus         │ │ Steel yield strength                       │ │ Partial safety factor                      │
                                             │ type: derived                              │ │ type: user-input                           │ │ type: coefficient                          │
                                             │ id: W_z_res                                │ │ id: fy                                     │ │ id: gamma_M0                               │
                                             │ expr: class 3 ? Wel_z : Wpl_z              │ │                                            │ │                                            │
                                             └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
                                                                          │
                                     ┌────────────────────────────────────┼────────────────────────────────────┐
                                     │                                    │                                    │
                 ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                 │ Section class                              │ │ Plastic section modulus about z-z          │ │ Elastic section modulus about z-z          │
                 │ type: user-input                           │ │ type: user-input                           │ │ type: user-input                           │
                 │ id: section_class                          │ │ id: Wpl_z                                  │ │ id: Wel_z                                  │
                 └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
```
