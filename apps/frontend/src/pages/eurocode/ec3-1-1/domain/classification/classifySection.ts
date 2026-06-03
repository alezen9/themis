import { Ec3FormValues } from "../../Form/schema/schema";
import { classifyChsSection } from "./classifyChsSection";
import { classifyISection } from "./classifyISection";
import { classifyRhsSection } from "./classifyRhsSection";

type Input = Pick<
  Ec3FormValues,
  | "shape"
  | "fabrication_type"
  | "eta"
  | "section_id"
  | "steel_grade_id"
  | "i_geometry"
  | "rhs_geometry"
  | "chs_geometry"
  | "N_Ed_kN"
  | "M_y_Ed_kNm"
  | "M_z_Ed_kNm"
>;

export const classifySection = (input: Input) => {
  const {
    shape,
    fabrication_type,
    eta,
    steel_grade_id,
    section_id,
    N_Ed_kN,
    M_y_Ed_kNm,
    M_z_Ed_kNm,
    i_geometry,
    rhs_geometry,
    chs_geometry,
  } = input;

  const actions = { N_Ed_kN, M_y_Ed_kNm, M_z_Ed_kNm };
  switch (shape) {
    case "I":
      return classifyISection(
        i_geometry,
        steel_grade_id,
        section_id,
        actions,
        fabrication_type,
        eta,
      );
    case "RHS":
      return classifyRhsSection(
        rhs_geometry,
        steel_grade_id,
        section_id,
        actions,
      );
    case "CHS":
      return classifyChsSection(chs_geometry, steel_grade_id, actions);
  }
};
