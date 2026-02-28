# Check 5 - ulsShearZ

- Verification expression: `\frac{V_{z,Ed}}{V_{pl,z,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.6`
- Formula refs: `(6.18)`
- Verification refs: `(6.17)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.171313777) |
| i-c2 | I | 2 | ok (0.171313777) |
| i-c3 | I | 3 | ok (0.171313777) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.171313777) |
| rhs-c2 | RHS | 2 | ok (0.171313777) |
| rhs-c3 | RHS | 3 | ok (0.171313777) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.171313777) |
| chs-c2 | CHS | 2 | ok (0.171313777) |
| chs-c3 | CHS | 3 | ok (0.171313777) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 1
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 1,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 2
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 2,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 3
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 3,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `shear-z: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 1
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 1,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 2
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 2,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 3
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 3,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `shear-z: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 1
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 1,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 2
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 2,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.171313777`

#### Derivation Steps (evaluation trace)

1. `V_z_Ed` (user-input) = 50000
2. `section_class` (user-input) = 3
3. `Av_z` (user-input) = 1424
4. `fy` (user-input) = 355
5. `gamma_M0` (coefficient) = 1
6. `sqrt3` (constant) = 1.732050808
7. `V_pl_z_num` (derived) = 505520
8. `V_pl_z_den` (derived) = 1.732050808
9. `V_pl_z_Rd` (formula) = 291862.10808074
10. `abs_V_z_Ed` (derived) = 50000
11. `class_guard` (derived) = 1
12. `shear_z_check` (check) = 0.171313777

#### Expected Intermediates

```json
{
  "abs_V_z_Ed": 50000,
  "Av_z": 1424,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "section_class": 3,
  "shear_z_check": 0.17131377666253336,
  "sqrt3": 1.7320508075688772,
  "V_pl_z_den": 1.7320508075688772,
  "V_pl_z_num": 505520,
  "V_pl_z_Rd": 291862.1080807396,
  "V_z_Ed": 50000
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `shear-z: class 4 sections are out of scope`

