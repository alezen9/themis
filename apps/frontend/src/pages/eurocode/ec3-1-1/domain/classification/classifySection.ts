import { steelGradesMap } from "../../data/steelGrades";
import type { Ec3FormValues } from "../../Form/schema";
import { classifyChsSection } from "./classifyChsSection";
import { classifyISection } from "./classifyISection";
import { classifyRhsSection } from "./classifyRhsSection";

type Inputs = Pick<
  Ec3FormValues,
  | "shape"
  | "section_id"
  | "i_geometry"
  | "rhs_geometry"
  | "chs_geometry"
  | "steel_grade_id"
  | "fabrication_type"
  | "N_Ed_kN"
  | "M_y_Ed_kNm"
  | "M_z_Ed_kNm"
>;

const getSteelGrade = (steel_grade_id: string) => {
  const steelGrade = steelGradesMap.get(steel_grade_id);
  if (!steelGrade) throw new Error(`Unknown steel grade: ${steel_grade_id}`);
  return steelGrade;
};

const getIFabricationType = (
  fabrication_type: Ec3FormValues["fabrication_type"],
) => {
  if (fabrication_type === "rolled" || fabrication_type === "welded") {
    return fabrication_type;
  }

  throw new Error(`Invalid I section fabrication type: ${fabrication_type}`);
};

export const classifySection = (inputs: Inputs) => {
  const {
    shape,
    section_id,
    steel_grade_id,
    fabrication_type,
    i_geometry,
    rhs_geometry,
    chs_geometry,
    N_Ed_kN,
    M_y_Ed_kNm,
    M_z_Ed_kNm,
  } = inputs;

  const steelGrade = getSteelGrade(steel_grade_id);
  const actions = { N_Ed_kN, M_y_Ed_kNm, M_z_Ed_kNm };

  switch (shape) {
    case "I":
      return classifyISection(
        section_id,
        i_geometry,
        steelGrade,
        getIFabricationType(fabrication_type),
        actions,
      );
    case "RHS":
      return classifyRhsSection(section_id, rhs_geometry, steelGrade, actions);
    case "CHS":
      return classifyChsSection(chs_geometry, steelGrade);
  }
};
