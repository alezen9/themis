import { flangedSections } from "./data/flanged-sections";
import { steelGrades } from "./data/steel-grades";
import type { AnnexCoeffs, Ec3EditableInputs } from "./use-ec3-evaluate";

type WebsitePayload = Record<string, string | number | undefined>;

type DecodeResult = {
  sectionId?: string;
  gradeId?: string;
  editable: Partial<Ec3EditableInputs>;
  annex: Partial<AnnexCoeffs>;
};

const SECTION_CLASS_MAP: Record<
  string,
  Ec3EditableInputs["section_class_mode"]
> = {
  "0": "auto",
  "1": 1,
  "2": 2,
  "3": 3,
};

const MOMENT_SHAPE_MAP: Record<string, Ec3EditableInputs["moment_shape_y"]> = {
  "0": "uniform",
  "1": "linear",
  "2": "parabolic",
  "3": "triangular",
};

const SUPPORT_CONDITION_MAP: Record<
  string,
  Ec3EditableInputs["support_condition_y"]
> = {
  "0": "pinned-pinned",
  "1": "fixed-pinned",
  "2": "fixed-fixed",
};

const LOAD_LOCATION_MAP: Record<
  string,
  Ec3EditableInputs["load_application_LT"]
> = {
  "0": "top-flange",
  "1": "centroid",
  "2": "bottom-flange",
};

const TORSIONAL_DEFORMATION_MAP: Record<
  string,
  Ec3EditableInputs["torsional_deformations"]
> = {
  "0": "yes",
  "1": "no",
};

const INTERACTION_METHOD_MAP: Record<
  string,
  Ec3EditableInputs["interaction_factor_method"]
> = {
  "0": "both",
  "1": "method1",
  "2": "method2",
  "3": "any",
};

const F_METHOD_MAP: Record<string, Ec3EditableInputs["coefficient_f_method"]> =
  {
    "0": "default-equation",
    "1": "force-1.0",
  };

const LT_CURVE_POLICY_MAP: Record<
  string,
  Ec3EditableInputs["buckling_curves_LT_policy"]
> = {
  "0": "default",
};

const STEEL_CLASS_CODE_TO_GRADE_ID: Record<string, string> = {
  "1": "EN10025-2:S235",
  "2": "EN10025-2:S275",
  "3": "EN10025-2:S355",
  "4": "EN10025-2:S450",
  "5": "EN10025-3:S275 N/NL",
  "6": "EN10025-3:S355 N/NL",
  "7": "EN10025-3:S420 N/NL",
  "8": "EN10025-3:S460 N/NL",
  "9": "EN10025-4:S275 M/ML",
  "10": "EN10025-4:S355 M/ML",
  "11": "EN10025-4:S420 M/ML",
  "12": "EN10025-4:S460 M/ML",
  "13": "EN10025-5:S235 W",
  "14": "EN10025-5:S355 W",
  "15": "EN10025-6:S460 Q/QL/QL1",
};

const toCode = (value: string | number | undefined): string | undefined => {
  if (value === undefined || value === null) return undefined;
  const s = String(value).trim();
  return s.length > 0 ? s : undefined;
};

const toNumber = (value: string | number | undefined): number | undefined => {
  const code = toCode(value);
  if (code === undefined) return undefined;
  const n = Number(code);
  return Number.isFinite(n) ? n : undefined;
};

const setIfDefined = <T extends object, K extends keyof T>(
  target: T,
  key: K,
  value: T[K] | undefined,
) => {
  if (value !== undefined) target[key] = value;
};

const profileCodeToSectionId = (
  rawCode: string | undefined,
): string | undefined => {
  if (!rawCode) return undefined;
  const n = Number(rawCode);
  if (!Number.isInteger(n) || n < 1) return undefined;
  // EurocodeApplied flanged profile selector starts with "custom", then catalogue entries.
  return flangedSections[n - 1]?.id;
};

const normalizeGradeId = (raw: string | undefined): string | undefined => {
  if (!raw) return undefined;
  const [norm, id] = raw.split(":");
  const exists = steelGrades.some(
    (grade) => grade.norm === norm && grade.id === id,
  );
  return exists ? raw : undefined;
};

