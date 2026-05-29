export type SteelGrade = {
  id: string;
  standard: string;
  standardDescription: string;
  fy_MPa: number;
  fy_above_40_MPa?: number;
  fu_MPa: number;
  fu_above_40_MPa?: number;
};

export const steelGrades: SteelGrade[] = [
  {
    id: "S235",
    standard: "EN10025-2",
    standardDescription: "Hot rolled non alloy structural steels",
    fy_MPa: 235,
    fy_above_40_MPa: 215,
    fu_MPa: 360,
    fu_above_40_MPa: 360,
  },
  {
    id: "S275",
    standard: "EN10025-2",
    standardDescription: "Hot rolled non alloy structural steels",
    fy_MPa: 275,
    fy_above_40_MPa: 255,
    fu_MPa: 430,
    fu_above_40_MPa: 410,
  },
  {
    id: "S355",
    standard: "EN10025-2",
    standardDescription: "Hot rolled non alloy structural steels",
    fy_MPa: 355,
    fy_above_40_MPa: 335,
    fu_MPa: 490,
    fu_above_40_MPa: 470,
  },
  {
    id: "S275 N / NL",
    standard: "EN10025-3",
    standardDescription: "Hot rolled normalized fine grain steels",
    fy_MPa: 275,
    fy_above_40_MPa: 255,
    fu_MPa: 390,
    fu_above_40_MPa: 370,
  },
  {
    id: "S355 N / NL",
    standard: "EN10025-3",
    standardDescription: "Hot rolled normalized fine grain steels",
    fy_MPa: 355,
    fy_above_40_MPa: 335,
    fu_MPa: 490,
    fu_above_40_MPa: 470,
  },
  {
    id: "S420 N / NL",
    standard: "EN10025-3",
    standardDescription: "Hot rolled normalized fine grain steels",
    fy_MPa: 420,
    fy_above_40_MPa: 390,
    fu_MPa: 520,
    fu_above_40_MPa: 520,
  },
  {
    id: "S460 N / NL",
    standard: "EN10025-3",
    standardDescription: "Hot rolled normalized fine grain steels",
    fy_MPa: 460,
    fy_above_40_MPa: 430,
    fu_MPa: 540,
    fu_above_40_MPa: 540,
  },

  {
    id: "S275 M / ML",
    standard: "EN10025-4",
    standardDescription: "Hot rolled thermomechanical fine grain steels",
    fy_MPa: 275,
    fy_above_40_MPa: 255,
    fu_MPa: 370,
    fu_above_40_MPa: 360,
  },
  {
    id: "S355 M / ML",
    standard: "EN10025-4",
    standardDescription: "Hot rolled thermomechanical fine grain steels",
    fy_MPa: 355,
    fy_above_40_MPa: 335,
    fu_MPa: 470,
    fu_above_40_MPa: 450,
  },
  {
    id: "S420 M / ML",
    standard: "EN10025-4",
    standardDescription: "Hot rolled thermomechanical fine grain steels",
    fy_MPa: 420,
    fy_above_40_MPa: 390,
    fu_MPa: 520,
    fu_above_40_MPa: 500,
  },
  {
    id: "S460 M / ML",
    standard: "EN10025-4",
    standardDescription: "Hot rolled thermomechanical fine grain steels",
    fy_MPa: 460,
    fy_above_40_MPa: 430,
    fu_MPa: 540,
    fu_above_40_MPa: 530,
  },

  {
    id: "S235W",
    standard: "EN10025-5",
    standardDescription: "Hot rolled weather resistant structural steels",
    fy_MPa: 235,
    fy_above_40_MPa: 215,
    fu_MPa: 360,
    fu_above_40_MPa: 340,
  },
  {
    id: "S355W",
    standard: "EN10025-5",
    standardDescription: "Hot rolled weather resistant structural steels",
    fy_MPa: 355,
    fy_above_40_MPa: 335,
    fu_MPa: 490,
    fu_above_40_MPa: 490,
  },

  {
    id: "S460 Q / QL / QL1",
    standard: "EN10025-6",
    standardDescription:
      "Hot rolled quenched and tempered high strength steels",
    fy_MPa: 460,
    fy_above_40_MPa: 440,
    fu_MPa: 570,
    fu_above_40_MPa: 550,
  },

  {
    id: "S235H",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 235,
    fy_above_40_MPa: 215,
    fu_MPa: 360,
    fu_above_40_MPa: 340,
  },
  {
    id: "S275H",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 275,
    fy_above_40_MPa: 255,
    fu_MPa: 430,
    fu_above_40_MPa: 410,
  },
  {
    id: "S355H",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 355,
    fy_above_40_MPa: 335,
    fu_MPa: 510,
    fu_above_40_MPa: 490,
  },
  {
    id: "S275 NH / NLH",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 275,
    fy_above_40_MPa: 255,
    fu_MPa: 390,
    fu_above_40_MPa: 370,
  },
  {
    id: "S355 NH / NLH",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 355,
    fy_above_40_MPa: 335,
    fu_MPa: 490,
    fu_above_40_MPa: 470,
  },
  {
    id: "S420 NH / NLH",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 420,
    fy_above_40_MPa: 390,
    fu_MPa: 540,
    fu_above_40_MPa: 520,
  },
  {
    id: "S460 NH / NLH",
    standard: "EN10210-1",
    standardDescription: "Hot finished hollow sections in structural steels",
    fy_MPa: 460,
    fy_above_40_MPa: 430,
    fu_MPa: 560,
    fu_above_40_MPa: 550,
  },

  {
    id: "S235H",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 235,
    fu_MPa: 360,
  },
  {
    id: "S275H",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 275,
    fu_MPa: 430,
  },
  {
    id: "S355H",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 355,
    fu_MPa: 510,
  },
  {
    id: "S275 NH / NLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 275,
    fu_MPa: 370,
  },
  {
    id: "S355 NH / NLH / MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 355,
    fu_MPa: 470,
  },
  {
    id: "S460 NH / NLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 460,
    fu_MPa: 540,
  },
  {
    id: "S275 MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 275,
    fu_MPa: 360,
  },
  {
    id: "S420 MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 420,
    fu_MPa: 500,
  },
  {
    id: "S460 MH / MLH",
    standard: "EN10219-1",
    standardDescription:
      "Cold formed welded hollow sections in structural steels",
    fy_MPa: 460,
    fu_MPa: 530,
  },
];

export const composeSteelGradeId = (grade: SteelGrade) =>
  `${grade.standard}:${grade.id}`;
export const composeSteelGradeLabel = (grade: SteelGrade) => grade.id;

export const steelGradesMap = new Map(
  steelGrades.map(grade => [composeSteelGradeId(grade), grade]),
);
