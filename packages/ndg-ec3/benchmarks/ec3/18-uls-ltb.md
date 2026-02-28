# Check 18 - ulsLtb

- Verification expression: `\frac{M_{y,Ed}}{M_{b,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.3.2.3`, `6.3.2.2`, `6.3.2.1`
- Formula refs: `(6.57)`, `(6.58)`, `(6.55)`
- Verification refs: `(6.54)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.446562523) |
| i-c2 | I | 2 | ok (0.446562523) |
| i-c3 | I | 3 | ok (0.446562523) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| rhs-c2 | RHS | 2 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| rhs-c3 | RHS | 3 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| chs-c2 | CHS | 2 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| chs-c3 | CHS | 3 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.446562523`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `Wpl_y` (user-input) = 220600
3. `fy` (user-input) = 355
4. `E` (user-input) = 210000
5. `G` (user-input) = 81000
6. `Iz` (user-input) = 1.424000e+6
7. `It` (user-input) = 69800
8. `Iw` (user-input) = 1.299000e+10
9. `L` (user-input) = 3000
10. `k_LT` (user-input) = 1
11. `psi_LT` (user-input) = 1
12. `section_class` (user-input) = 1
13. `alpha_LT` (user-input) = 0.34
14. `gamma_M1` (coefficient) = 1
15. `lambda_LT_0` (coefficient) = 0.4
16. `beta_LT` (coefficient) = 0.75
17. `piSq` (constant) = 9.869604401
18. `k_c` (table) = 1
19. `C1` (derived) = 1
20. `Lcr_LT` (derived) = 3000
21. `Lcr_LT_sq` (derived) = 9.000000e+6
22. `euler_num` (derived) = 2.951407e+12
23. `euler_term` (derived) = 327934.055566862
24. `torsion_ratio` (derived) = 9122.191011236
25. `torsion_num` (derived) = 5.088420e+16
26. `torsion_den` (derived) = 2.951407e+12
27. `torsion_add` (derived) = 17240.661358659
28. `torsion_sum` (derived) = 26362.852369895
29. `torsion_root` (derived) = 162.366413922
30. `M_cr_prefactor` (derived) = 327934.055566862
31. `M_cr` (derived) = 5.324548e+7
32. `lambda_LT_num` (derived) = 7.831300e+7
33. `lambda_bar_LT_sq` (derived) = 1.470791605
34. `lambda_bar_LT` (derived) = 1.212761974
35. `lambda_LT_delta` (derived) = 0.812761974
36. `phi_alpha_term` (derived) = 0.276339071
37. `phi_beta_term` (derived) = 1.103093704
38. `phi_inner` (derived) = 2.379432775
39. `phi_LT` (derived) = 1.189716387
40. `phi_LT_sq` (derived) = 1.415425083
41. `chi_LT_radicand` (derived) = 0.312331379
42. `chi_LT_root` (derived) = 0.558866155
43. `chi_LT_den` (derived) = 1.748582542
44. `chi_LT_base` (formula) = 0.57189179
45. `chi_LT_cap` (derived) = 0.679905975
46. `chi_LT` (derived) = 0.57189179
47. `f_LT` (derived) = 1
48. `chi_LT_mod` (formula) = 0.57189179
49. `M_b_num` (derived) = 4.478656e+7
50. `M_b_Rd` (formula) = 4.478656e+7
51. `abs_M_y_Ed` (derived) = 2.000000e+7
52. `ltb_check` (check) = 0.446562523

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "alpha_LT": 0.34,
  "beta_LT": 0.75,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_base": 0.571891790034929,
  "chi_LT_cap": 0.6799059748099839,
  "chi_LT_den": 1.7485825420555938,
  "chi_LT_mod": 0.571891790034929,
  "chi_LT_radicand": 0.312331378759521,
  "chi_LT_root": 0.5588661546019056,
  "E": 210000,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "It": 69800,
  "Iw": 12990000000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "L": 3000,
  "lambda_bar_LT": 1.2127619737971853,
  "lambda_bar_LT_sq": 1.4707916050884449,
  "lambda_LT_0": 0.4,
  "lambda_LT_delta": 0.8127619737971853,
  "lambda_LT_num": 78313000,
  "Lcr_LT": 3000,
  "Lcr_LT_sq": 9000000,
  "ltb_check": 0.44656252271157887,
  "M_b_num": 44786561.75300539,
  "M_b_Rd": 44786561.75300539,
  "M_cr": 53245476.60529427,
  "M_cr_prefactor": 327934.05556686234,
  "M_y_Ed": 20000000,
  "phi_alpha_term": 0.276339071091043,
  "phi_beta_term": 1.1030937038163335,
  "phi_inner": 2.3794327749073765,
  "phi_LT": 1.1897163874536882,
  "phi_LT_sq": 1.4154250825758545,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "section_class": 1,
  "torsion_add": 17240.661358659192,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "Wpl_y": 220600
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.446562523`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `Wpl_y` (user-input) = 220600
3. `fy` (user-input) = 355
4. `E` (user-input) = 210000
5. `G` (user-input) = 81000
6. `Iz` (user-input) = 1.424000e+6
7. `It` (user-input) = 69800
8. `Iw` (user-input) = 1.299000e+10
9. `L` (user-input) = 3000
10. `k_LT` (user-input) = 1
11. `psi_LT` (user-input) = 1
12. `section_class` (user-input) = 2
13. `alpha_LT` (user-input) = 0.34
14. `gamma_M1` (coefficient) = 1
15. `lambda_LT_0` (coefficient) = 0.4
16. `beta_LT` (coefficient) = 0.75
17. `piSq` (constant) = 9.869604401
18. `k_c` (table) = 1
19. `C1` (derived) = 1
20. `Lcr_LT` (derived) = 3000
21. `Lcr_LT_sq` (derived) = 9.000000e+6
22. `euler_num` (derived) = 2.951407e+12
23. `euler_term` (derived) = 327934.055566862
24. `torsion_ratio` (derived) = 9122.191011236
25. `torsion_num` (derived) = 5.088420e+16
26. `torsion_den` (derived) = 2.951407e+12
27. `torsion_add` (derived) = 17240.661358659
28. `torsion_sum` (derived) = 26362.852369895
29. `torsion_root` (derived) = 162.366413922
30. `M_cr_prefactor` (derived) = 327934.055566862
31. `M_cr` (derived) = 5.324548e+7
32. `lambda_LT_num` (derived) = 7.831300e+7
33. `lambda_bar_LT_sq` (derived) = 1.470791605
34. `lambda_bar_LT` (derived) = 1.212761974
35. `lambda_LT_delta` (derived) = 0.812761974
36. `phi_alpha_term` (derived) = 0.276339071
37. `phi_beta_term` (derived) = 1.103093704
38. `phi_inner` (derived) = 2.379432775
39. `phi_LT` (derived) = 1.189716387
40. `phi_LT_sq` (derived) = 1.415425083
41. `chi_LT_radicand` (derived) = 0.312331379
42. `chi_LT_root` (derived) = 0.558866155
43. `chi_LT_den` (derived) = 1.748582542
44. `chi_LT_base` (formula) = 0.57189179
45. `chi_LT_cap` (derived) = 0.679905975
46. `chi_LT` (derived) = 0.57189179
47. `f_LT` (derived) = 1
48. `chi_LT_mod` (formula) = 0.57189179
49. `M_b_num` (derived) = 4.478656e+7
50. `M_b_Rd` (formula) = 4.478656e+7
51. `abs_M_y_Ed` (derived) = 2.000000e+7
52. `ltb_check` (check) = 0.446562523

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "alpha_LT": 0.34,
  "beta_LT": 0.75,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_base": 0.571891790034929,
  "chi_LT_cap": 0.6799059748099839,
  "chi_LT_den": 1.7485825420555938,
  "chi_LT_mod": 0.571891790034929,
  "chi_LT_radicand": 0.312331378759521,
  "chi_LT_root": 0.5588661546019056,
  "E": 210000,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "It": 69800,
  "Iw": 12990000000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "L": 3000,
  "lambda_bar_LT": 1.2127619737971853,
  "lambda_bar_LT_sq": 1.4707916050884449,
  "lambda_LT_0": 0.4,
  "lambda_LT_delta": 0.8127619737971853,
  "lambda_LT_num": 78313000,
  "Lcr_LT": 3000,
  "Lcr_LT_sq": 9000000,
  "ltb_check": 0.44656252271157887,
  "M_b_num": 44786561.75300539,
  "M_b_Rd": 44786561.75300539,
  "M_cr": 53245476.60529427,
  "M_cr_prefactor": 327934.05556686234,
  "M_y_Ed": 20000000,
  "phi_alpha_term": 0.276339071091043,
  "phi_beta_term": 1.1030937038163335,
  "phi_inner": 2.3794327749073765,
  "phi_LT": 1.1897163874536882,
  "phi_LT_sq": 1.4154250825758545,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "section_class": 2,
  "torsion_add": 17240.661358659192,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "Wpl_y": 220600
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.446562523`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `Wpl_y` (user-input) = 220600
3. `fy` (user-input) = 355
4. `E` (user-input) = 210000
5. `G` (user-input) = 81000
6. `Iz` (user-input) = 1.424000e+6
7. `It` (user-input) = 69800
8. `Iw` (user-input) = 1.299000e+10
9. `L` (user-input) = 3000
10. `k_LT` (user-input) = 1
11. `psi_LT` (user-input) = 1
12. `section_class` (user-input) = 3
13. `alpha_LT` (user-input) = 0.34
14. `gamma_M1` (coefficient) = 1
15. `lambda_LT_0` (coefficient) = 0.4
16. `beta_LT` (coefficient) = 0.75
17. `piSq` (constant) = 9.869604401
18. `k_c` (table) = 1
19. `C1` (derived) = 1
20. `Lcr_LT` (derived) = 3000
21. `Lcr_LT_sq` (derived) = 9.000000e+6
22. `euler_num` (derived) = 2.951407e+12
23. `euler_term` (derived) = 327934.055566862
24. `torsion_ratio` (derived) = 9122.191011236
25. `torsion_num` (derived) = 5.088420e+16
26. `torsion_den` (derived) = 2.951407e+12
27. `torsion_add` (derived) = 17240.661358659
28. `torsion_sum` (derived) = 26362.852369895
29. `torsion_root` (derived) = 162.366413922
30. `M_cr_prefactor` (derived) = 327934.055566862
31. `M_cr` (derived) = 5.324548e+7
32. `lambda_LT_num` (derived) = 7.831300e+7
33. `lambda_bar_LT_sq` (derived) = 1.470791605
34. `lambda_bar_LT` (derived) = 1.212761974
35. `lambda_LT_delta` (derived) = 0.812761974
36. `phi_alpha_term` (derived) = 0.276339071
37. `phi_beta_term` (derived) = 1.103093704
38. `phi_inner` (derived) = 2.379432775
39. `phi_LT` (derived) = 1.189716387
40. `phi_LT_sq` (derived) = 1.415425083
41. `chi_LT_radicand` (derived) = 0.312331379
42. `chi_LT_root` (derived) = 0.558866155
43. `chi_LT_den` (derived) = 1.748582542
44. `chi_LT_base` (formula) = 0.57189179
45. `chi_LT_cap` (derived) = 0.679905975
46. `chi_LT` (derived) = 0.57189179
47. `f_LT` (derived) = 1
48. `chi_LT_mod` (formula) = 0.57189179
49. `M_b_num` (derived) = 4.478656e+7
50. `M_b_Rd` (formula) = 4.478656e+7
51. `abs_M_y_Ed` (derived) = 2.000000e+7
52. `ltb_check` (check) = 0.446562523

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "alpha_LT": 0.34,
  "beta_LT": 0.75,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_base": 0.571891790034929,
  "chi_LT_cap": 0.6799059748099839,
  "chi_LT_den": 1.7485825420555938,
  "chi_LT_mod": 0.571891790034929,
  "chi_LT_radicand": 0.312331378759521,
  "chi_LT_root": 0.5588661546019056,
  "E": 210000,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "It": 69800,
  "Iw": 12990000000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "L": 3000,
  "lambda_bar_LT": 1.2127619737971853,
  "lambda_bar_LT_sq": 1.4707916050884449,
  "lambda_LT_0": 0.4,
  "lambda_LT_delta": 0.8127619737971853,
  "lambda_LT_num": 78313000,
  "Lcr_LT": 3000,
  "Lcr_LT_sq": 9000000,
  "ltb_check": 0.44656252271157887,
  "M_b_num": 44786561.75300539,
  "M_b_Rd": 44786561.75300539,
  "M_cr": 53245476.60529427,
  "M_cr_prefactor": 327934.05556686234,
  "M_y_Ed": 20000000,
  "phi_alpha_term": 0.276339071091043,
  "phi_beta_term": 1.1030937038163335,
  "phi_inner": 2.3794327749073765,
  "phi_LT": 1.1897163874536882,
  "phi_LT_sq": 1.4154250825758545,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "section_class": 3,
  "torsion_add": 17240.661358659192,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "Wpl_y": 220600
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `ltb: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `ltb: SN003b M_cr is implemented only for I/H sections`

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `ltb: SN003b M_cr is implemented only for I/H sections`

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `ltb: SN003b M_cr is implemented only for I/H sections`

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `ltb: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `ltb: SN003b M_cr is implemented only for I/H sections`

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `ltb: SN003b M_cr is implemented only for I/H sections`

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `ltb: SN003b M_cr is implemented only for I/H sections`

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `ltb: class 4 sections are out of scope`

