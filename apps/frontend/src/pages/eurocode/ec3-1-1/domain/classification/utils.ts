export const getEpsilon = (fy_Mpa: number) => Math.sqrt(235 / fy_Mpa);
export const getEpsilon2 = (fy_Mpa: number) => 235 / fy_Mpa;

export const maxClass = <T extends number>(...classes: T[]) =>
  Math.max(...classes) as T;

export const throwClass4NotSupported = () => {
  throw new Error("Class 4 is not supported");
};
