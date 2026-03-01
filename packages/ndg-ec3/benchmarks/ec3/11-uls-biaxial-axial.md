# Check 11 - ulsBiaxialAxial

- Verification expression: `\left(\frac{M_{y,Ed}}{M_{N,y,Rd}}\right)^\alpha + \left(\frac{M_{z,Ed}}{M_{N,z,Rd}}\right)^\beta \leq 1.0`
- Section refs: `6.1`, `6.2.4`, `6.2.5`, `6.2.9.1`
- Formula refs: `(6.6)`, `(6.13)`, `(6.36)`, `(6.38)`
- Verification refs: `(6.41)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.355394612) |
| i-c2 | I | 2 | ok (0.355394612) |
| i-c3 | I | 3 | ok (0.416471106) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.179778125) |
| rhs-c2 | RHS | 2 | ok (0.179778125) |
| rhs-c3 | RHS | 3 | ok (0.221510529) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.124806001) |
| chs-c2 | CHS | 2 | ok (0.124806001) |
| chs-c3 | CHS | 3 | ok (0.158698671) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.355394612`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0
18. `a_w` (derived) = 0
19. `a_f_raw` (derived) = 0
20. `a_f` (derived) = 0
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 220600
23. `W_z_res` (derived) = 57700
24. `M_pl_yProduct` (derived) = 7.831300e+7
25. `M_pl_y_Rd` (formula) = 7.831300e+7
26. `M_pl_zProduct` (derived) = 2.048350e+7
27. `M_pl_z_Rd` (formula) = 2.048350e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 1
30. `axial_y_ratio` (derived) = 0.80218389
31. `axial_y_factor` (derived) = 0.80218389
32. `M_N_y_Rd` (formula) = 6.282143e+7
33. `axial_zProduct` (derived) = 0.19781611
34. `axial_zFactor` (derived) = 1
35. `axial_z_ratio` (derived) = 0.19781611
36. `axial_z_ratio_sq` (derived) = 0.039131213
37. `axial_z_factor` (derived) = 0.960868787
38. `M_N_z_Rd` (formula) = 1.968196e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 2
44. `beta_biax` (derived) = 1
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.318362714
48. `ratio_z` (derived) = 0.254039794
49. `term_y` (derived) = 0.101354818
50. `term_z` (derived) = 0.254039794
51. `biaxial_axial_check` (check) = 0.355394612

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0,
  "a_f_raw": 0,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 0.8021838898559899,
  "axial_y_ratio": 0.8021838898559899,
  "axial_yFactor": 1,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 0.9608687865674929,
  "axial_z_ratio": 0.19781611014401013,
  "axial_z_ratio_sq": 0.039131213432507146,
  "axial_zFactor": 1,
  "axial_zProduct": 0.19781611014401013,
  "beta_biax": 1,
  "biaxial_axial_check": 0.35539461209241285,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 62821426.966292135,
  "M_N_z_Rd": 19681955.78965524,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
  "M_pl_z_Rd": 20483500,
  "M_pl_zProduct": 20483500,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.3183627142174171,
  "ratio_z": 0.2540397942885321,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 1,
  "term_y": 0.10135481780388078,
  "term_z": 0.2540397942885321,
  "W_y_res": 220600,
  "W_z_res": 57700,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.355394612`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0
18. `a_w` (derived) = 0
19. `a_f_raw` (derived) = 0
20. `a_f` (derived) = 0
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 220600
23. `W_z_res` (derived) = 57700
24. `M_pl_yProduct` (derived) = 7.831300e+7
25. `M_pl_y_Rd` (formula) = 7.831300e+7
26. `M_pl_zProduct` (derived) = 2.048350e+7
27. `M_pl_z_Rd` (formula) = 2.048350e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 1
30. `axial_y_ratio` (derived) = 0.80218389
31. `axial_y_factor` (derived) = 0.80218389
32. `M_N_y_Rd` (formula) = 6.282143e+7
33. `axial_zProduct` (derived) = 0.19781611
34. `axial_zFactor` (derived) = 1
35. `axial_z_ratio` (derived) = 0.19781611
36. `axial_z_ratio_sq` (derived) = 0.039131213
37. `axial_z_factor` (derived) = 0.960868787
38. `M_N_z_Rd` (formula) = 1.968196e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 2
44. `beta_biax` (derived) = 1
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.318362714
48. `ratio_z` (derived) = 0.254039794
49. `term_y` (derived) = 0.101354818
50. `term_z` (derived) = 0.254039794
51. `biaxial_axial_check` (check) = 0.355394612

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0,
  "a_f_raw": 0,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 0.8021838898559899,
  "axial_y_ratio": 0.8021838898559899,
  "axial_yFactor": 1,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 0.9608687865674929,
  "axial_z_ratio": 0.19781611014401013,
  "axial_z_ratio_sq": 0.039131213432507146,
  "axial_zFactor": 1,
  "axial_zProduct": 0.19781611014401013,
  "beta_biax": 1,
  "biaxial_axial_check": 0.35539461209241285,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 62821426.966292135,
  "M_N_z_Rd": 19681955.78965524,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
  "M_pl_z_Rd": 20483500,
  "M_pl_zProduct": 20483500,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.3183627142174171,
  "ratio_z": 0.2540397942885321,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 2,
  "term_y": 0.10135481780388078,
  "term_z": 0.2540397942885321,
  "W_y_res": 220600,
  "W_z_res": 57700,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.416471106`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0
