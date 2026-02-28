# Check 20 - ulsBeamColumn62M1

- Verification expression: `\frac{N_{Ed}}{\chi_z N_{Rk}/\gamma_{M1}} + k_{zy}\frac{M_{y,Ed}}{\chi_{LT} M_{y,Rk}/\gamma_{M1}} + k_{zz}\frac{M_{z,Ed}}{M_{z,Rk}/\gamma_{M1}} \leq 1.0`
- Section refs: `6.1`, `6.3.2.3`, `6.3.1.2`, `6.3.1.4`, `6.3.2.2`, `Annex A`, `6.3.3`
- Formula refs: n/a
- Verification refs: `(6.62)`
- Scenarios: `12` (compute + not_applicable)

## Scenario Summary

| Scenario | Shape | Class | Expected |
|---|---|---:|---|
| i-c1 | I | 1 | ok (1.373523128) |
| i-c2 | I | 2 | ok (1.373523128) |
| i-c3 | I | 3 | ok (1.373523128) |
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
- Expected ratio: `1.373523128`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wel_z` (user-input) = 50000
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `fy` (user-input) = 355
10. `E` (user-input) = 210000
11. `G` (user-input) = 81000
12. `Iy` (user-input) = 1.943000e+7
13. `Iz` (user-input) = 1.424000e+6
14. `It` (user-input) = 69800
15. `Iw` (user-input) = 1.299000e+10
16. `L` (user-input) = 3000
17. `k_y` (user-input) = 1
18. `k_z` (user-input) = 1
19. `k_LT` (user-input) = 1
20. `psi_LT` (user-input) = 1
21. `psi_y` (user-input) = 0.1
22. `psi_z` (user-input) = -0.2
23. `section_class` (user-input) = 1
24. `alpha_y` (user-input) = 0.21
25. `alpha_z` (user-input) = 0.34
26. `alpha_LT` (user-input) = 0.34
27. `gamma_M1` (coefficient) = 1
28. `lambda_LT_0` (coefficient) = 0.4
29. `beta_LT` (coefficient) = 0.75
30. `piSq` (constant) = 9.869604401
31. `k_c` (table) = 1
32. `C1` (derived) = 1
33. `abs_N_Ed` (derived) = 200000
34. `abs_M_y_Ed` (derived) = 2.000000e+7
35. `abs_M_z_Ed` (derived) = 5.000000e+6
36. `Lcr_y` (derived) = 3000
37. `Lcr_z` (derived) = 3000
38. `Lcr_LT` (derived) = 3000
39. `Lcr_y_sq` (derived) = 9.000000e+6
40. `Lcr_z_sq` (derived) = 9.000000e+6
41. `Lcr_LT_sq` (derived) = 9.000000e+6
42. `N_cr_y_num` (derived) = 4.027095e+13
43. `N_cr_y` (derived) = 4.474550e+6
44. `N_cr_z_num` (derived) = 2.951407e+12
45. `N_cr_z` (derived) = 327934.055566862
46. `ip2_num` (derived) = 2.085400e+7
47. `ip2` (derived) = 7322.331460674
48. `ncr_t_warp_num` (derived) = 2.692329e+16
49. `ncr_t_warp` (derived) = 2.991477e+9
50. `ncr_t_num` (derived) = 8.645277e+9
51. `N_cr_T` (derived) = 1.180673e+6
52. `N_cr_TF` (derived) = 327934.055566862
53. `euler_num` (derived) = 2.951407e+12
54. `euler_term` (derived) = 327934.055566862
55. `torsion_ratio` (derived) = 9122.191011236
56. `torsion_num` (derived) = 5.088420e+16
57. `torsion_den` (derived) = 2.951407e+12
58. `torsion_term` (derived) = 17240.661358659
59. `torsion_sum` (derived) = 26362.852369895
60. `torsion_root` (derived) = 162.366413922
61. `M_cr_prefactor` (derived) = 327934.055566862
62. `M_cr` (derived) = 5.324548e+7
63. `lambda_bar_0_num` (derived) = 7.831300e+7
64. `lambda_bar_0` (derived) = 1.212761974
65. `it_over_iy` (derived) = 0.003592383
66. `a_LT` (derived) = 0.996407617
67. `eta_y_m_over_n` (derived) = 100
68. `eta_y_area_ratio` (derived) = 0.012910245
69. `eta_y` (derived) = 1.291024479
70. `psi_y_eff` (derived) = 0.1
71. `psi_z_eff` (derived) = -0.2
72. `ncr_y_ratio` (derived) = 0.044697236
73. `ncr_z_ratio` (derived) = 0.609878714
74. `Cmy_0` (table) = 0.807299069
75. `Cmz_0` (table) = 0.631635141
76. `ncr_t_ratio` (derived) = 0.169394951
77. `ncr_tf_ratio` (derived) = 0.609878714
78. `cm_branch_limit` (derived) = 0.060877847
79. `cm_branch_active` (derived) = 0
80. `cm_amp_num` (derived) = 1.286386624
81. `cm_amp_den` (derived) = 2.286386624
82. `cm_amp` (derived) = 0.562628652
83. `cm_denom` (derived) = 0.32403671
84. `Cm_y` (table) = 0.807299069
85. `Cm_z` (table) = 0.631635141
86. `Cm_y_aug` (derived) = 0.915718134
87. `cm_lt_num` (derived) = 0.835527345
88. `cm_lt_raw` (derived) = 2.578495953
89. `Cm_LT` (table) = 1
90. `N_Rk` (derived) = 1.011040e+6
91. `M_y_Rk` (derived) = 7.831300e+7
92. `M_z_Rk` (derived) = 2.048350e+7
93. `wy` (derived) = 1.103
94. `wz` (derived) = 1.154
95. `chi_y` (derived) = 0.931755785
96. `chi_z` (derived) = 0.263094394
97. `chi_LT` (derived) = 0.57189179
98. `f_LT` (derived) = 1
99. `chi_LT_mod` (derived) = 0.57189179
100. `C_zy` (derived) = 1
101. `k_yy_denom` (derived) = 0.955302764
102. `k_yy` (derived) = 0.845071426
103. `k_zz_denom` (derived) = 0.390121286
104. `k_zz` (derived) = 1.619073769
105. `k_zy` (derived) = 0.507042855
106. `bc_62_term1_den` (derived) = 265998.955855133
107. `bc_62_term1` (derived) = 0.751882651
108. `bc_62_term2_den` (derived) = 4.478656e+7
109. `bc_62_term2` (derived) = 0.226426337
110. `bc_62_term3_den` (derived) = 2.048350e+7
111. `bc_62_term3` (derived) = 0.39521414
112. `bc_62_m1_check` (check) = 1.373523128

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
  "bc_62_m1_check": 1.3735231277180233,
  "bc_62_term1": 0.7518826506556789,
  "bc_62_term1_den": 265998.95585513255,
  "bc_62_term2": 0.22642633659193662,
  "bc_62_term2_den": 44786561.75300539,
  "bc_62_term3": 0.3952141404704077,
  "bc_62_term3_den": 20483500,
  "beta_LT": 0.75,
  "C_zy": 1,
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
  "E": 210000,
  "eta_y": 1.2910244786944696,
  "eta_y_area_ratio": 0.012910244786944696,
  "eta_y_m_over_n": 100,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
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
  "k_yy": 0.8450714255234628,
  "k_yy_denom": 0.9553027643662946,
  "k_z": 1,
  "k_zy": 0.5070428553140777,
  "k_zz": 1.6190737692651191,
  "k_zz_denom": 0.3901212862620117,
  "L": 3000,
  "lambda_bar_0": 1.2127619737971853,
  "lambda_bar_0_num": 78313000,
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
- Expected ratio: `1.373523128`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wel_z` (user-input) = 50000
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `fy` (user-input) = 355
10. `E` (user-input) = 210000
11. `G` (user-input) = 81000
12. `Iy` (user-input) = 1.943000e+7
13. `Iz` (user-input) = 1.424000e+6
14. `It` (user-input) = 69800
15. `Iw` (user-input) = 1.299000e+10
16. `L` (user-input) = 3000
17. `k_y` (user-input) = 1
18. `k_z` (user-input) = 1
19. `k_LT` (user-input) = 1
20. `psi_LT` (user-input) = 1
21. `psi_y` (user-input) = 0.1
22. `psi_z` (user-input) = -0.2
23. `section_class` (user-input) = 2
24. `alpha_y` (user-input) = 0.21
25. `alpha_z` (user-input) = 0.34
26. `alpha_LT` (user-input) = 0.34
27. `gamma_M1` (coefficient) = 1
28. `lambda_LT_0` (coefficient) = 0.4
29. `beta_LT` (coefficient) = 0.75
30. `piSq` (constant) = 9.869604401
31. `k_c` (table) = 1
32. `C1` (derived) = 1
33. `abs_N_Ed` (derived) = 200000
34. `abs_M_y_Ed` (derived) = 2.000000e+7
35. `abs_M_z_Ed` (derived) = 5.000000e+6
36. `Lcr_y` (derived) = 3000
37. `Lcr_z` (derived) = 3000
38. `Lcr_LT` (derived) = 3000
39. `Lcr_y_sq` (derived) = 9.000000e+6
40. `Lcr_z_sq` (derived) = 9.000000e+6
41. `Lcr_LT_sq` (derived) = 9.000000e+6
42. `N_cr_y_num` (derived) = 4.027095e+13
43. `N_cr_y` (derived) = 4.474550e+6
44. `N_cr_z_num` (derived) = 2.951407e+12
45. `N_cr_z` (derived) = 327934.055566862
46. `ip2_num` (derived) = 2.085400e+7
47. `ip2` (derived) = 7322.331460674
48. `ncr_t_warp_num` (derived) = 2.692329e+16
49. `ncr_t_warp` (derived) = 2.991477e+9
50. `ncr_t_num` (derived) = 8.645277e+9
51. `N_cr_T` (derived) = 1.180673e+6
52. `N_cr_TF` (derived) = 327934.055566862
53. `euler_num` (derived) = 2.951407e+12
54. `euler_term` (derived) = 327934.055566862
55. `torsion_ratio` (derived) = 9122.191011236
56. `torsion_num` (derived) = 5.088420e+16
57. `torsion_den` (derived) = 2.951407e+12
58. `torsion_term` (derived) = 17240.661358659
59. `torsion_sum` (derived) = 26362.852369895
60. `torsion_root` (derived) = 162.366413922
61. `M_cr_prefactor` (derived) = 327934.055566862
62. `M_cr` (derived) = 5.324548e+7
63. `lambda_bar_0_num` (derived) = 7.831300e+7
64. `lambda_bar_0` (derived) = 1.212761974
65. `it_over_iy` (derived) = 0.003592383
66. `a_LT` (derived) = 0.996407617
67. `eta_y_m_over_n` (derived) = 100
68. `eta_y_area_ratio` (derived) = 0.012910245
69. `eta_y` (derived) = 1.291024479
70. `psi_y_eff` (derived) = 0.1
71. `psi_z_eff` (derived) = -0.2
72. `ncr_y_ratio` (derived) = 0.044697236
73. `ncr_z_ratio` (derived) = 0.609878714
74. `Cmy_0` (table) = 0.807299069
75. `Cmz_0` (table) = 0.631635141
76. `ncr_t_ratio` (derived) = 0.169394951
77. `ncr_tf_ratio` (derived) = 0.609878714
78. `cm_branch_limit` (derived) = 0.060877847
79. `cm_branch_active` (derived) = 0
80. `cm_amp_num` (derived) = 1.286386624
81. `cm_amp_den` (derived) = 2.286386624
82. `cm_amp` (derived) = 0.562628652
83. `cm_denom` (derived) = 0.32403671
84. `Cm_y` (table) = 0.807299069
85. `Cm_z` (table) = 0.631635141
86. `Cm_y_aug` (derived) = 0.915718134
87. `cm_lt_num` (derived) = 0.835527345
88. `cm_lt_raw` (derived) = 2.578495953
89. `Cm_LT` (table) = 1
90. `N_Rk` (derived) = 1.011040e+6
91. `M_y_Rk` (derived) = 7.831300e+7
92. `M_z_Rk` (derived) = 2.048350e+7
93. `wy` (derived) = 1.103
94. `wz` (derived) = 1.154
95. `chi_y` (derived) = 0.931755785
96. `chi_z` (derived) = 0.263094394
97. `chi_LT` (derived) = 0.57189179
98. `f_LT` (derived) = 1
99. `chi_LT_mod` (derived) = 0.57189179
100. `C_zy` (derived) = 1
101. `k_yy_denom` (derived) = 0.955302764
102. `k_yy` (derived) = 0.845071426
103. `k_zz_denom` (derived) = 0.390121286
104. `k_zz` (derived) = 1.619073769
105. `k_zy` (derived) = 0.507042855
106. `bc_62_term1_den` (derived) = 265998.955855133
107. `bc_62_term1` (derived) = 0.751882651
108. `bc_62_term2_den` (derived) = 4.478656e+7
109. `bc_62_term2` (derived) = 0.226426337
110. `bc_62_term3_den` (derived) = 2.048350e+7
111. `bc_62_term3` (derived) = 0.39521414
112. `bc_62_m1_check` (check) = 1.373523128

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
  "bc_62_m1_check": 1.3735231277180233,
  "bc_62_term1": 0.7518826506556789,
  "bc_62_term1_den": 265998.95585513255,
  "bc_62_term2": 0.22642633659193662,
  "bc_62_term2_den": 44786561.75300539,
  "bc_62_term3": 0.3952141404704077,
  "bc_62_term3_den": 20483500,
  "beta_LT": 0.75,
  "C_zy": 1,
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
  "E": 210000,
  "eta_y": 1.2910244786944696,
  "eta_y_area_ratio": 0.012910244786944696,
  "eta_y_m_over_n": 100,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
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
  "k_yy": 0.8450714255234628,
  "k_yy_denom": 0.9553027643662946,
  "k_z": 1,
  "k_zy": 0.5070428553140777,
  "k_zz": 1.6190737692651191,
  "k_zz_denom": 0.3901212862620117,
  "L": 3000,
  "lambda_bar_0": 1.2127619737971853,
  "lambda_bar_0_num": 78313000,
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
- Expected ratio: `1.373523128`

