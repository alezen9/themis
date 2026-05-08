import { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["i_geometry"];

export const getIClassificationGeometry = (geometry: Geometry) => {
  const { h_mm, b_mm, tw_mm, tf_mm } = geometry;

  const webDepth_mm = h_mm - 2 * tf_mm;
  const webRatio = webDepth_mm / tw_mm;
  const flangeWidth_mm = (b_mm - tw_mm) / 2;
  const flangeRatio = flangeWidth_mm / tf_mm;

  return {
    h_mm,
    b_mm,
    tw_mm,
    tf_mm,
    webDepth_mm,
    webRatio,
    flangeWidth_mm,
    flangeRatio,
  };
};

export type IClassificationGeometry = ReturnType<
  typeof getIClassificationGeometry
>;
