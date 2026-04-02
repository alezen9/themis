import type { Ec3FormValues } from "../formSchema";

type RhsSectionInput = Pick<
  Extract<Ec3FormValues, { shape: "RHS" }>,
  "shape" | "fabricationType" | "h" | "b" | "tw" | "ro" | "ri"
>;

export const computeRhsSectionProperties = (section: RhsSectionInput) => {
  const h = section.h;
  const b = section.b;
  const tw = section.tw; // wall thickness
  const ro = section.ro;
  const ri = section.ri;

  const ho = h - 2 * ro;
  const bo = b - 2 * ro;
  const hi = h - 2 * tw;
  const bi = b - 2 * tw;

  const outerArea = 2 * ro * (ho + bo) + Math.PI * ro ** 2 + ho * bo;
  const innerArea =
    2 * ri * (hi - 2 * ri + bi - 2 * ri) +
    Math.PI * ri ** 2 +
    (hi - 2 * ri) * (bi - 2 * ri);
  const A = outerArea - innerArea;
  const Iy = (b * h ** 3 - bi * hi ** 3) / 12;
  const Iz = (h * b ** 3 - hi * bi ** 3) / 12;
  const Wel_y = Iy / (h / 2);
  const Wel_z = Iz / (b / 2);
  const Wpl_y = (b * h ** 2 - bi * hi ** 2) / 4;
  const Wpl_z = (h * b ** 2 - hi * bi ** 2) / 4;
  const Av_y = (A * b) / (b + h);
  const Av_z = (A * h) / (b + h);
  const p = 2 * (h - tw + (b - tw)) - 2 * ro * (4 - Math.PI);
  const Ap = A / p;
  const It = (4 * Ap ** 2 * (p - 2.8 * Ap)) / 3;

  return {
    A,
    Iy,
    Iz,
    Wel_y,
    Wel_z,
    Wpl_y,
    Wpl_z,
    Av_y,
    Av_z,
    It,
    Iw: 0,
    tw,
    hw: h - 2 * tw,
    h,
    b,
    tf: 0, // flange thickness is not applicable to RHS sections
    t: 0, // CHS wall-thickness field is not applicable to RHS sections
    d: 0, // outer diameter is not applicable to RHS sections
  };
};
