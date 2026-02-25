// ########################################
//              MATERIAL TYPES
// ########################################

export interface MaterialResult {
  fy: number;
  fu: number;
  E: number;
  G: number;
  nu: number;
}

export interface ThicknessRange {
  up_to_40: number;
  above_40?: number;
}

export interface GradeData {
  fy: ThicknessRange;
  fu: ThicknessRange;
}

export interface NormData {
  description: string;
  grades: Record<string, GradeData>;
}

export interface MaterialDatabase {
  defaults: {
    density: number;
    E: number;
    G: number;
    nu: number;
    alpha: number;
  };
  norms: Record<string, NormData>;
}

// ########################################
//              SECTION TYPES
// ########################################

export type Shape = "I" | "RHS" | "CHS";

export interface FlangedDimensions {
  depth: number;
  width: number;
  web_thickness: number;
  flange_thickness: number;
  root_radius: number;
}

export interface RhsDimensions {
  depth: number;
  width: number;
  web_thickness: number;
  outer_rounding_radius: number;
  inner_rounding_radius: number;
}

export interface ChsDimensions {
  diameter: number;
  thickness: number;
}

export type SectionDimensions = FlangedDimensions | RhsDimensions | ChsDimensions;

export interface AxisProperties {
  moment_of_inertia: number;
  radius_of_gyration: number;
  elastic_section_modulus: number;
  plastic_section_modulus: number;
}

export interface TorsionProperties {
  torsion_constant: number;
  torsion_modulus: number;
  warping_constant?: number;
  warping_modulus?: number;
}

export interface SectionProperties {
  area: number;
  shear_area: { y: number; z: number };
  inertia: { y: AxisProperties; z: AxisProperties };
  torsion: TorsionProperties;
  buckling: { y: string; z: string };
}

export interface SectionRecord<D extends SectionDimensions = SectionDimensions> {
  id: string;
  shape: Shape;
  sectionType: string;
  dimensions: D;
  properties: SectionProperties;
  weight: number;
}

// ########################################
//              RAW JSON TYPES
// ########################################

export interface RawSectionEntry {
  dimensions: Record<string, number>;
  weight: number;
  perimeter: number;
  area: number;
  shear_area: { y: number; z: number };
  inertia: { y: AxisProperties; z: AxisProperties };
  torsion: TorsionProperties;
  buckling: Record<string, string | number>;
}

export interface RawSectionFile {
  units: Record<string, string>;
  sections: Record<string, Record<string, RawSectionEntry>>;
}
