import { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["rhs_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm">;

export const classifyRhsSection = (
  _geometry: Geometry,
  _steel_grade_id: Ec3FormValues["steel_grade_id"],
  _actions: Actions,
) => {
  void _geometry;
  void _steel_grade_id;
  void _actions;

  return [1, []] as const;
};
