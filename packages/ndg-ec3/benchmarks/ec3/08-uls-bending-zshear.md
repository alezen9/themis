# Check 8 - ulsBendingZShear

- Verification expression: `\frac{M_{z,Ed}}{M_{z,V,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.2.6`, `6.2.8`
- Formula refs: `(6.18)`
- Verification refs: n/a
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.244098909) |
| i-c2 | I | 2 | ok (0.244098909) |
| i-c3 | I | 3 | ok (0.244098909) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | ok (0.244098909) |
| rhs-c2 | RHS | 2 | ok (0.244098909) |
| rhs-c3 | RHS | 3 | ok (0.244098909) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | ok (0.244098909) |
| chs-c2 | CHS | 2 | ok (0.244098909) |
| chs-c3 | CHS | 3 | ok (0.244098909) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 1
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 2
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 3
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-shear: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 1
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 2
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 3
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-shear: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 1
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 1,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 2
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 2,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.244098909`

#### Derivation Steps (evaluation trace)

1. `M_z_Ed` (user-input) = 5.000000e+6
2. `V_y_Ed` (user-input) = 10000
3. `section_class` (user-input) = 3
4. `Wpl_z` (user-input) = 57700
5. `Av_y` (user-input) = 2848
6. `Av_z` (user-input) = 1424
7. `tw` (user-input) = 5.6
8. `fy` (user-input) = 355
9. `gamma_M0` (coefficient) = 1
10. `sqrt3` (constant) = 1.732050808
11. `V_pl_y_num` (derived) = 1.011040e+6
12. `V_pl_y_den` (derived) = 1.732050808
13. `V_pl_y_Rd` (formula) = 583724.216161479
14. `abs_V_y_Ed` (derived) = 10000
15. `rho_ratio` (derived) = 0.017131378
16. `rho_linear` (derived) = -0.965737245
17. `rho_sq` (derived) = 0.932648426
18. `rho_y` (derived) = 0
19. `Wpl_z_web` (derived) = 1993.6
20. `Wpl_z_flange` (derived) = 55706.4
21. `rho_flange_reduction` (derived) = 0
22. `Wpl_z_eff` (derived) = 57700
23. `M_z_V_num` (derived) = 2.048350e+7
24. `class_guard` (derived) = 1
25. `M_z_V_Rd` (derived) = 2.048350e+7
26. `abs_M_z_Ed` (derived) = 5.000000e+6
27. `bending_z_shear_check` (check) = 0.244098909

#### Expected Intermediates

```json
{
  "abs_M_z_Ed": 5000000,
  "abs_V_y_Ed": 10000,
  "Av_y": 2848,
  "Av_z": 1424,
  "bending_z_shear_check": 0.24409890887787733,
  "class_guard": 1,
  "fy": 355,
  "gamma_M0": 1,
  "M_z_Ed": 5000000,
  "M_z_V_num": 20483500,
  "M_z_V_Rd": 20483500,
  "rho_flange_reduction": 0,
  "rho_linear": -0.9657372446674933,
  "rho_ratio": 0.017131377666253337,
  "rho_sq": 0.9326484257379619,
  "rho_y": 0,
  "section_class": 3,
  "sqrt3": 1.7320508075688772,
  "tw": 5.6,
  "V_pl_y_den": 1.7320508075688772,
  "V_pl_y_num": 1011040,
  "V_pl_y_Rd": 583724.2161614792,
  "V_y_Ed": 10000,
  "Wpl_z": 57700,
  "Wpl_z_eff": 57700,
  "Wpl_z_flange": 55706.4,
  "Wpl_z_web": 1993.6
}
```

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `bending-z-shear: class 4 sections are out of scope`

