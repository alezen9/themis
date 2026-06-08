import type { Ec311FormValues } from "../../Form/schema/schema";
import { computeChsGeometryProperties } from "./computeChsGeometryProperties";
import { computeIGeometryProperties } from "./computeIGeometryProperties";
import { computeRhsGeometryProperties } from "./computeRhsGeometryProperties";

type BaseObj = Pick<Ec311FormValues, "section_id">;
type I_GeometryObj = Pick<Ec311FormValues, "i_geometry">;
type RHS_GeometryObj = Pick<Ec311FormValues, "rhs_geometry">;
type CHS_GeometryObj = Pick<Ec311FormValues, "chs_geometry">;

type I_Input = { shape: "I" } & BaseObj &
  Pick<Ec311FormValues, "fabrication_type" | "eta"> &
  I_GeometryObj &
  Partial<RHS_GeometryObj> &
  Partial<CHS_GeometryObj>;
type RHs_Input = { shape: "RHS" } & BaseObj &
  RHS_GeometryObj &
  Partial<I_GeometryObj> &
  Partial<CHS_GeometryObj>;
type CHS_Input = { shape: "CHS" } & BaseObj &
  CHS_GeometryObj &
  Partial<RHS_GeometryObj> &
  Partial<I_GeometryObj>;

type Inputs = I_Input | RHs_Input | CHS_Input;

export type GeometricProperties = ReturnType<typeof computeGeometryProperties>;

export const computeGeometryProperties = (inputs: Inputs) => {
  switch (inputs.shape) {
    case "I":
      return computeIGeometryProperties(
        inputs.section_id,
        inputs.i_geometry,
        inputs.fabrication_type,
        inputs.eta,
      );
    case "RHS":
      return computeRhsGeometryProperties(
        inputs.section_id,
        inputs.rhs_geometry,
      );
    case "CHS":
      return computeChsGeometryProperties(
        inputs.section_id,
        inputs.chs_geometry,
      );
  }
};