18. `a_w` (derived) = 0
19. `a_f_raw` (derived) = 0
20. `a_f` (derived) = 0
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 200000
23. `W_z_res` (derived) = 50000
24. `M_pl_yProduct` (derived) = 7.100000e+7
25. `M_pl_y_Rd` (formula) = 7.100000e+7
26. `M_pl_zProduct` (derived) = 1.775000e+7
27. `M_pl_z_Rd` (formula) = 1.775000e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 1
30. `axial_y_ratio` (derived) = 0.80218389
31. `axial_y_factor` (derived) = 0.80218389
32. `M_N_y_Rd` (formula) = 5.695506e+7
33. `axial_zProduct` (derived) = 0.19781611
34. `axial_zFactor` (derived) = 1
35. `axial_z_ratio` (derived) = 0.19781611
36. `axial_z_ratio_sq` (derived) = 0.039131213
37. `axial_z_factor` (derived) = 0.960868787
38. `M_N_z_Rd` (formula) = 1.705542e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 2
44. `beta_biax` (derived) = 1
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.351154074
48. `ratio_z` (derived) = 0.293161923
49. `term_y` (derived) = 0.123309184
50. `term_z` (derived) = 0.293161923
51. `biaxial_axial_check` (check) = 0.416471106

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0,
  "a_f_raw": 0,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 0.8021838898559899,
  "axial_y_ratio": 0.8021838898559899,
  "axial_yFactor": 1,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 0.9608687865674929,
  "axial_z_ratio": 0.19781611014401013,
  "axial_z_ratio_sq": 0.039131213432507146,
  "axial_zFactor": 1,
  "axial_zProduct": 0.19781611014401013,
  "beta_biax": 1,
  "biaxial_axial_check": 0.4164711061425276,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 56955056.17977528,
  "M_N_z_Rd": 17055420.961572997,
  "M_pl_y_Rd": 71000000,
  "M_pl_yProduct": 71000000,
  "M_pl_z_Rd": 17750000,
  "M_pl_zProduct": 17750000,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.351154073781811,
  "ratio_z": 0.293161922608966,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 3,
  "term_y": 0.12330918353356157,
  "term_z": 0.293161922608966,
  "W_y_res": 200000,
  "W_z_res": 50000,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `biaxial-axial: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.179778125`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `a_f_raw` (derived) = 0.5
