export type SteelGrade = {
  id: string;
  standard: string;
  standardDescription: string;
  fy: number;
  fy_above_40?: number;
  fu: number;
  fu_above_40?: number;
};

export const steelGrades = [
  {
    id: "S235",
    standard: "EN10025-2",
    standardDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 235,
    fy_above_40: 215,
    fu: 360,
    fu_above_40: 360,
  },
  {
    id: "S275",
    standard: "EN10025-2",
    standardDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 430,
    fu_above_40: 410,
  },
  {
    id: "S355",
    standard: "EN10025-2",
    standardDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S450",
    standard: "EN10025-2",
    standardDescription: "Hot rolled products - Non-alloy structural steels",
    fy: 450,
    fy_above_40: 410,
    fu: 550,
    fu_above_40: 550,
  },

  {
    id: "S275 N / NL",
    standard: "EN10025-3",
    standardDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 390,
    fu_above_40: 370,
  },
  {
    id: "S355 N / NL",
    standard: "EN10025-3",
    standardDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S420 N / NL",
    standard: "EN10025-3",
    standardDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 420,
    fy_above_40: 390,
    fu: 520,
    fu_above_40: 520,
  },
  {
    id: "S460 N / NL",
    standard: "EN10025-3",
    standardDescription:
      "Hot rolled products - Normalized/normalized rolled weldable fine grain structural steels",
    fy: 460,
    fy_above_40: 430,
    fu: 540,
    fu_above_40: 540,
  },

  {
    id: "S275 M / ML",
    standard: "EN10025-4",
    standardDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 275,
    fy_above_40: 255,
    fu: 370,
    fu_above_40: 360,
  },
  {
    id: "S355 M / ML",
    standard: "EN10025-4",
    standardDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 355,
    fy_above_40: 335,
    fu: 470,
    fu_above_40: 450,
  },
  {
    id: "S420 M / ML",
    standard: "EN10025-4",
    standardDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 420,
    fy_above_40: 390,
    fu: 520,
    fu_above_40: 500,
  },
  {
    id: "S460 M / ML",
    standard: "EN10025-4",
    standardDescription:
      "Hot rolled products - Thermomechanical rolled weldable fine grain structural steels",
    fy: 460,
    fy_above_40: 430,
    fu: 540,
    fu_above_40: 530,
  },

  {
    id: "S235W",
    standard: "EN10025-5",
    standardDescription:
      "Hot rolled products - Structural steels with improved atmospheric corrosion resistance",
    fy: 235,
    fy_above_40: 215,
    fu: 360,
    fu_above_40: 340,
  },
  {
    id: "S355W",
    standard: "EN10025-5",
    standardDescription:
      "Hot rolled products - Structural steels with improved atmospheric corrosion resistance",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 490,
  },

  {
    id: "S460 Q / QL / QL1",
    standard: "EN10025-6",
    standardDescription:
      "Hot rolled products - High yield strength structural steels in the quenched and tempered condition",
    fy: 460,
    fy_above_40: 440,
    fu: 570,
    fu_above_40: 550,
  },

  {
    id: "S235H",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 235,
    fy_above_40: 215,
    fu: 360,
    fu_above_40: 340,
  },
  {
    id: "S275H",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fy_above_40: 255,
    fu: 430,
    fu_above_40: 410,
  },
  {
    id: "S355H",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fy_above_40: 335,
    fu: 510,
    fu_above_40: 490,
  },
  {
    id: "S275 NH / NLH",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fy_above_40: 255,
    fu: 390,
    fu_above_40: 370,
  },
  {
    id: "S355 NH / NLH",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fy_above_40: 335,
    fu: 490,
    fu_above_40: 470,
  },
  {
    id: "S420 NH / NLH",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 420,
    fy_above_40: 390,
    fu: 540,
    fu_above_40: 520,
  },
  {
    id: "S460 NH / NLH",
    standard: "EN10210-1",
    standardDescription:
      "Hot finished structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fy_above_40: 430,
    fu: 560,
    fu_above_40: 550,
  },

  {
    id: "S235H",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 235,
    fu: 360,
  },
  {
    id: "S275H",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 430,
  },
  {
    id: "S355H",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 510,
  },
  {
    id: "S275 NH / NLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 370,
  },
  {
    id: "S355 NH / NLH / MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 355,
    fu: 470,
  },
  {
    id: "S460 NH / NLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fu: 540,
  },
  {
    id: "S275 MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 275,
    fu: 360,
  },
  {
    id: "S420 MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 420,
    fu: 500,
  },
  {
    id: "S460 MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded structural hollow sections - Non-alloy and fine grain steels",
    fy: 460,
    fu: 530,
  },
] satisfies SteelGrade[];

export const composeSteelGradeId = (grade: SteelGrade) =>
  `${grade.standard}:${grade.id}`;
export const composeSteelGradeLabel = (grade: SteelGrade) => grade.id;

export const steelGradesMap = new Map(
  steelGrades.map((grade) => [composeSteelGradeId(grade), grade]),
);
