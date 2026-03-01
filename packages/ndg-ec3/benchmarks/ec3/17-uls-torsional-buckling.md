# Check 17 - ulsTorsionalBuckling

- Verification expression: `\frac{N_{Ed}}{N_{b,TF,Rd}} \leq 1.0`
- Section refs: `6.1`, `6.3.1.4`, `6.3.1.2`, `6.3.1.1`
- Formula refs: `(6.49)`, `(6.47)`
- Verification refs: `(6.46)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.306764336) |
| i-c2 | I | 2 | ok (0.306764336) |
| i-c3 | I | 3 | ok (0.306764336) |
| i-c4 | I | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| rhs-c1 | RHS | 1 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| rhs-c2 | RHS | 2 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| rhs-c3 | RHS | 3 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| rhs-c4 | RHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |
| chs-c1 | CHS | 1 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| chs-c2 | CHS | 2 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| chs-c3 | CHS | 3 | not_applicable (NOT_APPLICABLE_SECTION_SHAPE) |
| chs-c4 | CHS | 4 | not_applicable (NOT_APPLICABLE_SECTION_CLASS) |

## Per-Cell Derivations

### i-c1

- Branch decision: shape=`I`, class=`1` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.306764336`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `A` (user-input) = 2848
3. `fy` (user-input) = 355
4. `E` (user-input) = 210000
5. `G` (user-input) = 81000
6. `Iy` (user-input) = 1.943000e+7
7. `Iz` (user-input) = 1.424000e+6
8. `It` (user-input) = 69800
9. `Iw` (user-input) = 1.299000e+10
10. `L` (user-input) = 3000
11. `k_T` (user-input) = 1
12. `k_z` (user-input) = 1
13. `section_class` (user-input) = 1
14. `alpha_z` (user-input) = 0.34
15. `gamma_M1` (coefficient) = 1
16. `piSq` (constant) = 9.869604401
17. `Lcr_T` (derived) = 3000
18. `Lcr_T_sq` (derived) = 9.000000e+6
19. `ip2_num` (derived) = 2.085400e+7
20. `ip2` (derived) = 7322.331460674
21. `ncr_t_left` (derived) = 5.653800e+9
22. `ncr_t_right_num` (derived) = 2.692329e+16
23. `ncr_t_right` (derived) = 2.991477e+9
24. `N_cr_T_num` (derived) = 8.645277e+9
25. `N_cr_T` (derived) = 1.180673e+6
26. `N_cr_z_num` (derived) = 2.951407e+12
27. `N_cr_z` (derived) = 327934.055566862
28. `N_cr_TF` (derived) = 327934.055566862
29. `N_cr_governing` (derived) = 1.180673e+6
30. `lambda_bar_TF_num` (derived) = 1.011040e+6
31. `lambda_bar_TF_sq` (derived) = 0.856325358
32. `lambda_bar_TF` (derived) = 0.925378494
33. `lambda_delta` (derived) = 0.725378494
34. `phi_alpha_term` (derived) = 0.246628688
35. `phi_inner` (derived) = 2.102954046
36. `phi_TF` (derived) = 1.051477023
37. `phi_TF_sq` (derived) = 1.10560393
38. `chi_TF_radicand` (derived) = 0.249278572
39. `chi_TF_root` (derived) = 0.499278051
40. `chi_TF_den` (derived) = 1.550755074
41. `chi_TF_base` (formula) = 0.644847157
42. `chi_TF` (derived) = 0.644847157
43. `N_b_TF_num` (derived) = 651966.269333927
44. `N_b_TF_Rd` (formula) = 651966.269333927
45. `abs_N_Ed` (derived) = 200000
46. `torsional_buckling_check` (check) = 0.306764336

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "chi_TF": 0.6448471567236975,
  "chi_TF_base": 0.6448471567236975,
  "chi_TF_den": 1.550755073622008,
  "chi_TF_radicand": 0.24927857194674952,
  "chi_TF_root": 0.4992780507360097,
  "E": 210000,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "ip2": 7322.331460674157,
  "ip2_num": 20854000,
  "It": 69800,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_T": 1,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_TF": 0.9253784942986586,
  "lambda_bar_TF_num": 1011040,
  "lambda_bar_TF_sq": 0.8563253577104525,
  "lambda_delta": 0.7253784942986585,
  "Lcr_T": 3000,
  "Lcr_T_sq": 9000000,
  "N_b_TF_num": 651966.2693339272,
  "N_b_TF_Rd": 651966.2693339272,
  "N_cr_governing": 1180672.7325034568,
  "N_cr_T": 1180672.7325034568,
  "N_cr_T_num": 8645277093.970184,
  "N_cr_TF": 327934.05556686234,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "ncr_t_left": 5653800000,
  "ncr_t_right": 2991477093.9701843,
  "ncr_t_right_num": 26923293845731660,
  "phi_alpha_term": 0.24662868806154392,
  "phi_inner": 2.1029540457719964,
  "phi_TF": 1.0514770228859982,
  "phi_TF_sq": 1.105603929657202,
  "piSq": 9.869604401089358,
  "section_class": 1,
  "torsional_buckling_check": 0.3067643364499936
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.306764336`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `A` (user-input) = 2848
3. `fy` (user-input) = 355
4. `E` (user-input) = 210000
5. `G` (user-input) = 81000
6. `Iy` (user-input) = 1.943000e+7
7. `Iz` (user-input) = 1.424000e+6
8. `It` (user-input) = 69800
9. `Iw` (user-input) = 1.299000e+10
10. `L` (user-input) = 3000
11. `k_T` (user-input) = 1
12. `k_z` (user-input) = 1
13. `section_class` (user-input) = 2
14. `alpha_z` (user-input) = 0.34
15. `gamma_M1` (coefficient) = 1
16. `piSq` (constant) = 9.869604401
17. `Lcr_T` (derived) = 3000
18. `Lcr_T_sq` (derived) = 9.000000e+6
19. `ip2_num` (derived) = 2.085400e+7
20. `ip2` (derived) = 7322.331460674
21. `ncr_t_left` (derived) = 5.653800e+9
22. `ncr_t_right_num` (derived) = 2.692329e+16
23. `ncr_t_right` (derived) = 2.991477e+9
24. `N_cr_T_num` (derived) = 8.645277e+9
25. `N_cr_T` (derived) = 1.180673e+6
26. `N_cr_z_num` (derived) = 2.951407e+12
27. `N_cr_z` (derived) = 327934.055566862
28. `N_cr_TF` (derived) = 327934.055566862
29. `N_cr_governing` (derived) = 1.180673e+6
30. `lambda_bar_TF_num` (derived) = 1.011040e+6
31. `lambda_bar_TF_sq` (derived) = 0.856325358
32. `lambda_bar_TF` (derived) = 0.925378494
33. `lambda_delta` (derived) = 0.725378494
34. `phi_alpha_term` (derived) = 0.246628688
35. `phi_inner` (derived) = 2.102954046
36. `phi_TF` (derived) = 1.051477023
37. `phi_TF_sq` (derived) = 1.10560393
38. `chi_TF_radicand` (derived) = 0.249278572
39. `chi_TF_root` (derived) = 0.499278051
40. `chi_TF_den` (derived) = 1.550755074
41. `chi_TF_base` (formula) = 0.644847157
42. `chi_TF` (derived) = 0.644847157
43. `N_b_TF_num` (derived) = 651966.269333927
44. `N_b_TF_Rd` (formula) = 651966.269333927
45. `abs_N_Ed` (derived) = 200000
46. `torsional_buckling_check` (check) = 0.306764336

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "chi_TF": 0.6448471567236975,
  "chi_TF_base": 0.6448471567236975,
  "chi_TF_den": 1.550755073622008,
  "chi_TF_radicand": 0.24927857194674952,
  "chi_TF_root": 0.4992780507360097,
  "E": 210000,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "ip2": 7322.331460674157,
  "ip2_num": 20854000,
  "It": 69800,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_T": 1,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_TF": 0.9253784942986586,
  "lambda_bar_TF_num": 1011040,
  "lambda_bar_TF_sq": 0.8563253577104525,
  "lambda_delta": 0.7253784942986585,
  "Lcr_T": 3000,
  "Lcr_T_sq": 9000000,
  "N_b_TF_num": 651966.2693339272,
  "N_b_TF_Rd": 651966.2693339272,
  "N_cr_governing": 1180672.7325034568,
  "N_cr_T": 1180672.7325034568,
  "N_cr_T_num": 8645277093.970184,
  "N_cr_TF": 327934.05556686234,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "ncr_t_left": 5653800000,
  "ncr_t_right": 2991477093.9701843,
  "ncr_t_right_num": 26923293845731660,
  "phi_alpha_term": 0.24662868806154392,
  "phi_inner": 2.1029540457719964,
  "phi_TF": 1.0514770228859982,
  "phi_TF_sq": 1.105603929657202,
  "piSq": 9.869604401089358,
  "section_class": 2,
  "torsional_buckling_check": 0.3067643364499936
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.306764336`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `A` (user-input) = 2848
3. `fy` (user-input) = 355
4. `E` (user-input) = 210000
5. `G` (user-input) = 81000
6. `Iy` (user-input) = 1.943000e+7
7. `Iz` (user-input) = 1.424000e+6
8. `It` (user-input) = 69800
9. `Iw` (user-input) = 1.299000e+10
10. `L` (user-input) = 3000
11. `k_T` (user-input) = 1
12. `k_z` (user-input) = 1
13. `section_class` (user-input) = 3
14. `alpha_z` (user-input) = 0.34
15. `gamma_M1` (coefficient) = 1
16. `piSq` (constant) = 9.869604401
17. `Lcr_T` (derived) = 3000
18. `Lcr_T_sq` (derived) = 9.000000e+6
19. `ip2_num` (derived) = 2.085400e+7
20. `ip2` (derived) = 7322.331460674
21. `ncr_t_left` (derived) = 5.653800e+9
22. `ncr_t_right_num` (derived) = 2.692329e+16
23. `ncr_t_right` (derived) = 2.991477e+9
24. `N_cr_T_num` (derived) = 8.645277e+9
25. `N_cr_T` (derived) = 1.180673e+6
26. `N_cr_z_num` (derived) = 2.951407e+12
27. `N_cr_z` (derived) = 327934.055566862
28. `N_cr_TF` (derived) = 327934.055566862
29. `N_cr_governing` (derived) = 1.180673e+6
30. `lambda_bar_TF_num` (derived) = 1.011040e+6
31. `lambda_bar_TF_sq` (derived) = 0.856325358
32. `lambda_bar_TF` (derived) = 0.925378494
33. `lambda_delta` (derived) = 0.725378494
34. `phi_alpha_term` (derived) = 0.246628688
35. `phi_inner` (derived) = 2.102954046
36. `phi_TF` (derived) = 1.051477023
37. `phi_TF_sq` (derived) = 1.10560393
38. `chi_TF_radicand` (derived) = 0.249278572
39. `chi_TF_root` (derived) = 0.499278051
40. `chi_TF_den` (derived) = 1.550755074
41. `chi_TF_base` (formula) = 0.644847157
42. `chi_TF` (derived) = 0.644847157
43. `N_b_TF_num` (derived) = 651966.269333927
44. `N_b_TF_Rd` (formula) = 651966.269333927
45. `abs_N_Ed` (derived) = 200000
46. `torsional_buckling_check` (check) = 0.306764336

