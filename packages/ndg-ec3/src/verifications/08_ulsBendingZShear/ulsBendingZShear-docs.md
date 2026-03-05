# Bending and Shear Resistance About z-z (EC3 §6.2.8)

## What this check does

This check verifies whether the section can carry the applied bending moment about z-z while accounting for shear interaction from `V_y_Ed`.

## When it applies

- It applies for finite `M_z_Ed` and `V_y_Ed`
- It supports `section_class` in `{1,2,3}` and throws `invalid-input-domain` outside this range
- It supports `section_shape` branches `I`, `RHS`, and `CHS`

## Terms in plain language

- `M_z_Ed`: Applied design bending moment about z-z
- `V_y_Ed`: Applied design shear force about y-y
- `Wpl_z`, `Wel_z`: Plastic and elastic section moduli about z-z
- `W_z_res`: Class-dependent resistance modulus (`Wpl_z` for class 1/2, `Wel_z` for class 3)
- `rho_ratio`: Shear ratio `|V_y_Ed| / V_pl_y_Rd`
- `rho_y`: EC3 shear reduction factor (zero when `rho_ratio <= 0.5`)
- `W_z_eff`: Effective modulus under shear, shape-dependent branch
- `M_z_V_Rd`: Reduced bending resistance under shear
- `bending_z_shear_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                      ┌──────────────────────────────────────────────────────┐
                                      │ Bending and shear resistance check about z-z         │
                                      │ id: bending_z_shear_check                            │
                                      │ expr: |M_z_Ed| / M_z_V_Rd <= 1.0                     │
                                      └──────────────────────────────────────────────────────┘
                                                           │
                          ┌────────────────────────────────┴────────────────────────────────┐
                          │                                                                 │
            ┌──────────────────────────────┐                                ┌──────────────────────────────┐
            │ abs_M_z_Ed                   │                                │ M_z_V_Rd                     │
            │ expr: |M_z_Ed|               │                                │ expr: W_z_eff*fy/gamma_M0    │
            └──────────────────────────────┘                                └──────────────────────────────┘
                          │                                                                 │
                    ┌──────────────┐                                 ┌──────────────────────┼──────────────────────┐
                    │ M_z_Ed        │                                 │                      │                      │
                    └──────────────┘                           ┌──────────────┐        ┌──────────────┐      ┌──────────────┐
                                                               │ W_z_eff      │        │ fy           │      │ gamma_M0     │
                                                               └──────────────┘        └──────────────┘      └──────────────┘
                                                                      │
                    ┌─────────────────────────────────────────────────┴─────────────────────────────────────────────────┐
                    │                                                                                                   │
          ┌────────────────────┐                                                                           ┌────────────────────┐
          │ section_shape      │                                                                           │ shape branches     │
          └────────────────────┘                                                                           │ I / RHS / CHS      │
                                                                                                           └────────────────────┘
                                                                                                                        │
                         ┌──────────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┐
                         │                                                                                                                                                                                                             │
               ┌────────────────────┐                                                                                                                                ┌────────────────────┐
               │ W_z_eff_i          │                                                                                                                                │ W_z_eff_rhs / chs  │
               │ expr: W_z_res -    │                                                                                                                                │ expr: W_z_res*(1-rho_y) │
               │ rho_y*(W_z_res-W_z_web)│                                                                                                                             └────────────────────┘
               └────────────────────┘                                                                                                                                                │
                         │                                                                                                                                                             ┌──────────────┴──────────────┐
          ┌──────────────┼──────────────┬──────────────┐                                                                                                                            │                             │
          │              │              │              │                                                                                                                      ┌──────────────┐             ┌──────────────┐
     ┌──────────┐  ┌──────────┐   ┌──────────┐                                                                                                                              │ W_z_res      │             │ rho_y        │
     │ W_z_res  │  │ W_z_web  │   │ rho_y    │                                                                                                                              └──────────────┘             └──────────────┘
     └──────────┘  └──────────┘   └──────────┘
          │              │              │
   ┌──────┴──────┐   ┌───┴────────┐   ┌───┴──────────────┐
   │ section_class│   │ tw h tf    │   │ rho_ratio       │
   └──────────────┘   └────────────┘   │ expr: |V_y_Ed|/V_pl_y_Rd
          │                             └──────────────────┘
  ┌───────┴───────────┐                          │
  │ class branches     │                 ┌───────┴──────────┐
  │ W_z_res_class12/3  │                 │ abs_V_y_Ed +     │
  └────────────────────┘                 │ V_pl_y_Rd         │
                                         └───────────────────┘
```
