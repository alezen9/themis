export const fakeVerifications = [
  { id: "tension", label: "Tension", ratio: 0.42 },
  { id: "compression", label: "Compression", ratio: 0.78 },
  { id: "bending-y", label: "Bending about y-y", ratio: 0.86 },
  { id: "bending-z", label: "Bending about z-z", ratio: 0.53 },
  { id: "shear-z", label: "Shear about z-z", ratio: 0.31 },
  { id: "shear-y", label: "Shear about y-y", ratio: 0.67 },
  { id: "bending-shear-y", label: "Bending and shear about y-y", ratio: null },
  { id: "bending-shear-z", label: "Bending and shear about z-z", ratio: 0.92 },
  { id: "bending-axial-y", label: "Bending and axial about y-y", ratio: 0.74 },
  { id: "bending-axial-z", label: "Bending and axial about z-z", ratio: 1.04 },
  {
    id: "biaxial-bending-axial",
    label: "Biaxial bending and axial",
    ratio: 0.89,
  },
  {
    id: "bending-axial-shear-y",
    label: "Bending, axial, and shear about y-y",
    ratio: 1.12,
  },
  {
    id: "bending-axial-shear-z",
    label: "Bending, axial, and shear about z-z",
    ratio: null,
  },
  {
    id: "biaxial-bending-axial-shear",
    label: "Biaxial bending, axial, and shear",
    ratio: 1.36,
  },
  { id: "flexural-buckling-y", label: "Flexural buckling y-y", ratio: 0.97 },
  { id: "flexural-buckling-z", label: "Flexural buckling z-z", ratio: 1.18 },
  { id: "torsional-buckling", label: "Torsional buckling", ratio: null },
  {
    id: "lateral-torsional-buckling",
    label: "Lateral-torsional buckling",
    ratio: 1.43,
  },
  { id: "beam-column-661-1", label: "Beam-column 6.61 Method 1", ratio: 1.08 },
  { id: "beam-column-662-1", label: "Beam-column 6.62 Method 1", ratio: 0.82 },
  { id: "beam-column-661-2", label: "Beam-column 6.61 Method 2", ratio: 2.69 },
  { id: "beam-column-662-2", label: "Beam-column 6.62 Method 2", ratio: 0.69 },
] as const;

export type Verification = (typeof fakeVerifications)[number];
