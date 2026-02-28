# Check 22 - ulsBeamColumn62M2

- Verification expression: `\frac{N_{Ed}}{\chi_z N_{Rk}/\gamma_{M1}} + k_{zy}\frac{M_{y,Ed}}{\chi_{LT} M_{y,Rk}/\gamma_{M1}} + k_{zz}\frac{M_{z,Ed}}{M_{z,Rk}/\gamma_{M1}} \leq 1.0`
- Section refs: `6.1`, `6.3.2.3`, `Annex B`, `6.3.2.2`, `6.3.3`
- Formula refs: n/a
- Verification refs: `(6.62)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (1.414220816) |
| i-c2 | I | 2 | ok (1.414220816) |
| i-c3 | I | 3 | ok (1.414220816) |
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
- Expected ratio: `1.414220816`

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
60. `lambda_bar_z_sq` (derived) = 3.083058874
61. `lambda_bar_z` (derived) = 1.755864139
62. `phi_y_alpha` (derived) = 0.057822582
63. `phi_y_inner` (derived) = 1.283776047
64. `phi_y` (derived) = 0.641888024
65. `phi_y_sq` (derived) = 0.412020235
66. `chi_y_radicand` (derived) = 0.186066769
67. `chi_y_root` (derived) = 0.431354575
68. `chi_y_den` (derived) = 1.073242599
69. `chi_y_base` (derived) = 0.931755785
70. `chi_y` (derived) = 0.931755785
71. `phi_z_alpha` (derived) = 0.528993807
72. `phi_z_inner` (derived) = 4.612052681
73. `phi_z` (derived) = 2.30602634
74. `phi_z_sq` (derived) = 5.317757483
75. `chi_z_radicand` (derived) = 2.234698609
76. `chi_z_root` (derived) = 1.494890835
77. `chi_z_den` (derived) = 3.800917176
78. `chi_z_base` (derived) = 0.263094394
79. `chi_z` (derived) = 0.263094394
80. `lambda_LT_sq` (derived) = 1.470791605
81. `lambda_LT` (derived) = 1.212761974
82. `phi_LT_alpha` (derived) = 0.276339071
83. `phi_LT_beta` (derived) = 1.103093704
84. `phi_LT_inner` (derived) = 2.379432775
85. `phi_LT` (derived) = 1.189716387
86. `phi_LT_sq` (derived) = 1.415425083
87. `chi_LT_radicand` (derived) = 0.312331379
88. `chi_LT_root` (derived) = 0.558866155
89. `chi_LT_den` (derived) = 1.748582542
90. `chi_LT_base` (derived) = 0.57189179
91. `chi_LT_cap` (derived) = 0.679905975
92. `chi_LT` (derived) = 0.57189179
93. `f_LT` (derived) = 1
94. `chi_LT_mod` (derived) = 0.57189179
95. `N_b_z_Rd` (derived) = 265998.955855133
96. `n_z` (derived) = 0.751882651
97. `lambda_bar_z_cap` (derived) = 1
98. `k_zz_branch1_term` (derived) = 1.4
99. `k_zz_branch1` (derived) = 1.06737057
100. `k_zz_branch2` (derived) = 1.06737057
101. `k_zz` (table) = 1.06737057
102. `k_zy_cm_denom` (derived) = 0.75
103. `k_zy_lambda_ratio` (derived) = 0.234115218
104. `k_zy_n_factor` (derived) = 0.176027171
105. `k_zy_low_a` (derived) = 2.355864139
106. `k_zy_low_b` (derived) = 0.823972829
107. `k_zy_high_lambda_cap` (derived) = 1
108. `k_zy_high_a` (derived) = 0.89974898
109. `k_zy_high_b` (derived) = 0.89974898
110. `k_zy` (table) = 0.89974898
111. `bc_62_term1` (derived) = 0.751882651
112. `bc_62_term2` (derived) = 0.401794174
113. `bc_62_term3` (derived) = 0.260543991
114. `bc_62_m2_check` (check) = 1.414220816

#### Expected Intermediates

```json
{
  "A": 2848,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "bc_62_m2_check": 1.4142208163592045,
  "bc_62_term1": 0.7518826506556789,
  "bc_62_term2": 0.40179417427692976,
  "bc_62_term3": 0.2605439914265956,
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
  "k_z": 1,
  "k_zy": 0.8997489799125762,
  "k_zy_cm_denom": 0.75,
  "k_zy_high_a": 0.8997489799125762,
  "k_zy_high_b": 0.8997489799125762,
  "k_zy_high_lambda_cap": 1,
  "k_zy_lambda_ratio": 0.2341152184977219,
  "k_zy_low_a": 2.355864138732914,
  "k_zy_low_b": 0.8239728289570994,
  "k_zy_n_factor": 0.17602717104290058,
  "k_zz": 1.0673705696773343,
  "k_zz_branch1": 1.0673705696773343,
  "k_zz_branch1_term": 1.4,
  "k_zz_branch2": 1.0673705696773343,
  "L": 3000,
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
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "N_Rk": 1011040,
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
- Expected ratio: `1.414220816`

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
60. `lambda_bar_z_sq` (derived) = 3.083058874
61. `lambda_bar_z` (derived) = 1.755864139
62. `phi_y_alpha` (derived) = 0.057822582
63. `phi_y_inner` (derived) = 1.283776047
64. `phi_y` (derived) = 0.641888024
65. `phi_y_sq` (derived) = 0.412020235
66. `chi_y_radicand` (derived) = 0.186066769
67. `chi_y_root` (derived) = 0.431354575
68. `chi_y_den` (derived) = 1.073242599
69. `chi_y_base` (derived) = 0.931755785
70. `chi_y` (derived) = 0.931755785
71. `phi_z_alpha` (derived) = 0.528993807
72. `phi_z_inner` (derived) = 4.612052681
73. `phi_z` (derived) = 2.30602634
74. `phi_z_sq` (derived) = 5.317757483
75. `chi_z_radicand` (derived) = 2.234698609
76. `chi_z_root` (derived) = 1.494890835
77. `chi_z_den` (derived) = 3.800917176
78. `chi_z_base` (derived) = 0.263094394
79. `chi_z` (derived) = 0.263094394
80. `lambda_LT_sq` (derived) = 1.470791605
81. `lambda_LT` (derived) = 1.212761974
82. `phi_LT_alpha` (derived) = 0.276339071
83. `phi_LT_beta` (derived) = 1.103093704
84. `phi_LT_inner` (derived) = 2.379432775
85. `phi_LT` (derived) = 1.189716387
86. `phi_LT_sq` (derived) = 1.415425083
87. `chi_LT_radicand` (derived) = 0.312331379
88. `chi_LT_root` (derived) = 0.558866155
89. `chi_LT_den` (derived) = 1.748582542
90. `chi_LT_base` (derived) = 0.57189179
91. `chi_LT_cap` (derived) = 0.679905975
92. `chi_LT` (derived) = 0.57189179
93. `f_LT` (derived) = 1
94. `chi_LT_mod` (derived) = 0.57189179
95. `N_b_z_Rd` (derived) = 265998.955855133
96. `n_z` (derived) = 0.751882651
97. `lambda_bar_z_cap` (derived) = 1
98. `k_zz_branch1_term` (derived) = 1.4
99. `k_zz_branch1` (derived) = 1.06737057
100. `k_zz_branch2` (derived) = 1.06737057
101. `k_zz` (table) = 1.06737057
102. `k_zy_cm_denom` (derived) = 0.75
103. `k_zy_lambda_ratio` (derived) = 0.234115218
104. `k_zy_n_factor` (derived) = 0.176027171
105. `k_zy_low_a` (derived) = 2.355864139
106. `k_zy_low_b` (derived) = 0.823972829
107. `k_zy_high_lambda_cap` (derived) = 1
108. `k_zy_high_a` (derived) = 0.89974898
109. `k_zy_high_b` (derived) = 0.89974898
110. `k_zy` (table) = 0.89974898
111. `bc_62_term1` (derived) = 0.751882651
112. `bc_62_term2` (derived) = 0.401794174
113. `bc_62_term3` (derived) = 0.260543991
114. `bc_62_m2_check` (check) = 1.414220816

#### Expected Intermediates

```json
{
  "A": 2848,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "bc_62_m2_check": 1.4142208163592045,
  "bc_62_term1": 0.7518826506556789,
  "bc_62_term2": 0.40179417427692976,
  "bc_62_term3": 0.2605439914265956,
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
  "k_z": 1,
  "k_zy": 0.8997489799125762,
  "k_zy_cm_denom": 0.75,
  "k_zy_high_a": 0.8997489799125762,
  "k_zy_high_b": 0.8997489799125762,
  "k_zy_high_lambda_cap": 1,
  "k_zy_lambda_ratio": 0.2341152184977219,
  "k_zy_low_a": 2.355864138732914,
  "k_zy_low_b": 0.8239728289570994,
  "k_zy_n_factor": 0.17602717104290058,
  "k_zz": 1.0673705696773343,
  "k_zz_branch1": 1.0673705696773343,
  "k_zz_branch1_term": 1.4,
  "k_zz_branch2": 1.0673705696773343,
  "L": 3000,
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
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "N_Rk": 1011040,
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
- Expected ratio: `1.414220816`

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
60. `lambda_bar_z_sq` (derived) = 3.083058874
61. `lambda_bar_z` (derived) = 1.755864139
62. `phi_y_alpha` (derived) = 0.057822582
63. `phi_y_inner` (derived) = 1.283776047
64. `phi_y` (derived) = 0.641888024
65. `phi_y_sq` (derived) = 0.412020235
66. `chi_y_radicand` (derived) = 0.186066769
67. `chi_y_root` (derived) = 0.431354575
68. `chi_y_den` (derived) = 1.073242599
69. `chi_y_base` (derived) = 0.931755785
70. `chi_y` (derived) = 0.931755785
71. `phi_z_alpha` (derived) = 0.528993807
72. `phi_z_inner` (derived) = 4.612052681
73. `phi_z` (derived) = 2.30602634
74. `phi_z_sq` (derived) = 5.317757483
75. `chi_z_radicand` (derived) = 2.234698609
76. `chi_z_root` (derived) = 1.494890835
77. `chi_z_den` (derived) = 3.800917176
78. `chi_z_base` (derived) = 0.263094394
79. `chi_z` (derived) = 0.263094394
80. `lambda_LT_sq` (derived) = 1.470791605
81. `lambda_LT` (derived) = 1.212761974
82. `phi_LT_alpha` (derived) = 0.276339071
83. `phi_LT_beta` (derived) = 1.103093704
84. `phi_LT_inner` (derived) = 2.379432775
85. `phi_LT` (derived) = 1.189716387
86. `phi_LT_sq` (derived) = 1.415425083
87. `chi_LT_radicand` (derived) = 0.312331379
88. `chi_LT_root` (derived) = 0.558866155
89. `chi_LT_den` (derived) = 1.748582542
90. `chi_LT_base` (derived) = 0.57189179
91. `chi_LT_cap` (derived) = 0.679905975
92. `chi_LT` (derived) = 0.57189179
93. `f_LT` (derived) = 1
94. `chi_LT_mod` (derived) = 0.57189179
95. `N_b_z_Rd` (derived) = 265998.955855133
96. `n_z` (derived) = 0.751882651
97. `lambda_bar_z_cap` (derived) = 1
98. `k_zz_branch1_term` (derived) = 1.4
99. `k_zz_branch1` (derived) = 1.06737057
100. `k_zz_branch2` (derived) = 1.06737057
101. `k_zz` (table) = 1.06737057
102. `k_zy_cm_denom` (derived) = 0.75
103. `k_zy_lambda_ratio` (derived) = 0.234115218
104. `k_zy_n_factor` (derived) = 0.176027171
105. `k_zy_low_a` (derived) = 2.355864139
106. `k_zy_low_b` (derived) = 0.823972829
107. `k_zy_high_lambda_cap` (derived) = 1
108. `k_zy_high_a` (derived) = 0.89974898
109. `k_zy_high_b` (derived) = 0.89974898
110. `k_zy` (table) = 0.89974898
111. `bc_62_term1` (derived) = 0.751882651
112. `bc_62_term2` (derived) = 0.401794174
113. `bc_62_term3` (derived) = 0.260543991
114. `bc_62_m2_check` (check) = 1.414220816

#### Expected Intermediates

```json
{
  "A": 2848,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "bc_62_m2_check": 1.4142208163592045,
  "bc_62_term1": 0.7518826506556789,
  "bc_62_term2": 0.40179417427692976,
  "bc_62_term3": 0.2605439914265956,
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
  "k_z": 1,
  "k_zy": 0.8997489799125762,
  "k_zy_cm_denom": 0.75,
  "k_zy_high_a": 0.8997489799125762,
  "k_zy_high_b": 0.8997489799125762,
  "k_zy_high_lambda_cap": 1,
  "k_zy_lambda_ratio": 0.2341152184977219,
  "k_zy_low_a": 2.355864138732914,
  "k_zy_low_b": 0.8239728289570994,
  "k_zy_n_factor": 0.17602717104290058,
  "k_zz": 1.0673705696773343,
  "k_zz_branch1": 1.0673705696773343,
  "k_zz_branch1_term": 1.4,
  "k_zz_branch2": 1.0673705696773343,
  "L": 3000,
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
  "N_b_z_Rd": 265998.95585513255,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "N_Rk": 1011040,
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
- Expected message snippet: `beam-column-62-m2: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m2: SN003b M_cr is implemented only for I/H sections`

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m2: SN003b M_cr is implemented only for I/H sections`

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m2: SN003b M_cr is implemented only for I/H sections`

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-62-m2: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m2: SN003b M_cr is implemented only for I/H sections`

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m2: SN003b M_cr is implemented only for I/H sections`

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m2: SN003b M_cr is implemented only for I/H sections`

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-62-m2: class 4 sections are out of scope`

