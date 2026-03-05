# Lateral-Torsional Buckling (EC3 SS6.3.2)

## What this check does

This check verifies major-axis bending resistance with lateral-torsional buckling reduction.

## When it applies

- It applies for finite major-axis bending and valid LTB input domain
- Denominator and radical domain checks throw `invalid-input-domain` when violated

## Terms in plain language

- `M_y_Ed`: Design major-axis bending moment
- `M_b_Rd`: LTB reduced bending resistance
- `lambda_bar_LT`: Non-dimensional LTB slenderness
- `chi_LT`: LTB reduction factor
- `ltb_check`: Final utilization ratio

## Full node tree (ascii)

```text
ltb_check
|- abs_M_y_Ed
|  `- M_y_Ed
`- M_b_Rd
   |- chi_LT
   `- M_c_Rk, gamma_M1
```
