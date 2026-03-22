# Bending y-y with Shear (EC3 6.2.8)

## What this check does

Checks y-axis bending under high shear using reduced resistance.

## Equation Ledger

| Node key                | EC3 ref      | Expression                                       | Branch                       |
| ----------------------- | ------------ | ------------------------------------------------ | ---------------------------- |
| `V_pl_z_Rd`             | 6.2.6 (6.18) | `A_v,z * f_y / (sqrt(3) * gamma_M0)`             | none                         |
| `u_z`                   | 6.2.8        | `abs(V_z,Ed) / V_pl,z,Rd`                        | none                         |
| `rho_z_1`               | 6.2.8        | `0`                                              | `u_z <= 0.5`                 |
| `rho_z_2`               | 6.2.8        | `(2*u_z - 1)^2`                                  | `u_z > 0.5`                  |
| `rho_z`                 | 6.2.8        | branch-selected `rho`                            | threshold selector           |
| `W_y_res`               | 6.2.8        | `Wpl_y` for class `1/2`, `Wel_y` for class `3`   | `section_class`              |
| `M_y_V_Rd_i`            | 6.2.8 (6.30) | `((W_y,res - rho*A_v,z^2/(4*t_w))*f_y)/gamma_M0` | `section_shape = I`          |
| `M_y_V_Rd_rhs_chs`      | 6.2.8 (3)    | `((W_y,res*(1-rho))*f_y)/gamma_M0`               | `section_shape = RHS or CHS` |
| `M_y_V_Rd`              | 6.2.8        | branch-selected `M_y,V,Rd`                       | shape selector               |
| `bending_y_shear_check` | 6.2.8 (6.29) | `abs(M_y,Ed) / M_y,V,Rd`                         | none                         |

## Node Tree

```text
bending_y_shear_check
|- M_y_Ed
`- M_y_V_Rd
   |- M_y_V_Rd_i (shape I)
   |  |- W_y_res
   |  |  |- Wpl_y (class 1/2)
   |  |  `- Wel_y (class 3)
   |  |- rho_z
   |  |  |- rho_z_1 (u_z <= 0.5)
   |  |  `- rho_z_2 (u_z > 0.5)
   |  |     `- u_z
   |  |        |- V_z_Ed
   |  |        `- V_pl_z_Rd
   |  |           |- Av_z
   |  |           |- fy
   |  |           `- gamma_M0
   |  |- Av_z
   |  |- tw
   |  |- fy
   |  `- gamma_M0
   `- M_y_V_Rd_rhs_chs (shape RHS/CHS)
      |- W_y_res
      |- rho_z
      |- fy
      `- gamma_M0
```
