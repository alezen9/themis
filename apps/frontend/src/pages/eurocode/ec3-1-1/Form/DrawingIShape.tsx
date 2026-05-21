import { useEffect, useRef } from "react";
import { Pluton2D } from "pluton-2d";
import { Ec3FormValues } from "./schema/schema";
import { iGeometrySchema } from "./schema/geometrySchema";
import { formatNumber } from "@formatters/number";
import { useEc311FormContext } from "./useEc311FormContext";

type DrawingShapeParams = Ec3FormValues["i_geometry"];

const targetHeight = 250;
const targetWidth = 180;
const dimensionOverflow = 15;
const dimensionOffset = 30;

export const DrawingIShape = () => {
  const ref = useRef<SVGSVGElement>(null);
  const scene = useRef<Pluton2D<DrawingShapeParams> | undefined>(undefined);
  const { getValues, subscribe } = useEc311FormContext();

  useEffect(() => {
    const unsubscribe = subscribe({
      name: ["i_geometry", "section_id"],
      formState: { values: true },
      callback: ({ values }) => {
        if (!scene.current) return;
        const result = iGeometrySchema.safeParse(values.i_geometry);
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
      params: { ...getValues().i_geometry },
    });

    const geometryGroup = scene.current.geometry.group();
    const dimensionsGroup = scene.current.dimensions.group();

    scene.current.draw((p) => {
      const { h_mm, b_mm, tf_mm, tw_mm, r_mm } = p;
      const heightScale = targetHeight / h_mm;
      const widthScale = targetWidth / b_mm;
      const scale = Math.min(heightScale, widthScale);
      const hDrawing = h_mm * scale;
      const bDrawing = b_mm * scale;
      const tfDrawing = tf_mm * scale;
      const twDrawing = tw_mm * scale;
      const rDrawing = r_mm * scale;

      geometryGroup
        .path()
        .moveToAbs(0, -hDrawing / 2)
        .lineTo(bDrawing / 2, 0)
        .lineTo(0, tfDrawing)
        .lineTo(-bDrawing / 2 + twDrawing / 2 + rDrawing, 0)
        .arcTo(-rDrawing, rDrawing, rDrawing, true)
        .lineTo(0, hDrawing - 2 * tfDrawing - 2 * rDrawing)
        .arcTo(rDrawing, rDrawing, rDrawing, true)
        .lineTo(bDrawing / 2 - twDrawing / 2 - rDrawing, 0)
        .lineTo(0, tfDrawing)
        .lineTo(-bDrawing, 0)
        .lineTo(0, -tfDrawing)
        .lineTo(bDrawing / 2 - twDrawing / 2 - rDrawing, 0)
        .arcTo(rDrawing, -rDrawing, rDrawing, true)
        .lineTo(0, -hDrawing + 2 * tfDrawing + 2 * rDrawing)
        .arcTo(-rDrawing, -rDrawing, rDrawing, true)
        .lineTo(-bDrawing / 2 + twDrawing / 2 + rDrawing, 0)
        .lineTo(0, -tfDrawing)
        .lineTo(bDrawing / 2, 0)
        .close();

      const webThicknessDimensionPositionY = (hDrawing / 2 - tfDrawing) / 2;
      const dimensions = dimensionsGroup.dimension();

      dimensions
        .moveToAbs(-twDrawing / 2, webThicknessDimensionPositionY)
        .tick(0)
        .lineTo(-dimensionOverflow, 0)
        .moveToAbs(twDrawing / 2, webThicknessDimensionPositionY)
        .tick(Math.PI)
        .lineTo(dimensionOverflow * 2, 0)
        .textAt(5, 0, `${formatNumber(tw_mm, "dimension")}mm`, "start");

      dimensions
        .moveToAbs(-bDrawing / 2, -hDrawing / 2 - dimensionOffset)
        .tick(0)
        .lineTo(bDrawing, 0)
        .tick(0)
        .textAt(-bDrawing / 2, -15, `${formatNumber(b_mm, "dimension")}mm`);

      dimensions
        .moveToAbs(bDrawing / 2 + dimensionOffset, -hDrawing / 2)
        .tick(-Math.PI / 2)
        .lineTo(0, hDrawing)
        .tick(Math.PI / 2)
        .textAt(
          15,
          -hDrawing / 2,
          `${formatNumber(h_mm, "dimension")}mm`,
          "start",
        );

      dimensions
        .moveToAbs(-bDrawing / 2 - dimensionOffset, -hDrawing / 2)
        .tick(-Math.PI / 2)
        .lineTo(0, tfDrawing)
        .tick(Math.PI / 2)
        .textAt(
          -15,
          -tfDrawing / 2,
          `${formatNumber(tf_mm, "dimension")}mm`,
          "end",
        );

      const filletRadiusDimensionDirX = Math.cos(Math.PI / 4);
      const filletRadiusDimensionDirY = Math.sin(Math.PI / 4);

      dimensions
        .moveToAbs(-twDrawing / 2, hDrawing / 2 - tfDrawing)
        .moveTo(-rDrawing, -rDrawing)
        .moveTo(
          rDrawing * filletRadiusDimensionDirX,
          rDrawing * filletRadiusDimensionDirY,
        )
        .arrowFilled(Math.PI / 4)
        .lineTo(-30, -30)
        .lineTo(-15, 0)
        .textAt(-5, 0, `R ${formatNumber(r_mm, "dimension")}mm`, "end");

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
