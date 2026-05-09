import { SectionClass } from "./utils";

export const classifyIFlangeInCompression = (
  ratio: number,
  epsilon: number,
): SectionClass => {
  if (ratio <= 9 * epsilon) return 1;
  if (ratio <= 10 * epsilon) return 2;
  if (ratio <= 14 * epsilon) return 3;

  return 4;
};
