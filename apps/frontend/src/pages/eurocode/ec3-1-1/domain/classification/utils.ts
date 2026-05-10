import { numberFormatter } from "../../../../../utils";

export const getEpsilon = (fy_Mpa: number) => Math.sqrt(235 / fy_Mpa);
export const getEpsilon2 = (fy_Mpa: number) => 235 / fy_Mpa;

export type SectionClass = 1 | 2 | 3 | 4;

export type ClassificationTrace = {
  label: string;
  part: string;
  sectionClass: SectionClass;
  ratio: { label: string; value: number };
  limit?: { label: string; value: number; formula: string };
  values: { label: string; value: number; unit?: string }[];
  passed: boolean;
};

export const maxClass = <T extends number>(...classes: T[]) =>
  Math.max(...classes) as T;

type Metadata = {
  fy: number;
  epsilon?: number;
  epsilon2?: number;
  alpha?: number;
  kSigma?: number;
  sigmaTipPoint?: number;
  sigmaSupportedPoint?: number;
  psi?: number;
  cOverT?: number;
  dOverT?: number;
  stressDistribution:
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
  note?: string; // Tension only, Not supported
};

type Point = {
  y_mm: number; // vertical distance from centroid
  z_mm: number; // horizontal distance from centroid
};

export type RawPart = {
  label: string;
  type: Part["type"];
  c_mm?: number;
  d_mm?: number;
  t_mm?: number;
  points?: { supported: Point; tip: Point };
};

export const metadataLabels: Record<keyof Metadata, string> = {
  alpha: "\u03b1",
  cOverT: "c / t",
  dOverT: "d / t",
  epsilon: "\u03b5",
  epsilon2: "\u03b5\u00b2",
  fy: "f\u1d67",
  kSigma: "k\u03c3",
  psi: "\u03c8",
  sigmaSupportedPoint: "\u03c3 supported point",
  sigmaTipPoint: "\u03c3 tip point",
  stressDistribution: "Stress distribution",
};

const ALPHA = "\u03b1";
const EPSILON = "\u03b5";
const EPSILON2 = "\u03b5\u00b2";
const SIGMA = "\u03c3";
const PSI = "\u03c8";

export const formatMetadata = (key: keyof Metadata, value: string | number) => {
  const formattedValue =
    typeof value === "number" ? numberFormatter.format(value) : value;

  if (key === "alpha") return `${ALPHA} = ${formattedValue}`;
  if (key === "cOverT") return `c / t = ${formattedValue}`;
  if (key === "dOverT") return `d / t = ${formattedValue}`;
  if (key === "epsilon") return `${EPSILON} = ${formattedValue}`;
  if (key === "epsilon2") return `${EPSILON2} = ${formattedValue}`;
  if (key === "fy") return `fy = ${formattedValue} MPa`;
  if (key === "sigmaTipPoint") return `${SIGMA} tip = ${formattedValue} MPa`;
  if (key === "sigmaSupportedPoint")
    return `${SIGMA} supported = ${formattedValue} MPa`;
  if (key === "psi") return `${PSI} = ${formattedValue}`;
  if (key === "kSigma") return `k${SIGMA} = ${formattedValue}`;
  if (key === "stressDistribution")
    return `Stress distribution = ${formattedValue}`;
};
