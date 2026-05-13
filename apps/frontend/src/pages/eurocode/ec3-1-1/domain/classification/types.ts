import { Ec3FormValues } from "../../Form/schema";
import { GeometricProperties } from "../geometry/computeGeometryProperties";

export type SectionClass = 1 | 2 | 3 | 4;

export type Actions = Pick<
  Ec3FormValues,
  "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm"
>;
export type SteelGradeId = Ec3FormValues["steel_grade_id"];
export type Context = GeometricProperties & Actions;

export type Metadata = {
  fy_MPa: number;
  epsilon?: number;
  epsilon2?: number;
  alpha?: number;
  kSigma?: number;
  psi?: number;
  cOverT?: number;
  dOverT?: number;
  sigma_supported_MPa?: number;
  sigma_tip_MPa?: number;
  sigma_a_MPa?: number;
  sigma_b_MPa?: number;
  stressDistribution:
    | "neutral"
    | "tension"
    | "compression"
    | "bending"
    | "compression-bending";
};

export type Part = {
  label: string;
  type: "outstand" | "internal" | "tubular";
  metadata: Metadata;
  trace: Trace[];
};

export type Trace = {
  label: "Class 1" | "Class 2" | "Class 3" | "Class 4";
  ratio?: number;
  limit?: string; // 50ε²
  satisfied: boolean;
  note?: string; // Tension only, Neutral, Not supported
};

export type Point = {
  y_mm: number; // horizontal distance from centroid
  z_mm: number; // vertical distance from centroid
};

export type RawPart = {
  label: string;
  type: Part["type"];
  c_mm?: number;
  d_mm?: number;
  t_mm?: number;
  axialPartCount?: 1 | 2;
  outstandPoints?: { supported: Point; tip: Point };
  internalPoints?: { a: Point; b: Point };
};
