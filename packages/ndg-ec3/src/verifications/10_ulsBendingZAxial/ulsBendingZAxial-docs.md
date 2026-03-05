# Bending and Axial About z-z (EC3 §6.2.9)

## What this check does

This check verifies minor-axis bending with axial force.

- For class 1/2 it uses the interaction reduction path from EC3 §6.2.9.1.
- For class 3 it uses the stress criterion from EC3 §6.2.9.2.

## When it applies

- `section_class` must be `1`, `2`, or `3`.
- `section_shape` branch for `a_f_raw` is `I`, `RHS`, or `CHS`.
- `M_z_Ed` and `N_Ed` must be finite.
- Denominators must remain positive (`N_pl_Rd`, `M_N_z_Rd`, `sigma_limit`).

## Terms in plain language

- `N_pl_Rd`: plastic axial resistance.
- `n`: axial ratio `|N_Ed| / N_pl_Rd`.
- `a_f_raw`: shape-dependent reduction parameter (`I`, `RHS`, `CHS`).
- `a_f`: limited `a_f_raw` (`min(a_f_raw, 0.5)`).
- `axial_factor`: class 1/2 reduction branch.
- `M_N_z_Rd`: reduced bending resistance for class 1/2.
- `sigma_x_class3`: combined normal stress for class 3.
- `sigma_limit`: `fy / gamma_M0`.
- `bending_z_axial_check`: final utilization.

## Full node tree (ascii)

```text
                                bending_z_axial_check
                         (class 1/2: |M_z_Ed|/M_N_z_Rd,
                         class 3: sigma_x_class3/sigma_limit)
                                           |
                 +-------------------------+-------------------------+
                 |                                                   |
            section_class                                          class branch
                 |                                                   |
           section_class                       +---------------------+---------------------+
                                               |                                           |
                                          class12_ratio                                class3_ratio
                                     (abs_M_z_Ed / M_N_z_Rd)                  (sigma_x_class3 / sigma_limit)
                                               |                                           |
                                    +----------+----------+                      +---------+---------+
                                    |                     |                      |                   |
                                abs_M_z_Ed            M_N_z_Rd              sigma_x_class3      sigma_limit
                                    |             (M_pl_z_Rd*axial_factor)    (sigma_N+sigma_M_z) (fy/gamma_M0)
                                  M_z_Ed                |                        |      |              |      |
                                              +---------+----------+          sigma_N  sigma_M_z       fy  gamma_M0
                                              |                    |             |         |             
                                           M_pl_z_Rd          axial_factor    abs_N_Ed  abs_M_z_Ed
                                      (Wpl_z*fy/gamma_M0)          |            |         |
                                              |                    |           N_Ed      M_z_Ed
                                      +-------+------+    +--------+--------+
                                      |              |    |                 |
                                    Wpl_z            fy   n_le_a_f      axial_ratio
                                                         (n <= a_f)   ((n-a_f)/(1-a_f))
                                                              |                 |
                                                         +----+----+       +----+----+
                                                         |         |       |         |
                                                   axial_factor_low high    n       a_f
                                                      (=1)          (=1-r²) |       |
                                                                            N_pl_Rd a_f_raw
                                                                              |       |
                                                                        +-----+----+  +---------------------------+
                                                                        |          |  |            |              |
                                                                        A         fy  a_f_raw_i   a_f_raw_rhs   a_f_raw_chs
                                                                                       (A,b,tf)    (A,h,t)       (=0.5)
                                                                                           \\         |             /
                                                                                            +---------+------------+
                                                                                                      |
                                                                                                section_shape
                                                                                                      |
                                                                                                 section_shape
```
