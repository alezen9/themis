# Check 19 - ulsBeamColumn61M1

- Verification expression: `\frac{N_{Ed}}{\chi_y N_{Rk}/\gamma_{M1}} + k_{yy}\frac{M_{y,Ed}}{\chi_{LT} M_{y,Rk}/\gamma_{M1}} + k_{yz}\frac{M_{z,Ed}}{M_{z,Rk}/\gamma_{M1}} \leq 1.0`
- Section refs: `6.1`, `6.3.2.3`, `6.3.1.2`, `6.3.1.4`, `6.3.2.2`, `Annex A`, `6.3.3`
- Formula refs: n/a
- Verification refs: `(6.61)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (0.899668856) |
| i-c2 | I | 2 | ok (0.899668856) |
| i-c3 | I | 3 | ok (0.899668856) |
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
- Expected ratio: `0.899668856`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wel_z` (user-input) = 50000
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_y` (user-input) = 2848
10. `Av_z` (user-input) = 1424
11. `tw` (user-input) = 5.6
12. `hw` (user-input) = 181.2
13. `fy` (user-input) = 355
14. `E` (user-input) = 210000
15. `G` (user-input) = 81000
16. `Iy` (user-input) = 1.943000e+7
17. `Iz` (user-input) = 1.424000e+6
18. `It` (user-input) = 69800
19. `Iw` (user-input) = 1.299000e+10
20. `L` (user-input) = 3000
21. `k_y` (user-input) = 1
22. `k_z` (user-input) = 1
23. `k_LT` (user-input) = 1
24. `psi_LT` (user-input) = 1
25. `psi_y` (user-input) = 0.1
26. `psi_z` (user-input) = -0.2
27. `section_class` (user-input) = 1
28. `alpha_y` (user-input) = 0.21
29. `alpha_z` (user-input) = 0.34
30. `alpha_LT` (user-input) = 0.34
31. `gamma_M1` (coefficient) = 1
32. `lambda_LT_0` (coefficient) = 0.4
33. `beta_LT` (coefficient) = 0.75
34. `piSq` (constant) = 9.869604401
35. `k_c` (table) = 1
36. `C1` (derived) = 1
37. `abs_N_Ed` (derived) = 200000
38. `abs_M_y_Ed` (derived) = 2.000000e+7
39. `abs_M_z_Ed` (derived) = 5.000000e+6
40. `Lcr_y` (derived) = 3000
41. `Lcr_z` (derived) = 3000
42. `Lcr_LT` (derived) = 3000
43. `Lcr_y_sq` (derived) = 9.000000e+6
44. `Lcr_z_sq` (derived) = 9.000000e+6
45. `Lcr_LT_sq` (derived) = 9.000000e+6
46. `N_cr_y_num` (derived) = 4.027095e+13
47. `N_cr_y` (derived) = 4.474550e+6
48. `N_cr_z_num` (derived) = 2.951407e+12
49. `N_cr_z` (derived) = 327934.055566862
50. `ip2_num` (derived) = 2.085400e+7
51. `ip2` (derived) = 7322.331460674
52. `ncr_t_warp_num` (derived) = 2.692329e+16
53. `ncr_t_warp` (derived) = 2.991477e+9
54. `ncr_t_num` (derived) = 8.645277e+9
55. `N_cr_T` (derived) = 1.180673e+6
56. `N_cr_TF` (derived) = 327934.055566862
57. `euler_num` (derived) = 2.951407e+12
58. `euler_term` (derived) = 327934.055566862
59. `torsion_ratio` (derived) = 9122.191011236
60. `torsion_num` (derived) = 5.088420e+16
61. `torsion_den` (derived) = 2.951407e+12
62. `torsion_term` (derived) = 17240.661358659
63. `torsion_sum` (derived) = 26362.852369895
64. `torsion_root` (derived) = 162.366413922
65. `M_cr_prefactor` (derived) = 327934.055566862
66. `M_cr` (derived) = 5.324548e+7
67. `lambda_bar_0_num` (derived) = 7.831300e+7
68. `lambda_bar_0` (derived) = 1.212761974
69. `it_over_iy` (derived) = 0.003592383
70. `a_LT` (derived) = 0.996407617
71. `eta_y_m_over_n` (derived) = 100
72. `eta_y_area_ratio` (derived) = 0.012910245
73. `eta_y` (derived) = 1.291024479
74. `psi_y_eff` (derived) = 0.1
75. `psi_z_eff` (derived) = -0.2
76. `ncr_y_ratio` (derived) = 0.044697236
77. `ncr_z_ratio` (derived) = 0.609878714
78. `Cmy_0` (table) = 0.807299069
79. `Cmz_0` (table) = 0.631635141
80. `ncr_t_ratio` (derived) = 0.169394951
81. `ncr_tf_ratio` (derived) = 0.609878714
82. `cm_branch_limit` (derived) = 0.060877847
83. `cm_branch_active` (derived) = 0
84. `cm_amp_num` (derived) = 1.286386624
85. `cm_amp_den` (derived) = 2.286386624
86. `cm_amp` (derived) = 0.562628652
87. `cm_denom` (derived) = 0.32403671
88. `Cm_y` (table) = 0.807299069
89. `Cm_z` (table) = 0.631635141
90. `Cm_y_aug` (derived) = 0.915718134
91. `cm_lt_num` (derived) = 0.835527345
92. `cm_lt_raw` (derived) = 2.578495953
93. `Cm_LT` (table) = 1
94. `N_Rk` (derived) = 1.011040e+6
95. `M_y_Rk` (derived) = 7.831300e+7
96. `M_z_Rk` (derived) = 2.048350e+7
97. `chi_y` (derived) = 0.931755785
98. `chi_z` (derived) = 0.263094394
99. `chi_LT` (derived) = 0.57189179
100. `f_LT` (derived) = 1
101. `chi_LT_mod` (derived) = 0.57189179
102. `lambda_bar_y` (derived) = 0.475345627
103. `lambda_bar_z` (derived) = 1.755864139
104. `n_pl` (derived) = 0.19781611
105. `wy` (derived) = 1.103
106. `wz` (derived) = 1.154
107. `lambda_bar_max` (derived) = 1.755864139
108. `b_LT` (derived) = 0.079874159
109. `c_LT` (derived) = 1.019774317
110. `d_LT` (derived) = 0.333325978
111. `e_LT` (derived) = 0.733142732
112. `C_yy` (derived) = 0.906618314
113. `C_yz` (derived) = 0.894626928
114. `C_zy` (derived) = 0.820592285
115. `C_zz` (derived) = 0.886258414
116. `k_yy_denom` (derived) = 0.955302764
117. `k_yy` (derived) = 0.932113782
118. `k_zz_denom` (derived) = 0.390121286
119. `k_zz` (derived) = 1.826864201
120. `k_yz` (derived) = 1.110685416
121. `bc_61_term1_den` (derived) = 942042.368857003
122. `bc_61_term1` (derived) = 0.212304676
123. `bc_61_term2_den` (derived) = 4.478656e+7
124. `bc_61_term2` (derived) = 0.416247082
125. `bc_61_term3_den` (derived) = 2.048350e+7
126. `bc_61_term3` (derived) = 0.271117098
127. `bc_61_m1_check` (check) = 0.899668856

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_LT": 0.9964076170869789,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "Av_y": 2848,
  "Av_z": 1424,
  "b_LT": 0.07987415858895829,
  "bc_61_m1_check": 0.8996688563477757,
  "bc_61_term1": 0.21230467610778872,
  "bc_61_term1_den": 942042.3688570027,
  "bc_61_term2": 0.4162470821015102,
  "bc_61_term2_den": 44786561.75300539,
  "bc_61_term3": 0.27111709813847684,
  "bc_61_term3_den": 20483500,
  "beta_LT": 0.75,
  "c_LT": 1.0197743167176125,
  "C_yy": 0.9066183136899365,
  "C_yz": 0.8946269277721743,
  "C_zy": 0.8205922848429158,
  "C_zz": 0.8862584139238378,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_mod": 0.571891790034929,
  "chi_y": 0.9317557849907053,
  "chi_z": 0.2630943937481529,
  "cm_amp": 0.562628651987052,
  "cm_amp_den": 2.2863866244169158,
  "cm_amp_num": 1.2863866244169155,
  "cm_branch_active": 0,
  "cm_branch_limit": 0.0608778471978906,
  "cm_denom": 0.324036709982383,
  "Cm_LT": 1,
  "cm_lt_num": 0.8355273452371839,
  "cm_lt_raw": 2.5784959527659974,
  "Cm_y": 0.8072990688895293,
  "Cm_y_aug": 0.9157181339968632,
  "Cm_z": 0.6316351414187918,
  "Cmy_0": 0.8072990688895293,
  "Cmz_0": 0.6316351414187918,
  "d_LT": 0.33332597769581385,
  "E": 210000,
  "e_LT": 0.733142731870702,
  "eta_y": 1.2910244786944696,
  "eta_y_area_ratio": 0.012910244786944696,
  "eta_y_m_over_n": 100,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "hw": 181.2,
  "ip2": 7322.331460674157,
  "ip2_num": 20854000,
  "It": 69800,
  "it_over_iy": 0.0035923829130211013,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "k_y": 1,
  "k_yy": 0.9321137823523795,
  "k_yy_denom": 0.9553027643662946,
  "k_yz": 1.110685415943898,
  "k_z": 1,
  "k_zz": 1.8268642010368066,
  "k_zz_denom": 0.3901212862620117,
  "L": 3000,
  "lambda_bar_0": 1.2127619737971853,
  "lambda_bar_0_num": 78313000,
  "lambda_bar_max": 1.7558641387329141,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_LT_0": 0.4,
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
  "N_cr_T": 1180672.7325034568,
  "N_cr_TF": 327934.05556686234,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "n_pl": 0.19781611014401013,
  "N_Rk": 1011040,
  "ncr_t_num": 8645277093.970184,
  "ncr_t_ratio": 0.16939495127995974,
  "ncr_t_warp": 2991477093.9701843,
  "ncr_t_warp_num": 26923293845731660,
  "ncr_tf_ratio": 0.6098787137379883,
  "ncr_y_ratio": 0.04469723563370537,
  "ncr_z_ratio": 0.6098787137379883,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "psi_y": 0.1,
  "psi_y_eff": 0.1,
  "psi_z": -0.2,
  "psi_z_eff": -0.2,
  "section_class": 1,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "torsion_term": 17240.661358659192,
  "tw": 5.6,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700,
  "wy": 1.103,
  "wz": 1.154
}
```

