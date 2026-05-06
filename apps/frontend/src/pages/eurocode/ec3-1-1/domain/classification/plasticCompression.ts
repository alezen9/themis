import {
  GEOMETRY_EPSILON,
  type LineState,
  type Point,
  type Polygon,
  computeCompressionProperties,
  computePolygonSetProperties,
  computeProjectionBounds,
  normalizePoint,
  signedDistance,
} from "./utils";

type SolverInput = {
  polygons: Polygon[];
  fy_MPa: number;
  N_Ed_N: number;
  M_y_Ed_Nmm: number;
  M_z_Ed_Nmm: number;
};

const THETA_SAMPLE_COUNT = 360;
const OFFSET_ITERATIONS = 50;
const THETA_REFINEMENT_ITERATIONS = 24;
const ALL_COMPRESSION = { type: "all-compression" } as const;
const ALL_TENSION = { type: "all-tension" } as const;

export const solvePlasticCompressionState = (input: SolverInput) => {
  const { polygons, fy_MPa, N_Ed_N, M_y_Ed_Nmm, M_z_Ed_Nmm } = input;
  const total = computePolygonSetProperties(polygons);
  const targetForceArea_mm2 = -N_Ed_N / fy_MPa;
  const bendingMagnitude = Math.hypot(M_y_Ed_Nmm, M_z_Ed_Nmm);

  if (targetForceArea_mm2 >= total.area_mm2 - GEOMETRY_EPSILON) {
    return ALL_COMPRESSION;
  }

  if (targetForceArea_mm2 <= -total.area_mm2 + GEOMETRY_EPSILON) {
    return ALL_TENSION;
  }

  if (bendingMagnitude <= GEOMETRY_EPSILON) {
    return targetForceArea_mm2 > 0 ? ALL_COMPRESSION : ALL_TENSION;
  }

  const desiredMoment = normalizePoint({
    y_mm: -M_z_Ed_Nmm,
    z_mm: -M_y_Ed_Nmm,
  });
  const firstGuessTheta = Math.atan2(desiredMoment.z_mm, desiredMoment.y_mm);
  const firstGuess = solveStateForTheta(
    polygons,
    total.area_mm2,
    firstGuessTheta,
    targetForceArea_mm2,
  );

  let bestTheta = firstGuessTheta;
  let bestScore = scorePlasticMomentDirection(firstGuess, total, desiredMoment);

  for (let index = 0; index < THETA_SAMPLE_COUNT; index += 1) {
    const theta = (index / THETA_SAMPLE_COUNT) * 2 * Math.PI;
    const state = solveStateForTheta(
      polygons,
      total.area_mm2,
      theta,
      targetForceArea_mm2,
    );
    const score = scorePlasticMomentDirection(state, total, desiredMoment);

    if (score < bestScore) {
      bestTheta = theta;
      bestScore = score;
    }
  }

  const refinedTheta = refineTheta(
    polygons,
    total,
    targetForceArea_mm2,
    desiredMoment,
    bestTheta,
  );

  return solveStateForTheta(
    polygons,
    total.area_mm2,
    refinedTheta,
    targetForceArea_mm2,
  ).lineState;
};

export const computeCompressionFraction = (
  state: LineState,
  start: Point,
  end: Point,
) => {
  if (state.type === "all-compression") return 1;
  if (state.type === "all-tension") return 0;

  const startValue = signedDistance(state, start);
  const endValue = signedDistance(state, end);

  if (startValue >= 0 && endValue >= 0) return 1;
  if (startValue <= 0 && endValue <= 0) return 0;

  const fractionToCrossing = startValue / (startValue - endValue);
  return startValue > 0 ? fractionToCrossing : 1 - fractionToCrossing;
};

export const isCompressed = (state: LineState, point: Point) => {
  if (state.type === "all-compression") return true;
  if (state.type === "all-tension") return false;
  return signedDistance(state, point) >= 0;
};

const refineTheta = (
  polygons: Polygon[],
  total: ReturnType<typeof computePolygonSetProperties>,
  targetForceArea_mm2: number,
  desiredMoment: Point,
  theta: number,
) => {
  const sampleWidth = (2 * Math.PI) / THETA_SAMPLE_COUNT;
  let low = theta - sampleWidth;
  let high = theta + sampleWidth;

  for (let index = 0; index < THETA_REFINEMENT_ITERATIONS; index += 1) {
    const first = low + (high - low) / 3;
    const second = high - (high - low) / 3;
    const firstScore = scorePlasticMomentDirection(
      solveStateForTheta(polygons, total.area_mm2, first, targetForceArea_mm2),
      total,
      desiredMoment,
    );
    const secondScore = scorePlasticMomentDirection(
      solveStateForTheta(polygons, total.area_mm2, second, targetForceArea_mm2),
      total,
      desiredMoment,
    );

    if (firstScore < secondScore) {
      high = second;
    } else {
      low = first;
    }
  }

  return (low + high) / 2;
};

const solveStateForTheta = (
  polygons: Polygon[],
  totalArea_mm2: number,
  theta: number,
  targetForceArea_mm2: number,
) => {
  const normal = { y_mm: Math.cos(theta), z_mm: Math.sin(theta) };
  const { min, max } = computeProjectionBounds(polygons, normal);
  const margin = Math.max(max - min, 1);
  let low = min - margin;
  let high = max + margin;

  for (let index = 0; index < OFFSET_ITERATIONS; index += 1) {
    const offset_mm = (low + high) / 2;
    const compressionProperties = computeCompressionProperties(polygons, {
      type: "line",
      normal,
      offset_mm,
    });
    const forceArea_mm2 = 2 * compressionProperties.area_mm2 - totalArea_mm2;

    if (forceArea_mm2 > targetForceArea_mm2) {
      low = offset_mm;
    } else {
      high = offset_mm;
    }
  }

  const lineState = {
    type: "line",
    normal,
    offset_mm: (low + high) / 2,
  } as const;

  return {
    lineState,
    compressionProperties: computeCompressionProperties(polygons, lineState),
  };
};

const scorePlasticMomentDirection = (
  state: ReturnType<typeof solveStateForTheta>,
  total: ReturnType<typeof computePolygonSetProperties>,
  desiredMoment: Point,
) => {
  const plasticMoment = normalizePoint({
    y_mm:
      2 * state.compressionProperties.firstMomentY_mm3 - total.firstMomentY_mm3,
    z_mm:
      2 * state.compressionProperties.firstMomentZ_mm3 - total.firstMomentZ_mm3,
  });

  return (
    1 -
    plasticMoment.y_mm * desiredMoment.y_mm -
    plasticMoment.z_mm * desiredMoment.z_mm
  );
};
