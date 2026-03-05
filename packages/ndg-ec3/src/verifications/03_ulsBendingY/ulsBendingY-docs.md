# Bending Resistance About y-y (EC3 §6.2.5)

## What this check does

This check verifies whether the section can carry the applied bending moment about the y-y axis without exceeding the design resistance moment.

## When it applies

- It applies for finite bending moments about y-y
- It supports `section_class` in `{1,2,3}` and throws `invalid-input-domain` outside this range

## Terms in plain language

- `M_y_Ed`: Applied design bending moment about y-y
- `Wpl_y`: Plastic section modulus about y-y
- `Wel_y`: Elastic section modulus about y-y
- `section_class`: Cross-section class used to select elastic or plastic resistance path
- `W_y_res`: Class-dependent resistance modulus (`Wpl_y` for class 1/2, `Wel_y` for class 3)
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `M_c_y_Rd`: Design resistance moment about y-y
- `bending_y_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                        ┌────────────────────────────────────────────┐
                                        │ Bending resistance check about y-y         │
                                        │ type: check                                │
                                        │ id: bending_y_check                        │
                                        │ expr: |M_y_Ed| / M_c_y_Rd <= 1.0           │
                                        └────────────────────────────────────────────┘
                                                              │
                              ┌───────────────────────────────┴───────────────────────────────┐
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┐
│ Bending moment magnitude about y-y         │                         │ Design resistance moment about y-y         │
│ type: derived                              │                         │ type: formula                              │
│ id: abs_M_y_Ed                             │                         │ id: M_c_y_Rd                               │
│ expr: |M_y_Ed|                             │                         │ expr: W_y_res * fy / gamma_M0              │
└────────────────────────────────────────────┘                         └────────────────────────────────────────────┘
                              │                                                               │
┌────────────────────────────────────────────┐                         ┌────────────────────────────────────────────┼────────────────────────────────────────────┐
│ Design bending moment about y-y            │                         │                                            │                                            │
│ type: user-input                           │                         │                                            │                                            │
│ id: M_y_Ed                                 │                         │                                            │                                            │
└────────────────────────────────────────────┘                         │                                            │                                            │
                                             ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                                             │ Class-dependent resistance modulus         │ │ Steel yield strength                       │ │ Partial safety factor                      │
                                             │ type: derived                              │ │ type: user-input                           │ │ type: coefficient                          │
                                             │ id: W_y_res                                │ │ id: fy                                     │ │ id: gamma_M0                               │
                                             │ expr: class 3 ? Wel_y : Wpl_y              │ │                                            │ │                                            │
                                             └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
                                                                          │
                                     ┌────────────────────────────────────┼────────────────────────────────────┐
                                     │                                    │                                    │
                 ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐ ┌────────────────────────────────────────────┐
                 │ Section class                              │ │ Plastic section modulus about y-y          │ │ Elastic section modulus about y-y          │
                 │ type: user-input                           │ │ type: user-input                           │ │ type: user-input                           │
                 │ id: section_class                          │ │ id: Wpl_y                                  │ │ id: Wel_y                                  │
                 └────────────────────────────────────────────┘ └────────────────────────────────────────────┘ └────────────────────────────────────────────┘
```
