# Bending, Axial, and Shear Resistance About y-y (EC3 §6.2.10)

## What this check does

This check verifies the utilization for bending about y-y with simultaneous axial force and shear.

## When it applies

- It applies for supported shapes (`I`, `RHS`, `CHS`) and classes (`1`, `2`, `3`)
- Class `1/2` uses reduced resistance `M_NV_y_Rd`
- Class `3` uses a Von-Mises stress utilization branch

## Terms in plain language

- `rho_z`, `rho_y`: Shear reduction factors from `|V|/V_pl`
- `M_y_V_Rd`: Shear-reduced bending resistance about y-y
- `M_NV_y_Rd`: Shear + axial reduced bending resistance about y-y
- `sigma_v_class3`: Equivalent Von-Mises stress for class 3
- `bending_y_axial_shear_check`: Final utilization ratio

## Full node tree (ascii)

```text
                              bending_y_axial_shear_check
                 (class 1/2: |M_y_Ed| / M_NV_y_Rd, class 3: sigma_v/sigma_limit)
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
              class12_ratio                                        class3_ratio
                   |                                                   |
          +--------+--------+                             +------------+------------+
          |                 |                             |                         |
      abs_M_y_Ed         M_NV_y_Rd                  sigma_v_class3             sigma_limit
          |                 |                             |                         |
        M_y_Ed      +-------+-------+          +----------+----------+          fy,gamma_M0
                    |               |          |                     |
                 M_y_V_Rd       axial_factor  sigma_x_class3      tau_y,tau_z
                    |               |          |                     |
            Wpl_y_eff,fy,gM0   n,a_w branch  sigma_N+sigma_M_y   |V_y|/Av_y,|V_z|/Av_z
                    |               |          |      |
          shape branch (I/RHS/CHS)  |       |N|/A   |M_y|/Wel_y
                    |               |
                 rho_z,rho_y    N_pl_Rd, a_w_raw
                   |   |          |         |
               |V_z|/Vpl_z    A,fy,gM0   shape branch (I/RHS/CHS)
```
