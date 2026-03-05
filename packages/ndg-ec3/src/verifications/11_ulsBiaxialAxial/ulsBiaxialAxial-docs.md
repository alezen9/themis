# Biaxial Bending and Axial Force (EC3 §6.2.9)

## What this check does

This check combines major-axis bending, minor-axis bending, and axial force.

- For class 1/2 it uses the biaxial interaction from EC3 §6.2.9.1.
- For class 3 it uses the stress criterion from EC3 §6.2.9.2.

## When it applies

- `section_class` must be `1`, `2`, or `3`.
- `section_shape` branches are `I`, `RHS`, `CHS`.
- `M_y_Ed`, `M_z_Ed`, and `N_Ed` must be finite.
- Denominators must remain positive (`N_pl_Rd`, `M_N_y_Rd`, `M_N_z_Rd`, `sigma_limit`).

## Terms in plain language

- `n`: axial ratio `|N_Ed| / N_pl_Rd`.
- `M_N_y_Rd`, `M_N_z_Rd`: reduced resistances under axial force.
- `ratio_y`, `ratio_z`: per-axis moment ratios.
- `alpha_biax`, `beta_biax`: shape-dependent exponents.
- `term_y`, `term_z`: powered interaction terms used in class 1/2.
- `sigma_x_class3`: class-3 stress sum from axial + y + z.
- `sigma_limit`: `fy / gamma_M0`.
- `biaxial_axial_check`: final utilization.

## Full node tree (ascii)

```text
                                    biaxial_axial_check
                   (class 1/2: term_y + term_z, class 3: sigma_x_class3/sigma_limit)
                                               |
                    +--------------------------+--------------------------+
                    |                                                     |
               section_class                                           class branch
                    |                                                     |
              section_class                    +--------------------------+--------------------------+
                                                |                                                     |
                                           class12_ratio                                          class3_ratio
                                           (term_y+term_z)                               (sigma_x_class3/sigma_limit)
                                                |                                                     |
                                +---------------+---------------+                     +---------------+---------------+
                                |                               |                     |                               |
                              term_y                          term_z             sigma_x_class3                    sigma_limit
                        (ratio_y^alpha_biax)           (ratio_z^beta_biax)   (sigma_N+sigma_M_y+sigma_M_z)      (fy/gamma_M0)
                                |                               |                     |         |         |           |      |
                    +-----------+-----------+        +----------+----------+      sigma_N   sigma_M_y  sigma_M_z    fy  gamma_M0
                    |                       |        |                     |         |          |          |
                 ratio_y                alpha_biax ratio_z             beta_biax  abs_N_Ed   abs_M_y_Ed  abs_M_z_Ed
              (|M_y_Ed|/M_N_y_Rd)       (shape) (|M_z_Ed|/M_N_z_Rd)    (shape)      |          |          |
                    |                                  |                             N_Ed       M_y_Ed      M_z_Ed
          +---------+---------+              +---------+---------+
          |                   |              |                   |
       abs_M_y_Ed         M_N_y_Rd       abs_M_z_Ed         M_N_z_Rd
                             |                                  |
                     +-------+-------+                  +-------+-------+
                     |               |                  |               |
                  M_pl_y_Rd     axial_y_factor       M_pl_z_Rd     axial_z_factor
                     |               |                  |               |
                  W_y_res        axial_y_ratio       W_z_res        axial_z_ratio / (n<=a_f)
                     |               |                  |               |
               class branch         n,a_w          class branch         n,a_f
                                     |                                  |
                              +------+-----+                     +------+------+
                              |            |                     |             |
                              n          a_w                   n             a_f
                              |            |                                  |
                           N_pl_Rd      a_w_raw                             a_f_raw
                              |            |                                  |
                            A,fy,gM0   shape branch                        shape branch
                                          (I/RHS/CHS)                        (I/RHS/CHS)
```
