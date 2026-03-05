# Bending and Axial About y-y (EC3 §6.2.9)

## What this check does

This check verifies major-axis bending with axial force.

- For class 1/2 it uses the interaction reduction path from EC3 §6.2.9.1.
- For class 3 it uses the stress criterion from EC3 §6.2.9.2.

## When it applies

- `section_class` must be `1`, `2`, or `3`.
- `section_shape` branch for `a_w_raw` is `I`, `RHS`, or `CHS`.
- `M_y_Ed` and `N_Ed` must be finite.
- Denominators must remain positive (`N_pl_Rd`, `M_N_y_Rd`, `sigma_limit`).

## Terms in plain language

- `N_pl_Rd`: plastic axial resistance.
- `n`: axial ratio `|N_Ed| / N_pl_Rd`.
- `a_w_raw`: shape-dependent area ratio (`I`, `RHS`, `CHS`).
- `a_w`: limited `a_w_raw` (`min(a_w_raw, 0.5)`).
- `axial_factor`: class 1/2 reduction branch.
- `M_N_y_Rd`: reduced bending resistance for class 1/2.
- `sigma_x_class3`: combined normal stress for class 3.
- `sigma_limit`: `fy / gamma_M0`.
- `bending_y_axial_check`: final utilization.

## Full node tree (ascii)

```text
                                bending_y_axial_check
                         (class 1/2: |M_y_Ed|/M_N_y_Rd,
                         class 3: sigma_x_class3/sigma_limit)
                                           |
                 +-------------------------+-------------------------+
                 |                                                   |
            section_class                                          class branch
                 |                                                   |
           section_class                       +---------------------+---------------------+
                                               |                                           |
                                          class12_ratio                                class3_ratio
                                     (abs_M_y_Ed / M_N_y_Rd)                  (sigma_x_class3 / sigma_limit)
                                               |                                           |
                                    +----------+----------+                      +---------+---------+
                                    |                     |                      |                   |
                                abs_M_y_Ed            M_N_y_Rd              sigma_x_class3      sigma_limit
                                    |             (M_pl_y_Rd*axial_factor)    (sigma_N+sigma_M_y) (fy/gamma_M0)
                                  M_y_Ed                |                        |      |              |      |
                                              +---------+----------+          sigma_N  sigma_M_y       fy  gamma_M0
                                              |                    |             |         |             
                                           M_pl_y_Rd          axial_factor    abs_N_Ed  abs_M_y_Ed
                                      (Wpl_y*fy/gamma_M0)          |            |         |
                                              |                    |           N_Ed      M_y_Ed
                                      +-------+------+    +--------+--------+
                                      |              |    |                 |
                                    Wpl_y            fy  n_le_half_a_w   axial_ratio
                                                         (n <= 0.5*a_w)  ((1-n)/(1-0.5*a_w))
                                                              |                 |
                                                         +----+----+       +----+----+
                                                         |         |       |         |
                                                   axial_factor_low high    n       a_w
                                                      (=1)          (=min)  |       |
                                                                            N_pl_Rd a_w_raw
                                                                              |       |
                                                                        +-----+----+  +---------------------------+
                                                                        |          |  |            |              |
                                                                        A         fy  a_w_raw_i   a_w_raw_rhs   a_w_raw_chs
                                                                                       (A,b,tf)    (A,b,t)       (=0.5)
                                                                                           \\         |             /
                                                                                            +---------+------------+
                                                                                                      |
                                                                                                section_shape
                                                                                                      |
                                                                                                 section_shape
```
