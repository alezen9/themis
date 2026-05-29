import { create } from "zustand";
import type { VerificationRow } from "@ndg/ndg-ec3-1-1";

import { classifySection } from "./domain/classification/classifySection";
import { computeGeometryProperties } from "./domain/geometry/computeGeometryProperties";
import { defaultValues } from "./Form/defaultValues";

type Ec311DerivedState = {
  geometry: ReturnType<typeof computeGeometryProperties>;
  classification: ReturnType<typeof classifySection>;
  verifications: readonly VerificationRow[];
  threshold: number;
  setGeometry: (geometry: ReturnType<typeof computeGeometryProperties>) => void;
  setClassification: (
    classification: ReturnType<typeof classifySection>,
  ) => void;
  setVerifications: (verifications: readonly VerificationRow[]) => void;
  setThreshold: (threshold: number) => void;
};

export const useEc311DerivedStore = create<Ec311DerivedState>(set => ({
  geometry: computeGeometryProperties(defaultValues),
  classification: classifySection(defaultValues),
  verifications: [],
  threshold: 1,
  setGeometry: geometry => set({ geometry }),
  setClassification: classification => set({ classification }),
  setVerifications: verifications => set({ verifications }),
  setThreshold: threshold => set({ threshold }),
}));