20. `a_f` (derived) = 0.5
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 220600
23. `W_z_res` (derived) = 57700
24. `M_pl_yProduct` (derived) = 7.831300e+7
25. `M_pl_y_Rd` (formula) = 7.831300e+7
26. `M_pl_zProduct` (derived) = 2.048350e+7
27. `M_pl_z_Rd` (formula) = 2.048350e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 0.75
30. `axial_y_ratio` (derived) = 1.06957852
31. `axial_y_factor` (derived) = 1
32. `M_N_y_Rd` (formula) = 7.831300e+7
33. `axial_zProduct` (derived) = -0.30218389
34. `axial_zFactor` (derived) = 0.5
35. `axial_z_ratio` (derived) = -0.60436778
36. `axial_z_ratio_sq` (derived) = 0.365260413
37. `axial_z_factor` (derived) = 1
38. `M_N_z_Rd` (formula) = 2.048350e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 1.736798214
44. `beta_biax` (derived) = 1.736798214
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.25538544
48. `ratio_z` (derived) = 0.244098909
49. `term_y` (derived) = 0.093415578
50. `term_z` (derived) = 0.086362547
51. `biaxial_axial_check` (check) = 0.179778125

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 1.7367982144283314,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 1,
  "axial_y_ratio": 1.0695785198079866,
  "axial_yFactor": 0.75,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 1,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "axial_zFactor": 0.5,
  "axial_zProduct": -0.3021838898559899,
  "beta_biax": 1.7367982144283314,
  "biaxial_axial_check": 0.17977812474651814,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_N_z_Rd": 20483500,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
  "M_pl_z_Rd": 20483500,
  "M_pl_zProduct": 20483500,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 1,
  "term_y": 0.09341557791389618,
  "term_z": 0.08636254683262196,
  "W_y_res": 220600,
  "W_z_res": 57700,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.179778125`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `a_f_raw` (derived) = 0.5
20. `a_f` (derived) = 0.5
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 220600
23. `W_z_res` (derived) = 57700
24. `M_pl_yProduct` (derived) = 7.831300e+7
25. `M_pl_y_Rd` (formula) = 7.831300e+7
26. `M_pl_zProduct` (derived) = 2.048350e+7
27. `M_pl_z_Rd` (formula) = 2.048350e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 0.75
30. `axial_y_ratio` (derived) = 1.06957852
31. `axial_y_factor` (derived) = 1
32. `M_N_y_Rd` (formula) = 7.831300e+7
33. `axial_zProduct` (derived) = -0.30218389
34. `axial_zFactor` (derived) = 0.5
35. `axial_z_ratio` (derived) = -0.60436778
36. `axial_z_ratio_sq` (derived) = 0.365260413
37. `axial_z_factor` (derived) = 1
38. `M_N_z_Rd` (formula) = 2.048350e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 1.736798214
44. `beta_biax` (derived) = 1.736798214
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.25538544
48. `ratio_z` (derived) = 0.244098909
49. `term_y` (derived) = 0.093415578
50. `term_z` (derived) = 0.086362547
51. `biaxial_axial_check` (check) = 0.179778125

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 1.7367982144283314,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 1,
  "axial_y_ratio": 1.0695785198079866,
  "axial_yFactor": 0.75,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 1,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "axial_zFactor": 0.5,
  "axial_zProduct": -0.3021838898559899,
  "beta_biax": 1.7367982144283314,
  "biaxial_axial_check": 0.17977812474651814,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_N_z_Rd": 20483500,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
  "M_pl_z_Rd": 20483500,
  "M_pl_zProduct": 20483500,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 2,
  "term_y": 0.09341557791389618,
  "term_z": 0.08636254683262196,
  "W_y_res": 220600,
  "W_z_res": 57700,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.221510529`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `a_f_raw` (derived) = 0.5
