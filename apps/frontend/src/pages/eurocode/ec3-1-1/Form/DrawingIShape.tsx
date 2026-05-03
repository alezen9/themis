import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Pluton2D } from "pluton-2d";
import { Ec3FormValues } from "./schema";

type DrawingIShapeParams = Pick<
  Extract<Ec3FormValues, { shape: "I" }>,
  "h" | "b" | "tw" | "tf" | "r"
>;

const drawingIShapeFieldNames = ["h", "b", "tw", "tf", "r"] as const;

const previewHeight = 250;

export const DrawingIShape = () => {
  const ref = useRef<SVGSVGElement>(null);
  const scene = useRef<Pluton2D<DrawingIShapeParams> | undefined>(undefined);
  const { getValues, subscribe } = useFormContext<Ec3FormValues>();

  const updateSceneParams = useCallback<
    Parameters<typeof subscribe>[0]["callback"]
  >(({ values }) => {
    if (!scene.current || values.shape !== "I") return;
    Object.assign(scene.current.params, getDrawingIShapeParams(values));
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const nextScene = new Pluton2D(ref.current, {
      params: getDrawingIShapeParams(getValues()),
    });

    const unsubscribeDraw = drawIShape(nextScene);
    scene.current = nextScene;

    return () => {
      unsubscribeDraw();
      nextScene.dispose();
      if (scene.current === nextScene) scene.current = undefined;
    };
  }, [getValues]);

  useEffect(() => {
    const unsubscribe = subscribe({
      name: drawingIShapeFieldNames,
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

const getDrawingIShapeParams = (values: Ec3FormValues): DrawingIShapeParams => {
  if (values.shape !== "I") return { h: 0, b: 0, tw: 0, tf: 0, r: 0 };

  const { h, b, tw, tf, r } = values;
  return { h, b, tw, tf, r };
};

const drawIShape = (scene: Pluton2D<DrawingIShapeParams>) => {
  const geometryGroup = scene.geometry.group();
  const dimensionsGroup = scene.dimensions.group();

  const dimensionOverflow = 15;
  const dimensionOffset = 30;

  return scene.draw((p) => {
    const scale = previewHeight / p.h;
    const h = p.h * scale;
    const b = p.b * scale;
    const tf = p.tf * scale;
    const tw = p.tw * scale;
    const r = p.r * scale;

    geometryGroup
      .path()
      .moveToAbs(0, -h / 2)
      .lineTo(b / 2, 0)
      .lineTo(0, tf)
      .lineTo(-b / 2 + tw / 2 + r, 0)
      .arcTo(-r, r, r, true)
      .lineTo(0, h - 2 * tf - 2 * r)
      .arcTo(r, r, r, true)
      .lineTo(b / 2 - tw / 2 - r, 0)
      .lineTo(0, tf)
      .lineTo(-b, 0)
      .lineTo(0, -tf)
      .lineTo(b / 2 - tw / 2 - r, 0)
      .arcTo(r, -r, r, true)
      .lineTo(0, -h + 2 * tf + 2 * r)
      .arcTo(-r, -r, r, true)
      .lineTo(-b / 2 + tw / 2 + r, 0)
      .lineTo(0, -tf)
      .lineTo(b / 2, 0)
      .close();

    const webThicknessDimensionPositionY = (h / 2 - tf) / 2;
    const dimensions = dimensionsGroup.dimension();

    dimensions
      .moveToAbs(-tw / 2, webThicknessDimensionPositionY)
      .tick(0)
      .lineTo(-dimensionOverflow, 0)
      .moveToAbs(tw / 2, webThicknessDimensionPositionY)
      .tick(Math.PI)
      .lineTo(dimensionOverflow * 2, 0)
      .textAt(5, 0, `${p.tw}mm`, "start");

    dimensions
      .moveToAbs(-b / 2, -h / 2 - dimensionOffset)
      .tick(0)
      .lineTo(b, 0)
      .tick(0)
      .textAt(-b / 2, -15, `${p.b}mm`);

    dimensions
      .moveToAbs(b / 2 + dimensionOffset, -h / 2)
      .tick(-Math.PI / 2)
      .lineTo(0, h)
      .tick(Math.PI / 2)
      .textAt(15, -h / 2, `${p.h}mm`, "start");

    const filletRadiusDimensionDirX = Math.cos(Math.PI / 4);
    const filletRadiusDimensionDirY = Math.sin(Math.PI / 4);

    dimensions
      .moveToAbs(-tw / 2, h / 2 - tf)
      .moveTo(-r, -r)
      .moveTo(r * filletRadiusDimensionDirX, r * filletRadiusDimensionDirY)
      .arrowFilled(Math.PI / 4)
      .lineTo(-30, -30)
      .lineTo(-15, 0)
      .textAt(-5, 0, `R ${p.r}mm`, "end");
  });
};
