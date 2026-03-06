# Bending z-z with Shear (EC3 6.2.8)

## What this check does

Checks z-axis bending under high shear using reduced resistance.

## Equation Ledger

| Node key | EC3 ref | Expression | Branch |
|---|---|---|---|
| `V_pl_y_Rd` | 6.2.6 (6.18) | `A_v,y * f_y / (sqrt(3) * gamma_M0)` | none |
| `u_y` | 6.2.8 | `abs(V_y,Ed) / V_pl,y,Rd` | none |
| `rho_y_1` | 6.2.8 | `0` | `u_y <= 0.5` |
| `rho_y_2` | 6.2.8 | `(2*u_y - 1)^2` | `u_y > 0.5` |
| `rho_y` | 6.2.8 | branch-selected `rho_y` | threshold selector |
| `W_z_res` | 6.2.8 | `Wpl_z` for class `1/2`, `Wel_z` for class `3` | `section_class` |
| `W_z_web` | 6.2.8 | `t_w^2(h-2t_f)/4` | I-shape term |
| `M_z_V_Rd_i` | 6.2.8 (3) | `((W_z,res - rho_y*(W_z,res - W_z,web))*f_y)/gamma_M0` | `section_shape = I` |
| `M_z_V_Rd_rhs_chs` | 6.2.8 (3) | `((W_z,res*(1-rho_y))*f_y)/gamma_M0` | `section_shape = RHS or CHS` |
| `M_z_V_Rd` | 6.2.8 | branch-selected `M_z,V,Rd` | shape selector |
| `bending_z_shear_check` | 6.2.8 (6.29) | `abs(M_z,Ed) / M_z,V,Rd` | none |

## Node Tree

```text
bending_z_shear_check
|- M_z_Ed
`- M_z_V_Rd
   |- M_z_V_Rd_i (shape I)
   |  |- W_z_res
   |  |  |- Wpl_z (class 1/2)
   |  |  `- Wel_z (class 3)
   |  |- W_z_web
   |  |  |- tw
   |  |  |- h
   |  |  `- tf
   |  |- rho_y
   |  |  |- rho_y_1 (u_y <= 0.5)
   |  |  `- rho_y_2 (u_y > 0.5)
   |  |     `- u_y
   |  |        |- V_y_Ed
   |  |        `- V_pl_y_Rd
   |  |           |- Av_y
   |  |           |- fy
   |  |           `- gamma_M0
   |  |- fy
   |  `- gamma_M0
   `- M_z_V_Rd_rhs_chs (shape RHS/CHS)
      |- W_z_res
      |- rho_y
      |- fy
      `- gamma_M0
```
