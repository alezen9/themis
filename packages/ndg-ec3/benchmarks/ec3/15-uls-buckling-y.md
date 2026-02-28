# Check 15 - ulsBucklingY

- Verification expression: `\frac{N_{Ed}}{N_{b,y,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.3.1.2`, `6.3.1.1`
- Formula refs: `(6.49)`, `(6.47)`
- Verification refs: `(6.46)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.212304676) |
| i-c2 | I | 2 | ok (0.212304676) |
| i-c3 | I | 3 | ok (0.212304676) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.212304676) |
| rhs-c2 | RHS | 2 | ok (0.212304676) |
| rhs-c3 | RHS | 3 | ok (0.212304676) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.212304676) |
| chs-c2 | CHS | 2 | ok (0.212304676) |
| chs-c3 | CHS | 3 | ok (0.212304676) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 1
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 2
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 3
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `buckling-y: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 1
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 2
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 3
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `buckling-y: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 1
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 2
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.212304676`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iy` (user-input) = 1.943000e+7
7. `L` (user-input) = 3000
8. `k_y` (user-input) = 1
9. `alpha_y` (user-input) = 0.21
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_y` (derived) = 3000
13. `Lcr_y_sq` (derived) = 9.000000e+6
14. `N_cr_y_num` (derived) = 4.027095e+13
15. `N_cr_y` (derived) = 4.474550e+6
16. `lambda_bar_y_num` (derived) = 1.011040e+6
17. `lambda_bar_y_sq` (derived) = 0.225953466
18. `lambda_bar_y` (derived) = 0.475345627
19. `lambda_bar_y_minus_02` (derived) = 0.275345627
20. `phi_y_alpha_term` (derived) = 0.057822582
21. `phi_y_sum` (derived) = 1.283776047
22. `phi_y` (derived) = 0.641888024
23. `phi_y_sq` (derived) = 0.412020235
24. `chi_y_root_arg` (derived) = 0.186066769
25. `chi_y_root` (derived) = 0.431354575
26. `chi_y_den` (derived) = 1.073242599
27. `chi_y_base` (derived) = 0.931755785
28. `chi_y` (formula) = 0.931755785
29. `N_b_y_num` (derived) = 942042.368857003
30. `N_b_y_Rd` (formula) = 942042.368857003
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_y_check` (check) = 0.212304676

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_y": 0.21,
  "buckling_y_check": 0.2123046761077887,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_root": 0.4313545749857082,
  "chi_y_root_arg": 0.18606676936110092,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iy": 19430000,
  "k_y": 1,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_minus_02": 0.27534562749173086,
  "lambda_bar_y_num": 1011040,
  "lambda_bar_y_sq": 0.22595346557550736,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "N_b_y_num": 942042.3688570028,
  "N_b_y_Rd": 942042.3688570028,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_Ed": -200000,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha_term": 0.05782258177326348,
  "phi_y_sq": 0.4120202349366083,
  "phi_y_sum": 1.2837760473487707,
  "piSq": 9.869604401089358,
  "section_class": 3
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `buckling-y: class 4 sections are out of scope`

