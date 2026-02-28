# Check 14 - ulsBiaxialAxialShear

- Verification expression: `\left(\frac{M_{y,Ed}}{M_{NV,y,Rd}}\right)^\alpha + \left(\frac{M_{z,Ed}}{M_{NV,z,Rd}}\right)^\beta \leq 1.0`
- Section refs: `6.1`, `6.2.6`, `6.2.4`, `6.2.8`, `6.2.9.1`, `6.2.10`
- Formula refs: `(6.18)`, `(6.6)`, `(6.30)`, `(6.36)`, `(6.38)`
- Verification refs: `(6.41)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.309320632) |
| i-c2 | I | 2 | ok (0.309320632) |
| i-c3 | I | 3 | ok (0.309320632) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.179778125) |
| rhs-c2 | RHS | 2 | ok (0.179778125) |
| rhs-c3 | RHS | 3 | ok (0.179778125) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.124806001) |
| chs-c2 | CHS | 2 | ok (0.124806001) |
| chs-c3 | CHS | 3 | ok (0.124806001) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.309320632`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 1
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 2
65. `beta_biax` (derived) = 1
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.065221723
71. `term_z` (derived) = 0.244098909
72. `biaxial_axial_shear_check` (check) = 0.309320632

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 1,
  "biaxial_axial_shear_check": 0.3093206320850175,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.06522172320714018,
  "term_z": 0.24409890887787733,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.309320632`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 2
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 2
65. `beta_biax` (derived) = 1
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.065221723
71. `term_z` (derived) = 0.244098909
72. `biaxial_axial_shear_check` (check) = 0.309320632

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 1,
  "biaxial_axial_shear_check": 0.3093206320850175,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.06522172320714018,
  "term_z": 0.24409890887787733,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.309320632`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 3
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 2
65. `beta_biax` (derived) = 1
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.065221723
71. `term_z` (derived) = 0.244098909
72. `biaxial_axial_shear_check` (check) = 0.309320632

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 1,
  "biaxial_axial_shear_check": 0.3093206320850175,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.06522172320714018,
  "term_z": 0.24409890887787733,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `biaxial-axial-shear: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.179778125`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 1
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 1.736798214
65. `beta_biax` (derived) = 1.736798214
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.093415578
71. `term_z` (derived) = 0.086362547
72. `biaxial_axial_shear_check` (check) = 0.179778125

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 1.7367982144283314,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 1.7367982144283314,
  "biaxial_axial_shear_check": 0.17977812474651814,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.09341557791389618,
  "term_z": 0.08636254683262196,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
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
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 2
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 1.736798214
65. `beta_biax` (derived) = 1.736798214
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.093415578
71. `term_z` (derived) = 0.086362547
72. `biaxial_axial_shear_check` (check) = 0.179778125

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 1.7367982144283314,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 1.7367982144283314,
  "biaxial_axial_shear_check": 0.17977812474651814,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.09341557791389618,
  "term_z": 0.08636254683262196,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.179778125`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 3
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 1.736798214
65. `beta_biax` (derived) = 1.736798214
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.093415578
71. `term_z` (derived) = 0.086362547
72. `biaxial_axial_shear_check` (check) = 0.179778125

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 1.7367982144283314,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 1.7367982144283314,
  "biaxial_axial_shear_check": 0.17977812474651814,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.09341557791389618,
  "term_z": 0.08636254683262196,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `biaxial-axial-shear: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.124806001`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 1
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 2
65. `beta_biax` (derived) = 2
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.065221723
71. `term_z` (derived) = 0.059584277
72. `biaxial_axial_shear_check` (check) = 0.124806001

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 2,
  "biaxial_axial_shear_check": 0.12480600052251044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.06522172320714018,
  "term_z": 0.05958427731537026,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
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
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 2
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 2
65. `beta_biax` (derived) = 2
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.065221723
71. `term_z` (derived) = 0.059584277
72. `biaxial_axial_shear_check` (check) = 0.124806001

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 2,
  "biaxial_axial_shear_check": 0.12480600052251044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.06522172320714018,
  "term_z": 0.05958427731537026,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.124806001`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `M_z_Ed` (user-input) = 5.000000e+6
