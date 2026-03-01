# Check 12 - ulsBendingYAxialShear

- Verification expression: `\frac{M_{y,Ed}}{M_{NV,y,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.6`, `6.2.4`, `6.2.8`, `6.2.9.1`, `6.2.10`
- Formula refs: `(6.18)`, `(6.6)`, `(6.30)`, `(6.36)`
- Verification refs: n/a
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.318362714) |
| i-c2 | I | 2 | ok (0.318362714) |
| i-c3 | I | 3 | ok (0.318362714) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.25538544) |
| rhs-c2 | RHS | 2 | ok (0.25538544) |
| rhs-c3 | RHS | 3 | ok (0.25538544) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.25538544) |
| chs-c2 | CHS | 2 | ok (0.25538544) |
| chs-c3 | CHS | 3 | ok (0.25538544) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.318362714`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0
26. `a_w` (derived) = 0
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 1
36. `axial_ratio` (derived) = 0.80218389
37. `axial_factor` (derived) = 0.80218389
38. `M_NV_y_Rd` (formula) = 6.282143e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.318362714

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 0.8021838898559899,
  "axial_ratio": 0.8021838898559899,
  "axialFactor": 1,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.3183627142174171,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 62821426.966292135,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 1,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.318362714`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0
26. `a_w` (derived) = 0
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 1
36. `axial_ratio` (derived) = 0.80218389
37. `axial_factor` (derived) = 0.80218389
38. `M_NV_y_Rd` (formula) = 6.282143e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.318362714

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 0.8021838898559899,
  "axial_ratio": 0.8021838898559899,
  "axialFactor": 1,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.3183627142174171,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 62821426.966292135,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 2,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.318362714`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0
26. `a_w` (derived) = 0
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 1
36. `axial_ratio` (derived) = 0.80218389
37. `axial_factor` (derived) = 0.80218389
38. `M_NV_y_Rd` (formula) = 6.282143e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.318362714

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 0.8021838898559899,
  "axial_ratio": 0.8021838898559899,
  "axialFactor": 1,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.3183627142174171,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 62821426.966292135,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 3,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-axial-shear: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0.5
26. `a_w` (derived) = 0.5
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 0.75
36. `axial_ratio` (derived) = 1.06957852
37. `axial_factor` (derived) = 1
38. `M_NV_y_Rd` (formula) = 7.831300e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 1,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
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
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0.5
26. `a_w` (derived) = 0.5
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 0.75
36. `axial_ratio` (derived) = 1.06957852
37. `axial_factor` (derived) = 1
38. `M_NV_y_Rd` (formula) = 7.831300e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 2,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0.5
26. `a_w` (derived) = 0.5
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 0.75
36. `axial_ratio` (derived) = 1.06957852
37. `axial_factor` (derived) = 1
38. `M_NV_y_Rd` (formula) = 7.831300e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 3,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-axial-shear: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0.5
26. `a_w` (derived) = 0.5
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 0.75
36. `axial_ratio` (derived) = 1.06957852
37. `axial_factor` (derived) = 1
38. `M_NV_y_Rd` (formula) = 7.831300e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 1,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
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
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0.5
26. `a_w` (derived) = 0.5
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 0.75
36. `axial_ratio` (derived) = 1.06957852
37. `axial_factor` (derived) = 1
38. `M_NV_y_Rd` (formula) = 7.831300e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 2,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `V_z_Ed` (user-input) = 50000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `tw` (user-input) = 5.6
10. `fy` (user-input) = 355
11. `gamma_M0` (coefficient) = 1
12. `sqrt3` (constant) = 1.732050808
13. `V_pl_zProduct` (derived) = 505520
14. `V_pl_zFactor` (derived) = 1.732050808
15. `V_pl_z_Rd` (formula) = 291862.10808074
16. `abs_V_z_Ed` (derived) = 50000
17. `rho_ratio` (derived) = 0.171313777
18. `rho_linear` (derived) = -0.657372447
19. `rho_sq` (derived) = 0.432138534
20. `rho_z` (derived) = 0
21. `N_plProduct` (derived) = 1.011040e+6
22. `N_pl_Rd` (formula) = 1.011040e+6
23. `abs_N_Ed` (derived) = 200000
24. `n` (derived) = 0.19781611
25. `a_w_raw` (derived) = 0.5
26. `a_w` (derived) = 0.5
27. `Av_z_sq` (derived) = 2.027776e+6
28. `shear_mod_reduction` (derived) = 90525.714285714
29. `rho_mod_reduction` (derived) = 0
30. `Wpl_y_eff` (derived) = 220600
31. `M_y_VProduct` (derived) = 7.831300e+7
32. `class_guard` (derived) = 1
33. `M_y_V_Rd` (formula) = 7.831300e+7
34. `axialProduct` (derived) = 0.80218389
35. `axialFactor` (derived) = 0.75
36. `axial_ratio` (derived) = 1.06957852
37. `axial_factor` (derived) = 1
38. `M_NV_y_Rd` (formula) = 7.831300e+7
39. `abs_M_y_Ed` (derived) = 2.000000e+7
40. `bending_y_axial_shear_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "abs_V_z_Ed": 50000,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_shear_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "M_y_V_Rd": 78313000,
  "M_y_VProduct": 78313000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "N_plProduct": 1011040,
  "rho_linear": -0.6573724466749333,
  "rho_mod_reduction": 0,
  "rho_ratio": 0.17131377666253336,
  "rho_sq": 0.4321385336473881,
  "rho_z": 0,
  "section_class": 3,
  "shear_mod_reduction": 90525.71428571429,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_z_Rd": 291862.1080807396,
  "V_pl_zFactor": 1.7320508075688772,
  "V_pl_zProduct": 505520,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-axial-shear: class 4 sections are out of scope`

