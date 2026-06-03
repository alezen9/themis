import { Ec3FormValues } from "../../Form/schema/schema";
import { computeGeometryProperties } from "../geometry/computeGeometryProperties";
import { Actions, SectionClass, type Part, type RawPart } from "./types";
import { maxClass } from "./utils";
import { classifyInternalPart } from "./classifyInternalPart";
import { classifyOutstandPart } from "./classifyOutstandPart";

type Geometry = Ec3FormValues["i_geometry"];

export const classifyISection = (
  i_geometry: Geometry,
  steel_grade_id: string,
  section_id: string,
  actions: Actions,
  fabrication_type: Ec3FormValues["fabrication_type"],
  eta: number,
): [SectionClass, Part[]] => {
  const geometricProperties = computeGeometryProperties({
    shape: "I",
    i_geometry,
    section_id,
    fabrication_type,
    eta,
  });
  const ctx = { ...geometricProperties, ...actions };

  const rawParts = decompose(i_geometry);

  const classifiedParts = rawParts.map(rawPart => {
    if (rawPart.type === "outstand")
      return classifyOutstandPart(rawPart, steel_grade_id, ctx);
    return classifyInternalPart(rawPart, steel_grade_id, ctx);
  });

  const sectionClass = maxClass(...classifiedParts.map(([c]) => c));
  const parts = classifiedParts.map(([, p]) => p);

  return [sectionClass, parts];
};

const decompose = (geometry: Geometry): RawPart[] => {
  const { h_mm, b_mm, tw_mm, tf_mm, r_mm } = geometry;
  const flange_c_mm = (b_mm - tw_mm) / 2 - r_mm;
  const web_c_mm = h_mm - 2 * tf_mm - 2 * r_mm;

  return [
    {
      label: "Top left flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      outstandPoints: {
        supported: {
          key: "sigma_supported_MPa",
          y_mm: -(tw_mm / 2 + r_mm),
          z_mm: h_mm / 2 - tf_mm / 2,
        },
        tip: {
          key: "sigma_tip_MPa",
          y_mm: -b_mm / 2,
          z_mm: h_mm / 2 - tf_mm / 2,
        },
      },
    },
    {
      label: "Top right flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      outstandPoints: {
        supported: {
          key: "sigma_supported_MPa",
          y_mm: tw_mm / 2 + r_mm,
          z_mm: h_mm / 2 - tf_mm / 2,
        },
        tip: {
          key: "sigma_tip_MPa",
          y_mm: b_mm / 2,
          z_mm: h_mm / 2 - tf_mm / 2,
        },
      },
    },
    {
      label: "Web",
      type: "internal",
      c_mm: web_c_mm,
      t_mm: tw_mm,
      sectionWebCount: 1,
      internalPoints: {
        a: { key: "sigma_a_MPa", y_mm: 0, z_mm: web_c_mm / 2 },
        b: { key: "sigma_b_MPa", y_mm: 0, z_mm: -web_c_mm / 2 },
      },
    },
    {
      label: "Bottom left flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      outstandPoints: {
        supported: {
          key: "sigma_supported_MPa",
          y_mm: -(tw_mm / 2 + r_mm),
          z_mm: -h_mm / 2 + tf_mm / 2,
        },
        tip: {
          key: "sigma_tip_MPa",
          y_mm: -b_mm / 2,
          z_mm: -h_mm / 2 + tf_mm / 2,
        },
      },
    },
    {
      label: "Bottom right flange",
      type: "outstand",
      c_mm: flange_c_mm,
      t_mm: tf_mm,
      outstandPoints: {
        supported: {
          key: "sigma_supported_MPa",
          y_mm: tw_mm / 2 + r_mm,
          z_mm: -h_mm / 2 + tf_mm / 2,
        },
        tip: {
          key: "sigma_tip_MPa",
          y_mm: b_mm / 2,
          z_mm: -h_mm / 2 + tf_mm / 2,
        },
      },
    },
  ];
};
