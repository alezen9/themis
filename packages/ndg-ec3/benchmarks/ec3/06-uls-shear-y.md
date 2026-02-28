# Check 6 - ulsShearY

- Verification expression: `\frac{V_{y,Ed}}{V_{pl,y,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.6`
- Formula refs: `(6.18)`
- Verification refs: `(6.17)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.017131378) |
| i-c2 | I | 2 | ok (0.017131378) |
| i-c3 | I | 3 | ok (0.017131378) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.017131378) |
| rhs-c2 | RHS | 2 | ok (0.017131378) |
| rhs-c3 | RHS | 3 | ok (0.017131378) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.017131378) |
| chs-c2 | CHS | 2 | ok (0.017131378) |
| chs-c3 | CHS | 3 | ok (0.017131378) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 1
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 1,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 2
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 2,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 3
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 3,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `shear-y: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 1
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 1,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 2
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 2,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 3
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 3,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `shear-y: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 1
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 1,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 2
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 2,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.017131378`

#### Derivation Steps (evaluation trace)

1. `V_y_Ed` (user-input) = 10000
2. `section_class` (user-input) = 3
3. `Av_y` (user-input) = 2848
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_y_num` (derived) = 1.011040e+6
8. `V_pl_y_den` (derived) = 1.732050808
9. `V_pl_y_Rd` (formula) = 583724.216161479
10. `abs_V_y_Ed` (derived) = 10000
11. `class_guard` (derived) = 1
12. `shear_y_check` (check) = 0.017131378

#### Expected Intermediates

```json
{
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 3,
  "shear_y_check": 0.017131377666253337,
  "sqrt3": 1.7320508075688772,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `shear-y: class 4 sections are out of scope`

