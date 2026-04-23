import type { Drawable } from "$lib/core/types";
/**
 * Подготовка изображнеия к отрисовке на холсте
 * @param decoded 
 * @returns 
 */
export function createDrawable(decoded: any): Drawable {
  if (decoded.type === "image-data") {
    return {
      kind: "image-data",
      data: decoded.data,
    };
  }

  return {
    kind: "image",
    image: decoded.image,
  };
}