3. `N_Ed` (user-input) = -200000
4. `V_z_Ed` (user-input) = 50000
5. `V_y_Ed` (user-input) = 10000
6. `A` (user-input) = 2848
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_z` (user-input) = 1424
10. `Av_y` (user-input) = 2848
11. `tw` (user-input) = 5.6
12. `section_class` (user-input) = 3
13. `fy` (user-input) = 355
14. `gamma_M0` (coefficient) = 1
15. `sqrt3` (constant) = 1.732050808
16. `V_pl_z_num` (derived) = 505520
17. `V_pl_den` (derived) = 1.732050808
18. `V_pl_z_Rd` (formula) = 291862.10808074
19. `V_pl_y_num` (derived) = 1.011040e+6
20. `V_pl_y_Rd` (formula) = 583724.216161479
21. `abs_V_z_Ed` (derived) = 50000
22. `abs_V_y_Ed` (derived) = 10000
23. `rho_z_ratio` (derived) = 0.171313777
24. `rho_z_linear` (derived) = -0.657372447
25. `rho_z_sq` (derived) = 0.432138534
26. `rho_z` (derived) = 0
27. `rho_y_ratio` (derived) = 0.017131378
28. `rho_y_linear` (derived) = -0.965737245
29. `rho_y_sq` (derived) = 0.932648426
30. `rho_y` (derived) = 0
31. `N_pl_num` (derived) = 1.011040e+6
32. `N_pl_Rd` (formula) = 1.011040e+6
33. `abs_N_Ed` (derived) = 200000
34. `n` (derived) = 0.19781611
35. `a_w_raw` (derived) = 0.5
36. `a_w` (derived) = 0.5
37. `a_f_raw` (derived) = 0.5
38. `a_f` (derived) = 0.5
39. `Av_z_sq` (derived) = 2.027776e+6
40. `M_y_shear_mod` (derived) = 90525.714285714
41. `M_y_rho_mod` (derived) = 0
42. `Wpl_y_eff` (derived) = 220600
43. `M_y_V_num` (derived) = 7.831300e+7
44. `M_y_V_Rd` (formula) = 7.831300e+7
45. `axial_y_num` (derived) = 0.80218389
46. `axial_y_den` (derived) = 0.75
47. `axial_y_ratio` (derived) = 1.06957852
48. `axial_y_factor` (derived) = 1
49. `M_NV_y_Rd` (formula) = 7.831300e+7
50. `Wpl_z_web` (derived) = 1993.6
51. `Wpl_z_flange` (derived) = 55706.4
52. `M_z_rho_mod` (derived) = 0
53. `Wpl_z_eff` (derived) = 57700
54. `M_z_V_num` (derived) = 2.048350e+7
55. `class_guard` (derived) = 1
56. `M_z_V_Rd` (derived) = 2.048350e+7
57. `n_minus_af` (derived) = -0.30218389
58. `one_minus_af` (derived) = 0.5
59. `axial_z_ratio` (derived) = -0.60436778
60. `axial_z_ratio_sq` (derived) = 0.365260413
61. `axial_z_factor` (derived) = 0.634739587
62. `n_le_af` (derived) = 1
63. `M_NV_z_Rd` (formula) = 2.048350e+7
64. `alpha_biax` (derived) = 2
65. `beta_biax` (derived) = 2
66. `abs_M_y_Ed` (derived) = 2.000000e+7
67. `abs_M_z_Ed` (derived) = 5.000000e+6
68. `ratio_y` (derived) = 0.25538544
69. `ratio_z` (derived) = 0.244098909
70. `term_y` (derived) = 0.065221723
71. `term_z` (derived) = 0.059584277
72. `biaxial_axial_shear_check` (check) = 0.124806001

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
  "abs_V_y_Ed": 10000,
  "abs_V_z_Ed": 50000,
  "alpha_biax": 2,
  "Av_y": 2848,
  "Av_z": 1424,
  "Av_z_sq": 2027776,
  "axial_y_den": 0.75,
  "axial_y_factor": 1,
  "axial_y_num": 0.8021838898559899,
  "axial_y_ratio": 1.0695785198079866,
  "axial_z_factor": 0.634739586846012,
  "axial_z_ratio": -0.6043677797119797,
  "axial_z_ratio_sq": 0.36526041315398805,
  "beta_biax": 2,
  "biaxial_axial_shear_check": 0.12480600052251044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_NV_y_Rd": 78313000,
  "M_NV_z_Rd": 20483500,
  "M_y_Ed": 20000000,
  "M_y_rho_mod": 0,
  "M_y_shear_mod": 90525.71428571429,
  "M_y_V_num": 78313000,
  "M_y_V_Rd": 78313000,
  "M_z_Ed": 5000000,
  "M_z_rho_mod": 0,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_le_af": 1,
  "n_minus_af": -0.3021838898559899,
  "N_pl_num": 1011040,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "ratio_y": 0.25538544047603845,
  "ratio_z": 0.24409890887787733,
  "rho_y": 0,
  "rho_y_linear": -0.9657372446674933,
  "rho_y_ratio": 0.017131377666253337,
  "rho_y_sq": 0.9326484257379619,
  "rho_z": 0,
  "rho_z_linear": -0.6573724466749333,
  "rho_z_ratio": 0.17131377666253336,
  "rho_z_sq": 0.4321385336473881,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "term_y": 0.06522172320714018,
  "term_z": 0.05958427731537026,
  "tw": 5.6,
  "V_pl_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_y_Ed": 10000,
  "V_z_Ed": 50000,
  "Wpl_y": 220600,
  "Wpl_y_eff": 220600,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `biaxial-axial-shear: class 4 sections are out of scope`

