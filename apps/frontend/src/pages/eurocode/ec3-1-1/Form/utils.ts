import { circularSectionsMap } from "../data/circularSections";
import { flangedSectionsMap } from "../data/flangedSections";
import { hollowSectionsMap } from "../data/hollowSections";

export const getIShapePatchFields = (sectionId: string) => {
  const section = flangedSectionsMap.get(sectionId);
  if (!section) return {};
  const { h, b, tw, tf, r } = section;
  return { h, b, tw, tf, r };
};

export const getRhsShapePatchFields = (sectionId: string) => {
  const section = hollowSectionsMap.get(sectionId);
  if (!section) return {};
  const { h, b, tw, ro, ri } = section;
  return { h, b, tw, ro, ri };
};

export const getChsShapePatchFields = (sectionId: string) => {
  const section = circularSectionsMap.get(sectionId);
  if (!section) return {};
  const { d, t } = section;
  return { d, t };
};

const dimensionFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatDimension = (value: number) => {
  if (Number.isInteger(value)) return String(value);
  return dimensionFormatter.format(value);
};