#### Derivation Steps (evaluation trace)

1. `N_Ed` (user-input) = -200000
2. `M_y_Ed` (user-input) = 2.000000e+7
3. `M_z_Ed` (user-input) = 5.000000e+6
4. `A` (user-input) = 2848
5. `Wel_y` (user-input) = 200000
6. `Wel_z` (user-input) = 50000
7. `Wpl_y` (user-input) = 220600
8. `Wpl_z` (user-input) = 57700
9. `fy` (user-input) = 355
10. `E` (user-input) = 210000
11. `G` (user-input) = 81000
12. `Iy` (user-input) = 1.943000e+7
13. `Iz` (user-input) = 1.424000e+6
14. `It` (user-input) = 69800
15. `Iw` (user-input) = 1.299000e+10
16. `L` (user-input) = 3000
17. `k_y` (user-input) = 1
18. `k_z` (user-input) = 1
19. `k_LT` (user-input) = 1
20. `psi_LT` (user-input) = 1
21. `psi_y` (user-input) = 0.1
22. `psi_z` (user-input) = -0.2
23. `section_class` (user-input) = 3
24. `alpha_y` (user-input) = 0.21
25. `alpha_z` (user-input) = 0.34
26. `alpha_LT` (user-input) = 0.34
27. `gamma_M1` (coefficient) = 1
28. `lambda_LT_0` (coefficient) = 0.4
29. `beta_LT` (coefficient) = 0.75
30. `piSq` (constant) = 9.869604401
31. `k_c` (table) = 1
32. `C1` (derived) = 1
33. `abs_N_Ed` (derived) = 200000
34. `abs_M_y_Ed` (derived) = 2.000000e+7
35. `abs_M_z_Ed` (derived) = 5.000000e+6
36. `Lcr_y` (derived) = 3000
37. `Lcr_z` (derived) = 3000
38. `Lcr_LT` (derived) = 3000
39. `Lcr_y_sq` (derived) = 9.000000e+6
40. `Lcr_z_sq` (derived) = 9.000000e+6
41. `Lcr_LT_sq` (derived) = 9.000000e+6
42. `N_cr_y_num` (derived) = 4.027095e+13
43. `N_cr_y` (derived) = 4.474550e+6
44. `N_cr_z_num` (derived) = 2.951407e+12
45. `N_cr_z` (derived) = 327934.055566862
46. `ip2_num` (derived) = 2.085400e+7
47. `ip2` (derived) = 7322.331460674
48. `ncr_t_warp_num` (derived) = 2.692329e+16
49. `ncr_t_warp` (derived) = 2.991477e+9
50. `ncr_t_num` (derived) = 8.645277e+9
51. `N_cr_T` (derived) = 1.180673e+6
52. `N_cr_TF` (derived) = 327934.055566862
53. `euler_num` (derived) = 2.951407e+12
54. `euler_term` (derived) = 327934.055566862
55. `torsion_ratio` (derived) = 9122.191011236
56. `torsion_num` (derived) = 5.088420e+16
57. `torsion_den` (derived) = 2.951407e+12
58. `torsion_term` (derived) = 17240.661358659
59. `torsion_sum` (derived) = 26362.852369895
60. `torsion_root` (derived) = 162.366413922
61. `M_cr_prefactor` (derived) = 327934.055566862
62. `M_cr` (derived) = 5.324548e+7
63. `lambda_bar_0_num` (derived) = 7.831300e+7
64. `lambda_bar_0` (derived) = 1.212761974
65. `it_over_iy` (derived) = 0.003592383
66. `a_LT` (derived) = 0.996407617
67. `eta_y_m_over_n` (derived) = 100
68. `eta_y_area_ratio` (derived) = 0.012910245
69. `eta_y` (derived) = 1.291024479
70. `psi_y_eff` (derived) = 0.1
71. `psi_z_eff` (derived) = -0.2
72. `ncr_y_ratio` (derived) = 0.044697236
73. `ncr_z_ratio` (derived) = 0.609878714
74. `Cmy_0` (table) = 0.807299069
75. `Cmz_0` (table) = 0.631635141
76. `ncr_t_ratio` (derived) = 0.169394951
77. `ncr_tf_ratio` (derived) = 0.609878714
78. `cm_branch_limit` (derived) = 0.060877847
79. `cm_branch_active` (derived) = 0
80. `cm_amp_num` (derived) = 1.286386624
81. `cm_amp_den` (derived) = 2.286386624
82. `cm_amp` (derived) = 0.562628652
83. `cm_denom` (derived) = 0.32403671
84. `Cm_y` (table) = 0.807299069
85. `Cm_z` (table) = 0.631635141
86. `Cm_y_aug` (derived) = 0.915718134
87. `cm_lt_num` (derived) = 0.835527345
88. `cm_lt_raw` (derived) = 2.578495953
89. `Cm_LT` (table) = 1
90. `N_Rk` (derived) = 1.011040e+6
91. `M_y_Rk` (derived) = 7.831300e+7
92. `M_z_Rk` (derived) = 2.048350e+7
93. `wy` (derived) = 1.103
94. `wz` (derived) = 1.154
95. `chi_y` (derived) = 0.931755785
96. `chi_z` (derived) = 0.263094394
97. `chi_LT` (derived) = 0.57189179
98. `f_LT` (derived) = 1
99. `chi_LT_mod` (derived) = 0.57189179
100. `C_zy` (derived) = 1
101. `k_yy_denom` (derived) = 0.955302764
102. `k_yy` (derived) = 0.845071426
103. `k_zz_denom` (derived) = 0.390121286
104. `k_zz` (derived) = 1.619073769
105. `k_zy` (derived) = 0.507042855
106. `bc_62_term1_den` (derived) = 265998.955855133
107. `bc_62_term1` (derived) = 0.751882651
108. `bc_62_term2_den` (derived) = 4.478656e+7
109. `bc_62_term2` (derived) = 0.226426337
110. `bc_62_term3_den` (derived) = 2.048350e+7
111. `bc_62_term3` (derived) = 0.39521414
112. `bc_62_m1_check` (check) = 1.373523128

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
  "bc_62_m1_check": 1.3735231277180233,
  "bc_62_term1": 0.7518826506556789,
  "bc_62_term1_den": 265998.95585513255,
  "bc_62_term2": 0.22642633659193662,
  "bc_62_term2_den": 44786561.75300539,
  "bc_62_term3": 0.3952141404704077,
  "bc_62_term3_den": 20483500,
  "beta_LT": 0.75,
  "C_zy": 1,
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
  "E": 210000,
  "eta_y": 1.2910244786944696,
  "eta_y_area_ratio": 0.012910244786944696,
  "eta_y_m_over_n": 100,
  "euler_num": 2951406500101.761,
  "euler_term": 327934.05556686234,
  "f_LT": 1,
  "fy": 355,
  "G": 81000,
  "gamma_M1": 1,
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
  "k_yy": 0.8450714255234628,
  "k_yy_denom": 0.9553027643662946,
  "k_z": 1,
  "k_zy": 0.5070428553140777,
  "k_zz": 1.6190737692651191,
  "k_zz_denom": 0.3901212862620117,
  "L": 3000,
  "lambda_bar_0": 1.2127619737971853,
  "lambda_bar_0_num": 78313000,
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
- Expected message snippet: `beam-column-62-m1: class 4 sections are out of scope`

### rhs-c1

- Branch decision: shape=`RHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m1: SN003b M_cr is implemented only for I/H sections`

### rhs-c2

- Branch decision: shape=`RHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m1: SN003b M_cr is implemented only for I/H sections`

### rhs-c3

- Branch decision: shape=`RHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m1: SN003b M_cr is implemented only for I/H sections`

### rhs-c4

- Branch decision: shape=`RHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-62-m1: class 4 sections are out of scope`

### chs-c1

- Branch decision: shape=`CHS`, class=`1` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m1: SN003b M_cr is implemented only for I/H sections`

### chs-c2

- Branch decision: shape=`CHS`, class=`2` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m1: SN003b M_cr is implemented only for I/H sections`

### chs-c3

- Branch decision: shape=`CHS`, class=`3` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_SHAPE`
- Expected message snippet: `beam-column-62-m1: SN003b M_cr is implemented only for I/H sections`

### chs-c4

- Branch decision: shape=`CHS`, class=`4` -> `not_applicable`
- Clause: `undefined`
- Expected failure type: `NOT_APPLICABLE_SECTION_CLASS`
- Expected message snippet: `beam-column-62-m1: class 4 sections are out of scope`

