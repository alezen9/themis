# Check 9 - ulsBendingYAxial

- Verification expression: `\frac{M_{y,Ed}}{M_{N,y,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.4`, `6.2.5`, `6.2.9.1`
- Formula refs: `(6.6)`, `(6.13)`, `(6.36)`
- Verification refs: `(6.31)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.318362714) |
| i-c2 | I | 2 | ok (0.318362714) |
| i-c3 | I | 3 | ok (0.351154074) |
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
- Expected ratio: `0.318362714`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 1
4. `A` (user-input) = 2848
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 220600
15. `M_pl_yProduct` (derived) = 7.831300e+7
16. `M_pl_y_Rd` (formula) = 7.831300e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0
19. `a_w` (derived) = 0
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 1
22. `axial_ratio` (derived) = 0.80218389
23. `axial_factor` (derived) = 0.80218389
24. `M_N_y_Rd` (formula) = 6.282143e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.318362714

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.8021838898559899,
  "axial_ratio": 0.8021838898559899,
  "axialFactor": 1,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.3183627142174171,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 62821426.966292135,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
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
- Expected ratio: `0.318362714`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 2
4. `A` (user-input) = 2848
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 220600
15. `M_pl_yProduct` (derived) = 7.831300e+7
16. `M_pl_y_Rd` (formula) = 7.831300e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0
19. `a_w` (derived) = 0
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 1
22. `axial_ratio` (derived) = 0.80218389
23. `axial_factor` (derived) = 0.80218389
24. `M_N_y_Rd` (formula) = 6.282143e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.318362714

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.8021838898559899,
  "axial_ratio": 0.8021838898559899,
  "axialFactor": 1,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.3183627142174171,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 62821426.966292135,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
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
- Expected ratio: `0.351154074`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `N_Ed` (user-input) = -200000
3. `section_class` (user-input) = 3
4. `A` (user-input) = 2848
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 200000
15. `M_pl_yProduct` (derived) = 7.100000e+7
16. `M_pl_y_Rd` (formula) = 7.100000e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0
19. `a_w` (derived) = 0
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 1
22. `axial_ratio` (derived) = 0.80218389
23. `axial_factor` (derived) = 0.80218389
24. `M_N_y_Rd` (formula) = 5.695506e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.351154074

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0,
  "a_w_raw": 0,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 0.8021838898559899,
  "axial_ratio": 0.8021838898559899,
  "axialFactor": 1,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.351154073781811,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 56955056.17977528,
  "M_pl_y_Rd": 71000000,
  "M_pl_yProduct": 71000000,
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
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 220600
15. `M_pl_yProduct` (derived) = 7.831300e+7
16. `M_pl_y_Rd` (formula) = 7.831300e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0.5
19. `a_w` (derived) = 0.5
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 0.75
22. `axial_ratio` (derived) = 1.06957852
23. `axial_factor` (derived) = 1
24. `M_N_y_Rd` (formula) = 7.831300e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
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
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 220600
15. `M_pl_yProduct` (derived) = 7.831300e+7
16. `M_pl_y_Rd` (formula) = 7.831300e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0.5
19. `a_w` (derived) = 0.5
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 0.75
22. `axial_ratio` (derived) = 1.06957852
23. `axial_factor` (derived) = 1
24. `M_N_y_Rd` (formula) = 7.831300e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
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
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 200000
15. `M_pl_yProduct` (derived) = 7.100000e+7
16. `M_pl_y_Rd` (formula) = 7.100000e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0.5
19. `a_w` (derived) = 0.5
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 0.75
22. `axial_ratio` (derived) = 1.06957852
23. `axial_factor` (derived) = 1
24. `M_N_y_Rd` (formula) = 7.100000e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_pl_y_Rd": 71000000,
  "M_pl_yProduct": 71000000,
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
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 220600
15. `M_pl_yProduct` (derived) = 7.831300e+7
16. `M_pl_y_Rd` (formula) = 7.831300e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0.5
19. `a_w` (derived) = 0.5
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 0.75
22. `axial_ratio` (derived) = 1.06957852
23. `axial_factor` (derived) = 1
24. `M_N_y_Rd` (formula) = 7.831300e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
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
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 220600
15. `M_pl_yProduct` (derived) = 7.831300e+7
16. `M_pl_y_Rd` (formula) = 7.831300e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0.5
19. `a_w` (derived) = 0.5
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 0.75
22. `axial_ratio` (derived) = 1.06957852
23. `axial_factor` (derived) = 1
24. `M_N_y_Rd` (formula) = 7.831300e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 78313000,
  "M_pl_y_Rd": 78313000,
  "M_pl_yProduct": 78313000,
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
5. `Av_y` (user-input) = 2848
6. `Wel_y` (user-input) = 200000
7. `Wpl_y` (user-input) = 220600
8. `Av_z` (user-input) = 1424
9. `fy` (user-input) = 355
10. `gamma_M0` (coefficient) = 1
11. `N_pl_Rd` (formula) = 1.011040e+6
12. `abs_N_Ed` (derived) = 200000
13. `class_guard` (derived) = 1
14. `W_y_res` (derived) = 200000
15. `M_pl_yProduct` (derived) = 7.100000e+7
16. `M_pl_y_Rd` (formula) = 7.100000e+7
17. `n` (derived) = 0.19781611
18. `a_w_raw` (derived) = 0.5
19. `a_w` (derived) = 0.5
20. `axialProduct` (derived) = 0.80218389
21. `axialFactor` (derived) = 0.75
22. `axial_ratio` (derived) = 1.06957852
23. `axial_factor` (derived) = 1
24. `M_N_y_Rd` (formula) = 7.100000e+7
25. `abs_M_y_Ed` (derived) = 2.000000e+7
26. `bending_y_axial_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_w": 0.5,
  "a_w_raw": 0.5,
  "abs_M_y_Ed": 20000000,
  "abs_N_Ed": 200000,
  "Av_y": 2848,
  "Av_z": 1424,
  "axial_factor": 1,
  "axial_ratio": 1.0695785198079866,
  "axialFactor": 0.75,
  "axialProduct": 0.8021838898559899,
  "bending_y_axial_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_N_y_Rd": 71000000,
  "M_pl_y_Rd": 71000000,
  "M_pl_yProduct": 71000000,
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

