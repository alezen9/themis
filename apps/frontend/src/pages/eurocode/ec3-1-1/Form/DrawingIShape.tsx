import { useCallback, useEffect, useRef } from "react";
import { Pluton2D } from "pluton-2d";
import { Ec3FormValues } from "./schema";
import { formatDimension } from "./utils";
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

  const updateSceneParams = useCallback<
    Parameters<typeof subscribe>[0]["callback"]
  >(({ values }) => {
    if (!scene.current) return;
    Object.assign(scene.current.params, values.i_geometry);
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    scene.current = new Pluton2D(ref.current, {
      params: getValues().i_geometry,
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
        .textAt(5, 0, `${formatDimension(tw_mm)}mm`, "start");

      dimensions
        .moveToAbs(-bDrawing / 2, -hDrawing / 2 - dimensionOffset)
        .tick(0)
        .lineTo(bDrawing, 0)
        .tick(0)
        .textAt(-bDrawing / 2, -15, `${formatDimension(b_mm)}mm`);

      dimensions
        .moveToAbs(bDrawing / 2 + dimensionOffset, -hDrawing / 2)
        .tick(-Math.PI / 2)
        .lineTo(0, hDrawing)
        .tick(Math.PI / 2)
        .textAt(15, -hDrawing / 2, `${formatDimension(h_mm)}mm`, "start");

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
        .textAt(-5, 0, `R ${formatDimension(r_mm)}mm`, "end");
    });

    return () => {
      scene.current?.dispose();
    };
  }, [getValues]);

  useEffect(() => {
    const unsubscribe = subscribe({
      name: [
        "i_geometry.h_mm",
        "i_geometry.b_mm",
        "i_geometry.tf_mm",
        "i_geometry.tw_mm",
        "i_geometry.r_mm",
      ],
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
