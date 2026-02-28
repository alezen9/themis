# Check 21 - ulsBeamColumn61M2

- Verification expression: `\frac{N_{Ed}}{\chi_y N_{Rk}/\gamma_{M1}} + k_{yy}\frac{M_{y,Ed}}{\chi_{LT} M_{y,Rk}/\gamma_{M1}} + k_{yz}\frac{M_{z,Ed}}{M_{z,Rk}/\gamma_{M1}} \leq 1.0`
- Section refs: `6.1`, `6.3.2.3`, `Annex B`, `6.3.2.2`, `6.3.3`
- Formula refs: n/a
- Verification refs: `(6.61)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.671138144) |
| i-c2 | I | 2 | ok (0.671138144) |
| i-c3 | I | 3 | ok (0.671138144) |
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
- Expected ratio: `0.671138144`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wpl_y` (user-input) = 220600
6. `Wpl_z` (user-input) = 57700
7. `fy` (user-input) = 355
8. `E` (user-input) = 210000
9. `G` (user-input) = 81000
10. `Iy` (user-input) = 1.943000e+7
11. `Iz` (user-input) = 1.424000e+6
12. `It` (user-input) = 69800
13. `Iw` (user-input) = 1.299000e+10
14. `L` (user-input) = 3000
15. `k_y` (user-input) = 1
16. `k_z` (user-input) = 1
17. `k_LT` (user-input) = 1
18. `psi_LT` (user-input) = 1
19. `section_class` (user-input) = 1
20. `alpha_y` (user-input) = 0.21
21. `alpha_z` (user-input) = 0.34
22. `alpha_LT` (user-input) = 0.34
23. `psi_y` (user-input) = 0.1
24. `psi_z` (user-input) = -0.2
25. `gamma_M1` (coefficient) = 1
26. `lambda_LT_0` (coefficient) = 0.4
27. `beta_LT` (coefficient) = 0.75
28. `piSq` (constant) = 9.869604401
29. `k_c` (table) = 1
30. `C1` (derived) = 1
31. `Lcr_y` (derived) = 3000
32. `Lcr_z` (derived) = 3000
33. `Lcr_LT` (derived) = 3000
34. `Lcr_y_sq` (derived) = 9.000000e+6
35. `Lcr_z_sq` (derived) = 9.000000e+6
36. `Lcr_LT_sq` (derived) = 9.000000e+6
37. `psi_y_eff` (derived) = 0.1
38. `psi_z_eff` (derived) = -0.2
39. `psi_LT_eff` (derived) = 1
40. `Cm_y` (table) = 0.64
41. `Cm_z` (table) = 0.52
42. `Cm_LT` (table) = 1
43. `euler_num` (derived) = 2.951407e+12
44. `euler_term` (derived) = 327934.055566862
45. `torsion_ratio` (derived) = 9122.191011236
46. `torsion_num` (derived) = 5.088420e+16
47. `torsion_den` (derived) = 2.951407e+12
48. `torsion_add` (derived) = 17240.661358659
49. `torsion_sum` (derived) = 26362.852369895
50. `torsion_root` (derived) = 162.366413922
51. `M_cr_prefactor` (derived) = 327934.055566862
52. `M_cr` (derived) = 5.324548e+7
53. `N_Rk` (derived) = 1.011040e+6
54. `M_y_Rk` (derived) = 7.831300e+7
55. `M_z_Rk` (derived) = 2.048350e+7
56. `N_cr_y_num` (derived) = 4.027095e+13
57. `N_cr_y` (derived) = 4.474550e+6
58. `N_cr_z_num` (derived) = 2.951407e+12
59. `N_cr_z` (derived) = 327934.055566862
60. `lambda_bar_y_sq` (derived) = 0.225953466
61. `lambda_bar_y` (derived) = 0.475345627
62. `lambda_bar_z_sq` (derived) = 3.083058874
63. `lambda_bar_z` (derived) = 1.755864139
64. `phi_y_alpha` (derived) = 0.057822582
65. `phi_y_inner` (derived) = 1.283776047
66. `phi_y` (derived) = 0.641888024
67. `phi_y_sq` (derived) = 0.412020235
68. `chi_y_radicand` (derived) = 0.186066769
69. `chi_y_root` (derived) = 0.431354575
70. `chi_y_den` (derived) = 1.073242599
71. `chi_y_base` (derived) = 0.931755785
72. `chi_y` (derived) = 0.931755785
73. `phi_z_alpha` (derived) = 0.528993807
74. `phi_z_inner` (derived) = 4.612052681
75. `phi_z` (derived) = 2.30602634
76. `phi_z_sq` (derived) = 5.317757483
77. `chi_z_radicand` (derived) = 2.234698609
78. `chi_z_root` (derived) = 1.494890835
79. `chi_z_den` (derived) = 3.800917176
80. `chi_z_base` (derived) = 0.263094394
81. `chi_z` (derived) = 0.263094394
82. `lambda_LT_sq` (derived) = 1.470791605
83. `lambda_LT` (derived) = 1.212761974
84. `phi_LT_alpha` (derived) = 0.276339071
85. `phi_LT_beta` (derived) = 1.103093704
86. `phi_LT_inner` (derived) = 2.379432775
87. `phi_LT` (derived) = 1.189716387
88. `phi_LT_sq` (derived) = 1.415425083
89. `chi_LT_radicand` (derived) = 0.312331379
90. `chi_LT_root` (derived) = 0.558866155
91. `chi_LT_den` (derived) = 1.748582542
92. `chi_LT_base` (derived) = 0.57189179
93. `chi_LT_cap` (derived) = 0.679905975
94. `chi_LT` (derived) = 0.57189179
95. `f_LT` (derived) = 1
96. `chi_LT_mod` (derived) = 0.57189179
97. `N_b_y_Rd` (derived) = 942042.368857003
98. `n_y` (derived) = 0.212304676
99. `lambda_bar_y_cap` (derived) = 0.475345627
100. `k_yy_branch1_term` (derived) = 0.275345627
101. `k_yy_branch1` (derived) = 0.677412585
102. `k_yy_branch2` (derived) = 0.748699994
103. `k_yy` (table) = 0.677412585
104. `N_b_z_Rd` (derived) = 265998.955855133
105. `n_z` (derived) = 0.751882651
106. `lambda_bar_z_cap` (derived) = 1
107. `k_zz_branch1_term` (derived) = 1.4
108. `k_zz_branch1` (derived) = 1.06737057
109. `k_zz_branch2` (derived) = 1.06737057
110. `k_zz_aux` (derived) = 1.06737057
111. `k_yz` (table) = 0.640422342
112. `bc_61_term1` (derived) = 0.212304676
113. `bc_61_term2` (derived) = 0.302507073
114. `bc_61_term3` (derived) = 0.156326395
115. `bc_61_m2_check` (check) = 0.671138144

