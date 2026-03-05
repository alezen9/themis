# Bending, Axial, and Shear Resistance About z-z (EC3 §6.2.10)

## What this check does

This check verifies the utilization for bending about z-z with simultaneous axial force and shear.

## When it applies

- It applies for supported shapes (`I`, `RHS`, `CHS`) and classes (`1`, `2`, `3`)
- Class `1/2` uses reduced resistance `M_NV_z_Rd`
- Class `3` uses a Von-Mises stress utilization branch

## Terms in plain language

- `rho_y`: shear reduction factor from `|V_y|/V_pl_y_Rd`
- `M_z_V_Rd`: shear-reduced bending resistance about z-z
- `M_NV_z_Rd`: shear + axial reduced bending resistance about z-z
- `sigma_v_class3`: equivalent Von-Mises stress for class 3
- `bending_z_axial_shear_check`: final utilization ratio

## Full node tree (ascii)

```text
                              bending_z_axial_shear_check
                 (class 1/2: |M_z_Ed| / M_NV_z_Rd, class 3: sigma_v/sigma_limit)
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
              class12_ratio                                        class3_ratio
                   |                                                   |
          +--------+--------+                             +------------+------------+
          |                 |                             |                         |
      abs_M_z_Ed         M_NV_z_Rd                  sigma_v_class3             sigma_limit
          |                 |                             |                         |
        M_z_Ed      +-------+-------+          +----------+----------+          fy,gamma_M0
                    |               |          |                     |
                 M_z_V_Rd       axial_factor  sigma_x_class3        tau_y
                    |               |          |                     |
            Wpl_z_eff,fy,gM0   n,a_f branch  sigma_N+sigma_M_z   |V_y|/Av_y
                    |               |          |      |
            Wpl_z,rho_y,Wpl_z_web N_pl_Rd,a_f_raw |N|/A |M_z|/Wel_z
                    |               |                     |
               |V_y|/Vpl_y      A,fy,gM0               M_z_Ed
```