#### Expected Intermediates

```json
{
  "A": 2848,
  "abs_N_Ed": 200000,
  "alpha_z": 0.34,
  "chi_TF": 0.6448471567236975,
  "chi_TF_base": 0.6448471567236975,
  "chi_TF_den": 1.550755073622008,
  "chi_TF_radicand": 0.24927857194674952,
  "chi_TF_root": 0.4992780507360097,
  "E": 210000,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "ip2": 7322.331460674157,
  "ip2_num": 20854000,
  "It": 69800,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_T": 1,
  "k_z": 1,
  "L": 3000,
  "lambda_bar_TF": 0.9253784942986586,
  "lambda_bar_TF_num": 1011040,
  "lambda_bar_TF_sq": 0.8563253577104525,
  "lambda_delta": 0.7253784942986585,
  "Lcr_T": 3000,
  "Lcr_T_sq": 9000000,
  "N_b_TF_num": 651966.2693339272,
  "N_b_TF_Rd": 651966.2693339272,
  "N_cr_governing": 1180672.7325034568,
  "N_cr_T": 1180672.7325034568,
  "N_cr_T_num": 8645277093.970184,
  "N_cr_TF": 327934.05556686234,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "ncr_t_left": 5653800000,
  "ncr_t_right": 2991477093.9701843,
  "ncr_t_right_num": 26923293845731660,
  "phi_alpha_term": 0.24662868806154392,
  "phi_inner": 2.1029540457719964,
  "phi_TF": 1.0514770228859982,
  "phi_TF_sq": 1.105603929657202,
  "piSq": 9.869604401089358,
  "section_class": 3,
  "torsional_buckling_check": 0.3067643364499936
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `torsional-buckling: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `torsional-buckling: implemented only for open I/H sections`

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `torsional-buckling: implemented only for open I/H sections`

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `torsional-buckling: implemented only for open I/H sections`

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `torsional-buckling: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `torsional-buckling: implemented only for open I/H sections`

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `torsional-buckling: implemented only for open I/H sections`

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `torsional-buckling: implemented only for open I/H sections`

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `torsional-buckling: class 4 sections are out of scope`

