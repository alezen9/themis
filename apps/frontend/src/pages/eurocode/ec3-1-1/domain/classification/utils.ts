export const getEpsilon = (fy_Mpa: number) => Math.sqrt(235 / fy_Mpa);
export const getEpsilon2 = (fy_Mpa: number) => 235 / fy_Mpa;

export type SectionClass = 1 | 2 | 3 | 4;

export type ClassificationTrace = {
  label: string;
  part: string;
  sectionClass: SectionClass;
  ratio: {
    label: string;
    value: number;
  };
  limit?: {
    label: string;
    value: number;
    formula: string;
  };
  values: {
    label: string;
    value: number;
    unit?: string;
  }[];
  passed: boolean;
};

export const maxClass = <T extends number>(...classes: T[]) =>
  Math.max(...classes) as T;
