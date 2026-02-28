# Check 9 - ulsBendingYAxial

- Verification expression: `\frac{M_{y,Ed}}{M_{N,y,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.4`, `6.2.5`, `6.2.9.1`
- Formula refs: `(6.6)`, `(6.13)`, `(6.36)`
- Verification refs: `(6.31)`
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
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 220600
14. `M_pl_y_num` (derived) = 7.831300e+7
15. `M_pl_y_Rd` (formula) = 7.831300e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.831300e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_num": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 1,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 220600
14. `M_pl_y_num` (derived) = 7.831300e+7
15. `M_pl_y_Rd` (formula) = 7.831300e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.831300e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_num": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 2,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 200000
14. `M_pl_y_num` (derived) = 7.100000e+7
15. `M_pl_y_Rd` (formula) = 7.100000e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.100000e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_pl_y_num": 71000000,
  "M_pl_y_Rd": 71000000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 3,
  "W_y_res": 200000,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-axial: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 220600
14. `M_pl_y_num` (derived) = 7.831300e+7
15. `M_pl_y_Rd` (formula) = 7.831300e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.831300e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_num": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 1,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 220600
14. `M_pl_y_num` (derived) = 7.831300e+7
15. `M_pl_y_Rd` (formula) = 7.831300e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.831300e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_num": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 2,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 200000
14. `M_pl_y_num` (derived) = 7.100000e+7
15. `M_pl_y_Rd` (formula) = 7.100000e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.100000e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_pl_y_num": 71000000,
  "M_pl_y_Rd": 71000000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 3,
  "W_y_res": 200000,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-axial: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 220600
14. `M_pl_y_num` (derived) = 7.831300e+7
15. `M_pl_y_Rd` (formula) = 7.831300e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.831300e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_num": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 1,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 220600
14. `M_pl_y_num` (derived) = 7.831300e+7
15. `M_pl_y_Rd` (formula) = 7.831300e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.831300e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_num": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 2,
  "W_y_res": 220600,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.281690141`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wpl_y` (user-input) = 220600
7. `Av_z` (user-input) = 1424
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `N_pl_Rd` (formula) = 1.011040e+6
11. `abs_N_Ed` (derived) = 200000
12. `class_guard` (derived) = 1
13. `W_y_res` (derived) = 200000
14. `M_pl_y_num` (derived) = 7.100000e+7
15. `M_pl_y_Rd` (formula) = 7.100000e+7
16. `n` (derived) = 0.19781611
17. `a_w_raw` (derived) = 0.5
18. `a_w` (derived) = 0.5
19. `axial_num` (derived) = 0.80218389
20. `axial_den` (derived) = 0.75
21. `axial_ratio` (derived) = 1.06957852
22. `axial_factor` (derived) = 1
23. `M_N_y_Rd` (formula) = 7.100000e+7
24. `abs_M_y_Ed` (derived) = 2.000000e+7
25. `bending_y_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_z": 1424,
  "axial_den": 0.75,
  "axial_factor": 1,
  "axial_num": 0.8021838898559899,
  "axial_ratio": 1.0695785198079866,
  "bending_y_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_pl_y_num": 71000000,
  "M_pl_y_Rd": 71000000,
  "M_y_Ed": 20000000,
  "n": 0.19781611014401013,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 3,
  "W_y_res": 200000,
  "Wel_y": 200000,
  "Wpl_y": 220600
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-y-axial: class 4 sections are out of scope`

