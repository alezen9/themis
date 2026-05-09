import { Ec3FormValues } from "../../../Form/schema";
import { ClassificationTrace } from "../utils";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<
  Ec3FormValues,
  "N_Ed_kN" | "M_y_Ed_kNm" | "M_z_Ed_kNm"
>;

export const classifyISection = (
  _geometry: Geometry,
  _steel_grade_id: Ec3FormValues["steel_grade_id"],
  _actions: Actions,
) => {
  void _geometry;
  void _steel_grade_id;
  void _actions;

  const trace: ClassificationTrace[] = [];
  return [1, trace] as const;
};
