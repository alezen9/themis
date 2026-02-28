import { getCmMethod1, getCmMethod2, resolveCmMethod1, type CmMethod1Inputs } from "../tables/c-m-factors";

export const computeCmMethod1 = (psi: number, NEd: number, Ncr: number) => {
  return getCmMethod1(psi, NEd, Ncr);
};

export const computeCmMethod2 = (psi: number) => {
  return getCmMethod2(psi);
};

export const computeCmMethod1Resolved = (inputs: CmMethod1Inputs) => {
  return resolveCmMethod1(inputs);
};
