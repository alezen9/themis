export type StandardSectionClassInput =
  | {
    sectionShape: "I";
    fy: number;
    h: number;
    b: number;
    tw: number;
    tf: number;
    r?: number;
    A?: number;
    Wel_y?: number;
    Wel_z?: number;
    N_Ed?: number;
    M_y_Ed?: number;
    M_z_Ed?: number;
  }
  | {
    sectionShape: "RHS";
    fy: number;
    h: number;
    b: number;
    tw: number;
    A?: number;
    Wel_y?: number;
    Wel_z?: number;
    N_Ed?: number;
    M_y_Ed?: number;
    M_z_Ed?: number;
  }
  | {
    sectionShape: "CHS";
    fy: number;
    d: number;
    t: number;
    A?: number;
    Wel_y?: number;
    Wel_z?: number;
    N_Ed?: number;
    M_y_Ed?: number;
    M_z_Ed?: number;
  };

type SectionClass = 1 | 2 | 3 | 4;

const toClass = (value: number, c1: number, c2: number, c3: number): SectionClass => {
  if (value <= c1) return 1;
  if (value <= c2) return 2;
  if (value <= c3) return 3;
  return 4;
};

const epsilon = (fy: number): number => Math.sqrt(235 / fy);

const defaultStress = {
  sigmaN: 0,
  sigmaY: 0,
  sigmaZ: 0,
};

const resolveStress = (input: {
  A?: number;
  Wel_y?: number;
  Wel_z?: number;
  N_Ed?: number;
  M_y_Ed?: number;
  M_z_Ed?: number;
}) => {
  const sigmaN = input.A && input.A > 0 ? (input.N_Ed ?? 0) / input.A : defaultStress.sigmaN;
  const sigmaY = input.Wel_y && input.Wel_y > 0 ? (input.M_y_Ed ?? 0) / input.Wel_y : defaultStress.sigmaY;
  const sigmaZ = input.Wel_z && input.Wel_z > 0 ? (input.M_z_Ed ?? 0) / input.Wel_z : defaultStress.sigmaZ;
  return { sigmaN, sigmaY, sigmaZ };
};

const isAllCompression = (stresses: readonly number[]) => stresses.every((sigma) => sigma < 0);

const classifyISection = (input: Extract<StandardSectionClassInput, { sectionShape: "I" }>): SectionClass => {
  const eps = epsilon(input.fy);
  const radius = input.r ?? 0;
  const flangeOutstand = Math.max((input.b - input.tw - 2 * radius) / 2, 0);
  const flangeRatio = flangeOutstand / input.tf;
  // c_web = h - 2*tf - 2*r matches catalogue class envelopes better than h-2*tf.
  const webHeight = Math.max(input.h - 2 * input.tf - 2 * radius, 0);
  const webRatio = webHeight / input.tw;

  const { sigmaN, sigmaY } = resolveStress(input);
  const sigmaTop = sigmaN + sigmaY;
  const sigmaBottom = sigmaN - sigmaY;
  const webInCompression = isAllCompression([sigmaTop, sigmaBottom]);

  const flangeClass = toClass(flangeRatio, 9 * eps, 10 * eps, 14 * eps);
  // Internal element limits for web:
  // - compression side (both edges in compression): 33/38/42*epsilon
  // - bending-dominant (one edge in tension):      72/83/124*epsilon
  const webClass = webInCompression
    ? toClass(webRatio, 33 * eps, 38 * eps, 42 * eps)
    : toClass(webRatio, 72 * eps, 83 * eps, 124 * eps);
  return Math.max(flangeClass, webClass) as SectionClass;
};

const classifyRhsSection = (input: Extract<StandardSectionClassInput, { sectionShape: "RHS" }>): SectionClass => {
  const eps = epsilon(input.fy);
  const cH = input.h - 2 * input.tw;
  const cB = input.b - 2 * input.tw;
  const ratioH = cH / input.tw;
  const ratioB = cB / input.tw;

  const { sigmaN, sigmaY, sigmaZ } = resolveStress(input);
  const cornerStresses = [
    sigmaN + sigmaY + sigmaZ,
    sigmaN + sigmaY - sigmaZ,
    sigmaN - sigmaY + sigmaZ,
    sigmaN - sigmaY - sigmaZ,
  ] as const;
  const wallCompression = isAllCompression(cornerStresses);

  const classH = wallCompression
    ? toClass(ratioH, 33 * eps, 38 * eps, 42 * eps)
    : toClass(ratioH, 72 * eps, 83 * eps, 124 * eps);
  const classB = wallCompression
    ? toClass(ratioB, 33 * eps, 38 * eps, 42 * eps)
    : toClass(ratioB, 72 * eps, 83 * eps, 124 * eps);
  return Math.max(classH, classB) as SectionClass;
};

const classifyChsSection = (input: Extract<StandardSectionClassInput, { sectionShape: "CHS" }>): SectionClass => {
  const epsSq = 235 / input.fy;
  const slenderness = input.d / input.t;

  const { sigmaN, sigmaY, sigmaZ } = resolveStress(input);
  const circleStresses = [
    sigmaN + sigmaY + sigmaZ,
    sigmaN + sigmaY - sigmaZ,
    sigmaN - sigmaY + sigmaZ,
    sigmaN - sigmaY - sigmaZ,
  ] as const;
  const shellCompression = isAllCompression(circleStresses);

  return shellCompression
    ? toClass(slenderness, 50 * epsSq, 70 * epsSq, 90 * epsSq)
    : toClass(slenderness, 70 * epsSq, 90 * epsSq, 120 * epsSq);
};

/**
 * EN 1993-1-1 cross-section class inference for the standard catalogue path.
 * Returns class 1..4. Downstream verifications still treat class 4 as not-applicable.
 */
export const inferSectionClassForStandardSection = (input: StandardSectionClassInput): SectionClass => {
  if (input.sectionShape === "I") return classifyISection(input);
  if (input.sectionShape === "RHS") return classifyRhsSection(input);
  return classifyChsSection(input);
};
