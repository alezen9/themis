import { Ec3FormValues } from "../../Form/schema";
import { classifyChsSection } from "./classifyChsSection";
import { classifyISection } from "./classifyISection";

type Input = Pick<
  Ec3FormValues,
  | "shape"
  | "fabrication_type"
  | "steel_grade_id"
  | "i_geometry"
  | "rhs_geometry"
  | "chs_geometry"
  | "N_Ed_kN"
  | "M_y_Ed_kNm"
>;

export const classifySection = (input: Input) => {
  const {
    shape,
    steel_grade_id,
    N_Ed_kN,
    M_y_Ed_kNm,
    i_geometry,
    // rhs_geometry,
    chs_geometry,
  } = input;

  const actions = { N_Ed_kN, M_y_Ed_kNm };
  switch (shape) {
    case "I":
      return classifyISection(i_geometry, actions);
    case "RHS":
      //   return classifyRhsSection(section_id, rhs_geometry);
      return 1;
    case "CHS":
      return classifyChsSection(chs_geometry, steel_grade_id);
  }
};
