import type { InterpolationFn } from "$lib/core/types";

export enum InterpolationMethod {
  Nearest = "nearest",
  Bilinear = "bilinear",
}

export const interpolationMap: Record<InterpolationMethod, InterpolationFn> = {
  [InterpolationMethod.Nearest]: nearestNeighbor,
  [InterpolationMethod.Bilinear]: bilinear,
};

// Обёртка для удобного вызова
export function resizeImage(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
  method: InterpolationMethod = InterpolationMethod.Bilinear,
): { data: Uint8ClampedArray; width: number; height: number } {
  const fn = interpolationMap[method];
  if (!fn) throw new Error(`Unknown interpolation method: ${method}`);

  return {
    data: fn(srcData, srcW, srcH, dstW, dstH),
    width: dstW,
    height: dstH,
  };
}

// Метод ближайшего соседа
function nearestNeighbor(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Uint8ClampedArray {
  const dstData = new Uint8ClampedArray(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      // Находим ближайший пиксель в источнике
      const srcX = Math.min(Math.round(x * xRatio), srcW - 1);
      const srcY = Math.min(Math.round(y * yRatio), srcH - 1);

      const srcIdx = (srcY * srcW + srcX) * 4;
      const dstIdx = (y * dstW + x) * 4;

      // Копируем RGBA
      dstData[dstIdx] = srcData[srcIdx];
      dstData[dstIdx + 1] = srcData[srcIdx + 1];
      dstData[dstIdx + 2] = srcData[srcIdx + 2];
      dstData[dstIdx + 3] = srcData[srcIdx + 3];
    }
  }
  return dstData;
}

// Билинейная интерполяция
function bilinear(
  srcData: Uint8ClampedArray,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number,
): Uint8ClampedArray {
  const dstData = new Uint8ClampedArray(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      const srcX = x * xRatio;
      const srcY = y * yRatio;

      // Индексы 4 соседних пикселей
      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(x0 + 1, srcW - 1);
      const y1 = Math.min(y0 + 1, srcH - 1);

      // Веса интерполяции (расстояние до границ)
      const dx = srcX - x0;
      const dy = srcY - y0;

      const dstIdx = (y * dstW + x) * 4;

      // Интерполируем каждый канал (R, G, B, A)
      for (let c = 0; c < 4; c++) {
        const p00 = srcData[(y0 * srcW + x0) * 4 + c];
        const p10 = srcData[(y0 * srcW + x1) * 4 + c];
        const p01 = srcData[(y1 * srcW + x0) * 4 + c];
        const p11 = srcData[(y1 * srcW + x1) * 4 + c];

        // Формула билинейной интерполяции
        const val =
          p00 * (1 - dx) * (1 - dy) +
          p10 * dx * (1 - dy) +
          p01 * (1 - dx) * dy +
          p11 * dx * dy;

        dstData[dstIdx + c] = Math.round(val); // Uint8ClampedArray автоматически обрежет до 0-255
      }
    }
  }
  return dstData;
}
