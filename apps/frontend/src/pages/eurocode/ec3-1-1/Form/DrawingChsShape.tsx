import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Pluton2D } from "pluton-2d";
import { Ec3FormValues } from "./schema";
import { formatDimension } from "./utils";

type DrawingShapeParams = Ec3FormValues["chs_geometry"];

const targetHeight = 125;
const dimensionOverflow = 15;
const dimensionOffset = 30;
const dimensionTextOffsetY = -15;
const thicknessDimensionAngle = -Math.PI / 4; // -45deg

export const DrawingChsShape = () => {
  const ref = useRef<SVGSVGElement>(null);
  const scene = useRef<Pluton2D<DrawingShapeParams> | undefined>(undefined);
  const { getValues, subscribe } = useFormContext<Ec3FormValues>();

  const updateSceneParams = useCallback<
    Parameters<typeof subscribe>[0]["callback"]
  >(({ values }) => {
    if (!scene.current) return;
    Object.assign(scene.current.params, values.chs_geometry);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    scene.current = new Pluton2D(ref.current, {
      params: getValues().chs_geometry,
    });

    const geometryGroup = scene.current.geometry.group();
    const dimensionsGroup = scene.current.dimensions.group();

    scene.current.draw((p) => {
      const { d, t } = p;
      const scale = targetHeight / (d / 2);
      const roDrawing = (d / 2) * scale;
      const tDrawing = t * scale;
      const riDrawing = roDrawing - tDrawing;

      const path = geometryGroup.path();

      // a single arcTo can create a circle with the help of a very small displacement (epsilon) and lareArc = true
      // it looks and behaves like a circle but a perfect one can only be produced by 2 or more arcs
      path
        // outer circle
        .moveToAbs(-roDrawing, 0)
        .arcTo(0, -Number.EPSILON, roDrawing, true, true)
        // inner circle
        .moveToAbs(-riDrawing, 0)
        .arcTo(0, -Number.EPSILON, riDrawing, true, true)
        .close();

      const dimensions = dimensionsGroup.dimension();

      // outer diameter dimension
      const formattedDiameter = formatDimension(d);
      dimensions
        .moveToAbs(-roDrawing, roDrawing + dimensionOffset)
        .tick(0)
        .lineTo(roDrawing * 2, 0)
        .tick(0)
        .textAt(-roDrawing, dimensionTextOffsetY, `${formattedDiameter}mm`);

      // wall thickness dimension
      const thicknessDirX = Math.cos(thicknessDimensionAngle);
      const thicknessDirY = Math.sin(thicknessDimensionAngle);
      const formattedThickness = formatDimension(t);
      dimensions
        .moveToAbs(
          (riDrawing - dimensionOverflow) * thicknessDirX,
          (riDrawing - dimensionOverflow) * thicknessDirY,
        )
        .lineTo(
          dimensionOverflow * thicknessDirX,
          dimensionOverflow * thicknessDirY,
        )
        .tick(thicknessDimensionAngle)
        .moveTo(tDrawing * thicknessDirX, tDrawing * thicknessDirY)
        .tick(thicknessDimensionAngle)
        .lineTo(
          dimensionOverflow * thicknessDirX,
          dimensionOverflow * thicknessDirY,
        )
        .lineTo(dimensionOverflow * 2, 0)
        .textAt(5, 0, `${formattedThickness}mm`, "start");
    });

    return () => {
      scene.current?.dispose();
    };
  }, [getValues]);

  useEffect(() => {
    const unsubscribe = subscribe({
      name: ["chs_geometry.d", "chs_geometry.t"],
      exact: true,
      formState: { values: true },
      callback: updateSceneParams,
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe, updateSceneParams]);

  return <svg ref={ref} className="w-full aspect-square" />;
};
