export type SteelGrade = {
  id: string;
  norm: string;
  normDescription: string;
  fy: number;
  fy_above_40?: number;
  fu: number;
  fu_above_40?: number;
};

export const steelGrades = [
  {
    id: "S235",
    norm: "EN10025-2",
    normDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 235,
    fy_above_40: 215,
    fu: 360,
    fu_above_40: 360,
  },
  {
    id: "S275",
    norm: "EN10025-2",
    normDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 430,
    fu_above_40: 410,
  },
  {
    id: "S355",
    norm: "EN10025-2",
    normDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S450",
    norm: "EN10025-2",
    normDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 450,
    fy_above_40: 410,
    fu: 550,
    fu_above_40: 550,
  },

  {
    id: "S275N",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 390,
    fu_above_40: 370,
  },
  {
    id: "S275NL",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 390,
    fu_above_40: 370,
  },
  {
    id: "S355N",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S355NL",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S420N",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 420,
    fy_above_40: 390,
    fu: 520,
    fu_above_40: 520,
  },
  {
    id: "S420NL",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 420,
    fy_above_40: 390,
    fu: 520,
    fu_above_40: 520,
  },
  {
    id: "S460N",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 460,
    fy_above_40: 430,
    fu: 540,
    fu_above_40: 540,
  },
  {
    id: "S460NL",
    norm: "EN10025-3",
    normDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 460,
    fy_above_40: 430,
    fu: 540,
    fu_above_40: 540,
  },

  {
    id: "S275M",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 370,
    fu_above_40: 360,
  },
  {
    id: "S275ML",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 370,
    fu_above_40: 360,
  },
  {
    id: "S355M",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 470,
    fu_above_40: 450,
  },
  {
    id: "S355ML",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 470,
    fu_above_40: 450,
  },
  {
    id: "S420M",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 420,
    fy_above_40: 390,
    fu: 520,
    fu_above_40: 500,
  },
  {
    id: "S420ML",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 420,
    fy_above_40: 390,
    fu: 520,
    fu_above_40: 500,
  },
  {
    id: "S460M",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 460,
    fy_above_40: 430,
    fu: 540,
    fu_above_40: 530,
  },
  {
    id: "S460ML",
    norm: "EN10025-4",
    normDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 460,
    fy_above_40: 430,
    fu: 540,
    fu_above_40: 530,
  },

  {
    id: "S235W",
    norm: "EN10025-5",
    normDescription:
      "Hot rolled products - Structural steels with improved atmospheric corrosion resistance",
    fy: 235,
    fy_above_40: 215,
    fu: 360,
    fu_above_40: 340,
  },
  {
    id: "S355W",
    norm: "EN10025-5",
    normDescription:
      "Hot rolled products - Structural steels with improved atmospheric corrosion resistance",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 490,
  },

  {
    id: "S460Q",
    norm: "EN10025-6",
    normDescription:
      "Hot rolled products - High yield strength structural steels in the quenched and tempered condition",
    fy: 460,
    fy_above_40: 440,
    fu: 570,
    fu_above_40: 550,
  },
  {
    id: "S460QL",
    norm: "EN10025-6",
    normDescription:
      "Hot rolled products - High yield strength structural steels in the quenched and tempered condition",
    fy: 460,
    fy_above_40: 440,
    fu: 570,
    fu_above_40: 550,
  },
  {
    id: "S460QL1",
    norm: "EN10025-6",
    normDescription:
      "Hot rolled products - High yield strength structural steels in the quenched and tempered condition",
    fy: 460,
    fy_above_40: 440,
    fu: 570,
    fu_above_40: 550,
  },

  {
    id: "S235H",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 235,
    fy_above_40: 215,
    fu: 360,
    fu_above_40: 340,
  },
  {
    id: "S275H",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fy_above_40: 255,
    fu: 430,
    fu_above_40: 410,
  },
  {
    id: "S355H",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fy_above_40: 335,
    fu: 510,
    fu_above_40: 490,
  },
  {
    id: "S275NH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fy_above_40: 255,
    fu: 390,
    fu_above_40: 370,
  },
  {
    id: "S275NLH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fy_above_40: 255,
    fu: 390,
    fu_above_40: 370,
  },
  {
    id: "S355NH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S355NLH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S420NH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 420,
    fy_above_40: 390,
    fu: 540,
    fu_above_40: 520,
  },
  {
    id: "S420NLH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 420,
    fy_above_40: 390,
    fu: 540,
    fu_above_40: 520,
  },
  {
    id: "S460NH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fy_above_40: 430,
    fu: 560,
    fu_above_40: 550,
  },
  {
    id: "S460NLH",
    norm: "EN10210-1",
    normDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fy_above_40: 430,
    fu: 560,
    fu_above_40: 550,
  },

  {
    id: "S235H",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 235,
    fu: 360,
  },
  {
    id: "S275H",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 430,
  },
  {
    id: "S355H",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 510,
  },
  {
    id: "S275NH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 370,
  },
  {
    id: "S275NLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 370,
  },
  {
    id: "S355NH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 470,
  },
  {
    id: "S355NLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 470,
  },
  {
    id: "S460NH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fu: 540,
  },
  {
    id: "S460NLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fu: 540,
  },
  {
    id: "S275MH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 360,
  },
  {
    id: "S275MLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 360,
  },
  {
    id: "S355MH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 470,
  },
  {
    id: "S355MLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 470,
  },
  {
    id: "S420MH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 420,
    fu: 500,
  },
  {
    id: "S420MLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 420,
    fu: 500,
  },
  {
    id: "S460MH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fu: 530,
  },
  {
    id: "S460MLH",
    norm: "EN10219-1",
    normDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fu: 530,
  },
] satisfies SteelGrade[];

export const composeSteelGradeId = (grade: SteelGrade) =>
  `${grade.norm}:${grade.id}`;
export const composeSteelGradeLabel = (grade: SteelGrade) =>
  `${grade.norm} / ${grade.id}`;

export const steelGradesMap = new Map(
  steelGrades.map((grade) => [composeSteelGradeId(grade), grade]),
);
