import type { Ec3FormValues } from "../../Form/schema";
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

type GeometricProperties = {
  A_mm2: number;
  Iy_mm4: number;
  Iz_mm4: number;
  Wel_y_mm3: number;
  Wel_z_mm3: number;
  Wpl_y_mm3: number;
  Wpl_z_mm3: number;
  Av_y_mm2: number;
  Av_z_mm2: number;
  It_mm4: number;
  Iw_mm6: number;
};

export const computeGeometryProperties = (
  inputs: Inputs,
): GeometricProperties => {
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
