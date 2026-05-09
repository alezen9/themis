import { Ec3FormValues } from "../../Form/schema";
import {
  ClassificationTrace,
  getEpsilon,
  maxClass,
  SectionClass,
} from "./utils";
import { classifyIFlangeInCompression } from "./_classifyIFlange";
import {
  classifyIWebInBending,
  classifyIWebInCompression,
  classifyIWebInCompressionAndBending,
} from "./_classifyIWeb";
import { getIClassificationGeometry } from "./_getIClassificationGeometry";
import { getISteelDesignStrength } from "./_getISteelDesignStrength";

type Geometry = Ec3FormValues["i_geometry"];
type Actions = Pick<Ec3FormValues, "N_Ed_kN" | "M_y_Ed_kNm">;

export const classifyISection = (
  geometry: Geometry,
  steel_grade_id: Ec3FormValues["steel_grade_id"],
  actions: Actions,
) => {
  const { N_Ed_kN, M_y_Ed_kNm } = actions;

  const trace: ClassificationTrace[] = [];

  if (N_Ed_kN >= 0 && M_y_Ed_kNm === 0) return [1, trace] as const;

  const fy_MPa = getISteelDesignStrength(geometry, steel_grade_id);
  const epsilon = getEpsilon(fy_MPa);
  const classificationGeometry = getIClassificationGeometry(geometry);

  const flangeClass = classifyIFlangeInCompression(
    classificationGeometry.flangeRatio,
    epsilon,
  );

  const isPureCompression = N_Ed_kN < 0 && M_y_Ed_kNm === 0;
  const isCompressionAndBending = N_Ed_kN < 0 && M_y_Ed_kNm !== 0;

  let webClass: SectionClass;
  if (isPureCompression) {
    webClass = classifyIWebInCompression(
      classificationGeometry.webRatio,
      epsilon,
    );
  } else if (isCompressionAndBending) {
    webClass = classifyIWebInCompressionAndBending(
      classificationGeometry,
      fy_MPa,
      epsilon,
      N_Ed_kN,
    );
  } else {
    webClass = classifyIWebInBending(classificationGeometry.webRatio, epsilon);
  }

  return [maxClass(webClass, flangeClass), trace] as const;
};
