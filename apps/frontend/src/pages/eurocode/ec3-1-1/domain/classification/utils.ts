export const max = <T extends number>(...args: T[]) => Math.max(...args) as T;

export const GEOMETRY_EPSILON = 1e-9;

export type Point = { y_mm: number; z_mm: number };

export type Polygon = Point[];

export type LineState =
  | { type: "all-compression" }
  | { type: "all-tension" }
  | { type: "line"; normal: Point; offset_mm: number };

export const createRectangle = (
  center: Point,
  width_mm: number,
  height_mm: number,
) => {
  const halfWidth_mm = width_mm / 2;
  const halfHeight_mm = height_mm / 2;

  return [
    { y_mm: center.y_mm - halfWidth_mm, z_mm: center.z_mm - halfHeight_mm },
    { y_mm: center.y_mm + halfWidth_mm, z_mm: center.z_mm - halfHeight_mm },
    { y_mm: center.y_mm + halfWidth_mm, z_mm: center.z_mm + halfHeight_mm },
    { y_mm: center.y_mm - halfWidth_mm, z_mm: center.z_mm + halfHeight_mm },
  ];
};

export const normalizePoint = (point: Point) => {
  const magnitude = Math.hypot(point.y_mm, point.z_mm);
  if (magnitude <= GEOMETRY_EPSILON) return { y_mm: 0, z_mm: 0 };

  return { y_mm: point.y_mm / magnitude, z_mm: point.z_mm / magnitude };
};

export const signedDistance = (
  state: Extract<LineState, { type: "line" }>,
  point: Point,
) =>
  state.normal.y_mm * point.y_mm +
  state.normal.z_mm * point.z_mm -
  state.offset_mm;

type PolygonProperties = {
  area_mm2: number;
  firstMomentY_mm3: number;
  firstMomentZ_mm3: number;
};

export const computePolygonSetProperties = (polygons: Polygon[]) =>
  polygons.reduce<PolygonProperties>(
    (total, polygon) => {
      const current = computePolygonProperties(polygon);
      return {
        area_mm2: total.area_mm2 + current.area_mm2,
        firstMomentY_mm3: total.firstMomentY_mm3 + current.firstMomentY_mm3,
        firstMomentZ_mm3: total.firstMomentZ_mm3 + current.firstMomentZ_mm3,
      };
    },
    { area_mm2: 0, firstMomentY_mm3: 0, firstMomentZ_mm3: 0 },
  );

export const computeCompressionProperties = (
  polygons: Polygon[],
  state: LineState,
) =>
  computePolygonSetProperties(
    polygons
      .map((polygon) => clipPolygonByCompressionSide(polygon, state))
      .filter((polygon) => polygon.length >= 3),
  );

export const computeProjectionBounds = (polygons: Polygon[], normal: Point) => {
  let min = Infinity;
  let max = -Infinity;

  for (const polygon of polygons) {
    for (const point of polygon) {
      const projection = normal.y_mm * point.y_mm + normal.z_mm * point.z_mm;
      min = Math.min(min, projection);
      max = Math.max(max, projection);
    }
  }

  return { min, max };
};

const computePolygonProperties = (polygon: Polygon): PolygonProperties => {
  let signedArea = 0;
  let centroidYNumerator = 0;
  let centroidZNumerator = 0;

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    if (!current || !next) continue;

    const cross = current.y_mm * next.z_mm - next.y_mm * current.z_mm;
    signedArea += cross;
    centroidYNumerator += (current.y_mm + next.y_mm) * cross;
    centroidZNumerator += (current.z_mm + next.z_mm) * cross;
  }

  signedArea /= 2;
  const area_mm2 = Math.abs(signedArea);
  if (area_mm2 <= GEOMETRY_EPSILON) {
    return { area_mm2: 0, firstMomentY_mm3: 0, firstMomentZ_mm3: 0 };
  }

  const centroidY_mm = centroidYNumerator / (6 * signedArea);
  const centroidZ_mm = centroidZNumerator / (6 * signedArea);

  return {
    area_mm2,
    firstMomentY_mm3: area_mm2 * centroidY_mm,
    firstMomentZ_mm3: area_mm2 * centroidZ_mm,
  };
};

const clipPolygonByCompressionSide = (
  polygon: Polygon,
  state: LineState,
): Polygon => {
  if (state.type !== "line") return polygon;

  const clipped: Polygon = [];

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    if (!current || !next) continue;

    const currentInside = signedDistance(state, current) >= -GEOMETRY_EPSILON;
    const nextInside = signedDistance(state, next) >= -GEOMETRY_EPSILON;

    if (currentInside && nextInside) {
      clipped.push(next);
      continue;
    }

    if (currentInside && !nextInside) {
      clipped.push(intersectSegmentWithLine(current, next, state));
      continue;
    }

    if (!currentInside && nextInside) {
      clipped.push(intersectSegmentWithLine(current, next, state), next);
    }
  }

  return clipped;
};

const intersectSegmentWithLine = (
  start: Point,
  end: Point,
  state: Extract<LineState, { type: "line" }>,
) => {
  const startValue = signedDistance(state, start);
  const endValue = signedDistance(state, end);
  const ratio = startValue / (startValue - endValue);

  return {
    y_mm: start.y_mm + (end.y_mm - start.y_mm) * ratio,
    z_mm: start.z_mm + (end.z_mm - start.z_mm) * ratio,
  };
};
