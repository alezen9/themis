import { useEffect, useRef } from "react";
import { Pluton2D } from "pluton-2d";
import { Ec3FormValues } from "./schema/schema";
import { rhsGeometrySchema } from "./schema/geometrySchema";
import { formatNumber } from "@formatters/number";
import { useEc311FormContext } from "./useEc311FormContext";

type DrawingShapeParams = Ec3FormValues["rhs_geometry"];

const targetHeight = 220;
const targetWidth = 220;
const dimensionOverflow = 15;
const dimensionOffset = 30;
const dimensionTextOffsetY = -15;
const radiusCalloutOffset = 30;
const outerRadiusDimensionAngle = Math.PI / 4;
const innerRadiusDimensionAngle = (-3 * Math.PI) / 4;

export const DrawingRhsShape = () => {
  const ref = useRef<SVGSVGElement>(null);
  const scene = useRef<Pluton2D<DrawingShapeParams> | undefined>(undefined);
  const { getValues, subscribe } = useEc311FormContext();

  useEffect(() => {
    const unsubscribe = subscribe({
      name: ["rhs_geometry", "section_id"],
      formState: { values: true },
      callback: ({ values }) => {
        if (!scene.current) return;
        const result = rhsGeometrySchema.safeParse(values.rhs_geometry);
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
      params: { ...getValues().rhs_geometry },
    });

    const geometryGroup = scene.current.geometry.group();
    const dimensionsGroup = scene.current.dimensions.group();

    scene.current.draw(p => {
      const { h_mm, b_mm, tw_mm, ro_mm, ri_mm } = p;
      const heightScale = targetHeight / h_mm;
      const widthScale = targetWidth / b_mm;
      const scale = Math.min(heightScale, widthScale);
      const hDrawing = h_mm * scale;
      const bDrawing = b_mm * scale;
      const twDrawing = tw_mm * scale;
      const roDrawing = ro_mm * scale;
      const riDrawing = ri_mm * scale;
      const innerHeightDrawing = hDrawing - 2 * twDrawing;
      const innerWidthDrawing = bDrawing - 2 * twDrawing;

      geometryGroup
        .path()
        // outer rectangle
        .moveToAbs(-bDrawing / 2, 0)
        .lineTo(0, hDrawing / 2 - roDrawing)
        .arcTo(roDrawing, roDrawing, roDrawing, true)
        .lineTo(bDrawing - roDrawing * 2, 0)
        .arcTo(roDrawing, -roDrawing, roDrawing, true)
        .lineTo(0, -(hDrawing - roDrawing * 2))
        .arcTo(-roDrawing, -roDrawing, roDrawing, true)
        .lineTo(-(bDrawing - roDrawing * 2), 0)
        .arcTo(-roDrawing, roDrawing, roDrawing, true)
        .lineTo(0, hDrawing / 2 - roDrawing)
        // inner rectangle
        .moveToAbs(-innerWidthDrawing / 2, 0)
        .lineTo(0, innerHeightDrawing / 2 - riDrawing)
        .arcTo(riDrawing, riDrawing, riDrawing, true)
        .lineTo(innerWidthDrawing - riDrawing * 2, 0)
        .arcTo(riDrawing, -riDrawing, riDrawing, true)
        .lineTo(0, -(innerHeightDrawing - riDrawing * 2))
        .arcTo(-riDrawing, -riDrawing, riDrawing, true)
        .lineTo(-(innerWidthDrawing - riDrawing * 2), 0)
        .arcTo(-riDrawing, riDrawing, riDrawing, true)
        .lineTo(0, innerHeightDrawing / 2 - riDrawing)
        .close();

      const dimensions = dimensionsGroup.dimension();

      dimensions
        .moveToAbs(-bDrawing / 2, -hDrawing / 2 - dimensionOffset)
        .tick(0)
        .lineTo(bDrawing, 0)
        .tick(0)
        .textAt(
          -bDrawing / 2,
          dimensionTextOffsetY,
          `${formatNumber(b_mm, "dimension")}mm`,
        );

      dimensions
        .moveToAbs(bDrawing / 2 + dimensionOffset, -hDrawing / 2)
        .tick(-Math.PI / 2)
        .lineTo(0, hDrawing)
        .tick(Math.PI / 2)
        .textAt(
          10,
          -hDrawing / 2,
          `${formatNumber(h_mm, "dimension")}mm`,
          "start",
        );

      dimensions
        .moveToAbs(-bDrawing / 2 - dimensionOverflow * 2, 15)
        .textAt(-5, 0, `${formatNumber(tw_mm, "dimension")}mm`, "end")
        .lineTo(dimensionOverflow * 2, 0)
        .tick(0)
        .moveTo(twDrawing, 0)
        .tick(0)
        .lineTo(dimensionOverflow, 0);

      const outerRadiusDirX = Math.cos(outerRadiusDimensionAngle);
      const outerRadiusDirY = Math.sin(outerRadiusDimensionAngle);
      dimensions
        .moveToAbs(bDrawing / 2 - roDrawing, hDrawing / 2 - roDrawing)
        .moveTo(roDrawing * outerRadiusDirX, roDrawing * outerRadiusDirY)
        .arrowFilled(outerRadiusDimensionAngle)
        .lineTo(-radiusCalloutOffset, -radiusCalloutOffset)
        .lineTo(-radiusCalloutOffset / 2, 0)
        .textAt(-5, 0, `R ${formatNumber(ro_mm, "dimension")}mm`, "end");

      const innerRadiusDirX = Math.cos(innerRadiusDimensionAngle);
      const innerRadiusDirY = Math.sin(innerRadiusDimensionAngle);
      dimensions
        .moveToAbs(
          -innerWidthDrawing / 2 + riDrawing,
          -innerHeightDrawing / 2 + riDrawing,
        )
        .moveTo(riDrawing * innerRadiusDirX, riDrawing * innerRadiusDirY)
        .arrowFilled(innerRadiusDimensionAngle)
        .lineTo(radiusCalloutOffset, radiusCalloutOffset)
        .lineTo(radiusCalloutOffset / 2, 0)
        .textAt(5, 0, `R ${formatNumber(ri_mm, "dimension")}mm`, "start");

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
