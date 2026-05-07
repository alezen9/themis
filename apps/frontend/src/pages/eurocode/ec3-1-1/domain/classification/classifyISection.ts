import { Ec3FormValues } from "../../Form/schema";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm">;

export const classifyISection = (geometry: Geometry, actions: Actions) => {
  const {} = geometry;
  const { N_Ed_kN, M_y_Ed_kNm } = actions;
  const isPureCompression = M_y_Ed_kNm === 0 && N_Ed_kN < 0;
  //   const isPureBending = M_y_Ed_kNm !== 0 && N_Ed_kN === 0;

  if (isPureCompression) {
  }
};
