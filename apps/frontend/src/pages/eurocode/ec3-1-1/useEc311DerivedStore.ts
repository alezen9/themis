import { create } from "zustand";

import { classifySection } from "./domain/classification/classifySection";
import { computeGeometryProperties } from "./domain/geometry/computeGeometryProperties";
import { defaultValues } from "./Form/defaultValues";

type Ec311DerivedState = {
  geometry: ReturnType<typeof computeGeometryProperties>;
  classification: ReturnType<typeof classifySection>;
  setGeometry: (geometry: ReturnType<typeof computeGeometryProperties>) => void;
  setClassification: (
    classification: ReturnType<typeof classifySection>,
  ) => void;
};

export const useEc311DerivedStore = create<Ec311DerivedState>((set) => ({
  geometry: computeGeometryProperties(defaultValues),
  classification: classifySection(defaultValues),
  setGeometry: (geometry) => set({ geometry }),
  setClassification: (classification) => set({ classification }),
}));
