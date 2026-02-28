# Check 3 - ulsBendingY

- Verification expression: `\frac{M_{y,Ed}}{M_{c,y,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.5`
- Formula refs: `(6.13)`
- Verification refs: `(6.12)`
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
2. `section_class` (user-input) = 1
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 220600
9. `M_c_y_Rd` (formula) = 7.831300e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 78313000,
  "M_y_Ed": 20000000,
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
2. `section_class` (user-input) = 2
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 220600
9. `M_c_y_Rd` (formula) = 7.831300e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 78313000,
  "M_y_Ed": 20000000,
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
2. `section_class` (user-input) = 3
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 200000
9. `M_c_y_Rd` (formula) = 7.100000e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 71000000,
  "M_y_Ed": 20000000,
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
- Expected message snippet: `bending-y: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `section_class` (user-input) = 1
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 220600
9. `M_c_y_Rd` (formula) = 7.831300e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 78313000,
  "M_y_Ed": 20000000,
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
2. `section_class` (user-input) = 2
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 220600
9. `M_c_y_Rd` (formula) = 7.831300e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 78313000,
  "M_y_Ed": 20000000,
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
2. `section_class` (user-input) = 3
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 200000
9. `M_c_y_Rd` (formula) = 7.100000e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 71000000,
  "M_y_Ed": 20000000,
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
- Expected message snippet: `bending-y: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.25538544`

#### Derivation Steps (evaluation trace)

1. `M_y_Ed` (user-input) = 2.000000e+7
2. `section_class` (user-input) = 1
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 220600
9. `M_c_y_Rd` (formula) = 7.831300e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 78313000,
  "M_y_Ed": 20000000,
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
2. `section_class` (user-input) = 2
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 220600
9. `M_c_y_Rd` (formula) = 7.831300e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.25538544

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.25538544047603845,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 78313000,
  "M_y_Ed": 20000000,
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
2. `section_class` (user-input) = 3
3. `Wel_y` (user-input) = 200000
4. `Wpl_y` (user-input) = 220600
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_y_res` (derived) = 200000
9. `M_c_y_Rd` (formula) = 7.100000e+7
10. `abs_M_y_Ed` (derived) = 2.000000e+7
11. `bending_y_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_y_Ed": 20000000,
  "bending_y_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_y_Rd": 71000000,
  "M_y_Ed": 20000000,
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
- Expected message snippet: `bending-y: class 4 sections are out of scope`

