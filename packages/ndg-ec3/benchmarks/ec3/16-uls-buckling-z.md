# Check 16 - ulsBucklingZ

- Verification expression: `\frac{N_{Ed}}{N_{b,z,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.3.1.2`, `6.3.1.1`
- Formula refs: `(6.49)`, `(6.47)`
- Verification refs: `(6.46)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.751882651) |
| i-c2 | I | 2 | ok (0.751882651) |
| i-c3 | I | 3 | ok (0.751882651) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.751882651) |
| rhs-c2 | RHS | 2 | ok (0.751882651) |
| rhs-c3 | RHS | 3 | ok (0.751882651) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.751882651) |
| chs-c2 | CHS | 2 | ok (0.751882651) |
| chs-c3 | CHS | 3 | ok (0.751882651) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 1
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 2
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 3
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `buckling-z: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 1
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 2
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 3
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `buckling-z: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 1
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 2
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.751882651`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `E` (user-input) = 210000
6. `Iz` (user-input) = 1.424000e+6
7. `L` (user-input) = 3000
8. `k_z` (user-input) = 1
9. `alpha_z` (user-input) = 0.34
10. `gamma_M1` (coefficient) = 1
11. `piSq` (constant) = 9.869604401
12. `Lcr_z` (derived) = 3000
13. `Lcr_z_sq` (derived) = 9.000000e+6
14. `N_cr_z_num` (derived) = 2.951407e+12
15. `N_cr_z` (derived) = 327934.055566862
16. `lambda_bar_z_num` (derived) = 1.011040e+6
17. `lambda_bar_z_sq` (derived) = 3.083058874
18. `lambda_bar_z` (derived) = 1.755864139
19. `lambda_bar_z_minus_02` (derived) = 1.555864139
20. `phi_z_alpha_term` (derived) = 0.528993807
21. `phi_z_sum` (derived) = 4.612052681
22. `phi_z` (derived) = 2.30602634
23. `phi_z_sq` (derived) = 5.317757483
24. `chi_z_root_arg` (derived) = 2.234698609
25. `chi_z_root` (derived) = 1.494890835
26. `chi_z_den` (derived) = 3.800917176
27. `chi_z_base` (derived) = 0.263094394
28. `chi_z` (formula) = 0.263094394
29. `N_b_z_num` (derived) = 265998.955855133
30. `N_b_z_Rd` (formula) = 265998.955855133
31. `abs_N_Ed` (derived) = 200000
32. `class_guard` (derived) = 1
33. `buckling_z_check` (check) = 0.751882651

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "buckling_z_check": 0.7518826506556789,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_root": 1.4948908351658539,
  "chi_z_root_arg": 2.234698609062864,
  "class_guard": 1,
  "E": 210000,
  "fy": 355,
  "gamma_M1": 1,
  "Iz": 1424000,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_minus_02": 1.5558641387329142,
  "lambda_bar_z_num": 1011040,
  "lambda_bar_z_sq": 3.0830588736882785,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "N_b_z_num": 265998.95585513255,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha_term": 0.5289938071691909,
  "phi_z_sq": 5.3177574827511425,
  "phi_z_sum": 4.612052680857469,
  "piSq": 9.869604401089358,
  "section_class": 3
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `buckling-z: class 4 sections are out of scope`

