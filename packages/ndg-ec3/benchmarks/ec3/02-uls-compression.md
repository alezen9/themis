# Check 2 - ulsCompression

- Verification expression: `\frac{N_{Ed}}{N_{c,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.4`
- Formula refs: `(6.10)`
- Verification refs: `(6.9)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.19781611) |
| i-c2 | I | 2 | ok (0.19781611) |
| i-c3 | I | 3 | ok (0.19781611) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.19781611) |
| rhs-c2 | RHS | 2 | ok (0.19781611) |
| rhs-c3 | RHS | 3 | ok (0.19781611) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.19781611) |
| chs-c2 | CHS | 2 | ok (0.19781611) |
| chs-c3 | CHS | 3 | ok (0.19781611) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 1
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 2
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 3
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `compression: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 1
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 2
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 3
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `compression: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 1
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 2
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.19781611`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_c_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 200000
8. `class_guard` (derived) = 1
9. `compression_check` (check) = 0.19781611

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "class_guard": 1,
  "compression_check": 0.19781611014401013,
  "fy": 355,
  "gamma_M0": 1,
  "N_c_Rd": 1011040,
  "N_Ed": -200000,
  "section_class": 3
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `compression: class 4 sections are out of scope`

