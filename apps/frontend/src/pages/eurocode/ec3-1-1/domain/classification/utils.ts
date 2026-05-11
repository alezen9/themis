import { numberFormatter } from "../../../../../utils";
import { Metadata } from "./types";

export const maxClass = <T extends number>(...classes: T[]) =>
  Math.max(...classes) as T;

export const metadataLabels: Record<keyof Metadata, string> = {
  alpha: "\u03b1",
  cOverT: "c / t",
  dOverT: "d / t",
  epsilon: "\u03b5",
  epsilon2: "\u03b5\u00b2",
  fy_MPa: "f\u1d67",
  kSigma: "k\u03c3",
  psi: "\u03c8",
  sigma_supported_MPa: "\u03c3 supported point",
  sigma_tip_MPa: "\u03c3 tip point",
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
  if (key === "fy_MPa") return `fy = ${formattedValue} MPa`;
  if (key === "sigma_tip_MPa") return `${SIGMA} tip = ${formattedValue} MPa`;
  if (key === "sigma_supported_MPa")
    return `${SIGMA} supported = ${formattedValue} MPa`;
  if (key === "psi") return `${PSI} = ${formattedValue}`;
  if (key === "kSigma") return `k${SIGMA} = ${formattedValue}`;
  if (key === "stressDistribution")
    return `Stress distribution = ${formattedValue}`;
};
