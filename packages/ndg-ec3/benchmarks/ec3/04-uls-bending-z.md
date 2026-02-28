# Check 4 - ulsBendingZ

- Verification expression: `\frac{M_{z,Ed}}{M_{c,z,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.5`
- Formula refs: `(6.13)`
- Verification refs: `(6.12)`
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
2. `section_class` (user-input) = 1
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 57700
9. `M_c_z_Rd` (formula) = 2.048350e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 20483500,
  "M_z_Ed": 5000000,
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
2. `section_class` (user-input) = 2
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 57700
9. `M_c_z_Rd` (formula) = 2.048350e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 20483500,
  "M_z_Ed": 5000000,
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
2. `section_class` (user-input) = 3
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 50000
9. `M_c_z_Rd` (formula) = 1.775000e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 17750000,
  "M_z_Ed": 5000000,
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
- Expected message snippet: `bending-z: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `section_class` (user-input) = 1
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 57700
9. `M_c_z_Rd` (formula) = 2.048350e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 20483500,
  "M_z_Ed": 5000000,
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
2. `section_class` (user-input) = 2
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 57700
9. `M_c_z_Rd` (formula) = 2.048350e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 20483500,
  "M_z_Ed": 5000000,
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
2. `section_class` (user-input) = 3
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 50000
9. `M_c_z_Rd` (formula) = 1.775000e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 17750000,
  "M_z_Ed": 5000000,
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
- Expected message snippet: `bending-z: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `section_class` (user-input) = 1
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 57700
9. `M_c_z_Rd` (formula) = 2.048350e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 20483500,
  "M_z_Ed": 5000000,
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
2. `section_class` (user-input) = 2
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 57700
9. `M_c_z_Rd` (formula) = 2.048350e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 20483500,
  "M_z_Ed": 5000000,
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
2. `section_class` (user-input) = 3
3. `Wel_z` (user-input) = 50000
4. `Wpl_z` (user-input) = 57700
5. `fy` (user-input) = 355
6. `gamma_M0` (coefficient) = 1
7. `class_guard` (derived) = 1
8. `W_z_res` (derived) = 50000
9. `M_c_z_Rd` (formula) = 1.775000e+7
10. `abs_M_z_Ed` (derived) = 5.000000e+6
11. `bending_z_check` (check) = 0.281690141

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "bending_z_check": 0.28169014084507044,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_c_z_Rd": 17750000,
  "M_z_Ed": 5000000,
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
- Expected message snippet: `bending-z: class 4 sections are out of scope`