export const decodeWebsiteCalculationPayload = (
  payload: WebsitePayload,
): DecodeResult => {
  const editable: Partial<Ec3EditableInputs> = {};
  const annex: Partial<AnnexCoeffs> = {};

  const profileCode = toCode(payload["Calculation.Profile"]);
  const steelCode = toCode(payload["Calculation.SteelClass"]);

  setIfDefined(
    editable,
    "section_class_mode",
    SECTION_CLASS_MAP[toCode(payload["Calculation.SectionClass"]) ?? ""],
  );
  setIfDefined(
    editable,
    "moment_shape_y",
    MOMENT_SHAPE_MAP[toCode(payload["Calculation.MomentDiagramMy"]) ?? ""],
  );
  setIfDefined(
    editable,
    "moment_shape_z",
    MOMENT_SHAPE_MAP[toCode(payload["Calculation.MomentDiagramMz"]) ?? ""],
  );
  setIfDefined(
    editable,
    "moment_shape_LT",
    MOMENT_SHAPE_MAP[toCode(payload["Calculation.MomentDiagramLT"]) ?? ""],
  );
  setIfDefined(
    editable,
    "support_condition_y",
    SUPPORT_CONDITION_MAP[
      toCode(payload["Calculation.SupportConditionsMy"]) ?? ""
    ],
  );
  setIfDefined(
    editable,
    "support_condition_z",
    SUPPORT_CONDITION_MAP[
      toCode(payload["Calculation.SupportConditionsMz"]) ?? ""
    ],
  );
  setIfDefined(
    editable,
    "support_condition_LT",
    SUPPORT_CONDITION_MAP[
      toCode(payload["Calculation.SupportConditionsLT"]) ?? ""
    ],
  );
  setIfDefined(
    editable,
    "load_application_LT",
    LOAD_LOCATION_MAP[toCode(payload["Calculation.LoadLocation"]) ?? ""],
  );
  setIfDefined(
    editable,
    "torsional_deformations",
    TORSIONAL_DEFORMATION_MAP[
      toCode(payload["Calculation.TorsionalDeformations"]) ?? ""
    ],
  );
  setIfDefined(
    editable,
    "interaction_factor_method",
    INTERACTION_METHOD_MAP[
      toCode(payload["Calculation.InteractionMethod"]) ?? ""
    ],
  );
  setIfDefined(
    editable,
    "coefficient_f_method",
    F_METHOD_MAP[toCode(payload["Calculation.fFactorMethod"]) ?? ""] ??
      "default-equation",
  );
  setIfDefined(
    editable,
    "buckling_curves_LT_policy",
    LT_CURVE_POLICY_MAP[
      toCode(payload["Calculation.BucklingCurvesForLTBucklingRule"]) ?? ""
    ] ?? "general",
  );

  // Website forces are kN / kNm and lengths are m.
  const N = toNumber(payload["Calculation.N"]);
  const Vy = toNumber(payload["Calculation.Vy"]);
  const Vz = toNumber(payload["Calculation.Vz"]);
  const My = toNumber(payload["Calculation.My"]);
  const Mz = toNumber(payload["Calculation.Mz"]);
  const L = toNumber(payload["Calculation.L"]);
  const Lcry = toNumber(payload["Calculation.Lcry_L"]);
  const Lcrz = toNumber(payload["Calculation.Lcrz_L"]);
  const LLT = toNumber(payload["Calculation.LLT_L"]);
  const LcrT = toNumber(payload["Calculation.LcrT_L"]);
  const psiY = toNumber(payload["Calculation.psiy"]);
  const psiZ = toNumber(payload["Calculation.psiz"]);
  const psiLT = toNumber(payload["Calculation.psiLT"]);

  setIfDefined(editable, "N_Ed", N !== undefined ? N * 1000 : undefined);
  setIfDefined(editable, "V_y_Ed", Vy !== undefined ? Vy * 1000 : undefined);
  setIfDefined(editable, "V_z_Ed", Vz !== undefined ? Vz * 1000 : undefined);
  setIfDefined(editable, "M_y_Ed", My !== undefined ? My * 1e6 : undefined);
  setIfDefined(editable, "M_z_Ed", Mz !== undefined ? Mz * 1e6 : undefined);
  setIfDefined(editable, "L", L !== undefined ? L * 1000 : undefined);
  setIfDefined(editable, "k_y", Lcry);
  setIfDefined(editable, "k_z", Lcrz);
  setIfDefined(editable, "LLT_over_L", LLT);
  setIfDefined(editable, "LcrT_over_L", LcrT);
  setIfDefined(editable, "psi_y", psiY);
  setIfDefined(editable, "psi_z", psiZ);
  setIfDefined(editable, "psi_LT", psiLT);

  setIfDefined(annex, "gamma_M0", toNumber(payload["Calculation.gammaM0"]));
  setIfDefined(annex, "gamma_M1", toNumber(payload["Calculation.gammaM1"]));

  const lambdaRule = toCode(payload["Calculation.lamdaBarLT0Rule"]);
  setIfDefined(annex, "lambda_LT_0", lambdaRule === "0" ? 0.4 : 0.2);
  const betaRule = toCode(payload["Calculation.betaRule"]);
  setIfDefined(annex, "beta_LT", betaRule === "0" ? 0.75 : 1.0);

  return {
    sectionId: profileCodeToSectionId(profileCode),
    gradeId: normalizeGradeId(STEEL_CLASS_CODE_TO_GRADE_ID[steelCode ?? ""]),
    editable,
    annex,
  };
};
