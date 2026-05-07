# EC3 Classification Scope Plan

## Product Scope

- Auto classification remains available.
- Supported shapes: I, RHS/SHS, CHS.
- Custom dimensions stay supported for those shapes.
- Class 4 remains unsupported.

## Auto Classification Scope

- Auto class should be based on predominant `N_Ed + M_y_Ed`.
- `M_z_Ed` is ignored by design for now.
- This matches the product reference scope while still supporting custom dimensions.

## Fabrication Type

- I sections:
  - `rolled` and `welded` are both auto-classified.
  - Fabrication type affects flange/outstand classification.
- RHS/SHS and CHS:
  - `hot-formed` and `cold-formed` stay in the form.
  - Auto class uses EN 1993-1-1 cross-section slenderness limits.
  - Hot/cold fabrication type does not change section class for now.
  - It may affect later checks such as buckling curves or product-standard-specific rules.

## Implementation Direction

- Prefer direct Table 5.2-style calculations over generic biaxial plastic solvers.
- Keep logic shape-specific and easy to explain.
- Keep manual class override available.