### i-c2

- Branch decision: shape=`I`, class=`2` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.899668856`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wel_z` (user-input) = 50000
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_y` (user-input) = 2848
10. `Av_z` (user-input) = 1424
11. `tw` (user-input) = 5.6
12. `hw` (user-input) = 181.2
13. `fy` (user-input) = 355
14. `E` (user-input) = 210000
15. `G` (user-input) = 81000
16. `Iy` (user-input) = 1.943000e+7
17. `Iz` (user-input) = 1.424000e+6
18. `It` (user-input) = 69800
19. `Iw` (user-input) = 1.299000e+10
20. `L` (user-input) = 3000
21. `k_y` (user-input) = 1
22. `k_z` (user-input) = 1
23. `k_LT` (user-input) = 1
24. `psi_LT` (user-input) = 1
25. `psi_y` (user-input) = 0.1
26. `psi_z` (user-input) = -0.2
27. `section_class` (user-input) = 2
28. `alpha_y` (user-input) = 0.21
29. `alpha_z` (user-input) = 0.34
30. `alpha_LT` (user-input) = 0.34
31. `gamma_M1` (coefficient) = 1
32. `lambda_LT_0` (coefficient) = 0.4
33. `beta_LT` (coefficient) = 0.75
34. `piSq` (constant) = 9.869604401
35. `k_c` (table) = 1
36. `C1` (derived) = 1
37. `abs_N_Ed` (derived) = 200000
38. `abs_M_y_Ed` (derived) = 2.000000e+7
39. `abs_M_z_Ed` (derived) = 5.000000e+6
40. `Lcr_y` (derived) = 3000
41. `Lcr_z` (derived) = 3000
42. `Lcr_LT` (derived) = 3000
43. `Lcr_y_sq` (derived) = 9.000000e+6
44. `Lcr_z_sq` (derived) = 9.000000e+6
45. `Lcr_LT_sq` (derived) = 9.000000e+6
46. `N_cr_y_num` (derived) = 4.027095e+13
47. `N_cr_y` (derived) = 4.474550e+6
48. `N_cr_z_num` (derived) = 2.951407e+12
49. `N_cr_z` (derived) = 327934.055566862
50. `ip2_num` (derived) = 2.085400e+7
51. `ip2` (derived) = 7322.331460674
52. `ncr_t_warp_num` (derived) = 2.692329e+16
53. `ncr_t_warp` (derived) = 2.991477e+9
54. `ncr_t_num` (derived) = 8.645277e+9
55. `N_cr_T` (derived) = 1.180673e+6
56. `N_cr_TF` (derived) = 327934.055566862
57. `euler_num` (derived) = 2.951407e+12
58. `euler_term` (derived) = 327934.055566862
59. `torsion_ratio` (derived) = 9122.191011236
60. `torsion_num` (derived) = 5.088420e+16
61. `torsion_den` (derived) = 2.951407e+12
62. `torsion_term` (derived) = 17240.661358659
63. `torsion_sum` (derived) = 26362.852369895
64. `torsion_root` (derived) = 162.366413922
65. `M_cr_prefactor` (derived) = 327934.055566862
66. `M_cr` (derived) = 5.324548e+7
67. `lambda_bar_0_num` (derived) = 7.831300e+7
68. `lambda_bar_0` (derived) = 1.212761974
69. `it_over_iy` (derived) = 0.003592383
70. `a_LT` (derived) = 0.996407617
71. `eta_y_m_over_n` (derived) = 100
72. `eta_y_area_ratio` (derived) = 0.012910245
73. `eta_y` (derived) = 1.291024479
74. `psi_y_eff` (derived) = 0.1
75. `psi_z_eff` (derived) = -0.2
76. `ncr_y_ratio` (derived) = 0.044697236
77. `ncr_z_ratio` (derived) = 0.609878714
78. `Cmy_0` (table) = 0.807299069
79. `Cmz_0` (table) = 0.631635141
80. `ncr_t_ratio` (derived) = 0.169394951
81. `ncr_tf_ratio` (derived) = 0.609878714
82. `cm_branch_limit` (derived) = 0.060877847
83. `cm_branch_active` (derived) = 0
84. `cm_amp_num` (derived) = 1.286386624
85. `cm_amp_den` (derived) = 2.286386624
86. `cm_amp` (derived) = 0.562628652
87. `cm_denom` (derived) = 0.32403671
88. `Cm_y` (table) = 0.807299069
89. `Cm_z` (table) = 0.631635141
90. `Cm_y_aug` (derived) = 0.915718134
91. `cm_lt_num` (derived) = 0.835527345
92. `cm_lt_raw` (derived) = 2.578495953
93. `Cm_LT` (table) = 1
94. `N_Rk` (derived) = 1.011040e+6
95. `M_y_Rk` (derived) = 7.831300e+7
96. `M_z_Rk` (derived) = 2.048350e+7
97. `chi_y` (derived) = 0.931755785
98. `chi_z` (derived) = 0.263094394
99. `chi_LT` (derived) = 0.57189179
100. `f_LT` (derived) = 1
101. `chi_LT_mod` (derived) = 0.57189179
102. `lambda_bar_y` (derived) = 0.475345627
103. `lambda_bar_z` (derived) = 1.755864139
104. `n_pl` (derived) = 0.19781611
105. `wy` (derived) = 1.103
106. `wz` (derived) = 1.154
107. `lambda_bar_max` (derived) = 1.755864139
108. `b_LT` (derived) = 0.079874159
109. `c_LT` (derived) = 1.019774317
110. `d_LT` (derived) = 0.333325978
111. `e_LT` (derived) = 0.733142732
112. `C_yy` (derived) = 0.906618314
113. `C_yz` (derived) = 0.894626928
114. `C_zy` (derived) = 0.820592285
115. `C_zz` (derived) = 0.886258414
116. `k_yy_denom` (derived) = 0.955302764
117. `k_yy` (derived) = 0.932113782
118. `k_zz_denom` (derived) = 0.390121286
119. `k_zz` (derived) = 1.826864201
120. `k_yz` (derived) = 1.110685416
121. `bc_61_term1_den` (derived) = 942042.368857003
122. `bc_61_term1` (derived) = 0.212304676
123. `bc_61_term2_den` (derived) = 4.478656e+7
124. `bc_61_term2` (derived) = 0.416247082
125. `bc_61_term3_den` (derived) = 2.048350e+7
126. `bc_61_term3` (derived) = 0.271117098
127. `bc_61_m1_check` (check) = 0.899668856

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_LT": 0.9964076170869789,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "Av_y": 2848,
  "Av_z": 1424,
  "b_LT": 0.07987415858895829,
  "bc_61_m1_check": 0.8996688563477757,
  "bc_61_term1": 0.21230467610778872,
  "bc_61_term1_den": 942042.3688570027,
  "bc_61_term2": 0.4162470821015102,
  "bc_61_term2_den": 44786561.75300539,
  "bc_61_term3": 0.27111709813847684,
  "bc_61_term3_den": 20483500,
  "beta_LT": 0.75,
  "c_LT": 1.0197743167176125,
  "C_yy": 0.9066183136899365,
  "C_yz": 0.8946269277721743,
  "C_zy": 0.8205922848429158,
  "C_zz": 0.8862584139238378,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_mod": 0.571891790034929,
  "chi_y": 0.9317557849907053,
  "chi_z": 0.2630943937481529,
  "cm_amp": 0.562628651987052,
  "cm_amp_den": 2.2863866244169158,
  "cm_amp_num": 1.2863866244169155,
  "cm_branch_active": 0,
  "cm_branch_limit": 0.0608778471978906,
  "cm_denom": 0.324036709982383,
  "Cm_LT": 1,
  "cm_lt_num": 0.8355273452371839,
  "cm_lt_raw": 2.5784959527659974,
  "Cm_y": 0.8072990688895293,
  "Cm_y_aug": 0.9157181339968632,
  "Cm_z": 0.6316351414187918,
  "Cmy_0": 0.8072990688895293,
  "Cmz_0": 0.6316351414187918,
  "d_LT": 0.33332597769581385,
  "E": 210000,
  "e_LT": 0.733142731870702,
  "eta_y": 1.2910244786944696,
  "eta_y_area_ratio": 0.012910244786944696,
  "eta_y_m_over_n": 100,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "hw": 181.2,
  "ip2": 7322.331460674157,
  "ip2_num": 20854000,
  "It": 69800,
  "it_over_iy": 0.0035923829130211013,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "k_y": 1,
  "k_yy": 0.9321137823523795,
  "k_yy_denom": 0.9553027643662946,
  "k_yz": 1.110685415943898,
  "k_z": 1,
  "k_zz": 1.8268642010368066,
  "k_zz_denom": 0.3901212862620117,
  "L": 3000,
  "lambda_bar_0": 1.2127619737971853,
  "lambda_bar_0_num": 78313000,
  "lambda_bar_max": 1.7558641387329141,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_LT_0": 0.4,
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
  "N_cr_T": 1180672.7325034568,
  "N_cr_TF": 327934.05556686234,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "n_pl": 0.19781611014401013,
  "N_Rk": 1011040,
  "ncr_t_num": 8645277093.970184,
  "ncr_t_ratio": 0.16939495127995974,
  "ncr_t_warp": 2991477093.9701843,
  "ncr_t_warp_num": 26923293845731660,
  "ncr_tf_ratio": 0.6098787137379883,
  "ncr_y_ratio": 0.04469723563370537,
  "ncr_z_ratio": 0.6098787137379883,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "psi_y": 0.1,
  "psi_y_eff": 0.1,
  "psi_z": -0.2,
  "psi_z_eff": -0.2,
  "section_class": 2,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "torsion_term": 17240.661358659192,
  "tw": 5.6,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700,
  "wy": 1.103,
  "wz": 1.154
}
```

