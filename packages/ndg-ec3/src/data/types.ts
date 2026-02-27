
export type MaterialResult = {
  fy: number;
  fu: number;
  E: number;
  G: number;
  nu: number;
};

export type ThicknessRange = {
  up_to_40: number;
  above_40?: number;
};

export type GradeData = {
  fy: ThicknessRange;
  fu: ThicknessRange;
};

export type NormData = {
  description: string;
  grades: Record<string, GradeData>;
};

export type MaterialDatabase = {
  defaults: {
    density: number;
    E: number;
    G: number;
    nu: number;
    alpha: number;
  };
  norms: Record<string, NormData>;
};

export type Shape = "I" | "RHS" | "CHS";

export type FlangedDimensions = {
  depth: number;
  width: number;
  web_thickness: number;
  flange_thickness: number;
  root_radius: number;
};

export type RhsDimensions = {
  depth: number;
  width: number;
  web_thickness: number;
  outer_rounding_radius: number;
  inner_rounding_radius: number;
};

export type ChsDimensions = {
  diameter: number;
  thickness: number;
};

export type SectionDimensions = FlangedDimensions | RhsDimensions | ChsDimensions;

export type AxisProperties = {
  moment_of_inertia: number;
  radius_of_gyration: number;
  elastic_section_modulus: number;
  plastic_section_modulus: number;
};

export type TorsionProperties = {
  torsion_constant: number;
  torsion_modulus: number;
  warping_constant?: number;
  warping_modulus?: number;
};

export type SectionProperties = {
  area: number;
  shear_area: { y: number; z: number };
  inertia: { y: AxisProperties; z: AxisProperties };
  torsion: TorsionProperties;
  buckling: { y: string; z: string };
};

export type SectionRecord<D extends SectionDimensions = SectionDimensions> = {
  id: string;
  shape: Shape;
  sectionType: string;
  dimensions: D;
  properties: SectionProperties;
  weight: number;
};

export type RawSectionEntry = {
  dimensions: Record<string, number>;
  weight: number;
  perimeter: number;
  area: number;
  shear_area: { y: number; z: number };
  inertia: { y: AxisProperties; z: AxisProperties };
  torsion: TorsionProperties;
  buckling: Record<string, string | number>;
};

export type RawSectionFile = {
  units: Record<string, string>;
  sections: Record<string, Record<string, RawSectionEntry>>;
};
