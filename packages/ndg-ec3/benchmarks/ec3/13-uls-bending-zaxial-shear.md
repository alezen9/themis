# Check 13 - ulsBendingZAxialShear

- Verification expression: `\frac{M_{z,Ed}}{M_{NV,z,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.6`, `6.2.4`, `6.2.8`, `6.2.9.1`, `6.2.10`
- Formula refs: `(6.18)`, `(6.6)`, `(6.38)`
- Verification refs: n/a
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.244098909) |
| i-c2 | I | 2 | ok (0.244098909) |
| i-c3 | I | 3 | ok (0.281690141) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.244098909) |
| rhs-c2 | RHS | 2 | ok (0.244098909) |
| rhs-c3 | RHS | 3 | ok (0.281690141) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.244098909) |
| chs-c2 | CHS | 2 | ok (0.244098909) |
| chs-c3 | CHS | 3 | ok (0.281690141) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 57700
33. `Wpl_z_eff` (derived) = 57700
34. `M_z_V_num` (derived) = 2.048350e+7
35. `M_z_V_Rd` (derived) = 2.048350e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 2.048350e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 57700
33. `Wpl_z_eff` (derived) = 57700
34. `M_z_V_num` (derived) = 2.048350e+7
35. `M_z_V_Rd` (derived) = 2.048350e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 2.048350e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 50000
33. `Wpl_z_eff` (derived) = 50000
34. `M_z_V_num` (derived) = 1.775000e+7
35. `M_z_V_Rd` (derived) = 1.775000e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 1.775000e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 17750000,
  "M_z_Ed": 5000000,
  "M_z_V_num": 17750000,
  "M_z_V_Rd": 17750000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 50000,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 50000,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-axial-shear: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 57700
33. `Wpl_z_eff` (derived) = 57700
34. `M_z_V_num` (derived) = 2.048350e+7
35. `M_z_V_Rd` (derived) = 2.048350e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 2.048350e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 57700
33. `Wpl_z_eff` (derived) = 57700
34. `M_z_V_num` (derived) = 2.048350e+7
35. `M_z_V_Rd` (derived) = 2.048350e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 2.048350e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 50000
33. `Wpl_z_eff` (derived) = 50000
34. `M_z_V_num` (derived) = 1.775000e+7
35. `M_z_V_Rd` (derived) = 1.775000e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 1.775000e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 17750000,
  "M_z_Ed": 5000000,
  "M_z_V_num": 17750000,
  "M_z_V_Rd": 17750000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 50000,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 50000,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-axial-shear: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 57700
33. `Wpl_z_eff` (derived) = 57700
34. `M_z_V_num` (derived) = 2.048350e+7
35. `M_z_V_Rd` (derived) = 2.048350e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 2.048350e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 57700
33. `Wpl_z_eff` (derived) = 57700
34. `M_z_V_num` (derived) = 2.048350e+7
35. `M_z_V_Rd` (derived) = 2.048350e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 2.048350e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `V_y_Ed` (user-input) = 10000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Wel_z` (user-input) = 50000
7. `Wpl_z` (user-input) = 57700
8. `Av_y` (user-input) = 2848
9. `Av_z` (user-input) = 1424
10. `tw` (user-input) = 5.6
11. `fy` (user-input) = 355
12. `gamma_M0` (coefficient) = 1
13. `sqrt3` (constant) = 1.732050808
14. `V_pl_y_num` (derived) = 1.011040e+6
15. `V_pl_y_den` (derived) = 1.732050808
16. `V_pl_y_Rd` (formula) = 583724.216161479
17. `abs_V_y_Ed` (derived) = 10000
18. `rho_ratio` (derived) = 0.017131378
19. `rho_linear` (derived) = -0.965737245
20. `rho_sq` (derived) = 0.932648426
21. `rho_y` (derived) = 0
22. `N_pl_num` (derived) = 1.011040e+6
23. `N_pl_Rd` (formula) = 1.011040e+6
24. `abs_N_Ed` (derived) = 200000
25. `n` (derived) = 0.19781611
26. `a_f_raw` (derived) = 0.5
27. `a_f` (derived) = 0.5
28. `Wpl_z_web` (derived) = 1993.6
29. `Wpl_z_flange` (derived) = 55706.4
30. `rho_flange_reduction` (derived) = 0
31. `class_guard` (derived) = 1
32. `W_z_res` (derived) = 50000
33. `Wpl_z_eff` (derived) = 50000
34. `M_z_V_num` (derived) = 1.775000e+7
35. `M_z_V_Rd` (derived) = 1.775000e+7
36. `n_minus_af` (derived) = -0.30218389
37. `one_minus_af` (derived) = 0.5
38. `axial_ratio` (derived) = -0.60436778
39. `axial_ratio_sq` (derived) = 0.365260413
40. `axial_factor` (derived) = 0.634739587
41. `n_le_af` (derived) = 1
42. `M_NV_z_Rd` (formula) = 1.775000e+7
43. `abs_M_z_Ed` (derived) = 5.000000e+6
44. `bending_z_axial_shear_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.634739586846012,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_shear_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_z_Rd": 17750000,
  "M_z_Ed": 5000000,
  "M_z_V_num": 17750000,
  "M_z_V_Rd": 17750000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "W_z_res": 50000,
  "Wel_z": 50000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 50000,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-axial-shear: class 4 sections are out of scope`