#### Expected Intermediates

```json
{
  "A": 2848,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "bc_61_m2_check": 0.6711381438950287,
  "bc_61_term1": 0.21230467610778872,
  "bc_61_term2": 0.3025070729312826,
  "bc_61_term3": 0.15632639485595737,
  "beta_LT": 0.75,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_base": 0.571891790034929,
  "chi_LT_cap": 0.6799059748099839,
  "chi_LT_den": 1.7485825420555938,
  "chi_LT_mod": 0.571891790034929,
  "chi_LT_radicand": 0.312331378759521,
  "chi_LT_root": 0.5588661546019056,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_radicand": 0.18606676936110092,
  "chi_y_root": 0.4313545749857082,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_radicand": 2.234698609062864,
  "chi_z_root": 1.4948908351658539,
  "Cm_LT": 1,
  "Cm_y": 0.64,
  "Cm_z": 0.52,
  "E": 210000,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "It": 69800,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "k_y": 1,
  "k_yy": 0.6774125851278897,
  "k_yy_branch1": 0.6774125851278897,
  "k_yy_branch1_term": 0.27534562749173086,
  "k_yy_branch2": 0.7486999941671879,
  "k_yz": 0.6404223418064006,
  "k_z": 1,
  "k_zz_aux": 1.0673705696773343,
  "k_zz_branch1": 1.0673705696773343,
  "k_zz_branch1_term": 1.4,
  "k_zz_branch2": 1.0673705696773343,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_cap": 0.47534562749173087,
  "lambda_bar_y_sq": 0.22595346557550736,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_cap": 1,
  "lambda_bar_z_sq": 3.0830588736882785,
  "lambda_LT": 1.2127619737971853,
  "lambda_LT_0": 0.4,
  "lambda_LT_sq": 1.4707916050884449,
  "Lcr_LT": 3000,
  "Lcr_LT_sq": 9000000,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "M_cr": 53245476.60529427,
  "M_cr_prefactor": 327934.05556686234,
  "M_y_Ed": 20000000,
  "M_y_Rk": 78313000,
  "M_z_Ed": 5000000,
  "M_z_Rk": 20483500,
  "N_b_y_Rd": 942042.3688570027,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "N_Rk": 1011040,
  "n_y": 0.21230467610778872,
  "n_z": 0.7518826506556789,
  "phi_LT": 1.1897163874536882,
  "phi_LT_alpha": 0.276339071091043,
  "phi_LT_beta": 1.1030937038163335,
  "phi_LT_inner": 2.3794327749073765,
  "phi_LT_sq": 1.4154250825758545,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha": 0.05782258177326348,
  "phi_y_inner": 1.2837760473487707,
  "phi_y_sq": 0.4120202349366083,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha": 0.5289938071691909,
  "phi_z_inner": 4.612052680857469,
  "phi_z_sq": 5.3177574827511425,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "psi_LT_eff": 1,
  "psi_y": 0.1,
  "psi_y_eff": 0.1,
  "psi_z": -0.2,
  "psi_z_eff": -0.2,
  "section_class": 1,
  "torsion_add": 17240.661358659192,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.671138144`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wpl_y` (user-input) = 220600
6. `Wpl_z` (user-input) = 57700
7. `fy` (user-input) = 355
8. `E` (user-input) = 210000
9. `G` (user-input) = 81000
10. `Iy` (user-input) = 1.943000e+7
11. `Iz` (user-input) = 1.424000e+6
12. `It` (user-input) = 69800
13. `Iw` (user-input) = 1.299000e+10
14. `L` (user-input) = 3000
15. `k_y` (user-input) = 1
16. `k_z` (user-input) = 1
17. `k_LT` (user-input) = 1
18. `psi_LT` (user-input) = 1
19. `section_class` (user-input) = 2
20. `alpha_y` (user-input) = 0.21
21. `alpha_z` (user-input) = 0.34
22. `alpha_LT` (user-input) = 0.34
23. `psi_y` (user-input) = 0.1
24. `psi_z` (user-input) = -0.2
25. `gamma_M1` (coefficient) = 1
26. `lambda_LT_0` (coefficient) = 0.4
27. `beta_LT` (coefficient) = 0.75
28. `piSq` (constant) = 9.869604401
29. `k_c` (table) = 1
30. `C1` (derived) = 1
31. `Lcr_y` (derived) = 3000
32. `Lcr_z` (derived) = 3000
33. `Lcr_LT` (derived) = 3000
34. `Lcr_y_sq` (derived) = 9.000000e+6
35. `Lcr_z_sq` (derived) = 9.000000e+6
36. `Lcr_LT_sq` (derived) = 9.000000e+6
37. `psi_y_eff` (derived) = 0.1
38. `psi_z_eff` (derived) = -0.2
39. `psi_LT_eff` (derived) = 1
40. `Cm_y` (table) = 0.64
41. `Cm_z` (table) = 0.52
42. `Cm_LT` (table) = 1
43. `euler_num` (derived) = 2.951407e+12
44. `euler_term` (derived) = 327934.055566862
45. `torsion_ratio` (derived) = 9122.191011236
46. `torsion_num` (derived) = 5.088420e+16
47. `torsion_den` (derived) = 2.951407e+12
48. `torsion_add` (derived) = 17240.661358659
49. `torsion_sum` (derived) = 26362.852369895
50. `torsion_root` (derived) = 162.366413922
51. `M_cr_prefactor` (derived) = 327934.055566862
52. `M_cr` (derived) = 5.324548e+7
53. `N_Rk` (derived) = 1.011040e+6
54. `M_y_Rk` (derived) = 7.831300e+7
55. `M_z_Rk` (derived) = 2.048350e+7
56. `N_cr_y_num` (derived) = 4.027095e+13
57. `N_cr_y` (derived) = 4.474550e+6
58. `N_cr_z_num` (derived) = 2.951407e+12
59. `N_cr_z` (derived) = 327934.055566862
60. `lambda_bar_y_sq` (derived) = 0.225953466
61. `lambda_bar_y` (derived) = 0.475345627
62. `lambda_bar_z_sq` (derived) = 3.083058874
63. `lambda_bar_z` (derived) = 1.755864139
64. `phi_y_alpha` (derived) = 0.057822582
65. `phi_y_inner` (derived) = 1.283776047
66. `phi_y` (derived) = 0.641888024
67. `phi_y_sq` (derived) = 0.412020235
68. `chi_y_radicand` (derived) = 0.186066769
69. `chi_y_root` (derived) = 0.431354575
70. `chi_y_den` (derived) = 1.073242599
71. `chi_y_base` (derived) = 0.931755785
72. `chi_y` (derived) = 0.931755785
73. `phi_z_alpha` (derived) = 0.528993807
74. `phi_z_inner` (derived) = 4.612052681
75. `phi_z` (derived) = 2.30602634
76. `phi_z_sq` (derived) = 5.317757483
77. `chi_z_radicand` (derived) = 2.234698609
78. `chi_z_root` (derived) = 1.494890835
79. `chi_z_den` (derived) = 3.800917176
80. `chi_z_base` (derived) = 0.263094394
81. `chi_z` (derived) = 0.263094394
82. `lambda_LT_sq` (derived) = 1.470791605
83. `lambda_LT` (derived) = 1.212761974
84. `phi_LT_alpha` (derived) = 0.276339071
85. `phi_LT_beta` (derived) = 1.103093704
86. `phi_LT_inner` (derived) = 2.379432775
87. `phi_LT` (derived) = 1.189716387
88. `phi_LT_sq` (derived) = 1.415425083
89. `chi_LT_radicand` (derived) = 0.312331379
90. `chi_LT_root` (derived) = 0.558866155
91. `chi_LT_den` (derived) = 1.748582542
92. `chi_LT_base` (derived) = 0.57189179
93. `chi_LT_cap` (derived) = 0.679905975
94. `chi_LT` (derived) = 0.57189179
95. `f_LT` (derived) = 1
96. `chi_LT_mod` (derived) = 0.57189179
97. `N_b_y_Rd` (derived) = 942042.368857003
98. `n_y` (derived) = 0.212304676
99. `lambda_bar_y_cap` (derived) = 0.475345627
100. `k_yy_branch1_term` (derived) = 0.275345627
101. `k_yy_branch1` (derived) = 0.677412585
102. `k_yy_branch2` (derived) = 0.748699994
103. `k_yy` (table) = 0.677412585
104. `N_b_z_Rd` (derived) = 265998.955855133
105. `n_z` (derived) = 0.751882651
106. `lambda_bar_z_cap` (derived) = 1
107. `k_zz_branch1_term` (derived) = 1.4
108. `k_zz_branch1` (derived) = 1.06737057
109. `k_zz_branch2` (derived) = 1.06737057
110. `k_zz_aux` (derived) = 1.06737057
111. `k_yz` (table) = 0.640422342
112. `bc_61_term1` (derived) = 0.212304676
113. `bc_61_term2` (derived) = 0.302507073
114. `bc_61_term3` (derived) = 0.156326395
115. `bc_61_m2_check` (check) = 0.671138144

#### Expected Intermediates

```json
{
  "A": 2848,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "bc_61_m2_check": 0.6711381438950287,
  "bc_61_term1": 0.21230467610778872,
  "bc_61_term2": 0.3025070729312826,
  "bc_61_term3": 0.15632639485595737,
  "beta_LT": 0.75,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_base": 0.571891790034929,
  "chi_LT_cap": 0.6799059748099839,
  "chi_LT_den": 1.7485825420555938,
  "chi_LT_mod": 0.571891790034929,
  "chi_LT_radicand": 0.312331378759521,
  "chi_LT_root": 0.5588661546019056,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_radicand": 0.18606676936110092,
  "chi_y_root": 0.4313545749857082,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_radicand": 2.234698609062864,
  "chi_z_root": 1.4948908351658539,
  "Cm_LT": 1,
  "Cm_y": 0.64,
  "Cm_z": 0.52,
  "E": 210000,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "It": 69800,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "k_y": 1,
  "k_yy": 0.6774125851278897,
  "k_yy_branch1": 0.6774125851278897,
  "k_yy_branch1_term": 0.27534562749173086,
  "k_yy_branch2": 0.7486999941671879,
  "k_yz": 0.6404223418064006,
  "k_z": 1,
  "k_zz_aux": 1.0673705696773343,
  "k_zz_branch1": 1.0673705696773343,
  "k_zz_branch1_term": 1.4,
  "k_zz_branch2": 1.0673705696773343,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_cap": 0.47534562749173087,
  "lambda_bar_y_sq": 0.22595346557550736,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_cap": 1,
  "lambda_bar_z_sq": 3.0830588736882785,
  "lambda_LT": 1.2127619737971853,
  "lambda_LT_0": 0.4,
  "lambda_LT_sq": 1.4707916050884449,
  "Lcr_LT": 3000,
  "Lcr_LT_sq": 9000000,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "M_cr": 53245476.60529427,
  "M_cr_prefactor": 327934.05556686234,
  "M_y_Ed": 20000000,
  "M_y_Rk": 78313000,
  "M_z_Ed": 5000000,
  "M_z_Rk": 20483500,
  "N_b_y_Rd": 942042.3688570027,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "N_Rk": 1011040,
  "n_y": 0.21230467610778872,
  "n_z": 0.7518826506556789,
  "phi_LT": 1.1897163874536882,
  "phi_LT_alpha": 0.276339071091043,
  "phi_LT_beta": 1.1030937038163335,
  "phi_LT_inner": 2.3794327749073765,
  "phi_LT_sq": 1.4154250825758545,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha": 0.05782258177326348,
  "phi_y_inner": 1.2837760473487707,
  "phi_y_sq": 0.4120202349366083,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha": 0.5289938071691909,
  "phi_z_inner": 4.612052680857469,
  "phi_z_sq": 5.3177574827511425,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "psi_LT_eff": 1,
  "psi_y": 0.1,
  "psi_y_eff": 0.1,
  "psi_z": -0.2,
  "psi_z_eff": -0.2,
  "section_class": 2,
  "torsion_add": 17240.661358659192,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.671138144`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wpl_y` (user-input) = 220600
6. `Wpl_z` (user-input) = 57700
7. `fy` (user-input) = 355
8. `E` (user-input) = 210000
9. `G` (user-input) = 81000
10. `Iy` (user-input) = 1.943000e+7
11. `Iz` (user-input) = 1.424000e+6
12. `It` (user-input) = 69800
13. `Iw` (user-input) = 1.299000e+10
14. `L` (user-input) = 3000
15. `k_y` (user-input) = 1
16. `k_z` (user-input) = 1
17. `k_LT` (user-input) = 1
18. `psi_LT` (user-input) = 1
19. `section_class` (user-input) = 3
20. `alpha_y` (user-input) = 0.21
21. `alpha_z` (user-input) = 0.34
22. `alpha_LT` (user-input) = 0.34
23. `psi_y` (user-input) = 0.1
24. `psi_z` (user-input) = -0.2
25. `gamma_M1` (coefficient) = 1
26. `lambda_LT_0` (coefficient) = 0.4
27. `beta_LT` (coefficient) = 0.75
28. `piSq` (constant) = 9.869604401
29. `k_c` (table) = 1
30. `C1` (derived) = 1
31. `Lcr_y` (derived) = 3000
32. `Lcr_z` (derived) = 3000
33. `Lcr_LT` (derived) = 3000
34. `Lcr_y_sq` (derived) = 9.000000e+6
35. `Lcr_z_sq` (derived) = 9.000000e+6
36. `Lcr_LT_sq` (derived) = 9.000000e+6
37. `psi_y_eff` (derived) = 0.1
38. `psi_z_eff` (derived) = -0.2
39. `psi_LT_eff` (derived) = 1
40. `Cm_y` (table) = 0.64
41. `Cm_z` (table) = 0.52
42. `Cm_LT` (table) = 1
43. `euler_num` (derived) = 2.951407e+12
44. `euler_term` (derived) = 327934.055566862
45. `torsion_ratio` (derived) = 9122.191011236
46. `torsion_num` (derived) = 5.088420e+16
47. `torsion_den` (derived) = 2.951407e+12
48. `torsion_add` (derived) = 17240.661358659
49. `torsion_sum` (derived) = 26362.852369895
50. `torsion_root` (derived) = 162.366413922
51. `M_cr_prefactor` (derived) = 327934.055566862
52. `M_cr` (derived) = 5.324548e+7
53. `N_Rk` (derived) = 1.011040e+6
54. `M_y_Rk` (derived) = 7.831300e+7
55. `M_z_Rk` (derived) = 2.048350e+7
56. `N_cr_y_num` (derived) = 4.027095e+13
57. `N_cr_y` (derived) = 4.474550e+6
58. `N_cr_z_num` (derived) = 2.951407e+12
59. `N_cr_z` (derived) = 327934.055566862
60. `lambda_bar_y_sq` (derived) = 0.225953466
61. `lambda_bar_y` (derived) = 0.475345627
62. `lambda_bar_z_sq` (derived) = 3.083058874
63. `lambda_bar_z` (derived) = 1.755864139
64. `phi_y_alpha` (derived) = 0.057822582
65. `phi_y_inner` (derived) = 1.283776047
66. `phi_y` (derived) = 0.641888024
67. `phi_y_sq` (derived) = 0.412020235
68. `chi_y_radicand` (derived) = 0.186066769
69. `chi_y_root` (derived) = 0.431354575
70. `chi_y_den` (derived) = 1.073242599
71. `chi_y_base` (derived) = 0.931755785
72. `chi_y` (derived) = 0.931755785
73. `phi_z_alpha` (derived) = 0.528993807
74. `phi_z_inner` (derived) = 4.612052681
75. `phi_z` (derived) = 2.30602634
76. `phi_z_sq` (derived) = 5.317757483
77. `chi_z_radicand` (derived) = 2.234698609
78. `chi_z_root` (derived) = 1.494890835
79. `chi_z_den` (derived) = 3.800917176
80. `chi_z_base` (derived) = 0.263094394
81. `chi_z` (derived) = 0.263094394
82. `lambda_LT_sq` (derived) = 1.470791605
83. `lambda_LT` (derived) = 1.212761974
84. `phi_LT_alpha` (derived) = 0.276339071
85. `phi_LT_beta` (derived) = 1.103093704
86. `phi_LT_inner` (derived) = 2.379432775
87. `phi_LT` (derived) = 1.189716387
88. `phi_LT_sq` (derived) = 1.415425083
89. `chi_LT_radicand` (derived) = 0.312331379
90. `chi_LT_root` (derived) = 0.558866155
91. `chi_LT_den` (derived) = 1.748582542
92. `chi_LT_base` (derived) = 0.57189179
93. `chi_LT_cap` (derived) = 0.679905975
94. `chi_LT` (derived) = 0.57189179
95. `f_LT` (derived) = 1
96. `chi_LT_mod` (derived) = 0.57189179
97. `N_b_y_Rd` (derived) = 942042.368857003
98. `n_y` (derived) = 0.212304676
99. `lambda_bar_y_cap` (derived) = 0.475345627
100. `k_yy_branch1_term` (derived) = 0.275345627
101. `k_yy_branch1` (derived) = 0.677412585
102. `k_yy_branch2` (derived) = 0.748699994
103. `k_yy` (table) = 0.677412585
104. `N_b_z_Rd` (derived) = 265998.955855133
105. `n_z` (derived) = 0.751882651
106. `lambda_bar_z_cap` (derived) = 1
107. `k_zz_branch1_term` (derived) = 1.4
108. `k_zz_branch1` (derived) = 1.06737057
109. `k_zz_branch2` (derived) = 1.06737057
110. `k_zz_aux` (derived) = 1.06737057
111. `k_yz` (table) = 0.640422342
112. `bc_61_term1` (derived) = 0.212304676
113. `bc_61_term2` (derived) = 0.302507073
114. `bc_61_term3` (derived) = 0.156326395
115. `bc_61_m2_check` (check) = 0.671138144

#### Expected Intermediates

```json
{
  "A": 2848,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "bc_61_m2_check": 0.6711381438950287,
  "bc_61_term1": 0.21230467610778872,
  "bc_61_term2": 0.3025070729312826,
  "bc_61_term3": 0.15632639485595737,
  "beta_LT": 0.75,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_base": 0.571891790034929,
  "chi_LT_cap": 0.6799059748099839,
  "chi_LT_den": 1.7485825420555938,
  "chi_LT_mod": 0.571891790034929,
  "chi_LT_radicand": 0.312331378759521,
  "chi_LT_root": 0.5588661546019056,
  "chi_y": 0.9317557849907053,
  "chi_y_base": 0.9317557849907053,
  "chi_y_den": 1.0732425986600935,
  "chi_y_radicand": 0.18606676936110092,
  "chi_y_root": 0.4313545749857082,
  "chi_z": 0.2630943937481529,
  "chi_z_base": 0.2630943937481529,
  "chi_z_den": 3.8009171755945887,
  "chi_z_radicand": 2.234698609062864,
  "chi_z_root": 1.4948908351658539,
  "Cm_LT": 1,
  "Cm_y": 0.64,
  "Cm_z": 0.52,
  "E": 210000,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "It": 69800,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "k_y": 1,
  "k_yy": 0.6774125851278897,
  "k_yy_branch1": 0.6774125851278897,
  "k_yy_branch1_term": 0.27534562749173086,
  "k_yy_branch2": 0.7486999941671879,
  "k_yz": 0.6404223418064006,
  "k_z": 1,
  "k_zz_aux": 1.0673705696773343,
  "k_zz_branch1": 1.0673705696773343,
  "k_zz_branch1_term": 1.4,
  "k_zz_branch2": 1.0673705696773343,
  "L": 3000,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_y_cap": 0.47534562749173087,
  "lambda_bar_y_sq": 0.22595346557550736,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_bar_z_cap": 1,
  "lambda_bar_z_sq": 3.0830588736882785,
  "lambda_LT": 1.2127619737971853,
  "lambda_LT_0": 0.4,
  "lambda_LT_sq": 1.4707916050884449,
  "Lcr_LT": 3000,
  "Lcr_LT_sq": 9000000,
  "Lcr_y": 3000,
  "Lcr_y_sq": 9000000,
  "Lcr_z": 3000,
  "Lcr_z_sq": 9000000,
  "M_cr": 53245476.60529427,
  "M_cr_prefactor": 327934.05556686234,
  "M_y_Ed": 20000000,
  "M_y_Rk": 78313000,
  "M_z_Ed": 5000000,
  "M_z_Rk": 20483500,
  "N_b_y_Rd": 942042.3688570027,
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "N_Rk": 1011040,
  "n_y": 0.21230467610778872,
  "n_z": 0.7518826506556789,
  "phi_LT": 1.1897163874536882,
  "phi_LT_alpha": 0.276339071091043,
  "phi_LT_beta": 1.1030937038163335,
  "phi_LT_inner": 2.3794327749073765,
  "phi_LT_sq": 1.4154250825758545,
  "phi_y": 0.6418880236743854,
  "phi_y_alpha": 0.05782258177326348,
  "phi_y_inner": 1.2837760473487707,
  "phi_y_sq": 0.4120202349366083,
  "phi_z": 2.3060263404287347,
  "phi_z_alpha": 0.5289938071691909,
  "phi_z_inner": 4.612052680857469,
  "phi_z_sq": 5.3177574827511425,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "psi_LT_eff": 1,
  "psi_y": 0.1,
  "psi_y_eff": 0.1,
  "psi_z": -0.2,
  "psi_z_eff": -0.2,
  "section_class": 3,
  "torsion_add": 17240.661358659192,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "Wpl_y": 220600,
  "Wpl_z": 57700
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-61-m2: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m2: SN003b M_cr is implemented only for I/H sections`

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m2: SN003b M_cr is implemented only for I/H sections`

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m2: SN003b M_cr is implemented only for I/H sections`

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-61-m2: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m2: SN003b M_cr is implemented only for I/H sections`

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m2: SN003b M_cr is implemented only for I/H sections`

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m2: SN003b M_cr is implemented only for I/H sections`

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-61-m2: class 4 sections are out of scope`

