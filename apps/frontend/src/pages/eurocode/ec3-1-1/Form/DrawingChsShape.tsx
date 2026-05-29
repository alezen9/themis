import { useEffect, useRef } from "react";
import { Pluton2D } from "pluton-2d";
import { Ec3FormValues } from "./schema/schema";
import { chsGeometrySchema } from "./schema/geometrySchema";
import { formatNumber } from "@formatters/number";
import { useEc311FormContext } from "./useEc311FormContext";

type DrawingShapeParams = Ec3FormValues["chs_geometry"];

const targetHeight = 125;
const dimensionOverflow = 15;
const dimensionOffset = 30;
const dimensionTextOffsetY = -15;
const thicknessDimensionAngle = -Math.PI / 4; // -45deg

export const DrawingChsShape = () => {
  const ref = useRef<SVGSVGElement>(null);
  const scene = useRef<Pluton2D<DrawingShapeParams> | undefined>(undefined);
  const { getValues, subscribe } = useEc311FormContext();

  useEffect(() => {
    const unsubscribe = subscribe({
      name: ["chs_geometry", "section_id"],
      formState: { values: true },
      callback: ({ values }) => {
        if (!scene.current) return;
        const result = chsGeometrySchema.safeParse(values.chs_geometry);
        const hasSection = !!values.section_id;
        const hasError = !hasSection || !result.success;
        ref.current?.toggleAttribute("data-drawing-error", hasError);
        if (!result.success) return;
        Object.assign(scene.current.params, { ...result.data });
      },
    });

    return () => {
      unsubscribe();
    };
  }, [subscribe]);

  useEffect(() => {
    if (!ref.current) return;

    scene.current = new Pluton2D(ref.current, {
      params: { ...getValues().chs_geometry },
    });

    const geometryGroup = scene.current.geometry.group();
    const dimensionsGroup = scene.current.dimensions.group();

    scene.current.draw(p => {
      const { d_mm, t_mm } = p;
      const scale = targetHeight / (d_mm / 2);
      const roDrawing = (d_mm / 2) * scale;
      const tDrawing = t_mm * scale;
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
      const formattedDiameter = formatNumber(d_mm, "dimension");
      dimensions
        .moveToAbs(-roDrawing, roDrawing + dimensionOffset)
        .tick(0)
        .lineTo(roDrawing * 2, 0)
        .tick(0)
        .textAt(-roDrawing, dimensionTextOffsetY, `Ø ${formattedDiameter}mm`);

      // wall thickness dimension
      const thicknessDirX = Math.cos(thicknessDimensionAngle);
      const thicknessDirY = Math.sin(thicknessDimensionAngle);
      const formattedThickness = formatNumber(t_mm, "dimension");
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

      // dimensions
      //   .moveToAbs(-180, -190)
      //   .lineTo(20, 0)
      //   .arrowFilled(0, 6)
      //   .textAt(10, 0, "Y")
      //   .moveToAbs(-180, -190)
      //   .lineTo(0, 20)
      //   .arrowFilled(Math.PI / 2, 6)
      //   .textAt(0, 10, "Z");

      dimensions
        .moveToAbs(190, 10)
        .textAt(0, 0, "Y", "start")
        .moveToAbs(10, 190)
        .textAt(0, 0, "Z");
    });

    return () => {
      scene.current?.dispose();
    };
  }, [getValues]);

  return <svg ref={ref} className="w-full aspect-square" />;
};