20. `a_f` (derived) = 0.5
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 200000
23. `W_z_res` (derived) = 50000
24. `M_pl_yProduct` (derived) = 7.100000e+7
25. `M_pl_y_Rd` (formula) = 7.100000e+7
26. `M_pl_zProduct` (derived) = 1.775000e+7
27. `M_pl_z_Rd` (formula) = 1.775000e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 0.75
30. `axial_y_ratio` (derived) = 1.06957852
31. `axial_y_factor` (derived) = 1
32. `M_N_y_Rd` (formula) = 7.100000e+7
33. `axial_zProduct` (derived) = -0.30218389
34. `axial_zFactor` (derived) = 0.5
35. `axial_z_ratio` (derived) = -0.60436778
36. `axial_z_ratio_sq` (derived) = 0.365260413
37. `axial_z_factor` (derived) = 1
38. `M_N_z_Rd` (formula) = 1.775000e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 1.736798214
44. `beta_biax` (derived) = 1.736798214
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.281690141
48. `ratio_z` (derived) = 0.281690141
49. `term_y` (derived) = 0.110755265
50. `term_z` (derived) = 0.110755265
51. `biaxial_axial_check` (check) = 0.221510529

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 1.7367982144283314,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 1,
  "axial_y_ratio": 1.0695785198079866,
  "axial_yFactor": 0.75,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 1,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "axial_zFactor": 0.5,
  "axial_zProduct": -0.3021838898559899,
  "beta_biax": 1.7367982144283314,
  "biaxial_axial_check": 0.2215105291521538,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_N_z_Rd": 17750000,
  "M_pl_y_Rd": 71000000,
  "M_pl_yProduct": 71000000,
  "M_pl_z_Rd": 17750000,
  "M_pl_zProduct": 17750000,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.28169014084507044,
  "ratio_z": 0.28169014084507044,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 3,
  "term_y": 0.1107552645760769,
  "term_z": 0.1107552645760769,
  "W_y_res": 200000,
  "W_z_res": 50000,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `biaxial-axial: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.124806001`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 1
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `a_f_raw` (derived) = 0.5
20. `a_f` (derived) = 0.5
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 220600
23. `W_z_res` (derived) = 57700
24. `M_pl_yProduct` (derived) = 7.831300e+7
25. `M_pl_y_Rd` (formula) = 7.831300e+7
26. `M_pl_zProduct` (derived) = 2.048350e+7
27. `M_pl_z_Rd` (formula) = 2.048350e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 0.75
30. `axial_y_ratio` (derived) = 1.06957852
31. `axial_y_factor` (derived) = 1
32. `M_N_y_Rd` (formula) = 7.831300e+7
33. `axial_zProduct` (derived) = -0.30218389
34. `axial_zFactor` (derived) = 0.5
35. `axial_z_ratio` (derived) = -0.60436778
36. `axial_z_ratio_sq` (derived) = 0.365260413
37. `axial_z_factor` (derived) = 1
38. `M_N_z_Rd` (formula) = 2.048350e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 2
44. `beta_biax` (derived) = 2
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.25538544
48. `ratio_z` (derived) = 0.244098909
49. `term_y` (derived) = 0.065221723
50. `term_z` (derived) = 0.059584277
51. `biaxial_axial_check` (check) = 0.124806001

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 1,
  "axial_y_ratio": 1.0695785198079866,
  "axial_yFactor": 0.75,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 1,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "axial_zFactor": 0.5,
  "axial_zProduct": -0.3021838898559899,
  "beta_biax": 2,
  "biaxial_axial_check": 0.12480600052251044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_N_z_Rd": 20483500,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
  "M_pl_z_Rd": 20483500,
  "M_pl_zProduct": 20483500,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 1,
  "term_y": 0.06522172320714018,
  "term_z": 0.05958427731537026,
  "W_y_res": 220600,
  "W_z_res": 57700,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.124806001`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 2
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `a_f_raw` (derived) = 0.5
20. `a_f` (derived) = 0.5
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 220600
23. `W_z_res` (derived) = 57700
24. `M_pl_yProduct` (derived) = 7.831300e+7
25. `M_pl_y_Rd` (formula) = 7.831300e+7
26. `M_pl_zProduct` (derived) = 2.048350e+7
27. `M_pl_z_Rd` (formula) = 2.048350e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 0.75
30. `axial_y_ratio` (derived) = 1.06957852
31. `axial_y_factor` (derived) = 1
32. `M_N_y_Rd` (formula) = 7.831300e+7
33. `axial_zProduct` (derived) = -0.30218389
34. `axial_zFactor` (derived) = 0.5
35. `axial_z_ratio` (derived) = -0.60436778
36. `axial_z_ratio_sq` (derived) = 0.365260413
37. `axial_z_factor` (derived) = 1
38. `M_N_z_Rd` (formula) = 2.048350e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 2
44. `beta_biax` (derived) = 2
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.25538544
48. `ratio_z` (derived) = 0.244098909
49. `term_y` (derived) = 0.065221723
50. `term_z` (derived) = 0.059584277
51. `biaxial_axial_check` (check) = 0.124806001

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 1,
  "axial_y_ratio": 1.0695785198079866,
  "axial_yFactor": 0.75,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 1,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "axial_zFactor": 0.5,
  "axial_zProduct": -0.3021838898559899,
  "beta_biax": 2,
  "biaxial_axial_check": 0.12480600052251044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_N_z_Rd": 20483500,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
  "M_pl_z_Rd": 20483500,
  "M_pl_zProduct": 20483500,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 2,
  "term_y": 0.06522172320714018,
  "term_z": 0.05958427731537026,
  "W_y_res": 220600,
  "W_z_res": 57700,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.158698671`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `section_class` (user-input) = 3
