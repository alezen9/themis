import { create } from "zustand";
import type { VerificationRow } from "@ndg/ndg-ec3-1-1";

import { classifySection } from "./domain/classification/classifySection";
import { computeGeometryProperties } from "./domain/geometry/computeGeometryProperties";
import { defaultValues } from "./Form/defaultValues";

type VerificationsState = { isValid: boolean; reason?: string };

type Ec311DerivedState = {
  geometry: ReturnType<typeof computeGeometryProperties>;
  classification: ReturnType<typeof classifySection>;
  verifications: readonly VerificationRow[];
  verificationsState: VerificationsState;
  threshold: number;
  setGeometry: (geometry: ReturnType<typeof computeGeometryProperties>) => void;
  setClassification: (
    classification: ReturnType<typeof classifySection>,
  ) => void;
  setVerifications: (verifications: readonly VerificationRow[]) => void;
  setVerificationsState: (verificationsState: VerificationsState) => void;
  setThreshold: (threshold: number) => void;
};

export const useEc311DerivedStore = create<Ec311DerivedState>(set => ({
  geometry: computeGeometryProperties(defaultValues),
  classification: classifySection(defaultValues),
  verifications: [],
  verificationsState: { isValid: false, reason: "Verification not run" },
  threshold: 1,
  setGeometry: geometry => set({ geometry }),
  setClassification: classification => set({ classification }),
  setVerifications: verifications => set({ verifications }),
  setVerificationsState: verificationsState => set({ verificationsState }),
  setThreshold: threshold => set({ threshold }),
}));
