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
  | "N_Ed"
  | "M_y_Ed"
  | "M_z_Ed"
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
    N_Ed,
    M_y_Ed,
    M_z_Ed,
  } = inputs;

  const { fy } = getSteelGrade(steel_grade_id);
  const actions = { N_Ed, M_y_Ed, M_z_Ed };

  switch (shape) {
    case "I":
      return classifyISection(
        section_id,
        i_geometry,
        fy,
        getIFabricationType(fabrication_type),
        actions,
      );
    case "RHS":
      return classifyRhsSection(section_id, rhs_geometry, fy, actions);
    case "CHS":
      return classifyChsSection(chs_geometry, fy);
  }
};
