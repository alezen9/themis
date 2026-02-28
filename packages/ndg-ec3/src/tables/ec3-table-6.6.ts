import { throwEc3VerificationError, throwInvalidInput } from "../errors";

export type Ec3MomentShape = "uniform" | "linear" | "parabolic" | "triangular";
export type Ec3SupportCondition = "pinned-pinned" | "fixed-pinned" | "fixed-fixed";
export type Ec3LoadApplicationLT = "top-flange" | "centroid" | "bottom-flange";

type KcLookupInput = {
  momentShape: Ec3MomentShape;
  psi?: number;
  supportCondition?: Ec3SupportCondition;
  loadApplication?: Ec3LoadApplicationLT;
  contextLabel?: string;
};

const table66NonLinearKc: Record<
  Exclude<Ec3MomentShape, "uniform" | "linear">,
  Record<Ec3SupportCondition, Record<Ec3LoadApplicationLT, number>>
> = {
  parabolic: {
    "pinned-pinned": { "top-flange": 0.9, centroid: 0.94, "bottom-flange": 0.91 },
    "fixed-pinned": { "top-flange": 0.9, centroid: 0.94, "bottom-flange": 0.91 },
    "fixed-fixed": { "top-flange": 0.9, centroid: 0.94, "bottom-flange": 0.91 },
  },
  triangular: {
    "pinned-pinned": { "top-flange": 0.77, centroid: 0.86, "bottom-flange": 0.82 },
    "fixed-pinned": { "top-flange": 0.77, centroid: 0.86, "bottom-flange": 0.82 },
    "fixed-fixed": { "top-flange": 0.77, centroid: 0.86, "bottom-flange": 0.82 },
  },
};

const throwMissingInput = (contextLabel: string, key: string): never => {
  throwEc3VerificationError({
    type: "MISSING_INPUT",
    message: `${contextLabel}: missing required input "${key}"`,
    details: { key, contextLabel },
  });
  throw new Error("unreachable");
};

export const getKcFromEc3Table66 = ({
  momentShape,
  psi,
  supportCondition,
  loadApplication,
  contextLabel = "ec3-table-6.6",
}: KcLookupInput): number => {
  if (momentShape === "uniform") return 1;

  if (momentShape === "linear") {
    if (psi === undefined) throwMissingInput(contextLabel, "psi_LT");
    const psiValue = psi!;
    if (psiValue < -1 || psiValue > 1) {
      throwInvalidInput(`${contextLabel}: psi_LT must be within [-1, 1]`, { psi: psiValue });
    }
    const denom = 1.33 - 0.33 * psiValue;
    if (denom <= 0) throwInvalidInput(`${contextLabel}: invalid denominator for k_c`, { psi: psiValue, denom });
    return 1 / denom;
  }

  if (momentShape !== "parabolic" && momentShape !== "triangular") {
    throwInvalidInput(`${contextLabel}: unsupported moment shape`, { momentShape });
  }
  if (supportCondition === undefined) throwMissingInput(contextLabel, "support_condition_LT");
  if (loadApplication === undefined) throwMissingInput(contextLabel, "load_application_LT");
  const support = supportCondition!;
  const load = loadApplication!;

  return table66NonLinearKc[momentShape][support][load];
};

export const getC1FromKc = (kc: number): number => {
  if (kc <= 0) throwInvalidInput("ec3-table-6.6: k_c must be > 0 to derive C1", { kc });
  return 1 / (kc ** 2);
};

export const getFReductionEq658 = (lambdaBarLT: number, kc: number): number => {
  if (!Number.isFinite(lambdaBarLT) || lambdaBarLT < 0) {
    throwInvalidInput("ec3-table-6.6: lambda_bar_LT must be finite and >= 0", { lambdaBarLT });
  }
  if (kc <= 0) throwInvalidInput("ec3-table-6.6: k_c must be > 0", { kc });
  const centered = lambdaBarLT - 0.8;
  const raw = 1 - 0.5 * (1 - kc) * (1 - 2 * centered * centered);
  return Math.min(1, raw);
};