5. `A` (user-input) = 2848
6. `Av_y` (user-input) = 2848
7. `Wel_y` (user-input) = 200000
8. `Wel_z` (user-input) = 50000
9. `Wpl_y` (user-input) = 220600
10. `Wpl_z` (user-input) = 57700
11. `Av_z` (user-input) = 1424
12. `fy` (user-input) = 355
13. `gamma_M0` (coefficient) = 1
14. `N_pl_Rd` (formula) = 1.011040e+6
15. `abs_N_Ed` (derived) = 200000
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `a_f_raw` (derived) = 0.5
20. `a_f` (derived) = 0.5
21. `class_guard` (derived) = 1
22. `W_y_res` (derived) = 200000
23. `W_z_res` (derived) = 50000
24. `M_pl_yProduct` (derived) = 7.100000e+7
25. `M_pl_y_Rd` (formula) = 7.100000e+7
26. `M_pl_zProduct` (derived) = 1.775000e+7
27. `M_pl_z_Rd` (formula) = 1.775000e+7
28. `axial_yProduct` (derived) = 0.80218389
29. `axial_yFactor` (derived) = 0.75
30. `axial_y_ratio` (derived) = 1.06957852
31. `axial_y_factor` (derived) = 1
32. `M_N_y_Rd` (formula) = 7.100000e+7
33. `axial_zProduct` (derived) = -0.30218389
34. `axial_zFactor` (derived) = 0.5
35. `axial_z_ratio` (derived) = -0.60436778
36. `axial_z_ratio_sq` (derived) = 0.365260413
37. `axial_z_factor` (derived) = 1
38. `M_N_z_Rd` (formula) = 1.775000e+7
39. `n_sq` (derived) = 0.039131213
40. `rhs_expFactor` (derived) = 0.955781729
41. `rhs_exp_raw` (derived) = 1.736798214
42. `rhs_exp` (derived) = 1.736798214
43. `alpha_biax` (derived) = 2
44. `beta_biax` (derived) = 2
45. `abs_M_y_Ed` (derived) = 2.000000e+7
46. `abs_M_z_Ed` (derived) = 5.000000e+6
47. `ratio_y` (derived) = 0.281690141
48. `ratio_z` (derived) = 0.281690141
49. `term_y` (derived) = 0.079349335
50. `term_z` (derived) = 0.079349335
51. `biaxial_axial_check` (check) = 0.158698671

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_y_factor": 1,
  "axial_y_ratio": 1.0695785198079866,
  "axial_yFactor": 0.75,
  "axial_yProduct": 0.8021838898559899,
  "axial_z_factor": 1,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "axial_zFactor": 0.5,
  "axial_zProduct": -0.3021838898559899,
  "beta_biax": 2,
  "biaxial_axial_check": 0.15869867089863124,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_N_z_Rd": 17750000,
  "M_pl_y_Rd": 71000000,
  "M_pl_yProduct": 71000000,
  "M_pl_z_Rd": 17750000,
  "M_pl_zProduct": 17750000,
  "M_y_Ed": 20000000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "n_sq": 0.039131213432507146,
  "ratio_y": 0.28169014084507044,
  "ratio_z": 0.28169014084507044,
  "rhs_exp": 1.7367982144283314,
  "rhs_exp_raw": 1.7367982144283314,
  "rhs_expFactor": 0.9557817288212669,
  "section_class": 3,
  "term_y": 0.07934933544931562,
  "term_z": 0.07934933544931562,
  "W_y_res": 200000,
  "W_z_res": 50000,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `biaxial-axial: class 4 sections are out of scope`

