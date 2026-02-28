# Check 10 - ulsBendingZAxial

- Verification expression: `\frac{M_{z,Ed}}{M_{N,z,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.4`, `6.2.5`, `6.2.9.1`
- Formula refs: `(6.6)`, `(6.13)`, `(6.38)`
- Verification refs: `(6.31)`
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
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 57700
14. `M_pl_z_num` (derived) = 2.048350e+7
15. `M_pl_z_Rd` (formula) = 2.048350e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 2.048350e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 20483500,
  "M_pl_z_num": 20483500,
  "M_pl_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 1,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 57700
14. `M_pl_z_num` (derived) = 2.048350e+7
15. `M_pl_z_Rd` (formula) = 2.048350e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 2.048350e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 20483500,
  "M_pl_z_num": 20483500,
  "M_pl_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 2,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 50000
14. `M_pl_z_num` (derived) = 1.775000e+7
15. `M_pl_z_Rd` (formula) = 1.775000e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 1.775000e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 17750000,
  "M_pl_z_num": 17750000,
  "M_pl_z_Rd": 17750000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 3,
  "W_z_res": 50000,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-axial: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 57700
14. `M_pl_z_num` (derived) = 2.048350e+7
15. `M_pl_z_Rd` (formula) = 2.048350e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 2.048350e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 20483500,
  "M_pl_z_num": 20483500,
  "M_pl_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 1,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 57700
14. `M_pl_z_num` (derived) = 2.048350e+7
15. `M_pl_z_Rd` (formula) = 2.048350e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 2.048350e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 20483500,
  "M_pl_z_num": 20483500,
  "M_pl_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 2,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 50000
14. `M_pl_z_num` (derived) = 1.775000e+7
15. `M_pl_z_Rd` (formula) = 1.775000e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 1.775000e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 17750000,
  "M_pl_z_num": 17750000,
  "M_pl_z_Rd": 17750000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 3,
  "W_z_res": 50000,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-axial: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 57700
14. `M_pl_z_num` (derived) = 2.048350e+7
15. `M_pl_z_Rd` (formula) = 2.048350e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 2.048350e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 20483500,
  "M_pl_z_num": 20483500,
  "M_pl_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 1,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 57700
14. `M_pl_z_num` (derived) = 2.048350e+7
15. `M_pl_z_Rd` (formula) = 2.048350e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 2.048350e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 20483500,
  "M_pl_z_num": 20483500,
  "M_pl_z_Rd": 20483500,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 2,
  "W_z_res": 57700,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Wel_z` (user-input) = 50000
6. `Wpl_z` (user-input) = 57700
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_z_res` (derived) = 50000
14. `M_pl_z_num` (derived) = 1.775000e+7
15. `M_pl_z_Rd` (formula) = 1.775000e+7
16. `n` (derived) = 0.19781611
17. `a_f_raw` (derived) = 0.5
18. `a_f` (derived) = 0.5
19. `n_minus_af` (derived) = -0.30218389
20. `one_minus_af` (derived) = 0.5
21. `axial_ratio` (derived) = -0.60436778
22. `axial_ratio_sq` (derived) = 0.365260413
23. `axial_factor` (derived) = 1
24. `M_N_z_Rd` (formula) = 1.775000e+7
25. `abs_M_z_Ed` (derived) = 5.000000e+6
26. `bending_z_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_f": 0.5,
  "a_f_raw": 0.5,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": -0.6043677797119797,
  "axial_ratio_sq": 0.36526041315398805,
  "bending_z_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_z_Rd": 17750000,
  "M_pl_z_num": 17750000,
  "M_pl_z_Rd": 17750000,
  "M_z_Ed": 5000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "n_minus_af": -0.3021838898559899,
  "N_pl_Rd": 1011040,
  "one_minus_af": 0.5,
  "section_class": 3,
  "W_z_res": 50000,
  "Wel_z": 50000,
  "Wpl_z": 57700
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-axial: class 4 sections are out of scope`

