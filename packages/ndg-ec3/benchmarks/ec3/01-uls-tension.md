# Check 1 - ulsTension

- Verification expression: `\frac{N_{Ed}}{N_{pl,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.3`
- Formula refs: `(6.6)`
- Verification refs: `(6.5)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0) |
| i-c2 | I | 2 | ok (0) |
| i-c3 | I | 3 | ok (0) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0) |
| rhs-c2 | RHS | 2 | ok (0) |
| rhs-c3 | RHS | 3 | ok (0) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0) |
| chs-c2 | CHS | 2 | ok (0) |
| chs-c3 | CHS | 3 | ok (0) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 1,
  "tension_check": 0
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 2,
  "tension_check": 0
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 3,
  "tension_check": 0
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `6.2.3`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `tension: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 1,
  "tension_check": 0
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 2,
  "tension_check": 0
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 3,
  "tension_check": 0
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `6.2.3`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `tension: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 1
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 1,
  "tension_check": 0
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 2
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 2,
  "tension_check": 0
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `6.2.3`
- Expected ratio: `0`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `section_class` (user-input) = 3
3. `A` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `N_pl_Rd` (formula) = 1.011040e+6
7. `abs_N_Ed` (derived) = 0
8. `class_guard` (derived) = 1
9. `tension_check` (check) = 0

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 0,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "N_Ed": -200000,
  "N_pl_Rd": 1011040,
  "section_class": 3,
  "tension_check": 0
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `6.2.3`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `tension: class 4 sections are out of scope`

