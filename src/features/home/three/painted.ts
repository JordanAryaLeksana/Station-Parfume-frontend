import React from "react";
import { useThree } from "@react-three/fiber";

import { surface } from "./canvas-textures";

export function usePainted(
  width: number,
  height: number,
  sources: string[],
  paint: (
    context: CanvasRenderingContext2D,
    images: HTMLImageElement[],
  ) => void,
) {
  const sheet = React.useMemo(() => surface(width, height), [width, height]);
  const invalidate = useThree((state) => state.invalidate);
  const key = sources.join("|");

  React.useEffect(() => {
    let alive = true;
    const images = key
      .split("|")
      .filter(Boolean)
      .map((source) => {
        const image = new Image();
        image.src = source;
        return image;
      });
    const draw = () => {
      if (!alive) return;
      sheet.paint((context) => paint(context, images));
      invalidate();
    };
    for (const image of images) image.onload = draw;
    draw();
    void document.fonts.ready.then(draw);
    return () => {
      alive = false;
    };
  }, [sheet, key, paint, invalidate]);

  React.useEffect(() => () => sheet.texture.dispose(), [sheet]);

  return sheet.texture;
}
