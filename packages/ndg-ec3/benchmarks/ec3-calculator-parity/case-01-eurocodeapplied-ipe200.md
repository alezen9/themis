# Case 01 - EurocodeApplied IPE200

## Authority
- Source PDF: `resources/ULS design of steel beam_column (IPE,HEA,HEB,HEM,UB,UC) - Eurocode 3.pdf`
- Captured date: 2026-02-28
- Scenario: IPE200, Class 1, L=5 m, N=100 kN (tension), Vy=10 kN, Vz=50 kN, My=20 kNm, Mz=5 kNm.

## Sign Convention Mapping
- Source convention: compression negative.
- Engine convention in this implementation: compression positive.
- Applied mapping: `N_Ed_engine = -N_source`.

## Expected Outcomes by Check
- 01 tension: `u = 0.104`
- 02 compression: `u = 0.000`
- 03 bending y: `u = 0.268`
- 04 bending z: `u = 0.331`
- 05 shear z: `u = 0.183`
- 06 shear y: `u = 0.030`
- 07 bending y + shear: same as (03)
- 08 bending z + shear: same as (04)
- 09 bending y + axial: same as (03)
- 10 bending z + axial: same as (04)
- 11 biaxial + axial: chart value `0.40`
- 12 bending y + axial + shear: same as (09)
- 13 bending z + axial + shear: same as (10)
- 14 biaxial + axial + shear: chart value `0.40`
- 15 flexural buckling y: not applicable (member in tension)
- 16 flexural buckling z: not applicable (member in tension)
- 17 torsional/torsional-flexural buckling: not applicable (member in tension)
- 18 lateral torsional buckling: `u = 0.753`
- 19 beam-column Eq.6.61 Method 1: `u = 1.055`
- 20 beam-column Eq.6.62 Method 1: `u = 0.725`
- 21 beam-column Eq.6.61 Method 2: `u = 0.952`
- 22 beam-column Eq.6.62 Method 2: `u = 1.085`

## Published Intermediate Anchors Used in Tests
- Check 18: `Mcr = 27.9 kNm`, `chi_LT = 0.356`, `Mb,Rd = 26.6 kNm`.
- Check 19: `k_yy = 1.050`, `k_yz = 0.797`.
- Check 20: `k_zy = 0.523`, `k_zz = 1.000`.
