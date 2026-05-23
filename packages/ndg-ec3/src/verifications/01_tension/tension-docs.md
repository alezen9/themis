# Tension Resistance Check (EC3 §6.2.3)

## What this check does

This check verifies whether the section can carry the applied tensile axial force without exceeding its design tensile resistance.

## When it applies

- It applies when `N_Ed > 0`
- It throws `not-applicable-load-case` when `N_Ed <= 0` because that is not a tension load case (mapped to N/A in UI)

## Terms in plain language

- `N_Ed`: Applied axial design force
- `A`: Cross-section area
- `fy`: Steel yield strength
- `gamma_M0`: Partial safety factor from the annex
- `N_pl_Rd`: Design tensile resistance of the section
