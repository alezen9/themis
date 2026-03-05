# Bending and Shear Resistance About y-y (EC3 §6.2.8)

## What this check does

This check verifies whether the section can carry the applied bending moment about y-y while accounting for shear interaction from `V_z_Ed`.

## When it applies

- It applies for finite `M_y_Ed` and `V_z_Ed`
- It supports `section_class` in `{1,2,3}` and throws `invalid-input-domain` outside this range
- It supports `section_shape` branches `I`, `RHS`, and `CHS`

## Terms in plain language

- `M_y_Ed`: Applied design bending moment about y-y
- `V_z_Ed`: Applied design shear force about z-z
- `Wpl_y`, `Wel_y`: Plastic and elastic section moduli about y-y
- `W_y_res`: Class-dependent resistance modulus (`Wpl_y` for class 1/2, `Wel_y` for class 3)
- `rho_ratio`: Shear ratio `|V_z_Ed| / V_pl_z_Rd`
- `rho_z`: EC3 shear reduction factor (zero when `rho_ratio <= 0.5`)
- `W_y_eff`: Effective modulus under shear, shape-dependent branch
- `M_y_V_Rd`: Reduced bending resistance under shear
- `bending_y_shear_check`: Final utilization ratio

## Full node tree (ascii)

```text
                                      ┌──────────────────────────────────────────────────────┐
                                      │ Bending and shear resistance check about y-y         │
                                      │ id: bending_y_shear_check                            │
                                      │ expr: |M_y_Ed| / M_y_V_Rd <= 1.0                     │
                                      └──────────────────────────────────────────────────────┘
                                                           │
                          ┌────────────────────────────────┴────────────────────────────────┐
                          │                                                                 │
            ┌──────────────────────────────┐                                ┌──────────────────────────────┐
            │ abs_M_y_Ed                   │                                │ M_y_V_Rd                     │
            │ expr: |M_y_Ed|               │                                │ expr: W_y_eff*fy/gamma_M0    │
            └──────────────────────────────┘                                └──────────────────────────────┘
                          │                                                                 │
                    ┌──────────────┐                                 ┌──────────────────────┼──────────────────────┐
                    │ M_y_Ed        │                                 │                      │                      │
                    └──────────────┘                           ┌──────────────┐        ┌──────────────┐      ┌──────────────┐
                                                               │ W_y_eff      │        │ fy           │      │ gamma_M0     │
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
               │ W_y_eff_i          │                                                                                                                                │ W_y_eff_rhs / chs  │
               │ expr: W_y_res -    │                                                                                                                                │ expr: W_y_res*(1-rho_z) │
               │ rho_z*Av_z^2/(4*tw)│                                                                                                                                └────────────────────┘
               └────────────────────┘                                                                                                                                                │
                         │                                                                                                                                                             ┌──────────────┴──────────────┐
          ┌──────────────┼──────────────┬──────────────┬──────────────┐                                                                                                             │                             │
          │              │              │              │              │                                                                                                       ┌──────────────┐             ┌──────────────┐
     ┌──────────┐  ┌──────────┐   ┌──────────┐   ┌──────────┐                                                                                                                      │ W_y_res      │             │ rho_z        │
     │ W_y_res  │  │ rho_z    │   │ Av_z     │   │ tw       │                                                                                                                      └──────────────┘             └──────────────┘
     └──────────┘  └──────────┘   └──────────┘   └──────────┘
          │              │
   ┌──────┴──────┐   ┌───┴──────────────┐
   │ section_class│   │ rho_ratio       │
   └──────────────┘   │ expr: |V_z_Ed|/V_pl_z_Rd
          │           └──────────────────┘
  ┌───────┴───────────┐          │
  │ class branches     │   ┌──────┴────────────┐
  │ W_y_res_class12/3  │   │ abs_V_z_Ed + V_pl_z_Rd │
  └────────────────────┘   └────────────────────┘
```
