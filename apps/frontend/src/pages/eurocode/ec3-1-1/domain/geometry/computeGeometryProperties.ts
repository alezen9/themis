import type { Ec3FormValues } from "../../Form/schema/schema";
import { computeChsGeometryProperties } from "./computeChsGeometryProperties";
import { computeIGeometryProperties } from "./computeIGeometryProperties";
import { computeRhsGeometryProperties } from "./computeRhsGeometryProperties";

type SectionIdObj = Pick<Ec3FormValues, "section_id">;
type I_GeometryObj = Pick<Ec3FormValues, "i_geometry">;
type RHS_GeometryObj = Pick<Ec3FormValues, "rhs_geometry">;
type CHS_GeometryObj = Pick<Ec3FormValues, "chs_geometry">;

type I_Input = { shape: "I" } & SectionIdObj &
  I_GeometryObj &
  Partial<RHS_GeometryObj> &
  Partial<CHS_GeometryObj>;
type RHs_Input = { shape: "RHS" } & SectionIdObj &
  RHS_GeometryObj &
  Partial<I_GeometryObj> &
  Partial<CHS_GeometryObj>;
type CHS_Input = { shape: "CHS" } & SectionIdObj &
  CHS_GeometryObj &
  Partial<RHS_GeometryObj> &
  Partial<I_GeometryObj>;

type Inputs = I_Input | RHs_Input | CHS_Input;

export type GeometricProperties = ReturnType<typeof computeGeometryProperties>;

export const computeGeometryProperties = (inputs: Inputs) => {
  const { shape, section_id, i_geometry, rhs_geometry, chs_geometry } = inputs;
  switch (shape) {
    case "I":
      return computeIGeometryProperties(section_id, i_geometry);
    case "RHS":
      return computeRhsGeometryProperties(section_id, rhs_geometry);
    case "CHS":
      return computeChsGeometryProperties(section_id, chs_geometry);
  }
};
