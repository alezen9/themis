import type { Ec3FormValues } from "../../Form/schema";

type ChsSectionInput = Pick<
  Extract<Ec3FormValues, { shape: "CHS" }>,
  "shape" | "fabricationType" | "d" | "t"
>;

export const computeChsSectionProperties = (section: ChsSectionInput) => {
  const d = section.d; // outer diameter
  const t = section.t; // wall thickness
  const di = d - 2 * t;

  const A = (Math.PI / 4) * (d ** 2 - di ** 2);
  const Iy = (Math.PI / 64) * (d ** 4 - di ** 4);
  const Iz = Iy;
  const Wel_y = Iy / (d / 2);
  const Wel_z = Wel_y;
  const Wpl_y = (d ** 3 - di ** 3) / 6;
  const Wpl_z = Wpl_y;
  const Av_y = (2 * A) / Math.PI;
  const Av_z = Av_y;
  const It = 2 * Iy;

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
    tw: 0, // web thickness is not applicable to CHS sections
    hw: 0, // web height is not applicable to CHS sections
    h: 0, // section height is not applicable to CHS sections
    b: 0, // section width is not applicable to CHS sections
    tf: 0, // flange thickness is not applicable to CHS sections
    t,
    d,
  };
};