### i-c3

- Branch decision: shape=`I`, class=`3` -> `compute`
- Clause: `undefined`
- Expected ratio: `0.899668856`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wel_z` (user-input) = 50000
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `Av_y` (user-input) = 2848
10. `Av_z` (user-input) = 1424
11. `tw` (user-input) = 5.6
12. `hw` (user-input) = 181.2
13. `fy` (user-input) = 355
14. `E` (user-input) = 210000
15. `G` (user-input) = 81000
16. `Iy` (user-input) = 1.943000e+7
17. `Iz` (user-input) = 1.424000e+6
18. `It` (user-input) = 69800
19. `Iw` (user-input) = 1.299000e+10
20. `L` (user-input) = 3000
21. `k_y` (user-input) = 1
22. `k_z` (user-input) = 1
23. `k_LT` (user-input) = 1
24. `psi_LT` (user-input) = 1
25. `psi_y` (user-input) = 0.1
26. `psi_z` (user-input) = -0.2
27. `section_class` (user-input) = 3
28. `alpha_y` (user-input) = 0.21
29. `alpha_z` (user-input) = 0.34
30. `alpha_LT` (user-input) = 0.34
31. `gamma_M1` (coefficient) = 1
32. `lambda_LT_0` (coefficient) = 0.4
33. `beta_LT` (coefficient) = 0.75
34. `piSq` (constant) = 9.869604401
35. `k_c` (table) = 1
36. `C1` (derived) = 1
37. `abs_N_Ed` (derived) = 200000
38. `abs_M_y_Ed` (derived) = 2.000000e+7
39. `abs_M_z_Ed` (derived) = 5.000000e+6
40. `Lcr_y` (derived) = 3000
41. `Lcr_z` (derived) = 3000
42. `Lcr_LT` (derived) = 3000
43. `Lcr_y_sq` (derived) = 9.000000e+6
44. `Lcr_z_sq` (derived) = 9.000000e+6
45. `Lcr_LT_sq` (derived) = 9.000000e+6
46. `N_cr_y_num` (derived) = 4.027095e+13
47. `N_cr_y` (derived) = 4.474550e+6
48. `N_cr_z_num` (derived) = 2.951407e+12
49. `N_cr_z` (derived) = 327934.055566862
50. `ip2_num` (derived) = 2.085400e+7
51. `ip2` (derived) = 7322.331460674
52. `ncr_t_warp_num` (derived) = 2.692329e+16
53. `ncr_t_warp` (derived) = 2.991477e+9
54. `ncr_t_num` (derived) = 8.645277e+9
55. `N_cr_T` (derived) = 1.180673e+6
56. `N_cr_TF` (derived) = 327934.055566862
57. `euler_num` (derived) = 2.951407e+12
58. `euler_term` (derived) = 327934.055566862
59. `torsion_ratio` (derived) = 9122.191011236
60. `torsion_num` (derived) = 5.088420e+16
61. `torsion_den` (derived) = 2.951407e+12
62. `torsion_term` (derived) = 17240.661358659
63. `torsion_sum` (derived) = 26362.852369895
64. `torsion_root` (derived) = 162.366413922
65. `M_cr_prefactor` (derived) = 327934.055566862
66. `M_cr` (derived) = 5.324548e+7
67. `lambda_bar_0_num` (derived) = 7.831300e+7
68. `lambda_bar_0` (derived) = 1.212761974
69. `it_over_iy` (derived) = 0.003592383
70. `a_LT` (derived) = 0.996407617
71. `eta_y_m_over_n` (derived) = 100
72. `eta_y_area_ratio` (derived) = 0.012910245
73. `eta_y` (derived) = 1.291024479
74. `psi_y_eff` (derived) = 0.1
75. `psi_z_eff` (derived) = -0.2
76. `ncr_y_ratio` (derived) = 0.044697236
77. `ncr_z_ratio` (derived) = 0.609878714
78. `Cmy_0` (table) = 0.807299069
79. `Cmz_0` (table) = 0.631635141
80. `ncr_t_ratio` (derived) = 0.169394951
81. `ncr_tf_ratio` (derived) = 0.609878714
82. `cm_branch_limit` (derived) = 0.060877847
83. `cm_branch_active` (derived) = 0
84. `cm_amp_num` (derived) = 1.286386624
85. `cm_amp_den` (derived) = 2.286386624
86. `cm_amp` (derived) = 0.562628652
87. `cm_denom` (derived) = 0.32403671
88. `Cm_y` (table) = 0.807299069
89. `Cm_z` (table) = 0.631635141
90. `Cm_y_aug` (derived) = 0.915718134
91. `cm_lt_num` (derived) = 0.835527345
92. `cm_lt_raw` (derived) = 2.578495953
93. `Cm_LT` (table) = 1
94. `N_Rk` (derived) = 1.011040e+6
95. `M_y_Rk` (derived) = 7.831300e+7
96. `M_z_Rk` (derived) = 2.048350e+7
97. `chi_y` (derived) = 0.931755785
98. `chi_z` (derived) = 0.263094394
99. `chi_LT` (derived) = 0.57189179
100. `f_LT` (derived) = 1
101. `chi_LT_mod` (derived) = 0.57189179
102. `lambda_bar_y` (derived) = 0.475345627
103. `lambda_bar_z` (derived) = 1.755864139
104. `n_pl` (derived) = 0.19781611
105. `wy` (derived) = 1.103
106. `wz` (derived) = 1.154
107. `lambda_bar_max` (derived) = 1.755864139
108. `b_LT` (derived) = 0.079874159
109. `c_LT` (derived) = 1.019774317
110. `d_LT` (derived) = 0.333325978
111. `e_LT` (derived) = 0.733142732
112. `C_yy` (derived) = 0.906618314
113. `C_yz` (derived) = 0.894626928
114. `C_zy` (derived) = 0.820592285
115. `C_zz` (derived) = 0.886258414
116. `k_yy_denom` (derived) = 0.955302764
117. `k_yy` (derived) = 0.932113782
118. `k_zz_denom` (derived) = 0.390121286
119. `k_zz` (derived) = 1.826864201
120. `k_yz` (derived) = 1.110685416
121. `bc_61_term1_den` (derived) = 942042.368857003
122. `bc_61_term1` (derived) = 0.212304676
123. `bc_61_term2_den` (derived) = 4.478656e+7
124. `bc_61_term2` (derived) = 0.416247082
125. `bc_61_term3_den` (derived) = 2.048350e+7
126. `bc_61_term3` (derived) = 0.271117098
127. `bc_61_m1_check` (check) = 0.899668856

#### Expected Intermediates

```json
{
  "A": 2848,
  "a_LT": 0.9964076170869789,
  "abs_M_y_Ed": 20000000,
  "abs_M_z_Ed": 5000000,
  "abs_N_Ed": 200000,
  "alpha_LT": 0.34,
  "alpha_y": 0.21,
  "alpha_z": 0.34,
  "Av_y": 2848,
  "Av_z": 1424,
  "b_LT": 0.07987415858895829,
  "bc_61_m1_check": 0.8996688563477757,
  "bc_61_term1": 0.21230467610778872,
  "bc_61_term1_den": 942042.3688570027,
  "bc_61_term2": 0.4162470821015102,
  "bc_61_term2_den": 44786561.75300539,
  "bc_61_term3": 0.27111709813847684,
  "bc_61_term3_den": 20483500,
  "beta_LT": 0.75,
  "c_LT": 1.0197743167176125,
  "C_yy": 0.9066183136899365,
  "C_yz": 0.8946269277721743,
  "C_zy": 0.8205922848429158,
  "C_zz": 0.8862584139238378,
  "C1": 1,
  "chi_LT": 0.571891790034929,
  "chi_LT_mod": 0.571891790034929,
  "chi_y": 0.9317557849907053,
  "chi_z": 0.2630943937481529,
  "cm_amp": 0.562628651987052,
  "cm_amp_den": 2.2863866244169158,
  "cm_amp_num": 1.2863866244169155,
  "cm_branch_active": 0,
  "cm_branch_limit": 0.0608778471978906,
  "cm_denom": 0.324036709982383,
  "Cm_LT": 1,
  "cm_lt_num": 0.8355273452371839,
  "cm_lt_raw": 2.5784959527659974,
  "Cm_y": 0.8072990688895293,
  "Cm_y_aug": 0.9157181339968632,
  "Cm_z": 0.6316351414187918,
  "Cmy_0": 0.8072990688895293,
  "Cmz_0": 0.6316351414187918,
  "d_LT": 0.33332597769581385,
  "E": 210000,
  "e_LT": 0.733142731870702,
  "eta_y": 1.2910244786944696,
  "eta_y_area_ratio": 0.012910244786944696,
  "eta_y_m_over_n": 100,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
  "hw": 181.2,
  "ip2": 7322.331460674157,
  "ip2_num": 20854000,
  "It": 69800,
  "it_over_iy": 0.0035923829130211013,
  "Iw": 12990000000,
  "Iy": 19430000,
  "Iz": 1424000,
  "k_c": 1,
  "k_LT": 1,
  "k_y": 1,
  "k_yy": 0.9321137823523795,
  "k_yy_denom": 0.9553027643662946,
  "k_yz": 1.110685415943898,
  "k_z": 1,
  "k_zz": 1.8268642010368066,
  "k_zz_denom": 0.3901212862620117,
  "L": 3000,
  "lambda_bar_0": 1.2127619737971853,
  "lambda_bar_0_num": 78313000,
  "lambda_bar_max": 1.7558641387329141,
  "lambda_bar_y": 0.47534562749173087,
  "lambda_bar_z": 1.7558641387329141,
  "lambda_LT_0": 0.4,
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
  "N_cr_T": 1180672.7325034568,
  "N_cr_TF": 327934.05556686234,
  "N_cr_y": 4474549.648640545,
  "N_cr_y_num": 40270946837764.91,
  "N_cr_z": 327934.05556686234,
  "N_cr_z_num": 2951406500101.761,
  "N_Ed": -200000,
  "n_pl": 0.19781611014401013,
  "N_Rk": 1011040,
  "ncr_t_num": 8645277093.970184,
  "ncr_t_ratio": 0.16939495127995974,
  "ncr_t_warp": 2991477093.9701843,
  "ncr_t_warp_num": 26923293845731660,
  "ncr_tf_ratio": 0.6098787137379883,
  "ncr_y_ratio": 0.04469723563370537,
  "ncr_z_ratio": 0.6098787137379883,
  "piSq": 9.869604401089358,
  "psi_LT": 1,
  "psi_y": 0.1,
  "psi_y_eff": 0.1,
  "psi_z": -0.2,
  "psi_z_eff": -0.2,
  "section_class": 3,
  "torsion_den": 2951406500101.761,
  "torsion_num": 50884200000000000,
  "torsion_ratio": 9122.191011235955,
  "torsion_root": 162.3664139220151,
  "torsion_sum": 26362.852369895147,
  "torsion_term": 17240.661358659192,
  "tw": 5.6,
  "Wel_y": 200000,
  "Wel_z": 50000,
  "Wpl_y": 220600,
  "Wpl_z": 57700,
  "wy": 1.103,
  "wz": 1.154
}
```

### i-c4

- Branch decision: shape=`I`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-61-m1: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m1: SN003b M_cr is implemented only for I/H sections`

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m1: SN003b M_cr is implemented only for I/H sections`

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m1: SN003b M_cr is implemented only for I/H sections`

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-61-m1: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m1: SN003b M_cr is implemented only for I/H sections`

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m1: SN003b M_cr is implemented only for I/H sections`

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-61-m1: SN003b M_cr is implemented only for I/H sections`

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-61-m1: class 4 sections are out of scope`

