# Check 7 - ulsBendingYShear

- Verification expression: `\frac{M_{y,Ed}}{M_{y,V,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.6`, `6.2.8`
- Formula refs: `(6.18)`, `(6.30)`
- Verification refs: n/a
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.25538544) |
| i-c2 | I | 2 | ok (0.25538544) |
| i-c3 | I | 3 | ok (0.281690141) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.25538544) |
| rhs-c2 | RHS | 2 | ok (0.25538544) |
| rhs-c3 | RHS | 3 | ok (0.281690141) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.25538544) |
| chs-c2 | CHS | 2 | ok (0.25538544) |
| chs-c3 | CHS | 3 | ok (0.281690141) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 1
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 220600
24. `Wpl_y_eff` (derived) = 220600
25. `M_y_V_num` (derived) = 7.831300e+7
26. `M_y_V_Rd` (formula) = 7.831300e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 1,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 2
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 220600
24. `Wpl_y_eff` (derived) = 220600
25. `M_y_V_num` (derived) = 7.831300e+7
26. `M_y_V_Rd` (formula) = 7.831300e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 2,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 3
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 200000
24. `Wpl_y_eff` (derived) = 200000
25. `M_y_V_num` (derived) = 7.100000e+7
26. `M_y_V_Rd` (formula) = 7.100000e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 71000000,
  "M_y_V_Rd": 71000000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 3,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 200000,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 200000
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-shear: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 1
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 220600
24. `Wpl_y_eff` (derived) = 220600
25. `M_y_V_num` (derived) = 7.831300e+7
26. `M_y_V_Rd` (formula) = 7.831300e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 1,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 2
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 220600
24. `Wpl_y_eff` (derived) = 220600
25. `M_y_V_num` (derived) = 7.831300e+7
26. `M_y_V_Rd` (formula) = 7.831300e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 2,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 3
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 200000
24. `Wpl_y_eff` (derived) = 200000
25. `M_y_V_num` (derived) = 7.100000e+7
26. `M_y_V_Rd` (formula) = 7.100000e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 71000000,
  "M_y_V_Rd": 71000000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 3,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 200000,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 200000
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-shear: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 1
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 220600
24. `Wpl_y_eff` (derived) = 220600
25. `M_y_V_num` (derived) = 7.831300e+7
26. `M_y_V_Rd` (formula) = 7.831300e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 1,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 2
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 220600
24. `Wpl_y_eff` (derived) = 220600
25. `M_y_V_num` (derived) = 7.831300e+7
26. `M_y_V_Rd` (formula) = 7.831300e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 2,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `V_z_Ed` (user-input) = 50000
3. `section_class` (user-input) = 3
4. `Wel_y` (user-input) = 200000
5. `Wpl_y` (user-input) = 220600
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_z_num` (derived) = 505520
12. `V_pl_z_den` (derived) = 1.732050808
13. `V_pl_z_Rd` (formula) = 291862.10808074
14. `abs_V_z_Ed` (derived) = 50000
15. `rho_ratio` (derived) = 0.171313777
16. `rho_linear` (derived) = -0.657372447
17. `rho_sq` (derived) = 0.432138534
18. `rho_z` (derived) = 0
19. `Av_z_sq` (derived) = 2.027776e+6
20. `shear_mod_reduction` (derived) = 90525.714285714
21. `rho_mod_reduction` (derived) = 0
22. `class_guard` (derived) = 1
23. `W_y_res` (derived) = 200000
24. `Wpl_y_eff` (derived) = 200000
25. `M_y_V_num` (derived) = 7.100000e+7
26. `M_y_V_Rd` (formula) = 7.100000e+7
27. `abs_M_y_Ed` (derived) = 2.000000e+7
28. `bending_y_shear_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "bending_y_shear_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_y_Ed": 20000000,
  "M_y_V_num": 71000000,
  "M_y_V_Rd": 71000000,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 3,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000,
  "W_y_res": 200000,
  "Wel_y": 200000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 200000
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-shear: class 4 sections are out of scope`

